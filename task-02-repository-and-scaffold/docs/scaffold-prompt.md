# Scaffolding Prompt Evolution

## 1. Initial Prompt Draft (Hand-written)
```text
Set up the FieldLog web application for me. Read the PRD and the design tokens first so you understand the colors and the supervisor workflow. Don't write code until you summarize what you read and I approve it. Follow the tokens strictly and don't make up any styles. Only build the initial app shell and the basic home screen, don't try to build all the offline capture, reports, and sync yet. Tell me what files you create and what assumptions you made.
```

---

## 2. Final Tightened Prompt (Production Boundary Enforcement)
```text
You are a senior systems engineer scaffolding the foundation for FieldLog. 

Before generating any code, you must strictly follow this execution protocol:

1. CONTEXT INGESTION: Read all repository context files (AGENTS.md, docs/FieldLog-V1-PRD-v2.3.md) and design system tokens (task-01-design-system/tokens.css, design/tokens/fieldlog.tokens.json).
2. DELIBERATION GATE: Summarize your structural architectural plan in bullet points and explicitly wait for human approval before executing any file writes or commands.
3. SOURCE OF TRUTH: Treat the ingested PRD and tokens as the absolute single source of truth. If two documents conflict (e.g. role counts or token values), STOP and ask for clarification rather than assuming.
4. DESIGN TOKEN ENFORCEMENT: Consume ONLY semantic CSS tokens (--color-surface, --color-primary, type-*, --shadow-*). Hardcoded hex values, raw RGB/HSL, or ad-hoc Tailwind/utility classes are strictly prohibited.
5. FOUNDATION BOUNDARY: Build ONLY the minimal project setup, configuration, and a minimal landing/status home screen. DO NOT build complex product features (offline capture outbox, report compilation, review workflows, or AI embedding) in this pass.
6. AUDIT & TRACEABILITY: In your response, provide:
   a. An exhaustive list of every file created or modified.
   b. An explicit list of all assumptions made (or state "Zero assumptions made").
   c. A self-audit verifying compliance against each of these eight instructions.
```

---

## 3. What Changed Between Drafts and Why
* **Explicit Execution Gating**: The initial draft requested a summary, but LLMs frequently generate the summary and immediately generate files in the same turn. The final prompt established an explicit "Deliberation Gate" that halts execution until human confirmation.
* **Negative Constraints on Scope (Point 6)**: The first draft loosely asked not to build the full product. The final prompt explicitly forbade building the outbox, report builder, and AI pipelines. Without concrete negative constraints, coding agents habitually scaffold massive multi-file mock architectures that introduce dead code and duplicate utility functions.
* **Self-Audit Requirement**: Mandating a closing self-audit forces the model to review its generated output against the prompt instructions before finishing its response, catching accidental token leaks or premature feature builds.
