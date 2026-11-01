# Task 4: The Server is the Source of Truth

## Executive Summary
This repository directory contains the complete deliverables, technical documentation, empirical machine evidence, database migration logs, benchmark numbers, and technical interview defences for **Task 4: The Server is the Source of Truth** of the FieldLog development brief.

While Task 3 attacked client-side validation from both sides—proving that browser checks exist strictly for user ergonomics and provide zero security—**Task 4 establishes the server as the immutable, authoritative perimeter**. Every rule previously verified in the browser is re-enforced at the server boundary using strict runtime schemas (Zod). 

This task covers database schema architecture, zero-downtime migrations, adaptive cryptographic password hashing (Argon2id vs. SHA-256 with empirical machine benchmarks), boundary validation, defense against mass assignment, compound rate limiting, breached password protection ($k$-Anonymity), transactional email architecture with brand token fidelity, explicit justification of omitted controls, and real defect post-mortems.

---

## Deliverables Directory Structure

```
task-04-server-security/
  ├── README.md                                 # Master directory guide and technical summary
  ├── docs/                                     # 11 comprehensive architectural documents
  │   ├── schema.md                             # Schema design, entity justifications, money attempts model
  │   ├── migrations.md                         # Zero-downtime migrations, failed required column, drift fix
  │   ├── hashing.md                            # Timing numbers, attack arithmetic, Argon2id vs SHA-256
  │   ├── validation-placement.md               # Boundary placement, mass-assignment defense, Zod schemas
  │   ├── rate-limiting.md                      # Algorithm trade-offs, compound keying, boundary burst defense
  │   ├── breach-check.md                       # k-Anonymity design, API privacy, naive leak analysis
  │   ├── verification-design.md                # 6-digit CSPRNG token design, expiry justification, attacks
  │   ├── email-copy.md                         # Transactional copy critique: marketing voice vs agent defaults
  │   ├── not-implemented.md                    # 4 security controls deliberately omitted and justified
  │   ├── defects.md                            # 4 detected defects, root cause analysis, and fixes
  │   └── interview-answers.md                  # Comprehensive viva defence answers to all 19 questions
  └── evidence/                                 # 23 verifiable machine proof assets (logs and PNGs)
      ├── 01-schema-drawing.jpg                 # Hand-drawn entity relationship & state diagram
      ├── 02-database-state-before.png          # PostgreSQL table state prior to Task 4 migrations
      ├── 03-initial-migration.txt              # Terminal output: initial baseline migration execution
      ├── 04-required-column-failure.txt        # Diagnostic log: failed attempt adding NOT NULL column
      ├── 05-required-column-three-steps.txt    # Terminal output: successful 3-step zero-downtime migration
      ├── 06-drift-error.txt                    # Diagnostic log: Prisma schema drift error and resolution
      ├── 07-hash-twice-different.txt           # Cryptographic proof: identical password produces distinct hashes
      ├── 08-timing-argon-vs-sha.txt            # Machine benchmark: SHA-256 (0.015ms) vs Argon2id (82.88ms)
      ├── 09-email-case-normalised.png          # Visual evidence: case-insensitive email normalisation
      ├── 10-password-trim-working.png          # Visual evidence: untrimmed password entropy preservation
      ├── 11-validation-timing.txt              # Latency benchmark: sub-millisecond Zod boundary validation
      ├── 12-direct-request-before-and-after.txt# Side-by-side: Task 3 bypass accepted vs Task 4 HTTP 400 rejection
      ├── 13-rate-limit-triggered.png           # Visual evidence: HTTP 429 Too Many Requests response
      ├── 14-rate-limit-defeated.txt            # Penetration log: defeating IP-only limits via header spoofing
      ├── 15-breach-check-rejection.png         # Visual evidence: HaveIBeenPwned k-Anonymity rejection
      ├── 16-smtp-failure.txt                   # Diagnostic log: synchronous SMTP timeout failure
      ├── 17-smtp-success.txt                   # Operational log: asynchronous pg-boss background email dispatch
      ├── 18-registration-timing-sync-vs-job.txt# Latency comparison: 2,450ms sync SMTP vs 88ms async worker
      ├── 19-verification-row.png               # Visual evidence: database row with hashed verification token
      ├── 20-verification-expired.png           # Visual evidence: rejection of expired token (>10 mins)
      ├── 21-verification-wrong-code.png        # Visual evidence: rejection of invalid code + counter increment
      ├── 22-verification-code-reused.png       # Visual evidence: rejection of already-used code (idempotency fix)
      └── 23-rendered-email.png                 # Rendered transactional email using brand design tokens
```

---

## Technical Summary for Technical Interviewers (4-Minute Read)

### 1. Schema Design & Data Integrity
FieldLog uses a multi-tenant PostgreSQL schema managed by Prisma. In Task 4, authentication and billing models were added strictly in compliance with PRD Section 10:
- **`User` and `EmailToken`**: Passwords are saved exclusively as adaptive hashes. Verification codes are generated via `crypto.randomInt(100000, 1000000)`, set to expire in exactly 10 minutes, and bounded to a maximum of 3 attempts before revocation (FR-62).
- **`RateLimitCounter`**: Distributed database table for atomic window counting, eliminating in-memory counter wipe on serverless cold starts.
- **The Payment Attempts Model**: Rather than naively overwriting a `status` column on a subscription, we introduced `PaymentAttempt`. This preserves an append-only audit trail of every checkout initiation, gateway reference, currency, and failure reason, preventing race conditions during webhook delivery.

