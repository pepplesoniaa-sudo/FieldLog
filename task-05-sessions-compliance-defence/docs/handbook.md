# The Engineering Handbook: Seven Pillars of Production Software Architecture

> **Audience**: Incoming Forward Deployed Engineers and Full-Stack Developers  
> **Author**: FieldLog Core Engineering  
> **Purpose**: A comprehensive guide to building resilient, secure, and compliant production web systems, documented through real engineering scenarios, mechanisms, failure modes, and retrospective mistakes.

---

## Section 1: Typography, Shadows, and the Design System Export

### 1. The Concept, in Plain Words
A **Design System** is a single source of truth containing design tokens—standardized visual variables (colors, font sizes, line heights, letter spacings, and elevation shadows)—encoded in machine-readable JSON and compiled into CSS variables. A **semantic role** assigns a functional purpose to a token (e.g. `--color-primary`, `--color-surface`) rather than binding components directly to raw visual primitives (e.g. `--color-blue-40` or `#1B5EAD`).

### 2. Why It Exists
It prevents **visual fragmentation and irreversible styling debt**. In large codebases, developers working independently hardcode arbitrary hex codes (`#1e40af`, `#2563eb`), arbitrary font sizes (`17px`, `19px`), and mismatched drop shadows. When the brand evolves, when dark mode is introduced, or when accessibility auditors mandate high-contrast ratios, a codebase littered with raw values requires months of manual refactoring. With semantic tokens, changing a single variable updates the entire application instantly.

### 3. A Real Scenario
On a remediation project in the Niger Delta, site supervisor Aliyu was recording soil excavation data on a ruggedized Android tablet in blinding midday sunlight. The original UI used arbitrary light-blue badges with white text (`#93c5fd` on `#ffffff`, contrast ratio 1.8:1). Under direct sun glare, Aliyu could not read whether an entry was marked "Contaminated" or "Clean Backfill" and logged three truckloads into the wrong excavation sector, requiring two days of soil re-testing.

### 4. How It Is Done
1. **Palette Generation & Pinning**: Select the brand anchor (`#1B5EAD`) and lock it as **Primary 40** in the Material 3 HCT algorithm. Generate 13 tonal steps (0 to 100).
2. **Mathematical Line Heights**: Derive line heights strictly from type size: Display and Headlines use $\text{Size} \times 1.4$; Body uses $\text{Size} \times 1.5$; Labels use $\text{Size} \times 1.6$.
3. **Primary-Tinted Shadows**: Construct box-shadows using transparent primary blue (`rgba(27, 94, 173, 0.16)`) rather than raw black (`rgba(0,0,0,0.4)`), allowing elevated cards to blend naturally into daylight.
4. **Token Compilation**: Export tokens from Figma as JSON and compile them into CSS variables (`tokens.css`) using a build script that strictly forbids components from consuming raw primitives.

### 5. Where It Goes Wrong
**The Token Reference Bypass**. A developer gets lazy and writes `style={{ backgroundColor: '#1B5EAD' }}` directly on a button instead of `var(--color-primary)`. When the brand updates its color scheme or switches to dark mode, that hardcoded button remains frozen in the old color, breaking UI consistency.

### 6. What We Got Wrong During Task 1
During our first Figma export (`task-01-design-system/evidence/05-tokens-incomplete.json`), we exported tokens without enabling "Include Figma Variables". The generated JSON contained typography and shadows, but completely omitted the entire color palette! We had to delete the export, configure variable inclusion, and re-export `06-tokens-complete.json`.

---

## Section 2: Scaffolding, the Development Server, and Database Diagnostics

### 1. The Concept, in Plain Words
**Scaffolding** is the deliberate initial assembly of an application's framework structure, configuration files, and baseline dependencies. **Database Diagnostics** are repeatable terminal commands and health-check endpoints that prove the database engine is accepting TCP connections, enforcing relations, and persisting records before any frontend feature is written.

### 2. Why It Exists
It prevents the **False Success Illusion**. A developer runs a scaffolding script, sees a green terminal output, and assumes everything is operational. Days later, they discover that routes are 404ing because of nested directory misconfigurations, or that form data is disappearing because database writes are silently failing behind unhandled asynchronous promises.

### 3. A Real Scenario
During an early deployment of the FieldLog staging environment, junior engineer Fatima wrote a supervisor registration form. The UI displayed a success alert: *"Supervisor Registered!"* However, when Aliyu tried to log in on site the next morning, his account did not exist. The server action was executing an asynchronous database insert without an `await` statement; the server returned `HTTP 200` to the browser before PostgreSQL rejected the write due to a missing foreign key.

