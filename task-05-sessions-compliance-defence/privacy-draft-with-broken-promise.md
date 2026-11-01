# FieldLog Privacy & Data Handling Policy (Initial Draft with Unfulfillable Promise)

> **Document Status**: ARCHIVED DRAFT / COMPLIANCE DEFECT IDENTIFICATION  
> **Notice**: This draft contains an unfulfillable regulatory promise identified during technical compliance review. See the commentary at the end of this document and the revised canonical version in `privacy.md`.

---

## 1. Introduction & Scope
FieldLog provides digital site reporting and data capture infrastructure for environmental remediation contractors, project managers, and regulatory compliance reviewers. This policy sets out how personal data and operational site records are handled.

---

## 2. Information We Collect
1. **Account Identification**: Full name, business email address, role (Supervisor, Reviewer, Organisation Admin), hashed passwords, and assigned remediation project codes.
2. **Device & Telemetry Data**: Device identifiers, browser types, and device clock offsets to ensure offline synchronization integrity.
3. **Field Data Capture**: Photographic evidence of site containment, excavation, and remediation, GPS coordinates, timestamps, and structured supervisor notes.

---

## 3. Account Deletion & Right to Erasure (THE DEFECTIVE PROMISE)

We respect your right to privacy and the right to be forgotten under the Nigeria Data Protection Act (NDPA 2023) and the General Data Protection Regulation (GDPR). 

If you leave your organisation or wish to delete your account:

> **Unfulfillable Promise (Line 42)**:  
> *"You may request the immediate deletion of your account and all associated site data at any time by speaking directly to your Site Project Manager in the on-site trailer or by tapping 'Delete My Account' in the mobile app while working offline. Upon your request, FieldLog will immediately and completely erase your entire profile, all site logs, notes, GPS locations, and uploaded photographs from our databases, cloud storage, and active backups within 24 hours with zero retention."*

---

## 4. Why This Promise Cannot Be Kept: Compliance Post-Mortem

This clause represents a catastrophic compliance defect arising from an automated drafting template that conflated consumer social apps with industrial statutory reporting software.

### The Two Sentences on How This Promise Gets Written
*Eager product copywriters and generic AI legal drafting templates routinely copy consumer-app privacy clauses ("immediate 24-hour total wipe upon verbal or offline request") to project maximum privacy friendliness to end users without consulting the application's legal retention constraints or engineering architecture. In industrial environmental software, this results in a false promise that directly violates environmental protection statutes, destroys audit trails required by environmental regulators, and promises an offline wipe mechanism that disconnected devices cannot physically execute.*

### The Three Fatal Realities
1. **Statutory Environmental Retention (PRD Section 7.5, FR-55)**: Under national environmental regulatory frameworks (e.g. NOSDRA, NUPRC, UK Environment Agency, US EPA), records of environmental contamination, hydrocarbon spill containment, and soil excavation must be preserved for statutory audit periods (defaulting to **7 years** in FieldLog). Wiping site logs on an employee's verbal whim is a criminal destruction of regulatory evidence.
2. **Offline Architecture Impossibility (FR-20, FR-28)**: A field supervisor tapping "Delete" offline cannot trigger server-side deletion; nor can an unauthenticated verbal request in a muddy site trailer be validated without impersonation risks.
3. **Data Anonymisation vs. Document Destruction**: The correct legal remedy under GDPR Article 17(3)(b) and NDPA Section 34 is **anonymisation of personal employee identifiers** (stripping names and personal emails) while preserving the immutable environmental report revision and photographic proof.

