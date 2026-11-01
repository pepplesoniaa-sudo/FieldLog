# Design System Prompts & Iterations

## Prompt 1: Initial Attempt (Flawed - Generated Raw Primitives)
```text
Convert the tokens JSON file into CSS variables for our project so we can style our application.
```
* **What went wrong**: The agent flattened every token directly into CSS variables named `--color-primary-0` through `--color-primary-100`, but completely omitted semantic mappings like `--color-surface` and `--color-on-surface`. When asked to build a button, it used `--color-primary-40` directly. This defeats token architecture because components bind to primitive hex shades rather than functional roles.

---

## Prompt 2: Refined & Final Prompt (Enforced Single Source of Truth via Semantic Roles)
```text
You are a design systems engineer. Read 'evidence/06-tokens-complete.json' and generate a production CSS file ('tokens.css').

Strict Requirements:
1. Export typography roles (Display, Headline, Title, Body, Label) as reusable utility classes and font-token variables with exact rem values, line-heights, weights, and letter-spacings.
2. Export primary-tinted elevation shadows.
3. For colors:
   - Define private primitive palette variables in the root scope.
   - Define PUBLIC semantic role variables: --color-surface, --color-on-surface, --color-primary, --color-on-primary, --color-primary-container, --color-on-primary-container, --color-error, --color-warning, --color-success, and their container/on-container counterparts.
   - Public semantic roles MUST point to the primitive variables (e.g. --color-primary: var(--color-primary-40)).
   - CRITICAL CONSTRAINT: Interface components must ONLY reference semantic role variables (--color-*), NEVER primitive tone variables (--color-primary-40). The design system roles are the only allowable styling tokens.
```
* **Result**: Produced a clean, strict CSS token architecture where theme swapping or brand adjustments cascade cleanly through semantic role mappings.
