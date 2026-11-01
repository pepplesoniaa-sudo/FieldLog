# Task 1: Interview Answers

---

### 1. How would you structure design tokens?
I structure tokens in a three-tier hierarchy:
1. **Global/Primitive Tokens**: Raw context-agnostic values, such as color palettes (`blue-500: #2563EB`, `forest-40: #0E6245`), raw pixel/rem sizes, and base font families. They define the aesthetic range but convey no intent.
2. **Semantic/System Tokens**: Intent-driven alias tokens that assign jobs to values (e.g., `color-surface`, `color-primary`, `color-on-surface`, `font-size-title-large`). Components consume *only* this layer.
3. **Component Tokens** (optional for complex component systems): Scoped overrides targeting specific parts of complex controls, such as `btn-primary-bg: var(--color-primary)`.

This decoupling allows themes, dark mode, or rebranding to alter the mapping between primitive and semantic tiers without modifying a single line of component styling.

---

### 2. When is a token change breaking?
A token change is breaking when:
1. **Deletion or Renaming**: Removing or changing a token key (e.g. renaming `--color-surface` to `--color-bg`) causing silent CSS fallback failures or build breaks.
2. **Contrast Inversion / Regression**: Altering a background or foreground token value such that a previously compliant pair drops below WCAG thresholds (e.g. lightening a primary button color while keeping white text).
3. **Dimensional Scale Shifts**: Changing typography font-size, line-height, or global padding multiplier values in a way that breaks layout bounding boxes, causes clipping inside fixed containers, or triggers accidental multiline wrapping.
4. **Type Changes**: Switching a token's format, such as changing a rem string to a unitless number, breaking consumers expecting specific CSS units.

---

### 3. How would you support multiple brands and themes?
By keeping semantic token names constant while swapping their primitive alias mappings. 
In code, semantic tokens are declared as CSS custom properties attached to root scopes or theme attributes (e.g. `[data-theme="dark"]` or `[data-brand="client-b"]`). 

For multiple brands, each brand provides its own primitive palette file in Figma variables. The semantic layer (`--color-primary`, `--color-surface`) is mapped to corresponding brand primitives. When switching themes, we change the root HTML attribute. The components, which consume solely semantic roles, seamlessly update without duplicate CSS rules, conditional JavaScript logic, or bespoke component forks.

---

### 4. Can tokens guarantee accessible contrast?
No. Tokens are static value definitions; accessibility is relational. 
A token definition like `--color-primary: #0E6245` cannot ensure compliance on its own. Accessibility only emerges when two tokens are applied together as foreground and background in DOM layout.

Even if a design system defines paired roles like `color-primary` and `color-on-primary` with verified 6.2:1 contrast, a developer might accidentally place `color-on-primary` on `color-surface` (white on light green), generating an unreadable 1.1:1 ratio. Tokens enforce systematic values, but automated linting, DOM audits, and pairing rules are required to guarantee contrast.

---

### 5. How do you ensure that colour contrast guidelines are met within a website or application's design?
1. **Mathematical Pairing in Figma**: During token definition, every background role is paired with explicit foreground roles, testing luminance using APCA or WCAG formulas.
2. **Automated CI Audits**: Integrate axe-core or Playwright accessibility tests into automated pipelines to test actual rendered DOM elements on every pull request.
3. **Linter Guardrails**: Stylelint plugins that forbid pairing unapproved semantic tokens or using raw hex values.
4. **Manual & Assistive Verification**: Audit running views using browser DevTools color pickers and high-contrast simulation modes to inspect text over dynamic states, images, and disabled controls.

---

### 6. Can you discuss the differences between WCAG levels A, AA and AAA?
* **Level A (Essential Foundation)**: Baseline accessibility requirements without which assistive tech users cannot access content at all (e.g., keyboard navigability, text alternatives for non-text content, no keyboard traps).
* **Level AA (Legal & Practical Standard)**: The global enterprise and legal compliance standard. Requires a minimum 4.5:1 contrast ratio for normal text (3:1 for large text $\ge 24$px or $\ge 18.66$px bold) and 3:1 for graphical UI elements, plus visible focus indicators and orientation freedom.
* **Level AAA (Specialized Enhancement)**: Enhanced stringency. Demands 7:1 contrast for normal text (4.5:1 for large text), sign language interpretation, and no background audio interference. Most general-purpose platforms do not mandate full AAA across all views because it severely constrains color design.