### 4. How It Is Done
1. **Explicit Routing Scaffold**: Structure App Router directories cleanly (`app/`, `app/api/health/`, `app/sign-in/`).
2. **Liveness Health Endpoint**: Build `/api/health` that runs a raw ping query (`SELECT 1`) against PostgreSQL and returns `{ status: "ok", db: "connected", timestamp }`.
3. **Port Conflict Resolution**: Identify and kill hanging background node processes using `Get-NetTCPConnection` and `Stop-Process -Id` before starting the server.
4. **Verified Write Tests**: Execute automated scripts that insert a test row, verify its existence, and catch connection failures immediately.

### 5. Where It Goes Wrong
**Nested App Folder Nesting**. Running `create-next-app` inside an existing repository root often nests files into `fieldlog/fieldlog/app`, causing routes to return 404 while the developer searches for code bugs in the wrong directory.

### 6. What We Got Wrong During Task 2
During our initial server startup, the dev server failed with `EADDRINUSE: port 3000 already in use` (`evidence/07-port-conflict.txt`). Instead of guessing or switching to a random port like 3001 (which breaks OAuth and CORS origins), we had to inspect the PID holding port 3000, terminate the zombie process, and establish a clean restart protocol.

---

## Section 3: Information Design, the Browser Head, and Responsive Type

### 1. The Concept, in Plain Words
**Information Design** is the intentional visual arrangement, typographic hierarchy, and structural grouping of information so that users can comprehend state and take action with minimal cognitive effort. The **Browser Head** is the HTML `<head>` metadata (titles, viewports, theme colors, OpenGraph tags) that informs browsers, search engines, and screenreaders how to display and contextualize the document.

### 2. Why It Exists
It prevents **critical operational errors on mobile screens**. On environmental remediation sites, supervisors do not sit at dual-monitor desks; they look at 5.5-inch screens outdoors under dust and glare. If a page title wraps awkwardly, if primary actions are buried below diagnostic trivia, or if `<meta name="viewport">` allows the browser to shrink text to microscopic desktop scales, workers make hurried, incorrect data selections.

### 3. A Real Scenario
Safety supervisor Chidi was inspecting a high-pressure slurry pipeline. On his mobile phone, the heading *"Excavation Depth Limit Exceeded (Hazardous Waste Layer)"* wrapped awkwardly because the CSS font size was set in fixed pixels without a max-character width. The word *"Hazardous"* was pushed off the visible screen below the fold. Chidi saw only *"Excavation Depth Limit Exceeded"*, assumed it was a routine volume note, and failed to halt the backhoe before it struck an unmapped chemical containment liner.

### 4. How It Is Done
1. **Responsive Viewport Configuration**: Set `viewport: { width: 'device-width', initialScale: 1, maximumScale: 5 }` in Next.js layout metadata.
2. **Measure & Wrap Control**: Bound major heading widths to `max-width: 22ch` with `text-wrap: balance` to guarantee clean semantic breaks across 375px, 768px, and 1280px widths.
3. **Head Metadata Architecture**: Define dynamic title templates (`%s | FieldLog`), OpenGraph cards, and theme-color meta tags matching brand Primary 40 (`#1B5EAD`).
4. **Visual Hierarchy Prioritization**: Place primary human actions (e.g., *"Supervisor Sign In"*, *"+ Capture Entry"*) at the top of the optical reading gravity, sequestering technical diagnostic states into muted secondary cards.

### 5. Where It Goes Wrong
**Fixed Pixel Bloat & Unscaled Density**. Defining headings as `font-size: 57px` without media queries or fluid clamp formulas (`clamp(2rem, 5vw, 3.5rem)`), causing titles to collide with icons and push forms offscreen on compact phones.

### 6. What We Got Wrong During Task 2
Our initial home page scaffold displayed an unwrapped 57px heading that broke across three awkward lines on mobile viewports (`evidence/18-heading-wrap-bad.png`). We had to constrain the container measure and apply balanced wrapping to restore visual balance (`evidence/19-heading-wrap-good.png`).

---

## Section 4: The Working Tree, Branching, and Client-Side Validation

### 1. The Concept, in Plain Words
The **Working Tree** is your local file system as tracked by Git across its three states: the working directory, the staging index, and committed history. **Client-Side Validation** is the execution of form checks in the browser before dispatching an HTTP request.

### 2. Why It Exists
Clean branching isolates experimental features from production master code, ensuring incomplete work can be abandoned without breaking main. Client-side validation exists strictly for **user ergonomics and network bandwidth preservation**: it gives immediate, accessible feedback so the user fixes mistakes before wasting round-trips over poor mobile networks.

### 3. A Real Scenario
Supervisor Bola was submitting an end-of-day site report over a weak 2G cellular link. She mistyped her email (`bola@fieldlog`). Because there was no client-side validation, the browser submitted the entire multi-part form payload (including 8 high-resolution photos, 12MB total). The upload crawled for four minutes, consumed Bola's limited data allowance, and only then returned an error from the server: *"Invalid email format"*. All 8 photos had to be uploaded again from scratch.

