# Task 3 Defect Log & Remediation Register

## Overview
This document catalogs the defects, regressions, and design failures discovered during Task 3 implementation across architecture, form validation, usability, and accessibility.

---

## Defect Inventory

### Defect 1: The Disabled Button Silent Trap
- **Severity**: High (WCAG 2.1.1 / 4.1.2 Violation)
- **Symptom**: Sighted users saw a greyed-out button, but screen reader users navigating by keyboard tab had the submit button completely vanish from the accessibility tree.
- **Root Cause**: The HTML `disabled` attribute removes interactive elements from the browser tab order.
- **Remediation**: Transitioned to `aria-disabled="true"`. The button remains in the tab order, announces its disabled status, and clicking/pressing Enter triggers an accessible alert banner explaining exactly what required fields are missing.

### Defect 2: The Leading Zero / Spinner Cursor Trap on `<input type="number">`
- **Severity**: Medium (Usability & Data Corruption)
- **Symptom**: Entering `400` supervisor seats resulted in `0400` because the browser defaulted to `0` and appended characters rather than replacing them. Stepper arrows also incremented unexpectedly on mouse wheel scroll.
- **Root Cause**: HTML5 `type="number"` exhibits inconsistent browser-specific stepper behaviors and leading zero handling.
- **Remediation**: Replaced with `<input type="text" inputMode="numeric" pattern="[0-9]*">` with regex sanitization (`e.target.value.replace(/\D/g, '')`) and `Number(value)` conversion upon submit.

### Defect 3: Password Whitespace Bypass
- **Severity**: Critical (Authentication Bypass)
- **Symptom**: A user could enter 10 spaces (`"          "`) as a password, and the client marked the field valid because `value.length >= 10`.
- **Root Cause**: The client-side rule checked raw string length without checking for non-whitespace characters.
- **Remediation**: Updated rule to require `value.trim().length >= 10` and enforced server-side bcrypt hashing with minimum entropy checks.

### Defect 4: Single-Token Name Bot Ingestion
- **Severity**: Medium (Compliance & Data Integrity)
- **Symptom**: Registration accepted single-word tokens like `"test"` and `"bot"`, polluting the organisation user table.
- **Root Cause**: Missing structural validation on the name field.
- **Remediation**: Enforced a two-token rule (`split(/\s+/).length >= 2`), accompanied by an administrative exception process for mononymous individuals.

### Defect 5: Unbounded String Buffer Flood
- **Severity**: High (DoS & Memory Bloat)
- **Symptom**: Pasting 10,000 characters into the Organisation Name input was accepted into React state without restriction.
- **Root Cause**: Lack of `maxLength` attributes on text inputs.
- **Remediation**: Added `maxLength={100}` on name fields and enforced strict byte-length clamping in server-side schemas.
