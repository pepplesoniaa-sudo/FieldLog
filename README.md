# FieldLog: Offline-First Statutory Site Reporting Infrastructure

> **Target Audience**: Technical Interviewers, System Architects & Engineering Directors (4-Minute Read)  
> **Product Fact Source**: `docs/FieldLog-V1-PRD-v2.4.md` (Canonical Consolidated Specification)  
> **Core Engineering Invariant**: Zero data loss across the entire pipeline—from an offline phone in a remote swamp to an approved, cryptographically frozen regulatory report (PRD G3, NFR-01, NFR-02).

---

## 1. Executive Summary & What FieldLog Is

FieldLog is an enterprise Progressive Web App (PWA) engineered for field supervisors, safety officers, and licensed engineers on remote environmental remediation and ecological restoration sites (e.g. oil spill cleanups, hazardous industrial containment, and wetland restoration).

On remediation sites, supervisors capture dozens of high-resolution photographic proofs, GPS coordinates, and structured work notes in harsh outdoor conditions with degraded or nonexistent cellular connectivity (2G/Edge/Airplane mode). Currently, contractors lose millions in withheld payments due to fragmented field records (WhatsApp photos, soggy paper notebooks, and manual Word formatting).

FieldLog enables **"Capture once on site, report automatically with zero loss"**:
1. **Offline Capture**: Captures photos, EXIF metadata, and structured notes offline; persists them to IndexedDB in an atomic transaction before declaring "Saved on this phone" (FR-20, FR-21).
2. **Deterministic Synchronization**: An append-only log of typed, idempotent sync operations reconciles with PostgreSQL whenever connectivity returns (FR-24).
3. **Automated Daily Site Reports**: Compiles field entries into frozen, revision-controlled daily reports with immutable SHA-256 snapshot checksums for one-click reviewer approval and statutory PDF export (FR-36, FR-42).

---

## 2. Who Uses It (User Personas & Role Boundaries)

* **Field Supervisor (Primary)**: Captures site entries on mobile phones or ruggedized tablets under harsh weather; submits the draft daily report at the end of shift (FR-09 to FR-17).
* **Project Reviewer**: Exactly one certified engineer per project, assigned by the admin (FR-52). Approves or requests changes with mandatory comments on desktop (FR-37). *Enforced rule: A user never reviews a report they created (FR-40).*
* **Backup Reviewer**: Optional reviewer per project who steps in if the primary reviewer is the report author.
* **Organisation Admin**: Manages projects, remediation sites, user memberships, seat subscriptions, and statutory retention periods on desktop (FR-51 to FR-55).

---

## 3. The Five Assessment Deliverables Directories

The repository is organized into five standalone assessment task directories containing complete technical documentation, empirical machine logs, and visual evidence:

| Task Directory | Focus Area | Key Architectural Deliverables & Proofs |
| :--- | :--- | :--- |
| **[`task-01-design-system/`](./task-01-design-system/)** | Design Tokens & System Integrity | Material 3 HCT color system pinned at Primary 40 (`#1B5EAD`), 15-style typography scale, primary-tinted elevation, JSON tokens compiled to CSS, and empirical proof of agent token conformance (0 raw hex values). |
| **[`task-02-repository-and-scaffold/`](./task-02-repository-and-scaffold/)** | App Architecture & Diagnostics | Next.js 15 App Router foundation, `/api/health` liveness checks, port-conflict recovery protocols, responsive mobile measure control, and hand-drawn working tree. |
| **[`task-03-client-validation/`](./task-03-client-validation/)** | Form Architecture & Client Bounds | Single-page authentication collapse (`sign-in`, `sign-up`, `reset`), 4 validation categories, WCAG 2.2 AA audit, anti-enumeration defenses, and direct adversarial attack proof (`curl` bypassing client checks). |
| **[`task-04-server-security/`](./task-04-server-security/)** | Server Truth & Boundary Defense | Immutable Zod schemas at API boundary, 3-step zero-downtime database migrations, Argon2id vs SHA-256 machine benchmarks (82.88ms vs 0.015ms), compound rate limiting, $k$-Anonymity breach verification, and queue-backed background email dispatch. |
| **[`task-05-sessions-compliance-defence/`](./task-05-sessions-compliance-defence/)** | Sessions & Statutory Compliance | Server-side hashed sessions in PostgreSQL, 14-day deletion grace period, functional segregation (anonymising user identity while retaining 7-year environmental records), primary field research with an environmental contractor, 7-section technical handbook, and 22 viva defence answers. |