### 4. How It Is Done
1. **Feature Branching**: Always branch from `master` (`git checkout -b feature/auth-validation`), commit logically, and verify with `git status` and `git log --graph --oneline`.
2. **Four Validation Heuristics**:
   - *Category 1 (Empty Required Fields)*: Validate `onBlur` (when leaving the field) to avoid shouting at the user while they are still typing.
   - *Category 2 (Structural Rules)*: Validate format and length on blur or submit.
   - *Category 3 (Email & Real-Time)*: Validate format on submit for login (preventing enumeration), but validate interactively on registration to help users fix typos.
   - *Category 4 (Cross-Field Invariants)*: Verify password confirmation or seat allocations against plan maximums on submit.
3. **Accessible Error Binding**: Link error text to inputs using `aria-describedby="field-error"` and `aria-invalid="true"`.

### 5. Where It Goes Wrong
**Mistaking Client Validation for Security**. Believing that disabling a button in the browser stops an attacker. An attacker uses `curl` or Postman to bypass the browser entirely, sending invalid data straight to the server API.

### 6. What We Got Wrong During Task 3
We initially used `<input type="number">` for the supervisor seats input (`evidence/09-number-input-annoying.png`). On mobile browsers, number inputs display clunky increment spinners that get accidentally tapped when scrolling, and accept invalid characters like `e`, `+`, and `-`. We replaced it with `<input type="text" inputMode="numeric">` with strict regex filtering (`evidence/10-text-input-working.png`).

---

## Section 5: Migrations, Schema Design, and Email Delivery

### 1. The Concept, in Plain Words
A **Schema** is the formal blueprint of your database tables, column types, and relational constraints. A **Migration** is an ordered, version-controlled SQL script that transforms the database schema from one state to the next. **Asynchronous Email Delivery** is the offloading of email dispatch to background worker queues rather than sending emails synchronously inside an HTTP request handler.

### 2. Why It Exists
Database schemas must evolve without destroying existing production data or locking tables. Synchronous email delivery blocks web server threads: if an external SMTP relay takes 3 seconds to respond or times out, the user's browser hangs, and the registration endpoint crashes with HTTP 500 errors.

### 3. A Real Scenario
On Monday morning, an environmental firm launched an organisation registration drive. The registration route was programmed to send verification emails synchronously via Gmail SMTP inside the `POST /api/auth/register` handler. At 09:05 AM, the SMTP server experienced transient connection throttling. Fifty supervisors attempting to register simultaneously hung on loading spinners for 30 seconds before receiving generic server timeout crashes. Many submitted the form five times, generating duplicate records and flooding the database.

### 4. How It Is Done
1. **The Three-Step Zero-Downtime Migration Pattern**:
   - *Step 1*: Add new column as nullable (`ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;`).
   - *Step 2*: Run an idempotent backfill script to populate existing rows with default values or cryptographic invite hashes.
   - *Step 3*: Alter the column to enforce non-nullability (`ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;`).
2. **Money Table Separation**: Store financial transactions in an append-only `Payment` table (recording confirmed funds in minor currency units, e.g. kobo/cents) and checkout attempts in a `PaymentAttempt` table, preventing race conditions.
3. **Queue-Backed Email Dispatch**: In the registration route, write the user record, write an email job to the `pg-boss` queue table, and return `HTTP 201 Created` in **88ms**. A dedicated background Node worker process picks up the job and handles SMTP retries asynchronously.

### 5. Where It Goes Wrong
**Adding NOT NULL Columns Directly to Populated Tables**. Running `ALTER TABLE "User" ADD COLUMN "phone" VARCHAR(20) NOT NULL;` on a database with 10,000 existing users crashes immediately with a `NOT NULL violation`, halting production deployment.

### 6. What We Got Wrong During Task 4
When we introduced `passwordHash` to the `User` table, we attempted to add it directly as a required non-nullable column (`evidence/04-required-column-failure.txt`). The migration crashed because existing seeded test users had null values. We had to recover using the Three-Step Migration Pattern (`evidence/05-required-column-three-steps.txt`).

---

## Section 6: Server-Side Validation, Hashing, Rate Limiting, and Verification

### 1. The Concept, in Plain Words
**Server Boundary Validation** is the rigorous parsing of all incoming network payloads (body, query params, route headers) using immutable runtime schemas (Zod). **Adaptive Hashing** (Argon2id, bcrypt) is a computationally intensive, memory-hard mathematical function designed to make password cracking economically unfeasible. **$k$-Anonymity** is a mathematical privacy technique that verifies breached passwords without transmitting the password to any third party.

### 2. Why It Exists
The server is the only authoritative source of truth. Without boundary validation, adversaries exploit mass-assignment vulnerabilities to elevate user roles to `ADMIN`. Without adaptive hashing, stolen password databases are cracked in seconds on commodity GPUs. Without rate limiting, botnets execute distributed credential stuffing attacks.

