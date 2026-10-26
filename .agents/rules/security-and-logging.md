---
trigger: model_decision
description: Use when adding or changing HTTP security headers or CSP (next.config, proxy or middleware), audit events, logging, request ids, metrics, alerts or the health route.
---
# Security headers, audit and logging

AGENTS.md already says no email provider or error tracker is chosen and to ask before installing one. security-baseline.md lists what must never be logged. This file holds only what it leaves out.

## Headers
- HSTS max-age is 1 year (31536000). Do not add preload or includeSubDomains without Rox. Why: preload is very hard to undo once browsers ship it. [PRD 7.7]
- Do not build the Content Security Policy until Rox decides how the field screens get one. PRD 7.7 asks for Next.js nonces, but nonces need every page rendered per request, while PRD 7.1 serves the field screens as static pages precached by Serwist. A cached page reuses its nonce, which defeats it. Why: either choice changes 7.1 or 7.7, and that is Rox's call. [PRD 7.1, PRD 7.7, Next.js CSP docs]
- Whatever form the CSP takes: img-src allows self, blob:, data: and the storage domain; connect-src allows self and the storage domain. AI calls are server-side, so no Google domain goes in the CSP. Read the storage domain from configuration; it is not chosen yet (Q3). Why: the browser PUTs photos straight to storage, so a missing connect-src entry blocks every upload. [PRD 7.7, PRD 7.13]

## Audit
- Write an AuditEvent for each action in NFR-16 (every create, change, submit, decision, export, and sign-out with unsynced work), plus the AI and retention events their FRs name, in the same transaction as the change. Why: if the audit write is separate and fails, the change has no record. [NFR-16, FR-05, FR-55]
- Use only existing AuditAction values. Never add one; if none fits, ask Rox. Why: the schema is locked. [AGENTS.md How to work, PRD 10]
- SIGN_OUT_WITH_UNSYNCED is written when that user next syncs, not at sign-out. Why: at sign-out the phone may be offline. [FR-05]
- Never write code that updates or deletes an AuditEvent. The rule that the app's database role has no UPDATE or DELETE on it is SQL that Rox runs: write the statement in your reply and do not run it. [PRD 7.7, database-safety.md]

## Logs, metrics, alerts
- Logs are one JSON object per line with requestId, userId, organisationId, route, level, message and time. No logging library is named: use console with JSON, or ask Rox before installing one. Why: structured fields make one request traceable across the app and the worker. [PRD 7.11]
- Create a requestId per request, pass it to any job the request queues, and return it in an X-Request-Id header. Why: a user can quote it when reporting a problem. [Proposal, not in the PRD]
- Log retention (30 days) and alert delivery are host settings, not code. No metrics or alerting tool is chosen: emit the 7.11 metrics as log lines and ask Rox before installing a tool. [PRD 7.11]
- Metrics: sync success rate, entries waiting on the server, photo.verify failures, job queue age, export time, 5xx rate. Alerts: 5xx over 1% for 5 minutes, job queue age over 15 minutes, any checksum mismatch, any rejected sync item, health check failing for 2 minutes. [PRD 7.11]
- GET /api/health needs no session and returns no data. Why: monitoring calls it without signing in. [PRD 7.2]
