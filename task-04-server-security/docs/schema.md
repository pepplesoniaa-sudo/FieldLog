# Production Database Schema Architecture (PRD Section 10)

## Overview
This document specifies the core schema architecture for FieldLog, detailing the 5 required core domain models, indexing strategies, intentional denormalization trade-offs, and the vital operational distinction between the money table (`Payment`) and the money attempts table (`PaymentAttempt`).

---

## 1. Table Specifications

### Table 1: `User` (The People Who Use the System)
Represents authenticated supervisors, reviewers, and organisation administrators across tenant boundaries.

| Column | Type | Nullable | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (`@default(uuid())`) |
| `organisationId` | `UUID` | No | Foreign Key -> `Organisation.id` (Tenant Scoping) |
| `email` | `String` | No | Unique, lowercased user identifier |
| `passwordHash` | `String` | No | Salted bcrypt hash (12 rounds) or scrypt |
| `name` | `String` | No | Full legal name (two-token minimum) |
| `role` | `Role` (Enum) | No | `SUPERVISOR`, `REVIEWER`, `BACKUP_REVIEWER` |
| `emailVerifiedAt` | `DateTime` | Yes | Timestamp of email verification (FR-62) |
| `isActive` | `Boolean` | No | Deactivation flag (FR-57, default: `true`) |
| `createdAt` | `DateTime` | No | Creation timestamp (`@default(now())`) |
| `updatedAt` | `DateTime` | No | Last update timestamp (`@updatedAt`) |

- **Relationships**:
  - Many-to-One with `Organisation` (Many users belong to one tenant).
  - One-to-Many with `Session` (One user has many active/historical sessions).
  - One-to-Many with `Membership` (One user has project-level roles).
- **Indices**:
  - `@@unique([email])`: Enforces global email uniqueness. *Write cost*: B-tree rebalance on user creation.
  - `@@index([organisationId])`: Accelerates tenant-scoped directory listings. *Write cost*: Index leaf split on user insert.

---

### Table 2: `Session` (Their Sessions)
Manages database-backed user sessions per Auth.js custom adapter specifications (PRD 7.4).

| Column | Type | Nullable | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (`@default(uuid())`) |
| `sessionToken` | `String` | No | Unique cryptographic session identifier |
| `userId` | `UUID` | No | Foreign Key -> `User.id` |
| `expires` | `DateTime` | No | Session expiration timestamp |
| `createdAt` | `DateTime` | No | Session creation timestamp |
| `ipAddress` | `String` | Yes | Client IP address at login (audit defense) |
| `userAgent` | `String` | Yes | Client browser User-Agent string |

- **Relationships**:
  - Many-to-One with `User` (Each session belongs to exactly one user).
- **Indices**:
  - `@@unique([sessionToken])`: Used on every authenticated HTTP request to resolve identity. *Write cost*: Slight insert overhead on login.
  - `@@index([userId])`: Enables instant invalidation of all active sessions upon password reset or account deactivation. *Write cost*: Minor B-tree update.

---

### Table 3: `Payment` (The Money Table: Settled Transactions)
Records successfully finalized, verified financial settlements from Flutterwave hosted checkout (FR-63, FR-64).

| Column | Type | Nullable | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (`@default(uuid())`) |
| `organisationId` | `UUID` | No | Foreign Key -> `Organisation.id` |
| `flwRef` | `String` | No | Unique Flutterwave settlement reference |
| `txRef` | `String` | No | Unique internal transaction reference |
| `amount` | `Decimal` | No | Amount paid (Fixed `Decimal(12,2)`) |
| `currency` | `String` | No | ISO Currency (`NGN`) |
| `status` | `PaymentStatus` | No | `SETTLED`, `REFUNDED` |
| `paidAt` | `DateTime` | No | Gateway settlement timestamp |
| `createdAt` | `DateTime` | No | Record creation timestamp |

