---
trigger: always_on
description: Security rules for all code - secrets, environment values, server-side checks, input validation, logs and error responses.
---
# Security baseline

AGENTS.md already says permissions are checked on the server for every request. This file holds only what it leaves out.

- Never put a secret, API key, password or credential in code, tests, fixtures, docs or commit messages. Read it from process.env by name. Why: anything in the repository is copied to every clone and stays in git history. [PRD 7.7]
- Never print, echo, log or paste the value of any environment variable or any line of a .env file, including DATABASE_URL. Refer to a variable by its name only. Never create or edit a .env file; tell Rox the name you need. Why: terminal output and replies are not secret, and AGENTS.md says Rox names every variable. [PRD 7.7, AGENTS.md Stack]
- Never put a secret in a variable whose name starts with NEXT_PUBLIC_. Why: Next.js copies those values into the JavaScript sent to every browser. [Next.js docs]
- Every server action checks the session and the permission inside the action itself. A check in the page, layout or middleware does not protect it. Why: a server action is a public POST endpoint that anyone can call directly. [PRD 7.4, 7.7]
- Parse every input on the server with its shared Zod schema - body, query string, route params, form data and each sync operation - and use only the parsed result. Why: client checks can be skipped by anyone with a browser console. [PRD 7.7, NA7]
- Never log passwords, session tokens or cookies, presigned URLs, photo content, GPS coordinates or email addresses. Logs may contain requestId, userId, organisationId and route. Why: tokens and presigned URLs grant access to whoever reads the log, and location and email are personal data. [PRD 7.7, 7.11]
- Error responses sent to the browser never contain stack traces, SQL, file paths or another organisation's ids. Why: they tell an attacker how the server works. [Rox]
- Never weaken, bypass or mock out an authentication or permission check to make a test pass or to get something working. In tests, sign in as a test user who holds the right role. Why: a bypass left behind ships to production. [Rox]
- Never turn off TLS certificate checks (for example NODE_TLS_REJECT_UNAUTHORIZED=0). Why: it lets anyone on the network read and change traffic. [PRD 7.7]
