# Session Security Architecture, Token Lifecycle & Damage Limitation

## 1. Executive Summary & Threat Model
A user session represents an active authentication state established between a client browser and the server. In FieldLog, field supervisors log in under intermittent cellular network conditions, capture critical statutory site data, and frequently switch between offline airplane mode and online synchronization.

Under this threat model, sessions must balance two opposing forces:
1. **Offline Resilience**: A field supervisor operating in a remote wetland cannot have their session abruptly expire or self-destruct while capturing entries offline.
2. **Defensive Perimeter**: Session tokens must be cryptographically unguessable, stored securely on both client and server, bound to user status, and revocable in constant time ($O(1)$) across multiple devices.

---

## 2. What Session Hijacking Is and How an Attacker Uses a Stolen Identifier
Session hijacking occurs when an unauthorized adversary obtains a valid, active session identifier belonging to a legitimate user. Because HTTP is inherently stateless, web applications rely on session tokens (typically transmitted via HTTP cookies or headers) to correlate subsequent requests with an authenticated user record.

### The Attack Vector
Once an adversary acquires a session token (via insecure Wi-Fi packet sniffing, Cross-Site Scripting [XSS], physical access to an unattended field tablet, or browser inspection):
1. The attacker injects the token into their own browser’s cookie jar (`fieldlog.session_token=<stolen_token>`).
2. The attacker issues requests directly to protected application endpoints (e.g., `POST /api/reports/submit`, `GET /api/projects`, `DELETE /api/users/[id]`).
3. To the backend server, the attacker’s requests appear completely indistinguishable from the legitimate supervisor's traffic. The application executes the actions, stamps the legitimate user's ID into the immutable `AuditEvent` log, and gives the attacker full control over remediation data.

---

## 3. The Anatomy of a Secure Cookie: Flags & Protection Boundaries
In FieldLog, session cookies are configured with strict defense-in-depth flags:

```http
Set-Cookie: fieldlog_session=s%3A7a9f...; 
            Path=/; 
            HttpOnly; 
            Secure; 
            SameSite=Lax; 
            Max-Age=2592000; 
            Priority=High
```

| Cookie Flag | Value | What It Strictly Prevents | What It Fails to Protect Against |
| :--- | :---: | :--- | :--- |
| **`HttpOnly`** | `true` | Prevents client-side scripts (`document.cookie`) from reading or extracting the session token. Completely neutralizes token theft via standard stored or reflected Cross-Site Scripting (XSS). | Does not stop an attacker from using XSS to make requests directly through the victim's browser session (Cross-Site Script Inclusion / in-browser API execution). |
| **`Secure`** | `true` | Instructs the browser to transmit the cookie exclusively over encrypted TLS (`https://`) channels. Prevents plaintext interception and eavesdropping on public Wi-Fi or cellular interception. | Does not protect against malware running locally on the user's operating system or physical extraction from browser SQLite cookie stores. |
| **`SameSite`** | `Lax` | Restricts cookie dispatch on cross-site requests. For normal cross-site `POST` requests, embeds, and iframe form submissions, the browser refuses to send the cookie. Prevents Cross-Site Request Forgery (CSRF). | Does not protect against same-origin vulnerabilities, sub-domain takeovers, or top-level navigational `GET` links if endpoints mistakenly mutate state on `GET`. |
| **`Path`** | `/` | Confines cookie transmission to the application scope. | Does not isolate across distinct sub-directories on the same origin. |
| **`Max-Age`** | `2592000` (30 days) | Enforces temporal bounds, ensuring dormant sessions naturally expire after 30 days of inactivity. | Does not protect during the active 30-day window if an active token is leaked. |

---

## 4. Architectural Defense: Hashed Database Sessions & Damage Limitation

To minimize the blast radius of a compromised database or stolen session token, FieldLog implements four strict architectural controls:

### Control 1: One-Way Hashing of Server-Side Session Tokens
The server never stores raw session tokens in the database. When a session is generated:
1. The server generates a high-entropy 256-bit cryptographically secure pseudorandom token ($T$) using `crypto.randomBytes(32).toString('hex')`.
2. The server sends $T$ to the client browser inside the `Set-Cookie` header.
3. The server computes the SHA-256 digest: $H = \text{SHA-256}(T)$.
4. Only the hash $H$ is stored in the `Session` table:
   ```prisma
   model Session {
     id           String   @id @default(uuid()) @db.Uuid
     sessionToken String   @unique // Stores SHA-256(T)
     userId       String   @db.Uuid
     expires      DateTime
     user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   }
   ```
**Benefit**: If an adversary breaches the PostgreSQL database or downloads an automated snapshot, they obtain only one-way cryptographic hashes. Because SHA-256 is mathematically irreversible, the attacker cannot convert the hashes back into valid cookie tokens to impersonate users.

### Control 2: Instant Constant-Time Revocation on Logout ($O(1)$)
When a user logs out, the server does not merely clear the browser cookie; it queries:
```sql
DELETE FROM "Session" WHERE "sessionToken" = SHA-256($clientToken);
```
Once the database row is deleted, the token becomes instant dead weight. Even if an eavesdropper intercepted the token prior to logout, presenting it to the server triggers `HTTP 401 Unauthorized` because the matching database record no longer exists.

### Control 3: Session Invalidation on Password Reset (The "Kill All" Vector)
When a supervisor resets or changes their password, all active sessions must be terminated. The application runs:
```sql
DELETE FROM "Session" WHERE "userId" = $userId;
```
This single query immediately terminates all sessions across every phone, laptop, and field tablet globally. If a session token was stolen by an attacker, the password reset instantly purges the attacker's access.

### Control 4: Account Deactivation Hook in Middleware
Every incoming request authenticated by middleware checks `user.status`. If an Organisation Admin deactivates a former employee (e.g. during account deletion or termination), the user record transitions to `DEACTIVATED`. Even if a valid session cookie exists and has not yet expired, the server middleware refuses the request with `HTTP 403 Forbidden` and purges the session.

