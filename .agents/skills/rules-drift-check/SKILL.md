---
name: rules-drift-check
description: Checks AGENTS.md and every file in .agents/rules/ against a new or changed FieldLog PRD, or a decision from Rox, and reports stale lines without editing anything. Use when Rox says the PRD changed, a new PRD version is in docs/, or Rox has decided something that changes a fact.
---
# Rules drift check

Run the steps in order. This skill reads and reports. It edits nothing.

## 1. Name the change
- Name the source: the new PRD file in docs/ and its change table, or Rox's message with the decision.
- Copy each change row, or each decision line.
- Check: your notes list every change row.

## 2. List the facts
- For each change, write every fact it adds, removes or alters: an id (FR, NFR, US, P, NA, Q, A, RK), a number with its unit, a name (model, enum, route, package, job) or a priority.
- Write the old value and the new value for each.
- Check: one line per fact, in the form "fact: old value, new value".

## 3. Search
- For each fact, search AGENTS.md and every .md file in .agents/rules/ for its id, its old value, and other ways the old value is written (for example "1 s" and "1 second").
- Use read-only search only.
- Record the file and line number of every hit.
- Check: a hit list, or "no hits" for each fact.

## 4. Classify each hit
- Mark each hit STALE (it says the old value), CONFLICT (it says something that is neither old nor new) or OK.
- For each STALE or CONFLICT, quote the file line and the PRD line it disagrees with, with its PRD section.
- Open the PRD line before you quote it. If you cannot find it, mark the hit UNSOURCED and do not classify it.
- Check: every STALE and CONFLICT has two quotes and a PRD section.

## 5. Check the open lines
- Find every line in AGENTS.md and .agents/rules/ that says a value is "not set", "not in the PRD", or "ask Rox".
- Search the new PRD, or Rox's decision, for an answer to each. If one is now answered, mark the line STALE and quote the answer.
- Check: a list of open lines, each marked "still open" or STALE.

## 6. Report
- Follow agent-conduct.md "What you may change". Do not edit any file you checked.
- Reply with:
  1. A table: file:line | current text | PRD text and section | STALE, CONFLICT or UNSOURCED | proposed new text.
  2. The facts from step 2 that had no hits.
  3. Counts of STALE, CONFLICT, UNSOURCED and OK.
- Check: git status shows no change made by this task.
