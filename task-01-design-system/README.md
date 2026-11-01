# Task 1: The Design System, and Proving the Agent Used It

## 1. What This Task Was
Establish a complete, engineering-grade design system for **FieldLog** (an environmental remediation PWA) in Figma, export semantic design tokens into machine-readable JSON, translate those tokens into CSS custom properties via an instructed AI agent, and provide empirical proof that the agent strictly consumed the design system rather than falling back to unconstrained defaults.

## 2. What Was Built
* **Business Brief (`docs/business-brief.md`)**: Definition of the environmental remediation supervisor persona, harsh outdoor constraints, zero-loss offline capture requirements, and utilitarian aesthetic principles.
* **Color System (`docs/colour-roles.md`)**: Tonal palette derived from an environmental remediation brand color pinned at Primary 40, complete with functional roles (Error, Warning, Success) and verified WCAG AA/AAA contrast ratios.
* **Typography Scale (`docs/type-scale.md`)**: Complete 15-style semantic type hierarchy (Display, Headline, Title, Body, Label) following mathematical line-height multipliers ($1.4\times, 1.5\times, 1.6\times$) and custom scannable letter-spacing.
* **Deliberate Divergences (`docs/divergences.md`)**: Rationale and failure-mode analysis for two intentional divergences from standard Material 3 defaults.
* **Shadow System (`docs/shadows.md`)**: Soft, Medium, and Hard elevations tinted with the brand primary tone rather than raw black.
* **Token Export & Catch**: Comparison between `evidence/05-tokens-incomplete.json` (missing variables) and `evidence/06-tokens-complete.json`.
* **CSS Generation & Agent Verification**: Prompts used, full codebase raw hex search, typography interrogation, and before/after UI renders.
* **Deliberate Regression**: Demonstration on an unmerged branch showing broken UI consistency when token referencing is bypassed.

## 3. What Was Decided
1. **Pinned Primary 40 (`#1B5EAD`)**: Retained the authentic civil and environmental engineering blue hue without letting automated tonal generation dilute brand identity into a generic indigo.
2. **Generous Line-Height on Body/Labels**: Set to $1.5\times$ and $1.6\times$ respectively to maintain readability on handheld devices vibrating inside heavy machinery or during field walking.
3. **Primary-Tinted Shadows**: Built with low-opacity engineering blue tones (`rgba(27, 94, 173, ...)`) to blend with outdoor natural light rather than casting synthetic dirty grey/black shadows.

## 4. Known Defects (`docs/defects.md`)
* Documented in [`docs/defects.md`](file:///c:/Users/HP/Desktop/FieldLog/task-01-design-system/docs/defects.md).
