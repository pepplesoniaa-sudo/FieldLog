---
name: build-one-fr
description: Builds one FieldLog functional requirement, such as FR-12, from its PRD row to a tested diff in a fixed order. Use when Rox says "build FR-xx", "next FR", or names a requirement to implement.
---
# Build one FR

Run the steps in order. Finish each step before you start the next. Each step ends with a check you can show in your reply.

## 1. Find the requirement
- Open docs/FieldLog-V1-PRD-v2.4.md. Find the FR row in section 5. Copy its id, text and priority.
- Find every user story in section 5.8 that names this FR id. Copy each Given, When and Then, with its exact values and on-screen texts.
- Check: you can quote the FR row and every matching story. If no story names the FR, write "no story" and use the FR text as the only acceptance source.

## 2. Check scope
- Use AGENTS.md "Scope: what to build" to decide whether this FR may be built now. If it may not, stop and tell Rox which line says so.
- List the FR ids this one depends on, such as the data or route it reads. If one is not built yet, stop and name it.
- Check: your notes name the scope line that allows the FR, and the dependency list or "none".

## 3. Collect what applies
- Read PRD section 7.12. List each NFR that this FR touches.
- Read PRD section 6 Part A (P1 to P14) and section 7.8. List each step and budget this FR runs through.
- Check: a list of "id: why it applies". An empty list needs a one-line reason.

## 4. Read the rules files
- List the files in .agents/rules/. Pick each file whose description matches what this FR changes.
- Read each picked file in full before you write code.
- Check: your notes list the files you read.

## 5. List the gaps
- Write each question this FR needs answered that the PRD, AGENTS.md and the files from step 4 do not answer. Include every "ask Rox" line from those files that this FR hits.
- If any gap blocks the FR, stop and send the list to Rox. AGENTS.md "How to work" says what to do if Rox tells you to go on.
- Check: the gap list, or "none".

## 6. Write the tests first
- Turn each Then from step 1 into one test. Use the story's own values: ids, counts and texts.
- For each NFR and budget from step 3, write a test, or name where it is measured instead (CI, a device test, or Phase 1 week 10).
- If the FR adds or changes an API route or a server action, run the route-access-tests skill.
- If the FR touches the today, capture, entry or visit screen, run the offline-flow-test skill.
- Check: each Then from step 1 has a test name.

## 7. Build
- Write the code for this FR only. Follow agent-conduct.md "What you may change".
- Check: git diff --stat shows only files this FR needs.

## 8. Run and report
- Run the tests that agent-conduct.md lets you run. Hand the rest to Rox as agent-conduct.md says.
- Write the reply in this order:
  1. The FR id, as AGENTS.md "How to work" asks.
  2. A table: story Then | test name | result (pass, fail, or "Rox runs").
  3. The list from step 3, each with its status.
  4. The gap list from step 5.
  5. The lists agent-conduct.md asks for at the end of every reply.
- Check: the table has one row for every Then from step 1.
