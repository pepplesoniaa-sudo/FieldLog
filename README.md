# FieldLog: Offline-First Statutory Site Reporting Infrastructure

> **Product Fact Source**: `docs/FieldLog-V1-PRD-v2.4.md` (Canonical Consolidated Specification)  
> **Course Brief**: `ship-and-found-tasks.md` (Ship & Found: Five Assessment Tasks)  
> **Core Operational Invariant**: Zero data loss across the entire pipeline—from an offline phone on a remote remediation site to an approved, cryptographically frozen regulatory report (PRD G3, NFR-01, NFR-02).

---

## 1. What This Is

FieldLog is an offline-first progressive web application engineered for field supervisors and certified reviewers on environmental remediation sites (e.g. soil decontamination, brownfield monitoring, and toxic containment), where capturing high-resolution photos, GPS coordinates, and structured notes once—under zero cellular reception—and compiling them into verified, audit-ready daily site reports with zero data loss is the one thing that must work.

---

## 2. Status

Honest disclosure of implementation status across the platform:

* **Finished (100% Complete & Evidenced)**:
  * **Task 1 (Design System)**: Complete Material 3 token architecture pinned at Primary 40 (`#1B5EAD`), 15-style responsive typography scale ($1.4\times$ multiplier), primary-tinted elevation shadows, complete vs incomplete JSON export evidence, and verified agent token consumption (0 raw hex values).
  * **Task 2 (Scaffold & Diagnostics)**: Next.js 15 App Router architecture, `/api/health` diagnostic endpoint, port-conflict recovery with machine PIDs, first page load benchmarks, responsive measure control, and hand-drawn working tree.
  * **Task 3 (Client Validation & Accessibility)**: Single-page authentication collapse (`sign-in`, `sign-up`, `reset`), 4 client-side validation tiers, full WCAG 2.2 AA audit with caution icons and screen reader transcripts, anti-enumeration defenses, and adversarial curl bypass proof.
  * **Task 4 (Server Security & Data Truth)**: Multi-tenant PostgreSQL Prisma schema with 20+ tables (including separate `Payment` and `PaymentAttempt` tables), boundary Zod validation, 3-step zero-downtime migration protocols, empirical Argon2id vs SHA-256 benchmarks (82.88ms vs 0.015ms), compound rate limiting, and queue-backed background email dispatch.
  * **Task 5 (Sessions, Compliance & Defence)**: Server-side hashed sessions with secure cookie flags, 14-day account deletion grace period, right-to-erasure vs statutory retention conflict resolution (7-year environmental records), primary field research with an environmental contractor, 7-section technical handbook, and 22 viva defence answers.
* **Half Done (In Active Construction)**:
  * **Offline Sync Outbox Queue (FR-20 to FR-25)**: IndexedDB schema and typed client sync operation log designed; background Serwist service worker sync triggers undergoing field simulation.
  * **Statutory PDF Report Generation (FR-42)**: Report revision data model and frozen SHA-256 snapshot hashing completed; `@react-pdf/renderer` print stylesheet undergoing cross-browser layout tuning.
* **Not Started / Deliberately Deferred (Phase 2 Scope)**:
  * **Word (.docx) Export (FR-42a)**: Explicitly classified as a Should in PRD; deferred until requested.
  * **Gemini AI Summary Suggestions (FR-58) & Semantic Meaning Search (FR-59)**: Fully modeled in schema (`AiSuggestion`, `EntryEmbedding`), but deliberately kept switched OFF until Data Protection Impact Assessment (DPIA) sign-off per PRD Section 14 (Q31).

---

## 3. The Stack, with Reasons

Each architectural choice and the specific alternative considered:

* **Next.js 15 (App Router)**: Hybrid architecture allows lightweight, offline-cacheable Client Components for field screens (`/today`, `/capture`) alongside secure Server Actions for desktop review queues, chosen over a purely client-side SPA (Vite/CRA) which lacks secure server boundaries.
* **TypeScript & Zod**: Provides end-to-end type safety with immutable boundary validation on every API request and sync operation, chosen over unvalidated runtime JavaScript to prevent corrupted payloads entering the database.
* **PostgreSQL & Prisma ORM (v5.22.0)**: Strict ACID relational guarantees with multi-tenant foreign keys, soft deletes (`deletedAt`), and optimistic concurrency (`version`), chosen over MongoDB because financial ledgers and revision-controlled site reports require strict relational integrity.
* **Dexie.js (IndexedDB Wrapper)**: Durable, asynchronous browser database capable of storing hundreds of compressed megabyte-scale site photos and outbox queues offline, chosen over `localStorage` which is synchronous, unindexed, and hard-capped at 5MB.
* **Argon2id & scrypt**: Adaptive memory-hard hashing calibrated to ~80ms execution to neutralize GPU cracking clusters, chosen over SHA-256 which computes in 0.015ms and allows billions of brute-force guesses per second.
* **pg-boss**: Relational background worker queue running on dedicated Node processes for transactional email and cleanup jobs, chosen over BullMQ/Redis to avoid introducing a second stateful infrastructure dependency.

---

## 4. Getting Started

Follow these exact commands to go from a clean clone to a running application:

```bash
# 1. Clone repository and install dependencies
git clone https://github.com/your-org/fieldlog.git
cd fieldlog
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and enter your PostgreSQL credentials (e.g. postgresql://postgres:postgres@localhost:5432/fieldlog_dev?schema=public)

# 3. Validate schema and generate Prisma client
npx prisma validate
npx prisma generate

# 4. Deploy database migrations
npx prisma migrate deploy

# 5. Start development server
npm run dev
```

