# Task 3: The Form, Attacked From Both Sides

## Executive Summary
This repository directory contains the complete deliverables, technical documentation, visual diagnostic evidence, accessibility audits, and security attack results for **Task 3: The Form, Attacked From Both Sides** of the FieldLog development brief.

Task 3 focuses on single-page authentication architecture, client-side validation heuristics, accessible error design (WCAG 2.2 AA), information design, anti-enumeration defenses, and the crucial distinction between frontend ergonomics and server-side security.

---

## Deliverables Directory Structure

```
task-03-client-validation/
  ├── README.md                                 # Master directory guide and summary
  ├── docs/                                     # 10 comprehensive architectural documents
  │   ├── spa-rationale.md                     # Single page architecture vs. multi-page trade-offs
  │   ├── field-justification.md               # 3-question audit for every field; removed elements
  │   ├── validation-rules.md                  # 4 validation categories, derivations, legitimate user costs
  │   ├── terms-note.md                        # Provenance of terms; why "AI wrote it" is dangerous
  │   ├── enumeration.md                       # Anti-enumeration analysis, sensitive shape defense
  │   ├── accessibility-audit.md               # WCAG 2.2 AA audit, 4 defects fixed, transcripts
  │   ├── client-side-is-not-security.md       # Empirical direct attack analysis and findings
  │   ├── rollback.md                          # Version control rollback via cryptographic Git commit IDs
  │   ├── defects.md                           # Comprehensive defect log and remediation registers
  │   └── interview-answers.md                 # 14 interview answers (~200 words each) + enumeration
  └── evidence/                                # 17 verifiable proof assets (text logs and PNGs)
      ├── 01-page-count-before.txt             # Page audit before auth collapse (14 routes)
      ├── 02-page-count-after.txt              # Page audit after auth collapse (12 routes)
      ├── 03-url-states.png                    # Visual proof: 3 auth modes in single SPA route
      ├── 04-form-switch-logs.txt              # Zero-reload / zero-session console logs
      ├── 05-empty-field-error.png             # Visual proof: Category 1 empty field onBlur inline error
      ├── 06-length-rule-blocking.png          # Visual proof: Category 2 structure rule blocking
      ├── 07-email-realtime-signup.png         # Visual proof: Category 3 real-time email check on signup
      ├── 08-email-on-submit-login.png         # Visual proof: Category 3 submit-only check on login
      ├── 09-number-input-annoying.png         # Visual proof: Defect sequence with <input type="number">
      ├── 10-text-input-working.png            # Visual proof: Working text input with inputMode="numeric"
      ├── 11-screenreader-before.txt           # Verbatim screen reader transcript (defective state)
      ├── 12-screenreader-after.txt            # Verbatim screen reader transcript (accessible state)
      ├── 13-button-hidden-version.png         # Visual proof: Defect pattern (submit button hidden)
      ├── 14-button-disabled-version.png       # Visual proof: Accessible disabled button with helper
      ├── 15-form-attack-results.txt           # Results of attacking form through browser client
      ├── 16-direct-request-command-and-response.txt # Exact curl attack bypassing browser entirely
      └── 17-commit-list-and-rollback.txt      # Git log commit list and exact rollback command
```

---

## Key Achievements & Implementation Highlights

### 1. Single Page Auth Consolidation ([`app/sign-in/page.tsx`](file:///c:/Users/HP/Desktop/FieldLog/app/sign-in/page.tsx))
- Collapsed separate auth pages (`/sign-in`, `/sign-up`, `/reset`) into one unified SPA route with URL query parameter synchronization (`?mode=sign-in|sign-up|reset`).
- Zero page reloads, zero network round-trip time on switching, and zero orphaned server sessions.
- Identified the divergence case where separate pages win: cryptographic token routes (`/invite/[token]` and `/reset/[token]`) requiring strict isolation against referrer token leakage.

### 2. Four Client-Side Validation Categories
1. **Empty Required Fields**: Triggers inline on `onBlur`, paired with caution icon (`⚠️`) for color-independence.
2. **Length & Structure**: Enforced two-word name rule and minimum organisation length; explicitly documented the legitimate users blocked (mononymous individuals and two-letter corporate entities).
3. **Format in Real-Time vs. Submit**: Implemented real-time email syntax checks on registration (high-friction onboarding) vs. submit-only checks on login (low-friction returning user UX).
4. **Accessible Error States**: Programmatic linkage via `aria-invalid="true"`, `aria-describedby`, and `role="alert"`.

### 3. Input Type Architecture
- Proved why `<input type="number">` causes spinners, default `0`, leading-zero errors (`0400`), and accidental mouse-wheel increments.
- Implemented `<input type="text" inputMode="numeric" pattern="[0-9]*">` with regex sanitization and numeric conversion on submit.

### 4. WCAG 2.2 AA Accessibility Remediation
- Discovered and fixed 4 critical defects:
  1. Disabled button leaving tab order -> Fixed with `aria-disabled="true"` and live explanatory click banner.
  2. Mouse-only terms acceptance -> Fixed with semantic `<input type="checkbox">` and keyboard delegation.
  3. Terms checkbox lacking `aria-required` -> Added `aria-required="true"`.
  4. Password requirements unlinked -> Linked via dynamic `aria-describedby`.
- Documented full before-and-after screen reader transcripts verifying voice announcement parity for user Hauwa.

### 5. The Direct Attack & Reality Check
- Executed direct HTTP POST request bypassing the browser completely.
- Server accepted the malformed payload (`fullName: "a"`, `seats: -999`, `acceptTerms: false`), proving that 0 of 8 client-side rules protect the backend.
- Laid the architectural foundation for server-side Zod validation and rate limiting in Task 4.

---

## Verification & Type Safety
The implementation strictly complies with all workspace rules:
- TypeScript compilation: `npx tsc --noEmit` exits with code `0`.
- Zero database queries executed (adhering strictly to `database-safety.md`).
- Zero secrets or destructive Git commands run (adhering strictly to `agent-conduct.md`).
