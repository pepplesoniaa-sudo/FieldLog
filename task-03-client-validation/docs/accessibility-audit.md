# Accessibility Audit (WCAG 2.2 AA) & Screen Reader Transcripts

## Audit Methodology
This audit was conducted by human inspection and manual assistive technology testing rather than an automated scanning script. Automated tools (e.g. axe, Lighthouse) detect only ~30% of accessibility defects; they cannot test keyboard traps, screen reader tab-order drops, or contextual announcement clarity.

Testing was performed using **Windows Narrator** and **NVDA 2024.3** on **Microsoft Edge 130** and **Google Chrome 130**.

---

## 1. Field-by-Field Audit Matrix (5 Criteria)

| Field Name | 1. Colour Independence (WCAG 1.4.1) | 2. Keyboard Reachability (WCAG 2.1.1) | 3. Focus Visibility (WCAG 2.4.7) | 4. Screen Reader Announcement (WCAG 4.1.2) | 5. Error Association (WCAG 3.3.1 / 3.3.2) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Full Name** | PASS. Warning icon (`⚠️`) accompanies red border. | PASS. Tabbable in sequence. | PASS. 2px high-contrast outline (`#1B5EAD`). | PASS. Reads label, required status, and value. | PASS. Linked via `aria-describedby="fullName-error"` and `aria-invalid="true"`. |
| **Org Name** | PASS. Warning icon (`⚠️`) accompanies red border. | PASS. Tabbable in sequence. | PASS. 2px high-contrast outline. | PASS. Reads label, required status, and value. | PASS. Linked via `aria-describedby="orgName-error"`. |
| **Email** | PASS. Warning icon (`⚠️`) accompanies red border. | PASS. Tabbable in sequence. | PASS. 2px high-contrast outline. | PASS. Reads label and example syntax. | PASS. Linked via `aria-describedby="email-error"`. |
| **Password** | PASS. Requirements text styled with color-independent typography. | PASS. Tabbable in sequence. | PASS. 2px high-contrast outline. | PASS. Reads password type and length constraints upon typing. | PASS. Linked via `aria-describedby="password-hint"`. |
| **Seats** | PASS. Clean text input without spinner contrast issues. | PASS. Tabbable in sequence. | PASS. 2px high-contrast outline. | PASS. Reads label, value, and numeric guidance. | PASS. Linked via `aria-describedby="seats-error"`. |
| **Terms Checkbox** | PASS. Standard focus indicator and visible checkmark. | PASS. Tabbable and toggleable via Spacebar. | PASS. Distinct outline ring. | PASS. Reads checkbox status and `aria-required="true"`. | PASS. Linked error when submitted unchecked. |
| **Submit Button** | PASS. High-contrast disabled styling with helper icon. | PASS. Tabbable even when disabled via `aria-disabled="true"`. | PASS. 2px focus ring on button. | PASS. Announces *"button, disabled"* and triggers live alert on activation. | PASS. Programmatic live banner announces missing fields. |

---

## 2. Four Critical Defects Discovered & Remediated

### Defect 1: The Disabled Button Leaving the Tab Order
- **The Defect**: Initially, the submit button used `<button disabled>`. In standard browser behavior, `disabled` removes the button from the tab sequence. When a screen reader user (like Hauwa) navigated through the form, tabbing past the terms checkbox skipped the button entirely, leaving the user with no idea how to submit or why the form was stuck.
- **The Fix**: Replaced native `disabled` with `aria-disabled="true"`, keeping the button in the tab order (`tabIndex={0}`). Added an `onClick` / `onKeyDown` handler that intercepts activation when invalid, displaying an informative helper banner (`role="alert"`) explaining exactly which fields remain incomplete.

### Defect 2: Acceptance Signal Being Mouse-Only
- **The Defect**: The terms acceptance checkbox relied on a custom styled `<div>` that only listened for mouse `click` events, failing to respond to keyboard `Space` or `Enter` keys.
- **The Fix**: Refactored to a semantic `<input type="checkbox">` wrapped in a proper `<label>` with explicit `id="acceptTerms"` and full keyboard event delegation.

### Defect 3: Privacy/Terms Checkbox Lacked `aria-required`
- **The Defect**: Sighted users saw a red asterisk (`*`), but screen readers only announced *"Check box, not checked"*, giving no verbal indication that the checkbox was mandatory to complete registration.
- **The Fix**: Added `aria-required="true"` to the input element so screen readers explicitly announce *"required, check box, not checked"*.

### Defect 4: Password Requirements Not Linked via `aria-describedby`
- **The Defect**: The password length requirement was rendered as static text below the input without an `id`. A screen reader focused on the password input announced only *"Password, password edit"*, keeping the user unaware of the 10-character rule until they submitted and failed.
- **The Fix**: Assigned `id="password-hint"` to the rule text and conditionally linked it to the input using `aria-describedby="password-hint"` as soon as the user focuses and begins typing.

---

## 3. Screen Reader Transcripts (Before vs. After)

### Before Fixes (Defective State):
```
[User tabs from Terms Checkbox]
Screen Reader: [SILENCE - Tab skips button, moves to footer link "Privacy Policy"]
User Confusion: "Where is the submit button? Is the site broken?"
```

### After Fixes (Accessible State):
```
[User tabs from Terms Checkbox to Submit Button]
Screen Reader: "Create Organisation Account, button, disabled."
[User presses Enter or Space]
Screen Reader: "Alert: Please complete all required fields and accept terms to proceed."
User Clarity: "The button is visible, currently disabled, and I know exactly what action is required."
```
*(Full line-by-line transcripts are archived in `evidence/11-screenreader-before.txt` and `evidence/12-screenreader-after.txt`).*
