---
trigger: model_decision
description: Use when writing or changing sign-in, invites, sessions, the Auth.js adapter, passwords, roles and memberships, the tenant-scoping Prisma extension, rate limits, or any route's or server action's access check.
---
# Auth and access

AGENTS.md already holds: server-side permission checks on every request, scoping by organisationId and membership, the three project roles, that a user never reviews their own report, the backup reviewer and the open question on "absent", and when to switch away from Auth.js. This file holds only what it leaves out.

## Sign-in and sessions
- Auth.js runs with database sessions through the custom adapter in PRD 7.4. Auth.js's email-and-password (Credentials) provider does not create database sessions by itself, so the sign-in code must create the Session row and set the cookie. Prove it in Phase 1 week 1 with four tests: sign in, read session, revoke, expire. Why: if this fails, AGENTS.md says Rox decides the switch, and Rox needs the four results to decide. [PRD 7.4, NA2]
- Store only the SHA-256 of the cookie value in Session.sessionToken; hash on every read and write. Set organisationId from the user. Never log or return the raw token. Why: a database leak must not hand out working sessions. [PRD 7.4, PRD 10]
- Cookie: HttpOnly, Secure, SameSite=Lax, 30-day sliding expiry. Why: script cannot read it, it never travels over plain HTTP, and other sites cannot send it on a form post. [PRD 7.4, NA2]
- Revoke (delete) the user's Session rows on sign-out and on deactivation. Why: a removed user must lose access at once. [PRD 7.4, FR-54]
- Do not build password reset (FR-06, a Should) or the reset/[token] route until Rox names FR-06, even though the route map lists it. [FR-06, AGENTS.md Scope]
- Invites (FR-01, a Must): store only a hash of the invite token, make it single-use, and ask Rox for its expiry, which is not set in the PRD. No email provider is chosen, so build the token flow and leave sending to Rox. Why: an invite link is a password-setting key. [FR-01, AGENTS.md Stack]
- Passwords use argon2id. No argon2 package is named in AGENTS.md, so ask Rox before installing one, and ask for the cost settings, which are not set in the PRD. [PRD 7.4, NA3, NFR-13]
- Account lockout: FR-07 is a Should but NFR-13 lists lockout. Do not build lockout, or use the failedSignIns and lockedUntil columns, until Rox says which wins. [FR-07, NFR-13]

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
- Where the counts are stored, and which header gives the real client IP behind the host's proxy, are not set in the PRD (host not chosen, Q3): ask Rox. Why: counts kept in memory reset on every restart, and a client can fake the IP header. [PRD 7.7, Q3]
