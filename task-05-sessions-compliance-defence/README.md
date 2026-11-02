# Task 5: Sessions, Deletion, and the Defence

## Executive Summary
This directory contains the complete deliverables, regulatory privacy policies, statutory data retention schedules, architectural technical handbooks, user research findings, and empirical evidence for **Task 5: Sessions, Deletion, and the Defence** of the FieldLog development brief.

While Tasks 1 to 4 established design token integrity, App Router foundations, accessible client validation, and immutable server boundary security, **Task 5 addresses the identity, lifecycle, and legal compliance boundaries of enterprise production software**:
1. **Server-Side Session Tracking**: Cryptographically unguessable 256-bit session tokens stored hashed in PostgreSQL and transmitted via hardened cookies (`HttpOnly`, `Secure`, `SameSite=Lax`).
2. **Onboarding Architecture**: In-depth analysis of Soft Gating vs. Hard Gating, including drop-off metrics on African mobile networks.
3. **Logout & Password Reset Invalidation**: Solving the false-logout network failure defect and enforcing instant cross-device session termination ($O(1)$) on password resets.
4. **Account Deletion as a Legal Process**: Implementing the 14-day grace period, automated background deletion workers, and functional segregation (anonymising personal identities while retaining statutory environmental reports and financial ledgers for 7 years).
5. **Primary User Research**: An in-depth field interview with Engr. Nnamdi Okonkwo of Niger Delta Ecological Restoration Ltd, analyzing where real-world operational constraints contradict naive software designs.
6. **The Technical Handbook**: A comprehensive 7-section operational manual covering all core course topics, including honest documentation of mistakes made.
7. **The Viva Defence**: Thorough, ~200-word technical answers to all 22 interview questions across sessions, authorization, compliance, and forward deployed engineering.

---

## Deliverables Directory Structure

```
task-05-sessions-compliance-defence/
  ├── README.md                                 # Master directory guide & 4-minute technical summary
  ├── privacy.md                                # Production plain-language privacy policy (14-day grace, retention)
  ├── privacy-draft-with-broken-promise.md      # Draft policy containing the unfulfillable promise + post-mortem
  ├── docs/                                     # 9 comprehensive architectural & compliance documents
  │   ├── sessions.md                           # Session lifecycle, hijacking threat model, cookie flags
  │   ├── gating.md                             # Soft vs. Hard gating analysis, conversion benchmarks, trade-offs
  │   ├── retention-matrix.md                   # Complete schema retention matrix, backups, NDPA/GDPR conflicts
  │   ├── state-management.md                   # Evaluation of client stores vs. URL/IndexedDB primitives
  │   ├── interview-with-owner.md               # Primary research interview with Engr. Nnamdi Okonkwo
  │   ├── handbook.md                           # 7-section comprehensive technical handbook
  │   ├── what-i-do-not-know.md                 # Rigorous audit of 8 system boundaries and knowledge limits
  │   ├── defects.md                            # 4 real defects diagnosed, reproduced, and remediated
  │   └── interview-answers.md                  # Comprehensive viva defence answers to all 22 questions
  └── evidence/                                 # 17 verifiable proof assets (text logs & PNGs)
      ├── 01-two-session-ids.txt                # Cryptographic proof: fresh session token on each login
      ├── 02-cookie-flags.png                   # DevTools inspection: HttpOnly, Secure, SameSite=Lax flags
      ├── 03-soft-gating-flow.png               # Visual sequence: soft gating dashboard with warning banner
      ├── 04-hard-gating-flow.png               # Visual sequence: hard gating mandatory 6-digit barrier
      ├── 05-generic-errors-both-cases.png      # Side-by-side: identical 401 error defeats user enumeration
      ├── 06-two-users-one-browser.txt          # Shared browser audit: clean session & cache isolation
      ├── 07-session-row-present.png            # PostgreSQL query: active hashed session row in database
      ├── 08-session-row-deleted.png            # PostgreSQL query: session row purged immediately on logout
      ├── 09-logout-network-failure.txt         # Diagnostic log: network drop defect leaving session alive
      ├── 10-logout-edge-case-fixed.txt         # Operational log: offline-safe logout queue remediation
      ├── 11-reset-kills-other-session.png      # Dual browser visual: password reset terminates other session
      ├── 12-deletion-request-locks-account.png # UI visual: immediate deactivation & 14-day grace period lock
      ├── 13-scheduled-job-run-one.txt          # Background worker log: Run 1 purges and anonymises 2 users
      ├── 14-scheduled-job-run-two.txt          # Background worker log: Run 2 proves idempotent zero-change safety
      ├── 15-state-management-working.png       # UI visual: failed login email carried into password reset
      ├── 16-admin-route-refused.png            # Visual proof: supervisor refused on /admin/billing (HTTP 403)
      └── 17-published-article-screenshot.png   # Rendered publication: retrospective on statutory retention
```

---

## Technical Summary for Interviewers (4-Minute Read)

### 1. Server-Side Hashed Sessions & Cookie Security
FieldLog rejects stateless JWTs in favor of database-backed sessions stored in PostgreSQL. To protect against database breaches, the server never stores raw cookie tokens; it computes `SHA-256(token)` and stores only the digest (`evidence/07-session-row-present.png`). When an employee logs out or an admin deactivates an account, the session row is deleted in constant time ($O(1)$), rendering the cookie useless immediately (`evidence/08-session-row-deleted.png`). Cookies enforce `HttpOnly`, `Secure`, and `SameSite=Lax` flags (`evidence/02-cookie-flags.png`).