### 2. Zero-Downtime Database Migrations
Adding a non-nullable column (`passwordHash VARCHAR(255) NOT NULL`) to an active table crashed PostgreSQL with a `NOT NULL violation` (`evidence/04-required-column-failure.txt`). We resolved this using the **Three-Step Migration Pattern** (`evidence/05-required-column-three-steps.txt`):
1. Add column as nullable (`TEXT NULL`).
2. Backfill existing records with temporary cryptographic invite tokens.
3. Alter column to `NOT NULL` once all rows conform.

### 3. Password Hashing: The Core Inversion & Machine Timings
Using our benchmark script on this machine (`evidence/08-timing-argon-vs-sha.txt`):
- **SHA-256**: Calculated in **0.01515 ms** per hash (**65,994 hashes/sec** single-core).
- **Adaptive Hashing (Argon2id)**: Calculated in **82.885 ms** per hash (**12 hashes/sec** single-core).
- **Ratio**: SHA-256 is **5,470 times faster**.

**The Attack Arithmetic**:
On an 8-GPU offline cracking cluster (50 GH/s for SHA-256 vs 200 kH/s for Argon2id):
- Cracking an 8-character lowercase password ($26^8 \approx 208.8\text{ billion}$ combinations) takes **4.17 seconds** with SHA-256, but **12.08 days** with Argon2id.
- Cracking a 10-character alphanumeric password with Argon2id takes **9.4 million years**.
- An 82ms computation costs the authenticating user nothing perceptible, but slows down an offline adversary by factors of thousands.

### 4. Boundary Validation & The Direct Attack Proof
In Task 3, sending an invalid payload (`seats: -999`, `fullName: "a"`, `email: "bot-attack-no-at-sign"`) directly to the endpoint returned `HTTP 200 OK` because the backend lacked schema enforcement.
In Task 4 (`evidence/12-direct-request-before-and-after.txt`), the incoming request passes through an immutable Zod schema at the boundary (`app/api/auth/register/route.ts`). The identical attack payload is immediately refused with `HTTP 400 Bad Request` and detailed field error diagnostics in **0.42 ms**, never touching the database.

### 5. Rate Limiting: Defeating IP Limits
In `evidence/13-rate-limit-triggered.png`, sending 6 registration attempts from IP `198.51.100.14` correctly triggered `HTTP 429 Too Many Requests`.
In `evidence/14-rate-limit-defeated.txt`, we demonstrated that an attacker spoofing the `X-Forwarded-For: 203.0.113.88` header completely resets the rate limit bucket. We resolved this by architecting a **compound key** combining trusted edge reverse-proxy socket IPs with normalized target domain hashes.

### 6. Transactional Email & Asynchronous Architecture
Sending transactional emails synchronously within the HTTP registration cycle added **2,450 ms** of blocking latency and caused unhandled HTTP 500 crashes whenever the SMTP relay stalled (`evidence/16-smtp-failure.txt`). We decoupled email dispatch using **pg-boss background worker queues** (`evidence/17-smtp-success.txt`), dropping registration endpoint response latency to **88 ms** (`evidence/18-registration-timing-sync-vs-job.txt`). Furthermore, the email template incorporates FieldLog's Task 1 design tokens for brand consistency (`evidence/23-rendered-email.png`).

---

## Master Deliverable Matrix

| Deliverable File | Type | Purpose & Verification Standard |
| :--- | :--- | :--- |
| [`docs/schema.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/schema.md) | Architecture Doc | Schema design, entity justifications, and the money attempts model |
| [`docs/migrations.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/migrations.md) | Architecture Doc | Zero-downtime migrations, failed required column, drift recovery |
| [`docs/hashing.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/hashing.md) | Architecture Doc | Two timing numbers, GPU cracking arithmetic, Argon2id vs SHA-256 |
| [`docs/validation-placement.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/validation-placement.md) | Architecture Doc | Placement at boundary, mass assignment defense, Zod schemas |
| [`docs/rate-limiting.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/rate-limiting.md) | Architecture Doc | Algorithm comparison, compound keying, boundary burst defense |
| [`docs/breach-check.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/breach-check.md) | Architecture Doc | $k$-Anonymity range API design, privacy math, naive leak analysis |
| [`docs/verification-design.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/verification-design.md) | Architecture Doc | CSPRNG 6-digit generation, 10-minute expiry justification, attack analysis |
| [`docs/email-copy.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/email-copy.md) | Architecture Doc | Marketing voice critique vs. raw agent default copy |
| [`docs/not-implemented.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/not-implemented.md) | Architecture Doc | 4 security controls deliberately omitted and justified |
| [`docs/defects.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/defects.md) | Architecture Doc | 4 detected defects, root cause analysis, and fixes |
| [`docs/interview-answers.md`](file:///c:/Users/HP/Desktop/FieldLog/task-04-server-security/docs/interview-answers.md) | Viva Preparation | Thorough answers to all 19 viva defence questions (~200 words each) |

