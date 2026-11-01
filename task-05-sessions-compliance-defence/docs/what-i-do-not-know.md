# What I Do Not Know: An Honest Technical Audit of System Boundaries

> **Notice for Technical Assessors & Viva Examiners**:  
> In engineering, true competence begins with knowing the exact perimeter of your understanding. Claiming comprehensive mastery over complex distributed systems, cryptography, and jurisdictional data privacy is the hallmark of inexperienced developers. Below is an honest, rigorous audit of eight technical mechanisms in this codebase where my understanding reaches its limit, the evidence that reveals that limit, and the precise knowledge required to close the gap.

---

## 1. What Prisma Actually Does When a Complex Migration Fails Halfway Through PostgreSQL DDL Execution

### What it is
How the Prisma CLI and PostgreSQL engine manage transactionality when executing multi-statement SQL migration files containing mixed Data Definition Language (DDL) and Data Manipulation Language (DML) commands (e.g. `CREATE EXTENSION`, `ALTER TABLE`, followed by backfill `UPDATE` scripts).

### How I know I do not understand it
PostgreSQL natively supports transactional DDL (unlike MySQL), meaning most `ALTER TABLE` statements roll back atomically if a subsequent statement fails. However, certain PostgreSQL commands (such as `CREATE INDEX CONCURRENTLY` or adding enum values outside transactions) cannot run inside a standard transaction block. When our migration failed in Task 4, I observed that Prisma left the `_prisma_migrations` table in a `"failed"` state requiring manual resolution. I do not know the exact internal heuristic Prisma uses to decide whether to roll back partial DDL statements or leave them committed, nor how it handles table locks on multi-gigabyte tables during schema rollbacks.

### What I need to learn it
I need to inspect the Prisma Rust engine source code (`prisma-engines/migration-engine`) to study how migration scripts are parsed into transaction blocks, and construct an isolated PostgreSQL test lab to deliberately inject failures into multi-step migrations while monitoring active table locks via `pg_locks` and transaction boundaries in `pg_stat_activity`.

---

## 2. The Internal Cryptographic Padding and Ephemeral Key Derivation in Next.js Cookie Encryption

### What it is
The exact low-level cryptographic implementation used by Auth.js / Next.js when signing and encrypting session cookies using the AES-256-GCM / HKDF pipeline (RFC 5869).

### How I know I do not understand it
I know how to configure `AUTH_SECRET` and inspect cookie flags (`HttpOnly`, `Secure`, `SameSite=Lax`). However, if an examiner asks me to write out the mathematical steps by which Auth.js derives encryption keys from the base secret using HKDF (HMAC-based Extract-and-Expand Key Derivation Function), or how Galois/Counter Mode (GCM) computes authentication tags to detect cookie tampering without padding oracle vulnerabilities, I cannot derive it without looking at library documentation. I treat the cookie encryption mechanism as a trusted black box.

### What I need to learn it
I need to read the source code of the underlying cryptographic library (`jose` / `panva/hkdf`), review RFC 5869 for HKDF mechanics, and write a standalone Node.js script using the native `crypto.subtle` API that encrypts, decrypts, and verifies an authenticated session cookie from scratch without external dependencies.

---

## 3. High-Concurrency Race Conditions and Atomic Invariants in Rate Limit Counter Tables

### What it is
How our PostgreSQL `RateLimitCounter` table behaves under extreme distributed concurrency (e.g. 5,000 requests per second hitting `/api/auth/register` simultaneously across five clustered application nodes).

### How I know I do not understand it
In Task 4, we designed `RateLimitCounter` to store counters in PostgreSQL so rate limits survive server restarts. We wrote atomic updates using `INSERT ... ON CONFLICT (key) DO UPDATE SET count = count + 1`. While this is safe for moderate loads, at thousands of requests per second targeting the identical IP key, PostgreSQL row-level locks on that single tuple create severe contention, buffer-pin stalls, and connection pool exhaustion. I do not know the exact throughput saturation limit where PostgreSQL row locking degrades response latency past our 2-second budget, nor how deadlocks are resolved if concurrent transactions update related counters out of order.

### What I need to learn it
I need to execute a high-concurrency load test using tools like `k6` or `Vegeta` against a multi-instance PostgreSQL cluster, profile row-lock wait queues using `pg_stat_database_conflicts`, and study distributed token-bucket implementations in Redis using Lua scripts for sub-millisecond atomic decrementing.

---

## 4. What Happens to a `pg-boss` Background Job When the Node Worker Process Hard-Crashes Mid-Execution

### What it is
The exact fault-tolerance and message-acknowledgment guarantees of our background job runner (`pg-boss`) during catastrophic operating system crashes (e.g., `SIGKILL`, hardware power loss, or out-of-memory kernel termination).

### How I know I do not understand it
I understand that `pg-boss` uses PostgreSQL `SKIP LOCKED` to allow worker processes to fetch jobs without contention, and that jobs have a visibility timeout. However, if a worker process hard-crashes halfway through processing an email verification dispatch—after sending the email via Gmail SMTP but *before* writing the completion acknowledgment to PostgreSQL—I do not know whether `pg-boss` will automatically re-queue the job, how long the orphan job remains locked in `"active"` state, or how to guarantee strict idempotency so the user does not receive duplicate emails upon worker reboot.

