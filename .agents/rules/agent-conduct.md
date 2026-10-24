---
trigger: always_on
description: How the agent works on every task in this repository.
---
# Agent conduct rules

- A task is complete only when its automated tests run and pass [PRD 5.8, 7.12].
- Never skip, disable, weaken, or delete a test to achieve a passing test suite [PRD 7.12].
- Never decide scope, priority, or cuts; all scope, priority, and cut decisions belong solely to Rox [PRD 13].
- Never run git commit, push, merge, rebase, or force-push, and never push to the main branch; Rox performs all git writes [PRD 12.1 A4, 13].
