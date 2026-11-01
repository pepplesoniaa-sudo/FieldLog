# Task 1: Known Engineering Defects

## Defect 1: Hardcoded Palette Reference on Component Hover State
* **File & Line**: `task-01-design-system/components/capture-card.html`, line 67
* **Code**:
  ```css
  .btn-primary:hover {
    background-color: var(--palette-primary-30);
  }
  ```
* **The Problem**: Instead of referencing a semantic role like `--color-primary-hover` or using a CSS relative color adjustment (`color-mix`), the component directly reached into private primitive tokens (`--palette-primary-30`).
* **Production Cost**: Violates the single-source-of-truth abstraction. If a white-label enterprise client overrides `--color-primary`, or if the application renders in Dark Mode where the button background should lighten rather than darken on hover, this button's hover state remains locked to primary blue Tone 30 (`#00468A`), producing unreadable contrast or visual dissonance.

---

## Defect 2: Rigid RGB Channels in Elevation Shadow Tokens
* **File & Line**: `task-01-design-system/tokens.css`, lines 82–84
* **Code**:
  ```css
  --shadow-soft: 0 2px 6px 0 rgba(27, 94, 173, 0.08);
  --shadow-medium: 0 6px 16px -2px rgba(27, 94, 173, 0.12), ...;
  --shadow-hard: 0 12px 28px -4px rgba(27, 94, 173, 0.18), ...;
  ```
* **The Problem**: The RGB color channel `27, 94, 173` is hardcoded inside the box-shadow shorthand string rather than decoupled into a reusable `--shadow-color-rgb: 27 94 173` token.
* **Production Cost**: Dark mode or multi-tenant themes cannot adjust shadow warmth or opacity dynamically without rewriting the entire multi-parameter box-shadow syntax. In dark mode, primary-tinted dark blue shadows look like murky halos on black surfaces unless the opacity and spread are modified.
