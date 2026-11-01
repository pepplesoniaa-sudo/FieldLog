# FieldLog Production Privacy & Data Retention Policy

**Canonical Version**: 2.4 (Statutory Environmental & Tenant Architecture)  
**Applicability**: FieldLog Environmental Remediation Web Application & API  
**Jurisdictional Standards**: Nigeria Data Protection Act (NDPA 2023), General Data Protection Regulation (GDPR), National Environmental Standards and Regulations Enforcement Agency (NESREA), Nigerian Upstream Petroleum Regulatory Commission (NUPRC) Guidelines.

---

## 1. What This Document Explains in Plain Words
FieldLog is an industrial site reporting application used by environmental remediation supervisors, safety inspectors, and certified reviewers. When you use FieldLog, we handle two distinct types of data:
1. **Your Personal Information**: Details about you as an employee (your name, email address, password hash, and active login sessions).
2. **Statutory Site Records**: Professional engineering records you create in the field (photographs of contamination boundaries, soil excavation quantities, GPS coordinates, time logs, and signed daily reports).

We treat these two types of data differently because **your privacy rights as an individual must operate alongside mandatory environmental protection laws**.

---

## 2. Account Deletion: The 14-Day Grace Period
When you or your employing organisation requests the deletion of your user account, your account does not disappear instantly. It enters a structured **14-Day Grace Period**:

* **Day 0 (Request Initiated)**: 
  * Your account is immediately transitioned to `DEACTIVATED` status.
  * All active sessions across all devices (phones, tablets, desktop browsers) are revoked instantly on the server.
  * Your credentials (password hash, verification tokens) can no longer authenticate.
  * You cannot log in, capture new entries, or submit reports.
* **Days 1 to 14 (Cooling-Off & Verification Period)**: 
  * The account remains locked and inaccessible.
  * If an account closure was requested fraudulently or accidentally by an unauthorised party, the Organisation Admin can challenge and cancel the deletion within this 14-day window.
* **Day 15 (Automated Scheduled Purge)**: 
  * FieldLog's automated background maintenance worker executes the cryptographic purge and anonymisation script in a single transactional batch.

---

## 3. What is Purged vs. What is Retained

| Data Category | Purged or Retained? | Exact Action Taken | Legal / Business Basis | Retention Period |
| :--- | :---: | :--- | :--- | :--- |
| **Authentication Credentials** | **PURGED** | Password hash, salt, and token hashes permanently erased from PostgreSQL. | NDPA Right to Erasure; GDPR Art. 17. | Purged after 14-day grace period. |
| **Active & Historical Sessions** | **PURGED** | All session tokens, device session cookies, and login records permanently deleted. | Minimisation of security attack surface. | Purged immediately upon deactivation. |
| **Email Verification Tokens** | **PURGED** | 6-digit codes and SHA-256 token hashes permanently removed. | Transitory authentication artifact. | Purged immediately upon deactivation. |
| **Local Offline Outbox (Device)**| **PURGED** | IndexedDB database cleared on next connection *only after* server acknowledges all synced photos are verified (FR-57). | Prevention of orphaned local credentials. | Cleared after server verification. |
| **Personal Email & Phone** | **ANONYMISED** | Email replaced with `anon_uuid@fieldlog.internal`; name replaced with `Former Supervisor [ID]`. | NDPA / GDPR Anonymisation standard. | Personal data gone; stub retained for audit integrity. |
| **Approved Daily Site Reports** | **RETAINED** | Retained with immutable SHA-256 revision snapshot and reviewer sign-off. | Statutory environmental compliance (NESREA / NUPRC); PRD Section 7.5. | **7 Years** default (statutory limitation period). |
| **Field Site Photos & GPS** | **RETAINED** | Compressed JPEG evidence photos and site location coordinates retained in private storage. | Environmental remediation liability defence; public safety records. | **7 Years** default. |
| **Billing & Payment Records** | **RETAINED** | Invoices, payment attempts, transaction references, currency amounts. | Statutory financial accounting & tax law (FIRS / CAMA). | **7 Years** permanent financial ledger. |
| **System Audit Logs** | **RETAINED** | Append-only event logs recording who created, modified, or signed off on reports. | Regulatory inspection defence (NFR-16). | **7 Years** default. |

---

## 4. Why Statutory Site Data Cannot Be Wiped
Environmental remediation involves documenting the removal of hazardous contaminants (crude oil spills, heavy metals, asbestos, industrial chemical runoff). If a supervisor who logged contaminated soil excavation leaves their company, **the law does not allow their employer or FieldLog to delete the proof of where contaminated waste was deposited**.

Under the **Nigeria Data Protection Act (Section 34)** and **GDPR (Article 17(3)(b))**, the right to erasure does not apply when processing is necessary:
1. For compliance with a legal obligation requiring processing by law.
2. For the performance of a task carried out in the public interest (environmental protection).
3. For the establishment, exercise, or defence of legal claims.

Therefore, FieldLog satisfies your privacy rights by **anonymising your personal employee identity** while preserving the factual, objective environmental records you generated.

---

## 5. How to Request Account Deletion
Because FieldLog is an enterprise business-to-business platform, account deletion requests must be verified to prevent malicious sabotage:
1. **Self-Service Request**: Navigate to **Profile Settings > Security > Request Account Deletion**. Confirm your identity by re-entering your account password.
2. **Organisation Admin Request**: Your employing organisation's administrator can deactivate your membership directly from the Admin Management portal (`/admin`).
3. **Written Statutory Request**: If your employing organisation is unresponsive, send a signed data subject request to `privacy@fieldlog.internal`.

Upon submission, the 14-day grace period clock begins immediately.

