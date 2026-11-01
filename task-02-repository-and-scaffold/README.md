# Task 2: Scaffold It, Ship the Repository, Then Find Out What is Actually Running

## 1. What This Task Was
Scaffold FieldLog's foundational Next.js App Router application using context-constrained agent prompts, establish a professional Git repository architecture, benchmark cold development server startup and page load times, deliberately induce and recover from three distinct server failure modes, and rigorously investigate the "false success" vulnerability where the UI reports successful persistence while the database write completely fails.

## 2. What Was Built
* **Context-Constrained Prompting (`docs/scaffold-prompt.md`)**: Prompt evolution demonstrating how strict execution gating and negative constraints prevent AI agents from hallucinating dead features during scaffolding.
* **Model Evaluation (`docs/model-choices.md`)**: Comparative analysis of deep-deliberation models (Antigravity) vs. fast code-generation models, documenting when each should be used.
* **Server Performance Benchmark (`docs/performance-note.md`)**: Analysis of cold first load (8,450 ms) vs. warm reloads (68 ms).
* **Three Server Failure & Recovery Drills (`evidence/05-10`)**:
  1. *Nested Folder Error*: Induced and resolved both via agent re-scaffolding in place and directory navigation.
  2. *Port 3000 Conflict*: EADDRINUSE conflict resolved by identifying the specific PID (`14288`) and terminating it cleanly.
  3. *404 & Blank Page*: Diagnosed root cause via manual file hierarchy inspection, resolved with proper route folder scaffolding and a branded `not-found.tsx`.
* **The False Success Investigation (`docs/false-success.md`)**: Empirical testing of form submissions before and after severing database connectivity, demonstrating that optimistic frontend code can mislead users into believing data is saved when HTTP 500 errors occur.
* **Git Architecture & Working Tree (`docs/working-tree.md` & `evidence/15-git-log-graph.txt`)**: Hand-drawn pipeline analysis and verified Git log showing linear history, PR merges, and discarded experimental branches.
* **Information Design (`docs/information-design.md`)**: Scoped SEO metadata, dynamic route titles, `clamp()` responsive display typography, and rem-based button sizing.
* **Known Defects (`docs/defects.md`)**: Documented 2 real defects with line numbers and business impact.
* **Interview Defence (`docs/interview-answers.md`)**: Complete answers to all 15 technical interview questions.

## 3. What Was Decided
1. **Confine Scaffold to App Shell Only**: Explicitly stopped the agent from attempting to scaffold offline capture, outbox queues, or reporting tables in the initial pass.
2. **Mandatory 201 Created Status Check**: Modified client-side form submissions to require an explicit `201 Created` status code and server-assigned ID before displaying confirmation to users.
3. **Responsive Display Typography via `clamp()`**: Applied fluid scaling `clamp(2.25rem, 5vw + 1rem, 3.5625rem)` so large display headers fit mobile viewports without clipping.

## 4. What Was Got Wrong
* **Optimistic Error Swallowing**: Our first form submission component caught fetch exceptions but failed to inspect `response.ok`, happily displaying a green success message even when the server returned a 500 connection refused error.
* **Nested Directory Scaffolding**: The initial scaffolding command placed files inside a nested `fieldlog/` folder, causing immediate `ENOENT` package errors when running scripts from the repository root.
