# Task 5 Defects Log: Root Cause Analysis and Architectural Remediation

During the design, implementation, and verification of **Task 5: Sessions, Deletion, and the Defence**, several critical security, session handling, and data compliance defects were uncovered. Below is the technical post-mortem for each defect.

---

## Defect 1: The Logout Network Failure (The False Logout State Leak)

### Severity
**Critical (Session Security Flaw)**

### Detection & Diagnostic Evidence
Documented and proven in:
* [`task-05-sessions-compliance-defence/evidence/09-logout-network-failure.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/09-logout-network-failure.txt)
* [`task-05-sessions-compliance-defence/evidence/10-logout-edge-case-fixed.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/10-logout-edge-case-fixed.txt)

### The Failure Mechanism
In the initial naive implementation of logout:
```typescript
// Initial flawed client-side logout handler
async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error("Logout request failed over network", err);
  } finally {
    // Unconditionally redirect user to login screen
    router.push('/sign-in');
  }
}
```
When a supervisor tapped "Log Out" while their device was experiencing intermittent cellular packet loss or airplane mode, the `fetch('/api/auth/logout')` threw a network exception. The `finally` block executed, cleared local React UI state, and redirected the browser to the login screen.

The user believed they were securely logged out. However, because the server never received the HTTP `POST`, **the session record remained active and valid in the PostgreSQL database**. 
If another individual later opened that shared field tablet or laptop, the still-valid session cookie was dispatched on the next request, instantly granting unauthorized access to the previous user's account without requiring a password!

### Resolution & Architectural Fix
Implemented a **Two-Tiered Defensive Logout Protocol**:
1. **Client-Side Cookie Invalidation**: The client handler explicitly wipes local cookie state and indexedDB session caches even if the network fails:
   `document.cookie = "fieldlog_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";`
2. **Offline Outbox Logout Queue**: If the network request fails, an atomic `LOGOUT_PENDING` flag is persisted to IndexedDB. Upon next network reconnect, the service worker immediately transmits the revocation to the server before processing any other API requests.
3. **Explicit UI Feedback**: If the server fails to acknowledge the logout, the UI does *not* claim success; it alerts the user: *"Network disconnected. Local credentials purged from this device. Server revocation queued."*

---

## Defect 2: Session Confusion with Multiple Users on One Shared Device

### Severity
**High (Data Integrity & Authorization Defect)**

### Detection & Diagnostic Evidence
Documented in:
* [`task-05-sessions-compliance-defence/evidence/06-two-users-one-browser.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/06-two-users-one-browser.txt)

### The Failure Mechanism
On environmental remediation sites, shift supervisors frequently share a single ruggedized laptop in the site trailer. 
- Supervisor Aliyu signs in, captures entries, and closes the browser window (without explicitly logging out).
- Supervisor Bola opens the browser 30 minutes later, navigates to `/sign-in`, and enters her own credentials.

In the initial implementation, when Bola logged in, the application issued a new session cookie for Bola, but **did not invalidate Aliyu's existing local IndexedDB draft cache or Next.js client router cache**.
As a result, when Bola navigated to the field capture form, the client components rendered Aliyu's unsynced draft entries and cached user initials (`shortCode: "AL"`). When Bola clicked "Submit", entries were submitted with Bola's session token but carried Aliyu's cached metadata, corrupting the authorial integrity of the daily site report!

### Resolution & Architectural Fix
1. **Atomic Session Clean-Up on Login**: When `/api/auth/login` succeeds, the server stamps a unique `sessionId` in the session payload.
2. **Client Store Isolation**: The client store compares the incoming user ID with the active IndexedDB tenant cache. If a user change is detected, all local in-memory caches are purged immediately, and the outbox is partitioned strictly by `userId`.
3. **Server Session Invalidation**: The login route explicitly checks for prior session cookies and marks the preceding session as terminated in PostgreSQL before issuing the new cookie.

---

## Defect 3: Password Reset Failing to Terminate Concurrent Sessions

### Severity
**Critical (Account Takeover Vulnerability)**

### Detection & Diagnostic Evidence
Documented in:
* [`task-05-sessions-compliance-defence/evidence/11-reset-kills-other-session.png`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/11-reset-kills-other-session.png)

### The Failure Mechanism
When a user completed a password reset via `/api/auth/reset`:
```typescript
// Flawed initial reset logic
await prisma.user.update({
  where: { id: userId },
  data: { passwordHash: newHashedPassword }
});
```
The password was updated in the database, but existing session records in the `Session` table were left untouched. 
If an employee’s laptop was stolen or their account was compromised, and the legitimate user initiated a password reset from their phone, **the thief’s active session on the stolen laptop continued to work indefinitely**. The thief could continue submitting and viewing confidential data until the 30-day session cookie naturally expired!

### Resolution & Architectural Fix
Enforced the mandatory **Global Session Invalidation Protocol**:
```typescript
await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHashedPassword }
  }),
  // Cryptographic kill-switch across all devices
  prisma.session.deleteMany({
    where: { userId: userId }
  })
]);
```
This guarantees that completing a password reset instantly terminates all sessions across every phone, laptop, and browser globally, forcing all devices to re-authenticate with the new credentials.

---

## Defect 4: Account Deletion Worker Failing on Second Run (Non-Idempotent SQL Job)

### Severity
**High (Data Integrity / Maintenance Job Failure)**

### Detection & Diagnostic Evidence
Documented in:
* [`task-05-sessions-compliance-defence/evidence/13-scheduled-job-run-one.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/13-scheduled-job-run-one.txt)
* [`task-05-sessions-compliance-defence/evidence/14-scheduled-job-run-two.txt`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/evidence/14-scheduled-job-run-two.txt)

### The Failure Mechanism
The automated account deletion background worker finds users whose 14-day grace period has expired and executes anonymisation.
In the first implementation:
```sql
-- Naive worker query
SELECT id, email, name FROM "User" WHERE status = 'DEACTIVATED' AND "deletedAt" < NOW() - INTERVAL '14 days';
```
The worker anonymised the records. However, because it did not update a dedicated `isAnonymised` boolean or status enum, running the worker a second time five minutes later re-queried the identical rows!
On the second run, the script attempted to prepend `"anon_"` to emails that were *already* anonymised (`anon_anon_uuid@fieldlog.internal`), causing email strings to exceed the column length limit (`VARCHAR(255)`) and crashing the background worker with an unhandled exception.

### Resolution & Architectural Fix
Restructured the deletion job to be strictly **idempotent**:
1. Added an explicit `ANONYMISED` status to the `UserStatus` enum.
2. Query filters strictly for `WHERE status = 'DEACTIVATED' AND "deletedAt" < NOW() - INTERVAL '14 days' AND "isAnonymised" = false`.
3. In `evidence/14-scheduled-job-run-two.txt`, running the job against the identical database state finds **0 pending records**, executes in 12ms, and exits cleanly with 0 mutations.

