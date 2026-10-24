---
trigger: always_on
description: Security rules for all code: secrets, server-side checks, validation and logging.
---
# Security baseline rules

- Never store secrets, API keys, or credentials in code or in the repository [PRD 7.7].
- Never print, echo, or log values from .env files or environment variables [PRD 7.7].
- Never put a secret or credential in a NEXT_PUBLIC_ prefixed environment variable [PRD 7.7].
- Every route handler and server action must verify the user session and check permissions on the server [PRD 7.4, 7.7].
- Every input received by the server must be validated on the server with a shared Zod schema [PRD 7.7, NA7].
- Never write passwords, session tokens, photo contents, or personal data into logs [PRD 7.11].
- Never weaken, bypass, or disable an authorization or permission check to make a test pass [PRD 7.7, 7.12].
