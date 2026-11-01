# Field Justification & Information Design Audit

## Overview
Every form field imposes friction, increases abandonment, and expands the threat surface. In FieldLog, we audited every field requested during organisation onboarding against three mandatory criteria:
1. **Why it is needed.**
2. **What the business does with it.**
3. **What happens if the user gets it wrong.**

Any field failing all three was eradicated.

---

## Field-by-Field Analysis

### 1. Full Name (`fullName`)
- **Why it is needed**: FieldLog generates legally binding Daily Site Reports (PRD 1, P12) used in environmental remediation disputes, regulatory submissions to the UK Environment Agency, and commercial billing claims. Reports must identify the accountable supervisor and organisation administrator by name.
- **What the business does with it**: Binds to the initial Organisation Administrator user record (`User.name`) and populates the signature block of initial site setups and team invitation emails.
- **What happens if the user gets it wrong**: If a user enters a fake name ("A B") or an incomplete token, daily site reports fail regulatory compliance audits, audit trails (NFR-16) become legally contested, and invited team members cannot verify who issued their project invitations.

### 2. Organisation Name (`orgName`)
- **Why it is needed**: FieldLog is a multi-tenant B2B SaaS platform (PRD 7.4). Every project, site, visit, report, and seat is strictly scoped by `organisationId`. An organisation entity must be instantiated upon registration (FR-61).
- **What the business does with it**: Creates the root `Organisation` record, provisions the tenant boundary, and displays the company branding in the header of PDF report exports (FR-42).
- **What happens if the user gets it wrong**: If mistyped or entered as gibberish, client engineers and environmental auditors cannot identify the responsible company on official PDFs, and tenant scoping audits require administrative database interventions.

### 3. Work Email Address (`email`)
- **Why it is needed**: Primary identifier for authentication, account recovery, subscription billing receipts, and mandatory 6-digit email verification (FR-62).
- **What the business does with it**: Dispatches the initial 10-minute 6-digit verification code (FR-62), handles session verification via Auth.js, and serves as the destination for payment attempt receipts from Flutterwave (FR-64).
- **What happens if the user gets it wrong**: If mistyped, the user never receives the verification code, cannot complete registration, and locks themselves out. If an invalid domain is used, system bounce rates increase, damaging domain reputation.

### 4. Password (`password`)
- **Why it is needed**: Secures access to enterprise environmental data, site coordinates, and supervisor reports.
- **What the business does with it**: Salted and hashed via bcrypt (12 rounds) on the server, never stored in plaintext (PRD 7.7).
- **What happens if the user gets it wrong**: If too weak or forgotten, the account is vulnerable to credential stuffing attacks or requires immediate self-service password reset.

### 5. Supervisor Seats (`seats`)
- **Why it is needed**: FieldLog's pricing model is ₦7,300 per active supervisor per month in test mode (FR-63). Seat count dictates initial subscription provisioning and invoice generation.
- **What the business does with it**: Sets `Subscription.seats` and calculates the total monthly charge for Flutterwave hosted checkout (FR-64).
- **What happens if the user gets it wrong**: Entering too few blocks team invites when adding supervisors on site; entering too many leads to incorrect billing charges and subscription adjustment requests.

### 6. Terms of Service & Privacy Acceptance (`acceptTerms`)
- **Why it is needed**: Legal compliance under NDPR and UK GDPR for personal data capture (GPS coordinates, user names, audit logs).
- **What the business does with it**: Creates an immutable audit log timestamp (`AuditLog.ACTION = TERMS_ACCEPTED`) binding the organisation to terms.
- **What happens if the user gets it wrong**: Registration is rejected until explicitly accepted.

---

## Non-Functional Decoration Removed

During our information design audit, we identified and removed two non-functional elements:
1. **Interactive Decorative Logo in Card Header**:
   The initial scaffold placed a clickable 64px FieldLog logo inside the card body. Clicking it triggered a full page refresh to `/`, wiping incomplete form input. We removed the clickable logo and replaced it with a static, non-interactive semantic SVG badge, eliminating accidental abandonment.
2. **"Password Strength Meter Bar"**:
   A multi-colored animated bar that turned green based on complex character combinations was removed. As established in modern NIST SP 800-63B standards, complex character requirements encourage weak, predictable patterns (e.g. `P@ssword1!`). We replaced the visual meter with an unopinionated length rule (10 characters minimum) linked programmatically via ARIA.
