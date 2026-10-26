---
name: offline-flow-test
description: Writes the flight-mode Playwright test for one FieldLog field screen flow (today, capture, entry or visit) against a production build with the service worker live, plus the manual iOS check. Use when work touches a field screen, offline capture, the local store, or NFR-03.
---
# Offline flow test

Run the steps in order for one flow on one field screen.

## 1. Check the tool
- Check that package.json lists @playwright/test. If it does not, stop. agent-conduct.md says Rox approves every test package.
- Check: your notes name the Playwright version from package.json.

## 2. Name the flow
- Name the screen, the FR id, and each story Then the test must prove offline. Take the Thens from PRD section 5.8.
- Check: a list of the Thens, quoted.

## 3. Point the test at a production build
- The test runs against next build followed by next start, never next dev.
- Open the Serwist settings in the Next.js config. Confirm the service worker is not disabled for a production build. If it is, stop and tell Rox.
- Check: your reply quotes the Serwist setting you read.

## 4. Write the test in this order
1. Open a new browser context. Sign in online as a seeded test supervisor. Open the screen under test.
2. Wait until navigator.serviceWorker.ready resolves and navigator.serviceWorker.controller is not null.
3. Wait until the sync bootstrap response has finished and the reference data is in the local store.
4. Call context.setOffline(true). Never fake offline with page.route or a mocked fetch.
5. Reload the page and assert the screen renders, within the time the story sets.
6. Run the flow. Assert each on-screen text from step 2 exactly.
7. Close the page. Open a new page in the same context, still offline. Go to the same screen and assert the saved data is shown.
8. Call context.setOffline(false). Assert the sync indicator reaches its "all uploaded" state within the time the story sets.
- Check: each numbered line maps to a line in the test.

## 5. Cover the browsers
- Run the test in the Playwright projects chromium, firefox and webkit, and in one phone-sized Chromium project.
- Playwright's webkit is not Safari on iOS and cannot install to the home screen. For any FR that touches iOS (FR-27, NFR-04), write a manual checklist for Rox: the steps on a real iPhone, in a Safari tab and as an installed app, with the result to expect at each step.
- Check: your reply lists the projects the test runs in and the manual iOS steps, or "no iOS step".

## 6. Hand over
- The test signs in, so it needs a database. Follow agent-conduct.md for who runs it.
- Give the exact commands in order: build, start, then run this test file only.
- Check: your reply holds the test file name and the commands.