---

### 7. Discuss the importance of semantic HTML in the context of accessibility.
Semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<header>`, `<button>`, `<dialog>`) provide built-in accessibility semantics directly to the browser accessibility tree. 
They announce accessibility roles, states, and keyboard interaction patterns (like Enter/Space activation and tab order) natively without custom JavaScript. 

Using generic `<div>` tags with click handlers lacks accessibility roles, tab stops, and keyboard event dispatching unless manually polyfilled with extensive ARIA attributes. Semantic HTML provides the reliable, predictable scaffold that screen readers and switch-access devices depend upon.

---

### 8. How do you handle design handoff to developers using Figma?
I treat Figma as a code-aligned single source of truth rather than a static drawing canvas:
1. **Variables & Token Alignment**: Names in Figma collections match CSS custom property names 1:1.
2. **Auto-Layout & Constraints**: Components use responsive Auto-Layout matching Flexbox/Grid behavior and rem-based padding.
3. **Component Specs**: Clear documentation of interactive states (hover, focus, disabled, active) alongside the primary frame.
4. **Automated Token Pipelines**: Use the Figma REST API or Tokens Studio to export design variables directly to JSON into the repository, generating CSS variables through automated GitHub Actions.

---

### 9. Why do AI generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?
AI models generate the most statistically probable interface based on vast training corpuses dominated by generic Bootstrap/Tailwind aesthetics—neutral purples, standard light greys, and uniform 16px body copy.

To stop this, you must feed the agent strict context constraints before it generates code:
1. A **business brief** defining specific environmental and user constraints.
2. A **strict token file** (`tokens.css`) defining primitive-to-semantic role mappings.
3. **Negative constraints**: Explicit instructions forbidding arbitrary hex codes, default framework palettes, un-tokenized padding, or generic button styles.
4. Instruction to use specific typographic hierarchy classes (`type-title-large`, `type-label-small`).

---

### 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?
Our `Display Large` is 57px with an 80px line height, derived exactly via the $1.4\times$ multiplier ($57 \times 1.4 = 79.8 \approx 80$px).
* **If tightened to $1.3\times$ (74px)**: Ascenders and descenders on multiline headings collide or feel dangerously crowded, severely degrading readability for dyslexic users or on vibrating mobile devices.
* **If loosened to $1.5\times$ (86px)**: The vertical gap between lines becomes so pronounced that a multiline heading visually fractures into disjointed sentences rather than reading as a single conceptual headline block. $1.4\times$ is the exact equilibrium for large display scales.

---

### 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.
I would decouple the RGB channels in the shadow tokens. In `tokens.css`, shadows are hardcoded with `rgba(14, 98, 69, 0.08)`. 
Instead, I would declare `--shadow-color-rgb: 14, 98, 69;` and compose elevations as `0 2px 6px 0 rgba(var(--shadow-color-rgb), 0.08)`.

*Cost of fixing it now*: It requires updating the token JSON export schema, rewriting the token transformation parser, and re-testing all three elevation levels across existing component stylesheets to ensure no CSS syntax breaks.

---

### 12. Wrong-answer analysis: Candidate claiming Figma hex export to CSS is a "single source of truth".
**What is missing**: The candidate exported raw primitive values without creating an intermediate semantic abstraction layer. They have a single *storage* location, not a design system.

**What goes wrong in month four**: 
When marketing rebrands or adds Dark Mode, the team cannot simply remap roles. Because components directly consume hex-derived primitives (like `--color-forest-40`), developers must manually inspect every component to decide whether that specific green should invert, darken, or stay static. Half the buttons will break contrast, edge-cases will be missed, and hardcoded overrides will proliferate across CSS files, completely destroying maintainability.
