# Validation Placement: Architecture & Request Lifecycle

## 1. Where Validation Sits in the Request Lifecycle
In a secure backend architecture, schema validation sits at the **outermost boundary** of the application server, immediately after raw HTTP deserialization and rate limiting, but strictly *before* any business logic, authorization lookups, file processing, or database access.

```
Incoming HTTP Request
        │
        ▼
1. Transport & TLS Termination (Reverse Proxy)
        │
        ▼
2. Rate Limiting (IP & Endpoint Bucketing - HTTP 429)
        │
        ▼
3. JSON Body Deserialization (Syntax Verification)
        │
        ▼
===================================================
4. SCHEMA VALIDATION BOUNDARY (Zod .safeParse())
   [Fails -> HTTP 400 Bad Request immediately]
===================================================
        │ (Validated & Coerced Data Only)
        ▼
5. Authentication & Session Verification
        │
        ▼
6. Business Logic, Database Mutations & Domain Events
        │
        ▼
7. Outbound Response
```

---

## 2. What Runs Before Validation
Only components essential to network transport and system protection run before schema validation:
1. **Network Firewalls & Reverse Proxy Headers**: TLS termination, `X-Forwarded-For` injection.
2. **Denial-of-Service (DoS) Rate Limiting**: IP-level sliding window checks to drop request floods before allocating server CPU to payload parsing.
3. **HTTP Body Parser**: Safely parsing incoming bytes into an in-memory JSON object, throwing HTTP 400 on malformed syntax.

---

## 3. What Must NEVER Run Before Validation
Running any of the following before schema validation introduces severe security vulnerabilities:
1. **Database Queries**: Never query the database with raw unvalidated user input (risk of SQL injection, un-coerced type mismatches, or DoS via massive queries).
2. **Authorization & Role Verification**: Performing database-heavy permission lookups before validating that the request shape is sound allows attackers to force expensive database joins with junk payloads.
3. **File System Operations**: Never read or write files using un-validated paths (risk of path traversal attacks like `../../etc/passwd`).
4. **Third-Party External API Calls**: Never invoke external services (such as payment gateways or email services) with unvetted data.

---

## 4. Why Hand-Written Route Validation is Worse Than Schema Validation

Developers frequently write manual `if` statements inside route handlers (`if (!body.email) ... if (body.name.length < 2) ...`), believing it looks simpler than declaring a schema. This is an anti-pattern:

1. **Incomplete Coverage & Drift**: Hand-written checks inevitably miss edge cases (e.g. forgetting to check for negative numbers, prototype pollution, non-string types, or extra malicious properties). Two route handlers validating the same entity will drift over time.
2. **Type Disconnection**: Hand-written checks do not provide TypeScript type inference. With Zod (`z.infer<typeof schema>`), the validated data is automatically typed, preventing runtime undefined errors across downstream functions.
3. **Lack of Whitelisting (Mass Assignment Vulnerability)**: A schema strips out unexpected extraneous attributes. Hand-written checks often pass `req.body` directly to the database, allowing an attacker to inject `isAdmin: true` or `organisationId: "other-tenant"`.
4. **Centralization**: A shared schema file (`lib/validation/auth.ts`) guarantees that client forms and server endpoints enforce identical validation invariants from a single source of truth (PRD 7.7).
