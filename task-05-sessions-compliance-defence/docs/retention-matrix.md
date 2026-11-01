# FieldLog Statutory Retention Matrix & Data Lifecycle Schedule

## 1. Executive Summary & Legal Framework
In an environmental remediation application, data retention is governed by strict statutory mandates rather than convenience. Remediation sites involve hazardous waste excavation, toxic hydrocarbon spill recovery, and heavy civil works. If an oil spill cleanup is contested five years later in an environmental tribunal, the daily site reports, photo coordinates, and sign-offs are legal evidence.

This matrix establishes the definitive retention policy for every entity and column in FieldLog under:
* **Nigeria Data Protection Act (NDPA 2023)** & **GDPR (Regulation EU 2016/679)**
* **National Environmental Standards and Regulations Enforcement Agency (NESREA Act)**
* **Nigerian Upstream Petroleum Regulatory Commission (NUPRC / EGASPIN Guidelines)**
* **Statute of Limitations (Contract & Tort Liability: 6 to 7 Years)**

---

## 2. Master Table & Column Retention Schedule

| Schema Model | Significant Columns | Purged or Retained? | Retention Duration | Legal & Business Basis | Technical Action on Account Deletion |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **`Organisation`** | `id`, `name`, `dataRegion`, `retentionYears` | **RETAINED** | Permanent (or 7 years post-contract) | Corporate legal identity; tenant root (A3, A5). | Soft-delete flagged via `deletedAt`. |
| **`User`** | `name`, `email`, `shortCode`, `phone` | **ANONYMISED** | Personal data: **0 Days**; Audit stub: **7 Years** | NDPA Right to Erasure / GDPR Art. 17. | `name` replaced with `"Former Employee [UUID]"`, `email` replaced with `"anon_[UUID]@fieldlog.internal"`, `phone` wiped. |
| **`User`** | `passwordHash`, `lockoutUntil`, `failedSignIns` | **PURGED** | **0 Days** | Security attack surface reduction; credentials obsolete. | Columns overwritten with cryptographic nulls. |
| **`Session`** | `id`, `sessionToken`, `userId`, `expires` | **PURGED** | **0 Days** (Immediate) | Revocation of access perimeter. | Hard-deleted via `DELETE FROM "Session" WHERE "userId" = $id`. |
| **`Membership`** | `userId`, `projectId`, `role` | **RETAINED** | **7 Years** | Audit trail of who held supervisory authority on active site. | Retained pointing to the anonymized `User` stub. |
| **`Project` & `Site`**| `code`, `name`, `latitude`, `longitude`, `radiusM` | **RETAINED** | **Permanent** | Statutory public record of contaminated geographical sites. | Retained indefinitely as physical site remediation records. |
| **`PickListOption`**| `category`, `label`, `isIssue` | **RETAINED** | **Permanent** | Referential integrity for historical report versions. | Immutable system configuration. |
| **`Visit`** | `siteId`, `supervisorId`, `date`, `lastEntryAt` | **RETAINED** | **7 Years** default (FR-55) | Proof of physical supervisor site presence on given dates. | Retained; `supervisorId` references anonymized user stub. |
| **`Entry`** | `id`, `occurredAt`, `source`, `latitude`, `longitude`, `flags` | **RETAINED** | **7 Years** default (FR-55) | Core environmental capture event (A12, A13). | Immutable; retained in full to maintain report historical validity. |
| **`EntryVersion`**| `activityType`, `workStatus`, `note`, `quantity`, `unit` | **RETAINED** | **7 Years** default (FR-55) | Immutable record of work done, contamination observed. | Immutable; never modified or deleted (NFR-02, FR-17). |
| **`Photo`** | `storageKey`, `sha256`, `exifTime`, `latitude`, `longitude` | **RETAINED** | **7 Years** in cold archive | Visual evidence of environmental site condition (P10). | Stored in private S3/GCS; local device copy purged after 7 days. |
| **`Report` & `ReportRevision`** | `revisionNumber`, `snapshotJson`, `snapshotSha256`, `status` | **RETAINED** | **7 Years** (or client retention setting) | Official signed compliance report delivered to regulators. | Locked and frozen; immutable snapshot retained in database. |
| **`Review`** | `reviewerId`, `decision`, `comment` | **RETAINED** | **7 Years** | Proof of certified engineer approval / change requests (FR-40). | Retained; `reviewerId` references user stub. |
| **`ReportExport`**| `format`, `storageKey`, `sha256` | **RETAINED** | **7 Years** | Exact copies of PDFs submitted to government authorities. | Retained in private object storage. |
| **`AuditEvent`** | `action`, `entityType`, `entityId`, `beforeJson`, `afterJson` | **RETAINED** | **7 Years** | Non-repudiation and forensic accountability (NFR-16). | Append-only; strictly forbidden from being updated or deleted. |
| **`Subscription`**| `plan`, `seats`, `status`, `currentPeriodEnd` | **RETAINED** | **7 Years** | Commercial contract enforcement (FR-63). | Financial records retained for statutory corporate reporting. |
| **`Payment`** | `amountMinor`, `currency`, `providerReference` | **RETAINED** | **Permanent** (Tax law: 7 Years Min) | Corporate financial ledger and VAT/Tax compliance (FIRS). | Immutable financial row; zero edits or deletions allowed. |
| **`PaymentAttempt`**| `gatewayReference`, `status`, `failureReason` | **RETAINED** | **3 Years** | Audit log of payment gateway interactions and fraud detection. | Purged after 3 years via automated maintenance job. |
| **`EmailToken`** | `tokenHash`, `purpose`, `expiresAt`, `usedAt` | **PURGED** | **30 Days** max | Ephemeral security token. | Hard-deleted once expired or after 30 days. |
| **`RateLimitCounter`**| `key`, `count`, `windowEnds` | **PURGED** | Rolling **1 Hour / 24 Hours** | Operational rate-limiting state. | Hard-deleted by vacuum worker once `windowEnds < NOW()`. |