- **Relationships**:
  - Many-to-One with `Organisation` (Payments fund an organisation's active subscription).
- **Indices**:
  - `@@unique([flwRef])`: Prevents double-crediting if a payment webhook is replayed. *Write cost*: High-priority uniqueness check.
  - `@@index([organisationId, paidAt])`: Optimizes billing history ledger queries. *Write cost*: Composite B-tree update on payment.

---

### Table 4: `PaymentAttempt` (The Money Attempts Table)
Records every payment initiation, gateway redirection, user abandonment, network timeout, and failure.

| Column | Type | Nullable | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (`@default(uuid())`) |
| `organisationId` | `UUID` | No | Foreign Key -> `Organisation.id` |
| `txRef` | `String` | No | Unique initiation tracking reference |
| `amount` | `Decimal` | No | Attempted charge amount |
| `seats` | `Int` | No | Supervisor seats requested at checkout |
| `status` | `AttemptStatus` | No | `INITIATED`, `ABANDONED`, `FAILED`, `TIMED_OUT`, `FINALIZED` |
| `failureReason`| `String` | Yes | Error message from provider or gateway |
| `networkState` | `String` | Yes | Client network status (e.g. `OFFLINE_TIMEOUT`) |
| `attemptedAt`  | `DateTime` | No | Initiation timestamp (`@default(now())`) |

- **Relationships**:
  - Many-to-One with `Organisation`.
- **Indices**:
  - `@@unique([txRef])`: Guarantees idempotency of attempt initialization. *Write cost*: Uniqueness check on checkout click.
  - `@@index([status, attemptedAt])`: Powers the pg-boss 10-minute unfinalized payment attempt reconciliation worker (PRD NA31). *Write cost*: Composite index maintenance.

---

### Table 5: `EntryEmbedding` (The Chunks for Vector Retrieval)
Maintains high-dimensional vector embeddings for semantic search (FR-59, PRD 7.13) using the `pgvector` extension.

| Column | Type | Nullable | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (`@default(uuid())`) |
| `entryVersionId`| `UUID` | No | Foreign Key -> `EntryVersion.id` (Unique) |
| `organisationId`| `UUID` | No | Tenant scoping (Tenant isolation boundary) |
| `embedding` | `vector(768)` | No | 768-dimensional float embedding (`text-embedding-004`) |
| `chunkText` | `Text` | No | Chunk text (Rule NA32: 1 EntryVersion = 1 Chunk) |
| `createdAt` | `DateTime` | No | Embedding generation timestamp |

- **Relationships**:
  - One-to-One with `EntryVersion` (Each immutable entry version corresponds to exactly one retrieval chunk).
- **Indices**:
  - `HNSW Index (embedding vector_cosine_ops)`: Cosine distance Approximate Nearest Neighbor (ANN) index (`m=16, ef_construction=64`). *Write cost*: Substantial write penalty during embedding inserts (requires graph node insertion), but guarantees sub-50ms search over millions of site entries.

---

## 2. Intentional Denormalization: Where the Same Fact is Stored Twice

In FieldLog, `organisationId` is deliberately denormalized across every single child entity (including `EntryEmbedding`, `Payment`, `PaymentAttempt`, `Project`, and `Site`), even though it could theoretically be derived via relational joins (e.g. `EntryEmbedding` -> `EntryVersion` -> `Entry` -> `Visit` -> `Site` -> `Project` -> `Organisation`).

**Why we accepted that trade-off**:
1. **Bulletproof Tenant Isolation**: As mandated by PRD 7.4 and our security baseline, every database query must be strictly scoped by `WHERE organisationId = ...`. Denormalizing `organisationId` onto every table allows the Prisma tenant-scoping extension to append tenant filters directly to the `WHERE` clause without executing 6-table joins.
2. **Query Performance**: Eliminates costly relational joins on high-throughput query paths (such as vector similarity scans and supervisor daily lists).

---

## 3. The Money Attempts Table: Why It is Essential

Most junior developers only build a `Payment` table, recording transactions only after money settles. This is a fatal mistake for two reasons:

1. **Commercial Drop-off & Conversion Diagnostics**:
   Without an attempts table, the business is blind to where it loses revenue. Tracking `INITIATED`, `ABANDONED`, and `TIMED_OUT` attempts reveals payment gateway friction, drop-offs during card entry, and whether supervisors on remote sites fail checkout due to network timeouts.
2. **Regulatory, Statutory Tax & Litigation Defense**:
   Payment records are legal instruments. If a corporate bank or tax authority audits the company regarding an alleged double-charge, chargeback claim, or VAT discrepancy from fourteen months ago, having only settled transactions leaves the business defenseless against claims of unfulfilled attempts.

### Tax Authority Response Plan (14-Month Audit Inquest):
If our national tax authority (or HMRC/FIRS) asked to account for a specific transaction from fourteen months ago:
*"I would query the `PaymentAttempt` and `Payment` tables using the transaction reference (`txRef`). I would extract the immutable audit ledger containing the exact UTC timestamp of initiation, client IP address, attempted supervisor seat count, the corresponding Flutterwave gateway payload, the webhook signature verification timestamp, and the final settlement state. If the payment failed or was abandoned, the attempts record proves that the company never received beneficial control of the funds, accompanied by gateway response codes. If settled, the corresponding settled `Payment` entry proves exact VAT remittance tied to that invoice."*
