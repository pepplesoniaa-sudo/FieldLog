---
trigger: model_decision
description: Use when writing or changing sign-in, sessions, the Auth.js adapter, roles and permissions, tenant scoping, rate limits or any api or admin route's access check.
---
# Auth and access rules

- Auth.js runs with a custom database adapter that hashes session tokens with SHA-256 on every read and write, setting organisationId from the authenticated user [PRD 7.4, NA2].
- Passwords must be hashed using argon2id [PRD 7.4, NFR-13, NA3].
- Session cookies must be configured with HttpOnly, Secure, and SameSite=Lax flags, using a 30-day sliding expiry window [PRD 7.4, NA2].
- User sessions are revoked immediately upon sign-out, account deactivation, or password reset [PRD 7.4, FR-54].
- Role permissions matrix across actions and roles [PRD 7.4]:

| Action | Supervisor | Reviewer | Admin |
|---|---|---|---|
| Capture and edit own entries | Yes, assigned sites | No | No, unless also a supervisor |
| Submit own reports | Yes | No | No |
| Approve or request changes | No | Yes, own projects, not own reports | No, unless also the reviewer |
| Search | Assigned sites | Own projects | Whole organisation |
| Export approved reports | Own reports | Own projects | Whole organisation |
| Manage projects, sites, users, pick-lists, settings | No | No | Yes |

- Database tenant isolation is enforced by a single Prisma client extension that attaches organisationId and membership filters to every query [PRD 7.4].
- Role-by-route integration tests must verify every API route, ensuring 0 cross-site or cross-project reads across roles [PRD 7.4, 7.12 NFR-12].
- Sign-in rate limits are 10 requests per 15 minutes per account and 50 requests per 15 minutes per IP address [PRD 7.7].
- Sync rate limit is 120 requests per minute per user [PRD 7.7].
- Account lockout: FR-07 is a Should, but NFR-13 lists lockout. Do not build lockout until Rox says which wins. [FR-07, NFR-13]
- Do not build backup reviewer absence detection until Rox answers AGENTS open question 4. [FR-52]