---

## 4. Technical Stack & Architectural Rationale

* **Next.js 15 (App Router)**: Hybrid architecture utilizing Client Components for offline-first field screens (`/today`, `/capture`) and Server Components for online administrative views (`/admin`, `/reports`).
* **TypeScript & Zod**: Shared end-to-end type safety with immutable boundary parsing on all API handlers and server actions.
* **PostgreSQL & Prisma ORM (v5.22.0)**: Relational multi-tenant schema with UUID primary keys, optimistic concurrency control (`version`), soft deletes (`deletedAt`), and pgvector extensions.
* **Serwist & Dexie.js**: Production Service Worker caching the offline application shell, with Dexie wrapping client-side IndexedDB for outbox queueing.
* **Argon2id**: Memory-hard adaptive password hashing calibrated to ~80ms execution, neutralizing GPU brute-force attacks.
* **pg-boss**: Relational background worker queue running on dedicated Node processes for transactional email and cleanup jobs.

---

## 5. Getting Started & Verification Runbook

### Prerequisites
* **Node.js**: v20+ LTS (or v22 / v24)
* **PostgreSQL**: v15+ running locally or in cloud container

### Installation & Local Setup
```bash
# 1. Clone repository and install dependencies
git clone https://github.com/your-org/fieldlog.git
cd fieldlog
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and enter your PostgreSQL credentials

# 3. Validate database schema & generate Prisma Client
npx prisma validate
npx prisma generate

# 4. Start the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 6. Environment Variables

In accordance with FieldLog security baseline rules, secrets are never committed to version control. The application references:

* **`DATABASE_URL`**: Standard PostgreSQL connection string with schema parameters (e.g. `postgresql://user:password@localhost:5432/fieldlog_dev?schema=public`).
* **`AUTH_SECRET`**: High-entropy 256-bit secret used for cryptographic signing of session cookies.

---

## 7. What FieldLog Deliberately Does Not Do (PRD Section 3.2 Out of Scope)

To maintain focus on the core statutory reporting invariant, the following features were deliberately excluded from V1:
1. **No Single Sign-On (SSO) or Mandatory MFA in the Field**: Offline remote field sites suffer cellular desynchronization that breaks SMS OTP and TOTP clocks; sessions rely on persistent database-backed cookies.
2. **No Native Mobile App Wrapper**: Built as a responsive PWA to eliminate dual-codebase maintenance and app-store update latency.
3. **No Voice Dictation**: High ambient diesel engine and excavator noise on remediation sites renders mobile speech-to-text unusable.
4. **No Direct Third-Party Integrations**: No direct coupling to SAP, Procore, or ERPs in V1; reports export cleanly as standalone, legally certified PDFs (`@react-pdf/renderer`).
5. **No Automatic AI Approvals**: AI features (FR-58, FR-59) are strictly assistive and turned off by default; a human engineer must inspect, edit, and sign off on every statutory document.

---

## 8. Public Retrospective Article (Task 5, Step 13)

Read the in-depth engineering retrospective on resolving the conflict between the Right to Erasure and statutory environmental retention:  
👉 **[Why You Cannot Delete a User in Environmental Engineering Software](https://medium.com/@fieldlog-eng/why-you-cannot-delete-a-user-in-environmental-software-7a8b9c)**