* **Application Portal**: Open [http://localhost:3000](http://localhost:3000) (Marketing landing page with links to Supervisor Sign In and Organisation Registration).
* **System Diagnostic Liveness**: Check [http://localhost:3000/api/health](http://localhost:3000/api/health).
* **Prisma Studio Inspector**: Run `npx prisma studio` and open [http://localhost:5555](http://localhost:5555).

---

## 5. Environment Variables

In accordance with security baseline rules, secrets are never committed to version control. The application references:

* **`DATABASE_URL`**: PostgreSQL connection string with host, port, credentials, and schema parameters for Prisma ORM.
* **`AUTH_SECRET`**: High-entropy 256-bit secret used for cryptographic signing of database session cookies.
* **`PORT`**: Optional local server port (defaults to `3000`).

---

## 6. What FieldLog Deliberately Does Not Do

Explicit scope boundaries and operational reasons (PRD Section 3.2):

1. **No Single Sign-On (SSO) or Mandatory SMS MFA in the Field**: Remote remediation sites frequently have zero cellular signal; mandatory SMS OTP or external identity providers lock supervisors out of offline capture.
2. **No Native iOS/Android Apps**: Built as a responsive PWA to eliminate dual-codebase maintenance, app-store approval delays, and fragile native update synchronization.
3. **No Voice Dictation**: Severe ambient acoustic noise from heavy excavation machinery and diesel pumps renders mobile speech-to-text recognition unusable on site.
4. **No Direct Third-Party Integrations**: No fragile API coupling to SAP or Procore in V1; reports export cleanly as universal, legally certified PDFs (`@react-pdf/renderer`).
5. **No Automatic AI Approvals**: AI suggestions (FR-58, FR-59) are strictly assistive and off by default; a certified human engineer must inspect, edit, and sign off on every statutory report.

---

## 7. Known Defects

Real defects identified, documented, and referenced by file and line number:

1. **Mononymous User Exclusion**: Full name validation requires at least two whitespace-separated words (`app/sign-in/page.tsx:82`), which wrongly blocks legitimate mononymous individuals (e.g. users from Indonesia or Northern Nigeria). Documented in [`task-03-client-validation/docs/defects.md`](./task-03-client-validation/docs/defects.md) and defended in [`task-03-client-validation/docs/interview-answers.md`](./task-03-client-validation/docs/interview-answers.md#question-12).
2. **Native Number Input Stepper Friction**: Utilizing `<input type="number">` on seat allocations causes default zero prefixing (`0400`) and spinner layout shifts on mobile touchscreens. Documented in [`task-03-client-validation/docs/defects.md`](./task-03-client-validation/docs/defects.md) and replaced with digit-filtered text inputs.
3. **WebKit Safari Storage Eviction Risk**: iOS WebKit can silently evict IndexedDB storage if device storage runs low or if the app is unused for 7 days. Addressed in PRD FR-27 by blocking web capture until installed as a standalone PWA. Documented in [`task-05-sessions-compliance-defence/docs/defects.md`](./task-05-sessions-compliance-defence/docs/defects.md) and analyzed in [`task-05-sessions-compliance-defence/docs/interview-answers.md`](./task-05-sessions-compliance-defence/docs/interview-answers.md#question-21).
4. **Shadow Database Vector Extension Mismatch**: Standard Windows PostgreSQL installers do not package the compiled C-extension `pgvector`, causing `npx prisma migrate dev` to fail on shadow database creation. Resolved in [`prisma/migrations/20261031220811_init/migration.sql:2`](./prisma/migrations/20261031220811_init/migration.sql) by commenting out native extension creation for local development.
5. **Non-Atomic Registration Email Queueing**: In initial scaffolding, if the background SMTP mailer failed, user registration had already succeeded, leaving unverified accounts in a limbo state without an immediate retry trigger. Documented in [`task-04-server-security/docs/defects.md`](./task-04-server-security/docs/defects.md).

---

## Deliverables & Assessment Artifacts Directory

Each assessment task has its own standalone directory complete with technical documentation, empirical machine evidence, and interview defence transcripts:

* **[`task-01-design-system/`](./task-01-design-system/)**: Token JSON files, contrast ratios, and proof of agent token conformance.
* **[`task-02-repository-and-scaffold/`](./task-02-repository-and-scaffold/)**: Server diagnostics, port conflict resolution logs, and hand-drawn working tree ([`evidence/14-working-tree-drawing.jpg`](./task-02-repository-and-scaffold/evidence/14-working-tree-drawing.jpg)). Pull Request URL: [`github.com/fieldlog/fieldlog/pull/1`](https://github.com/fieldlog/fieldlog/pull/1).
* **[`task-03-client-validation/`](./task-03-client-validation/)**: Accessibility transcripts, direct curl attack evidence, and rollback runbooks.
* **[`task-04-server-security/`](./task-04-server-security/)**: Schema design, 3-step zero-downtime migrations, and empirical Argon2id timing logs.
* **[`task-05-sessions-compliance-defence/`](./task-05-sessions-compliance-defence/)**: Statutory retention matrix, 14-day deletion grace period, real contractor interview ([`docs/interview-with-owner.md`](./task-05-sessions-compliance-defence/docs/interview-with-owner.md)), 7-section handbook ([`docs/handbook.md`](./task-05-sessions-compliance-defence/docs/handbook.md)), and public engineering article:  
  👉 **[Why You Cannot Delete a User in Environmental Engineering Software](https://medium.com/@fieldlog-eng/why-you-cannot-delete-a-user-in-environmental-software-7a8b9c)**.
