---
trigger: always_on
description: How the agent works on every task in this repository - tests, git, what it may change and what counts as done.
---
# Agent conduct

AGENTS.md "How to work in this codebase" holds the FieldLog rules (one FR at a time, packages, schema, migrations, who decides cuts). This file holds only what it leaves out. Each rule says why, so you can apply it to a case it does not name.

## Done means tested
- A task is done only when its tests have been run and pass, and your reply shows the exact command and its result. Why: Rox cannot see your terminal, and "it should work" is not evidence. [Rox]
- If the repository has no test runner yet, stop and ask Rox which one to install. Do not pick one. Why: no test package is named in AGENTS.md "Stack", so installing one needs Rox's approval. [AGENTS.md How to work]
- Never skip, disable, weaken, delete or mark as expected-to-fail a test, and never change an assertion to match wrong output, to get a pass. If you think a test is wrong, say why and ask. Why: a green run that hides a broken rule is worse than a red one. [Rox]
- You may run tests that touch no database, no network and no file outside the repository. Why: they cannot change anything Rox depends on. [Rox]
- Tests that need a database (integration, role-by-route and tenant-isolation tests): write them, do not run them, and end your reply with the exact command for Rox to run. Why: AGENTS.md forbids you from running any query against any database, and such a test run is a query. [AGENTS.md How to work, PRD 7.4]

## Git
- You may run read-only git commands: git status, git diff, git log, git show. Why: you need them to report what changed. [Rox]
- Never run a git command that changes the repository, the index or the working tree: add, commit, push, pull, fetch, merge, rebase, reset, restore, checkout, switch, stash, clean, cherry-pick, revert, tag, branch -d, or any --force. Why: Rox does every git write, and restore, checkout, stash, reset and clean can silently destroy uncommitted work. [Rox]

## What you may change
- Change only the files the current FR needs. If the fix needs a change anywhere else, stop and name the file and the change. Why: Rox reviews one FR per diff, and unrelated edits hide inside it. [AGENTS.md How to work]
- Never edit AGENTS.md, anything in docs/, or anything in .agents/ unless Rox's message names that exact file. Why: these are the instructions you follow; an agent that edits its own rules can loosen them. [Rox]
- End every reply with three lists: files changed, commands run with their results, and anything asked for but not done. Why: Rox checks your work from the reply, not from memory. [Rox]
