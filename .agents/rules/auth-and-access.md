---
trigger: model_decision
description: Use when writing or changing sign-in, sign-up, email verification codes, password reset, invites, sessions, the Auth.js adapter, passwords, roles and memberships, the tenant-scoping Prisma extension, rate limits, or any route's or server action's access check.
---
# Auth and access

AGENTS.md already holds: server-side permission checks on every request, scoping by organisationId and membership, the three project roles, that a user never reviews their own report, the backup reviewer and the open question on "absent", and when to switch away from Auth.js. This file holds only what it leaves out.

## Sign-in and sessions
- Auth.js runs with database sessions through the custom adapter in PRD 7.4. Auth.js's email-and-password (Credentials) provider does not create database sessions by itself, so the sign-in code must create the Session row and set the cookie. Prove it in Phase 1 week 1 with four tests: sign in, read session, revoke, expire. Why: if this fails, AGENTS.md says Rox decides the switch, and Rox needs the four results to decide. [PRD 7.4, NA2]
- Store only the SHA-256 of the cookie value in Session.sessionToken; hash on every read and write. Set organisationId from the user. Never log or return the raw token. Why: a database leak must not hand out working sessions. [PRD 7.4, PRD 10]
- Cookie: HttpOnly, Secure, SameSite=Lax, 30-day sliding expiry. Why: script cannot read it, it never travels over plain HTTP, and other sites cannot send it on a form post. [PRD 7.4, NA2]
- Revoke (delete) the user's Session rows on sign-out and on deactivation. Why: a removed user must lose access at once. [PRD 7.4, FR-54]
- Password reset (FR-06): one-use emailed link, 60 minutes, only its SHA-256 stored in EmailToken (purpose RESET_PASSWORD). The reply is identical whether or not the email exists. On success, delete every Session row of that user in the same transaction as the new password hash. Why: a reset is what a user does when they think someone else is in their account. [FR-06, PRD 7.4, NA3]
- Invites (FR-01, a Must): store only the SHA-256 of the invite token in EmailToken (purpose INVITE), make it single-use, valid 7 days (NA3), and send it through the email provider named in AGENTS.md. Accepting it sets User.emailVerifiedAt. Why: an invite link is a password-setting key. [FR-01, AGENTS.md Stack]
- Passwords use argon2id. No argon2 package is named in AGENTS.md, so ask Rox before installing one, and ask for the cost settings, which are not set in the PRD. [PRD 7.4, NA3, NFR-13]
- Lockout (FR-07, a Must from PRD 2.3): after 10 failures set lockedUntil to 15 minutes ahead and reset failedSignIns on success. The message is the same as a wrong password. Why: a different message tells an attacker the account exists. [FR-07, NFR-13]
- Sign-up (FR-61) only creates a new Organisation, its admin User and its Subscription, in one transaction. It never adds a user to an existing organisation. If the email is already in use, show the same reply as success and send no code. Why: otherwise sign-up becomes a way to test which emails have accounts. [FR-61]
- Verification codes (FR-62): crypto.randomInt(0, 1000000), padded to 6 digits, SHA-256 stored in EmailToken (purpose VERIFY_EMAIL), the expiry and try limit from PRD NA29, single use. Never Math.random. Why: Math.random is predictable, so its codes can be guessed. [FR-62, NA29]
- Breached-password check (FR-61, sign-up and reset only): send only the first 5 hex characters of the password's SHA-1 to the range service and compare the returned suffixes locally. If the service is down, allow the password and log the outage (no email in the log). Why: the password, and even its full hash, must never leave the server. [FR-61]

## Roles (PRD 7.4)

| Action | Supervisor | Reviewer | Admin |
|---|---|---|---|
| Capture and edit own entries | Yes, assigned sites | No | No, unless also a supervisor |
| Submit own reports | Yes | No | No |
| Approve or request changes | No | Yes, own projects, not own reports | No, unless also the reviewer |
| Search | Assigned sites | Own projects | Whole organisation |
| Export approved reports | Own reports | Own projects | Whole organisation |
| Manage projects, sites, users, pick-lists, settings | No | No | Yes |

- The backup reviewer has the Reviewer column's rights only for a report the main reviewer cannot decide (their own report). Why: the table does not show the backup reviewer, and FR-52 limits them to that case. [FR-52]
- Block a user from holding Supervisor and a review role on the same project in application code, inside the same transaction as the assignment. Why: the database allows both rows; only the code can stop it. [FR-52, PRD 10]

## Tenant scoping
- One Prisma client extension adds organisationId and membership filters to every tenant query. App code uses only the extended client. Why: one forgotten filter is a cross-tenant leak (NFR-12). [PRD 7.4]
- $queryRaw and $executeRaw bypass the extension. Every raw query (the vector search) must add the organisation and access filters itself. Why: otherwise meaning search returns other organisations' entries. [PRD 7.4, PRD 7.13]
- Integration tests: for every API route and server action, test each role (supervisor, reviewer, backup reviewer, admin, a user from another organisation, signed out) and expect zero cross-site or cross-project reads. Run them as agent-conduct.md says for database tests. [PRD 7.4, NFR-12]

## Rate limits
- Sign-in: 10 per 15 minutes per account and 50 per 15 minutes per IP. Sync: 120 requests per minute per user. Over the limit, return 429 with Retry-After. [PRD 7.7]
- Counts are stored in the RateLimitCounter table (PRD 7.7), with sign-up and reset limits from NA28. Which header gives the real client IP behind the host's proxy is not set (host not chosen, Q3): ask Rox. Why: counts kept in memory reset on every restart, and a client can fake the IP header. [PRD 7.7, Q3]