### What I need to learn it
I need to examine the `pg-boss` schema tables (`job`, `archive`), write a chaotic integration test that sends `SIGKILL` to a running worker process mid-job, and design an idempotent job state machine that records progress checkpoints in the database.

---

## 5. Whether Our Retention Matrix Would Survive Cross-Examination by a Specialized Environmental Litigator

### What it is
The legal defensibility of our functional segregation model (anonymising the supervisor while retaining the daily report for 7 years) under international cross-border environmental litigation.

### How I know I do not understand it
I have grounded our retention matrix in the statutory text of the Nigeria Data Protection Act (NDPA Section 34), GDPR Article 17, and standard common-law tort limitation periods (6–7 years). However, in environmental contamination cases involving multinational oil operators, civil liability for groundwater contamination can be governed by statutory discovery rules where the limitation clock only begins when damage is *discovered*—which may be 15 or 20 years after remediation. I do not know whether our 7-year default retention period would be deemed inadequate by an environmental court, nor whether retaining GPS coordinates linked to an anonymized user short-code could be construed as "pseudonymous data" still subject to GDPR erasure.

### What I need to learn it
I need to consult with a certified data protection officer (DPO) and an environmental regulatory lawyer who specializes in oil and gas spill disputes in the Niger Delta, reviewing real case precedents regarding environmental site manifests and statutory document discovery.

---

## 6. How Vector Search Cosine Distance Scales with HNSW Index Compression on Resource-Constrained Databases

### What it is
The exact memory footprint, index build degradation, and recall loss of PostgreSQL `pgvector` HNSW (Hierarchical Navigable Small World) indexes as the `EntryEmbedding` table grows from 1,000 to 500,000 vectors.

### How I know I do not understand it
In AGENTS.md, PRD Section 7.13 specifies an HNSW index with raw SQL queries for semantic meaning search. I know that HNSW builds multi-layer graphs in RAM for fast approximate nearest neighbor (ANN) retrieval. However, I do not know how much RAM the HNSW graph consumes per 100,000 chunks for 768-dimensional embeddings, at what threshold PostgreSQL begins spilling vector index pages to disk (destroying our NFR-21 sub-2-second search latency budget), or how to tune the `m` (maximum connections per element) and `ef_construction` parameters for rugged, low-memory production environments.

### What I need to learn it
I need to read the original Malkov & Yashunin HNSW paper (2018), benchmark `pgvector` index build times using synthetic vector datasets on constrained cloud instances (e.g. 2 vCPU, 4GB RAM), and measure recall accuracy versus query latency curves under varying `ef_search` settings.

---

## 7. The Precise Failure Modes of Serwist Service Worker Cache Invalidation on iOS Safari

### What it is
How the browser service worker cache behaves on iOS Safari when an application update is deployed, specifically regarding progressive web app home-screen installations (FR-27).

### How I know I do not understand it
I know how to register a service worker and define cache strategies (Cache-First for assets, Network-First for API routes). However, Apple’s WebKit engine on iOS has notoriously unpredictable lifecycle quirks: standalone PWA instances on the iOS home screen operate in a separate sandboxed storage container from Safari browser tabs. I do not know how WebKit handles service worker updates when the app is launched while disconnected, how background sync is queued on iOS without native Background Sync API support, or when WebKit’s aggressive 7-day storage eviction heuristic wipes IndexedDB if a supervisor does not open the app for a week.

### What I need to learn it
I need to configure an automated Playwright testing harness simulating iOS WebKit storage eviction policies, deploy canary updates to an actual iPhone PWA running on airplane mode, and trace the Service Worker registration and byte-stream caching lifecycle through the Safari Web Inspector.

---

## 8. The Mathematical Limits of Browser Canvas EXIF Metadata Stripping During Local Image Compression

### What it is
Whether compressing site photos using HTML5 Canvas (`ctx.drawImage`) completely sanitizes sensitive hardware and lens metadata, or whether residual EXIF markers survive binary transcoding.

### How I know I do not understand it
In our photo capture pipeline (PRD Section 6, P1, P5), photos are compressed to 1,600px JPEGs on the client using the browser canvas. We assume that drawing a source image onto an HTML5 canvas and re-encoding it via `canvas.toBlob('image/jpeg', 0.8)` creates a completely fresh JPEG stream that strips all device metadata, GPS tags, and serial numbers. However, I do not know whether different mobile browser rendering engines (Chromium Blink vs. WebKit vs. Gecko) inject proprietary color profile headers, device-specific ICC profiles, or canvas-fingerprinting noise into the resulting binary blob that could inadvertently leak user hardware signatures.

### What I need to learn it
I need to write a byte-level parser using Node.js `Buffer` that reads the raw binary JFIF segments (APP0, APP1, APP2, SOF0) of canvas-exported JPEG blobs across five distinct mobile devices, verifying the complete absence of unexpected metadata markers.