### 2. The Logout Network Failure Defect
During testing on intermittent cellular links, we caught an edge-case defect (`evidence/09-logout-network-failure.txt`): when a user tapped "Log Out" and the cellular link dropped, the frontend router redirected to `/sign-in` while the server never received the request, leaving the session alive in PostgreSQL. We remediated this by implementing an **offline-safe logout protocol** (`evidence/10-logout-edge-case-fixed.txt`): client-side credentials are immediately quarantined, and a session revocation operation is enqueued into Dexie IndexedDB for background sync upon network reconnection.

### 3. Password Reset: Global Invalidation
Under `Step 5`, routine logins allow multi-device concurrency, but an emergency password reset must terminate all sessions globally. We implemented an atomic database transaction that updates the Argon2id hash and executes `DELETE FROM "Session" WHERE "userId" = $id`. As demonstrated in `evidence/11-reset-kills-other-session.png`, resetting a password on a mobile phone immediately boots a compromised trailer laptop with an `HTTP 401 Unauthorized` refusal.

### 4. Account Deletion: The Legal Process & The Hauwa Scenario
In the Hauwa scenario, deleting a departing user's row destroyed two years of financial and operational records. In FieldLog, we built a legally compliant deletion pipeline:
- **Phase 1 (Day 0)**: Immediate account deactivation, session revocation, and 14-day grace period lock (`evidence/12-deletion-request-locks-account.png`).
- **Phase 2 (Days 1–14)**: Cooling-off period allowing challenge of fraudulent requests.
- **Phase 3 (Day 15)**: Automated background maintenance worker executes transactional anonymisation (`evidence/13-scheduled-job-run-one.txt`).
- **Functional Segregation**: We purge authentication credentials and anonymise personal names/emails, but retain immutable environmental daily site reports, photos, and payment ledgers for the **7-year statutory retention period** mandated by environmental regulators (NESREA/NUPRC) and corporate tax law.
- **Idempotency**: Running the background worker a second time changes 0 rows and exits cleanly in 11ms (`evidence/14-scheduled-job-run-two.txt`).

### 5. Primary Research Findings
Our 20-minute field interview with Engr. Nnamdi Okonkwo of Niger Delta Ecological Restoration Ltd (`docs/interview-with-owner.md`) revealed that supervisors on muddy remediation sites are purely capture agents who wear safety gloves and refuse complex desktop-style interfaces. This grounded our decision to eliminate client-side state library bloat (`docs/state-management.md`), preserve generous 44px touch targets from Task 1, and enforce hard gating on organisation sign-ups while maintaining offline capture resilience.

---

## Master Deliverables Matrix

| Deliverable File | Type | Purpose & Verification Standard |
| :--- | :--- | :--- |
| [`privacy.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/privacy.md) | Policy | Production plain-language privacy notice; 14-day grace period, statutory retention |
| [`privacy-draft-with-broken-promise.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/privacy-draft-with-broken-promise.md) | Compliance Defect | Draft policy containing unfulfillable verbal/offline 24-hr wipe promise + post-mortem |
| [`docs/sessions.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/sessions.md) | Architecture Doc | Session hijacking threat model, cookie flags, hashed DB sessions, damage limitation |
| [`docs/gating.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/gating.md) | Architecture Doc | Soft vs. Hard gating analysis, conversion funnel benchmarks, switching criteria |
| [`docs/retention-matrix.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/retention-matrix.md) | Statutory Schedule | Schema table/column retention schedule, backup synchronization, erasure vs. retention conflict |
| [`docs/state-management.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/state-management.md) | Architecture Doc | Audit of client state vs. URL & IndexedDB; cross-form email handoff proof |
| [`docs/interview-with-owner.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/interview-with-owner.md) | Primary Research | 5-question field interview with Engr. Nnamdi Okonkwo; design assumptions invalidated |
| [`docs/handbook.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/handbook.md) | Technical Manual | 7 comprehensive topic sections: concept, reason, scenario, mechanism, failure, mistakes |
| [`docs/what-i-do-not-know.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/what-i-do-not-know.md) | Viva Preparation | Rigorous audit of 8 specific system boundaries, limits, and learning requirements |
| [`docs/defects.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/defects.md) | Architecture Doc | 4 real defects diagnosed: logout network failure, shared browser confusion, reset leak, worker idempotency |
| [`docs/interview-answers.md`](file:///c:/Users/HP/Desktop/FieldLog/task-05-sessions-compliance-defence/docs/interview-answers.md) | Viva Preparation | In-depth ~200-word answers to all 22 viva questions across sessions, auth, and compliance |

---

## Public Engineering Publication (Task 5, Step 13)

Read the live, published retrospective on LinkedIn:  
👉 **[Why Can't You Just Delete a User's Account in Some Apps?](https://www.linkedin.com/pulse/why-cant-you-just-delete-users-account-some-apps-sonia-pepple-mifle)**  
*Published by Sonia Pepple on LinkedIn (1,500-word deep dive into GDPR Article 17, cascading delete traps, and statutory retention).*


