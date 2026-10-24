---
trigger: model_decision
description: Use when adding or changing security headers, CSP, audit events, logging, metrics or alerts.
---
# Security and logging rules

- HTTP Strict Transport Security (HSTS) header must be configured with a 1-year max age, with TLS enforced everywhere [PRD 7.7].
- Content Security Policy (CSP) must disallow inline scripts except Next.js nonces; img-src must allow self, blob:, data:, and the storage domain; connect-src must allow self and the storage domain [PRD 7.7].
- The AuditEvent table is strictly append-only; the database role used by the application must have no UPDATE or DELETE grants on it [PRD 7.7, NFR-16].
- AuditEvent records must be generated for 100% of the following actions: create, change, submit, decision, export, and sign-out with unsynced work [PRD 7.12 NFR-16].
- Application logs must use structured JSON format containing requestId, userId, organisationId, and route fields, retaining entries for 30 days while strictly omitting photo content, passwords, and tokens [PRD 7.11].
- System metrics monitored must include sync success rate, entries waiting on the server side, photo.verify failures, job queue age, export time, and 5xx rate [PRD 7.11].
- Developer alerts must trigger on 5xx rate over 1% for 5 minutes, job queue age over 15 minutes, any checksum mismatch, any rejected sync item, or health check failing for 2 minutes [PRD 7.11].
- No error tracker or email provider is chosen. Do not install one; ask Rox (AGENTS open question 6). [PRD 7.1, 7.11]
