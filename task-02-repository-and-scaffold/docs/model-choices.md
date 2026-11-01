# Deliberate Model Choices

## 1. Architectural Strategy: Planning vs. Raw Execution
In agent-assisted development, different models possess fundamentally divergent operational profiles:
* **Antigravity (Deliberative & Tool-Grounded)**:
  - *Profile*: Executes multi-step tool calls, performs deep workspace reads, parses contextual rules, builds internal dependency graphs, and drafts explicit execution plans before modifying code.
  - *Best Used For*: Scaffolding, architecture design, schema migrations, cross-file refactoring, and security boundary enforcement.
* **Fast Code Generation Models (e.g. Gemini Flash / Open Code / Claude Haiku)**:
  - *Profile*: Optimized for low latency, rapid single-file completions, boilerplate syntax generation, and immediate unit test mock generation.
  - *Best Used For*: Writing isolated utility algorithms, generating static test data fixtures, or transforming repetitive token mappings.

---

## 2. Observed Differences in Practice
* **During Scaffolding**: 
  When tested with a fast, unconstrained coding model, it immediately attempted to scaffold the entire application in a single prompt—generating mock database schemas, fake offline sync outboxes, and incomplete UI components with placeholder functions.
  Antigravity, by contrast, followed the strict deliberation gate: it ingested the PRD, confirmed the scope boundary, and confined execution to the foundational app shell and health endpoint.
* **During Component Generation**:
  For rapid HTML/CSS utility drafting, fast models generated output in under 4 seconds, whereas deep-reasoning agents spent 25+ seconds reading directory trees and verifying imports.

---

## 3. Where We Chose Wrong and Had to Switch
* **The Incident**: 
  Attempted to use a fast, low-parameter model to convert `evidence/06-tokens-complete.json` into `tokens.css`.
* **The Failure**:
  The fast model ignored the negative prompt instruction ("*do not map raw hex directly to components*") and generated flattened primitive variables like `--color-primary-40: #1b5ead` without building the public semantic role abstraction layer (`--color-primary: var(--color-primary-40)`).
* **The Fix**:
  Switched back to Antigravity, which parsed the constraint requirements, verified token dependencies against the PRD, and correctly structured the two-tier CSS custom property architecture.
