# Defects Encountered, Root Cause Analysis, and Architectural Remediation

During the design, migration, implementation, and penetration testing of **Task 4: The Server is the Source of Truth**, several real architectural defects were identified and diagnosed. In accordance with professional engineering practice and course requirements, these defects are documented with their technical failure mechanism, diagnostic evidence, and resolution.

---

## Defect 1: Verification Code Re-use and Non-Idempotent Retry Failure

### Severity
**High (Security / Logic Flaw)**

### Detection & Diagnostic Evidence
Observed during automated testing of the `/api/auth/verify` endpoint, captured in:
* [`task-04-server-security/evidence/22-verification-code-reused.png`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence/22-verification-code-reused.png)

### The Failure Mechanism
In the initial naive implementation of email verification:
```typescript
// Initial flawed logic
const tokenRecord = await prisma.emailToken.findFirst({
  where: { email, code, usedAt: null }
});

if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
  return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
}

await prisma.$transaction([
  prisma.emailToken.update({ where: { id: tokenRecord.id }, data: { usedAt: new Date() } }),
  prisma.user.update({ where: { email }, data: { emailVerifiedAt: new Date() } })
]);
```
When a user entered their valid 6-digit code, their account was verified and `usedAt` was stamped. However, if the user’s mobile browser experienced an intermittent network hiccup (e.g. cellular handoff) and automatically retried the HTTP POST, or if an impatient supervisor double-clicked the "Verify" button, the second request queried `where: { usedAt: null }`. Because the first request had already populated `usedAt`, the second request failed the query and returned:
`HTTP 400 Bad Request: "Invalid or expired verification code"`.

This produced a confusing, hostile user experience: the supervisor was told their valid code was "invalid or expired", even though their account was already verified! More critically, in a system where failed verification attempts count toward an account lockout threshold (PRD 7.7: max 3 tries per code), innocent retry storms caused legitimate users to be locked out.

### Resolution & Architectural Fix
The verification endpoint was restructured to be strictly idempotent:
1. **Pre-check Account State**: Before inspecting token records, check if `user.emailVerifiedAt` is already set. If so, return an idempotent `HTTP 200 OK` with status `ALREADY_VERIFIED`.
2. **Atomic Verification State Transition**: Verification tokens are marked `USED` within a serializable database transaction.
3. **Explicit Error Categorization**: The server distinguishes between `EXPIRED_CODE`, `INVALID_CODE`, `ATTEMPTS_EXCEEDED`, and `ALREADY_VERIFIED`, returning clear semantic status codes.

---

## Defect 2: Rate Limit Evasion via Client Header Spoofing (`X-Forwarded-For`)

### Severity
**Critical (Security Defect)**

### Detection & Diagnostic Evidence
Documented and proven in:
* [`task-04-server-security/evidence/14-rate-limit-defeated.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence/14-rate-limit-defeated.txt)

### The Failure Mechanism
The initial rate-limiting middleware read the client IP address using:
```typescript
const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
```
When an adversary reached the threshold of 5 sign-ups per hour from IP `198.51.100.14`, the server correctly responded with `HTTP 429 Too Many Requests`. 

However, the attacker simply added an arbitrary `-H "X-Forwarded-For: 203.0.113.88"` header to subsequent curl requests. Because the endpoint naively trusted the outermost left-hand entry of the incoming header without validating reverse-proxy trust chains, each new spoofed IP created a fresh counter bucket in the database. The attacker completely bypassed the rate limit and flooded the database with automated registrations.

### Resolution & Architectural Fix
1. **Proxy Strip & Trust Boundary**: In production deployments, Next.js / Node must run behind a verified edge reverse proxy (such as Cloudflare, AWS CloudFront, or NGINX) configured to strip any untrusted incoming `X-Forwarded-For` headers from public clients and append the true socket IP.
2. **Compound Keying**: Rate limiting was redesigned to key not on IP alone, but on a compound hash: `IP + NormalisedEmailDomain + ActionType`. Even if the client cycles IP headers, repeated registration attempts targeting specific organisations or emails hit secondary rate limit ceilings.

---

## Defect 3: Migration Lockout on Required Non-Nullable Column Addition

### Severity
**High (Data Integrity / Production Outage Risk)**

### Detection & Diagnostic Evidence
Documented in:
* [`task-04-server-security/evidence/04-required-column-failure.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence/04-required-column-failure.txt)
* [`task-04-server-security/evidence/05-required-column-three-steps.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence/05-required-column-three-steps.txt)

### The Failure Mechanism
During schema updates, a new column `passwordHash VARCHAR(255) NOT NULL` was introduced to the `User` table. Because the database already contained seeded user records from earlier tasks, running a direct migration:
```sql
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL;
```
immediately crashed PostgreSQL with:
`ERROR: column "passwordHash" of relation "User" contains null values` (Exit code 1).

In a live production system, attempting to push a non-nullable column without a default value causes immediate downtime, locks the table, and blocks all active supervisor sessions.

### Resolution & Architectural Fix
Adopted the industry-standard **Three-Step Zero-Downtime Migration Pattern**:
1. **Step 1 (Add Nullable)**: Add `passwordHash` as a nullable column (`TEXT NULL`). This succeeds instantaneously without locking tables.
2. **Step 2 (Backfill Data)**: Execute an idempotent batch worker script to backfill existing records with secure temporary hashes or invite tokens.
3. **Step 3 (Enforce Constraint)**: Once 100% of rows contain valid non-null values, alter the column to `NOT NULL` in a subsequent migration.

---

## Defect 4: Trailing Whitespace Password Inconsistency

### Severity
**Medium (User Experience & Security Anomaly)**

### Detection & Diagnostic Evidence
Documented in:
* [`task-04-server-security/evidence/10-password-trim-working.png`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence/10-password-trim-working.png)

### The Failure Mechanism
Many mobile software keyboards (iOS QuickType, Android Gboard) automatically append a trailing space when a user selects an auto-completed word or types punctuation. If the client or server unconditionally applies `.trim()` to passwords, or conversely if one trims while the other does not, users experience mysterious authentication failures:
- If a user registers with `"Password123 "` and the registration endpoint does not trim, the hash stored is for `"Password123 "`.
- If the login endpoint later trims the input to `"Password123"`, verification fails.

Conversely, trimming passwords alters user entropy and can silently truncate valid passwords that deliberately incorporate leading/trailing spaces.

### Resolution & Architectural Fix
The architectural rule established:
- **Emails are always lowercased and trimmed**: `email.trim().toLowerCase()` prevents case-sensitive account duplication (`Tunde@FieldLog.com` vs `tunde@fieldlog.internal`).
- **Passwords are NEVER trimmed**: The exact byte sequence entered by the user is passed directly to the adaptive hasher. The client validation UI was updated to explicitly inform users if a trailing space is detected, preventing keyboard-induced typos without silently mutating the password payload.