### 3. A Real Scenario
A competitor attempted a credential-stuffing attack against an environmental firm’s portal, dispatching 10,000 automated login requests per minute using credentials leaked from an unrelated commercial website breach. Because the target application used SHA-256 without rate limiting, the attacker cracked 400 passwords offline in under 10 minutes and accessed confidential environmental remediation bids.

### 4. How It Is Done
1. **Boundary Schema Parsing**:
   ```typescript
   const validatedData = registerSchema.parse(await request.json());
   // Only use validatedData; discard raw request body to defeat mass assignment.
   ```
2. **Argon2id Adaptive Hashing**: Configure memory cost ($m=64\text{MB}$), time cost ($t=3$), and parallelism ($p=4$) to calibrate hashing execution to ~80ms per hash.
3. **Compound Rate Limiting**: Key rate limit buckets on `IP + NormalisedEmailDomain + ActionType` in a shared PostgreSQL `RateLimitCounter` table, returning `HTTP 429 Too Many Requests` with a `Retry-After` header.
4. **$k$-Anonymity Breach Verification**: Hash candidate password with SHA-1, send only the first 5 characters to HaveIBeenPwned range API, and check the returned suffix list locally.

### 5. Where It Goes Wrong
**Naive IP-Only Rate Limiting**. Keying rate limits strictly on the client IP address. Attackers rotating proxy headers (`X-Forwarded-For: 203.0.113.88`) or utilizing cellular CGNAT mobile pools completely bypass the rate limiter (`evidence/14-rate-limit-defeated.txt`).

### 6. What We Got Wrong During Task 4
In our initial verification route, verification was not idempotent: when a user's browser retried a valid code submission due to poor mobile connection, the second request hit the database, saw `usedAt` was already populated, and falsely reported `HTTP 400: "Invalid or expired verification code"` (`evidence/22-verification-code-reused.png`). We fixed this by adding an atomic state transition that returns `ALREADY_VERIFIED`.

---

## Section 7: Sessions, Logout, Account Deletion, and Compliance

### 1. The Concept, in Plain Words
A **Session** is a stateful server-side record of an authenticated user bound to a secure cookie token. **Account Deletion** is a multi-stage legal and architectural process (soft delete $\rightarrow$ grace period $\rightarrow$ purge/anonymisation) governed by data protection laws (NDPA, GDPR), not an immediate database wipe.

### 2. Why It Exists
Sessions must be tracked server-side so they can be revoked instantly upon logout, password reset, or employee termination. Deleting a user row directly with `DELETE FROM "User"` destroys financial accounting records, invalidates historical environmental sign-offs, and violates statutory audit laws.

### 3. A Real Scenario (The Hauwa Case)
Cooperative society manager Hauwa received a deletion request from a departing member, Ibrahim. Hauwa opened the database and executed `DELETE FROM "Member" WHERE id = 'ibrahim'`. Two years of contribution and loan records were destroyed. Six weeks later, Ibrahim disputed his payout, and the cooperative had no records to defend itself. When government auditors arrived, the unexplainable gap in the ledger was treated as fraudulent embezzlement.

### 4. How It Is Done
1. **Server-Side Hashed Sessions**: Store only `SHA-256(cookieToken)` in the `Session` table.
2. **True Server-Side Logout**: On logout, delete the session row from PostgreSQL and clear the browser cookie with an expired `Set-Cookie` header.
3. **Password Reset Revocation**: On password reset, execute `DELETE FROM "Session" WHERE "userId" = $id` to terminate all concurrent sessions across all devices globally.
4. **The 14-Day Deletion Grace Period**:
   - *Phase 1 (Day 0)*: Set `user.status = DEACTIVATED`, purge all active sessions, and lock authentication.
   - *Phase 2 (Days 1–14)*: Allow cooling-off period where admins can contest fraudulent deletion requests.
   - *Phase 3 (Day 15)*: Run an automated background maintenance job that purges credentials, anonymises personal identifiers (`name`, `email`, `phone`), and preserves immutable statutory daily reports and financial transactions for the legal **7-year** retention window.

### 5. Where It Goes Wrong
**Front-End-Only Logout**. Clicking "Logout" clears the local React state and redirects to `/login`, but fails to make a server request. The session row remains active in PostgreSQL, allowing anyone with the cookie to resume the session indefinitely.

### 6. What We Got Wrong During Task 5
In our initial logout design, when a network timeout occurred while calling `/api/auth/logout`, the UI reported success while the server session remained live in the database (`evidence/09-logout-network-failure.txt`). We resolved this by implementing an atomic, retry-safe offline cleanup handler (`evidence/10-logout-edge-case-fixed.txt`).