---

## 3. The Three Critical Regulatory Challenges

### A. The Conflict: Right to Erasure vs. Mandatory Statutory Retention
* **The Scenario**: An environmental supervisor who logged daily excavation entries on an oil spill cleanup leaves the contractor. Six months later, citing NDPA Section 34 and GDPR Article 17 ("Right to Erasure"), they demand that FieldLog erase all records containing their name, actions, notes, and photos.
* **The Conflict**: The individual’s right to erasure directly contradicts the contractor’s legal obligation under Nigerian environmental protection regulations (NESREA Act) and the Civil Liability Convention, which mandate that all hazardous waste remediation records be preserved for **7 years** to defend against future groundwater contamination lawsuits.
* **Which Wins and Why**: **The Statutory Retention Obligation Wins**.
  * Under **GDPR Article 17(3)(b) & (e)** and **NDPA Section 34(2)**, the right to erasure is explicitly exempted when data processing is required for *"compliance with a legal obligation"* or *"the establishment, exercise, or defence of legal claims."*
  * FieldLog resolves the conflict cleanly through **functional segregation**: we grant the supervisor’s privacy rights by purging their credentials and anonymising their personal email and telephone number, but we **refuse** to delete the daily site reports, photos, and time logs.

---

### B. Anonymisation Against Deletion: Why Anonymised Data Can Be Kept
Under both GDPR (Recital 26) and NDPA regulations, data that has been irreversibly anonymised such that the individual is no longer identifiable (directly or indirectly) **ceases to be personal data**.

When FieldLog anonymises a user:
1. `name` becomes `"Former Supervisor [UUID]"`.
2. `email` becomes `"anon_7a9f4c@fieldlog.internal"`.
3. Phone numbers, device fingerprints, and profile photos are deleted.

Because the remaining record cannot be re-linked to a living individual without access to destroyed keys, the site logs lose their character as "personal data" while retaining 100% of their evidential value as technical remediation data.

---

### C. Backup Synchronization & The Right to Erasure
A common legal trap occurs when an application deletes user data from the live production database, but retains that data inside daily database backup snapshots for 365 days. If a disaster recovery event occurs and an old backup is restored, the deleted user is accidentally resurrected!

To maintain compliance without destroying backup integrity:
1. **Daily Backup Lifecycle**: Automated PostgreSQL WAL snapshots and pg_dump archives are stored in encrypted private buckets in the London (`eu-west-2`) cloud region.
2. **Rolling Backup Expiry**: Daily backups are retained on a strict **30-day rolling lifecycle rule**. After 30 days, old backup archives are automatically destroyed by bucket lifecycle policies.
3. **Restoration Tombstone Replay**: If FieldLog ever restores a database snapshot from a backup taken prior to an account deletion, our disaster recovery runbook automatically re-executes the append-only `AuditEvent` tombstone log:
   ```sql
   -- Replay anonymisation tombstones on restored database
   UPDATE "User" SET name = 'Former Employee', email = 'anon_' || id || '@fieldlog.internal'
   WHERE id IN (SELECT "entityId" FROM "AuditEvent" WHERE action = 'USER_ANONYMISED');
   ```
This guarantees that restored databases immediately re-purge deleted records.

