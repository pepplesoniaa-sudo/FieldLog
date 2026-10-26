---
name: route-access-tests
description: Writes the role-by-route access and tenant-isolation tests for one FieldLog API route handler or server action, from one shared fixture. Use when work adds or changes a route under api/ or a server action, or when Rox asks for role tests or tenant-isolation tests.
---
# Route access tests

Run the steps in order for one route and method, or one server action.

Public routes (the marketing page, sign-in in every mode, invite, reset, api/billing/webhook and api/health) are outside this skill. Say so and stop. /admin/billing and api/billing/checkout are admin-only and inside it.

## 1. Load the shared fixture
- Find the shared access fixture file. If none exists, ask Rox where test files go, then create it once, there.
- The fixture holds exactly these records:
  - Org A with project P1 (sites S1 and S2) and project P2 (site S3). Org B with one project and one site.
  - sup1: Supervisor on P1, assigned to S1 only. sup2: Supervisor on P1, assigned to S2 only. sup3: Supervisor on P2, assigned to S3.
  - rev1: Reviewer on P1. bak1: Backup reviewer on P1. admA: admin of Org A with no membership. admB: admin of Org B.
  - On each site, one entry and one Draft report created by that site's supervisor.
  - A signed-out caller with no cookie.
- Sign each user in through the real sign-in code, as security-baseline.md requires for tests.
- Never create a user inside a single test file. If a route needs a case the fixture lacks, add it to the fixture file and say so in your reply.
- Check: the test file imports the fixture and creates no users.

## 2. Write the expected result for each caller
- Name the route and method, or the server action, and the action it matches in the role table in auth-and-access.md.
- For each caller, pick the first line that fits:
  1. Signed out: 401.
  2. The target is in another organisation, or on a site or project the caller cannot see: 404 (PRD US-02).
  3. The caller can see the target but the role table says No: 403 (PRD US-03).
  4. Otherwise: the route's success code.
- A server action returns no status code. For an action, write the refusal or result it returns in place of the code.
- If the role table has no line for this action, stop and ask Rox.
- Check: a table of caller | expected code | role table line or story that sets it.

## 3. Write one test per caller
- Call the route or action as that caller, against the target the table names, and assert the status code.
- For a success, assert the response holds only rows from sites and projects that caller may see.
- For a list or search route, call it as sup1 and assert that no result comes from S2, S3 or Org B.
- For a refusal on a write, read the touched tables and AuditEvent before and after the call. Assert that nothing changed.
- Check: the file has one test for each caller in the step 2 table.

## 4. Hand over
- These tests need a database. Follow agent-conduct.md for who runs them.
- Give the exact command that runs this test file only.
- Check: your reply holds the step 2 table, the test file name and the command.
