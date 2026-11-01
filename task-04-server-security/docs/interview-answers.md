# Task 4 Technical Interview Defence: Comprehensive Viva Answers

This document contains detailed, technically rigorous answers to all nineteen interview defence questions specified for **Task 4: The Server is the Source of Truth**, aligned with the FieldLog threat model, production security standards, and empirical benchmark evidence.

---

## Section 1: Hashing & Password Storage

### Question 1: Why should you hash passwords?
You must hash passwords because application databases inevitably operate under the threat of breach—whether via SQL injection, compromised backup storage, rogue insiders, or physical disk theft. If passwords are stored in plain text or reversible formats, a single database compromise instantly exposes every user's raw credentials. Because users routinely reuse passwords across multiple services, a breach of one system compromises their personal email, banking, and enterprise accounts.

Hashing is a one-way mathematical function: it maps an arbitrary-length input string to a fixed-length digest such that computing the original input from the output is computationally infeasible. By storing only the cryptographic digest, the authentication server never needs to know or persist the actual password. During authentication, the server takes the password presented by the user, computes its hash using the identical algorithm and stored parameters, and compares the resulting digest against the stored record. If the database is compromised, the attacker obtains only the one-way hashes rather than usable plain text. Hashing limits the blast radius of a breach, protects users against credential stuffing across unrelated platforms, and upholds statutory data protection obligations such as GDPR Article 32.

---

### Question 2: Why use bcrypt (or Argon2id) instead of SHA-256 for passwords?
General-purpose cryptographic hash functions like SHA-256, SHA-512, and MD5 were designed for high-throughput data integrity verification, message authentication, and digital signatures. They are intentionally engineered to execute as rapidly as possible, consuming minimal CPU cycles and negligible RAM. In our empirical benchmarks on standard hardware, SHA-256 computed in **0.015 milliseconds**—yielding over **65,000 hashes per second on a single CPU core**.

This blinding speed is catastrophic for password storage. An attacker who steals a database of SHA-256 hashes can mount an offline brute-force or dictionary attack using specialized GPU clusters (e.g., Hashcat on an 8x RTX 4090 rig) capable of computing over **50 billion SHA-256 hashes per second**. At that velocity, an 8-character lowercase password keyspace (208 billion combinations) is cracked in approximately **4.17 seconds**.

In contrast, password hashing algorithms like bcrypt, scrypt, and Argon2id are *adaptive, computationally expensive, and memory-hard*. They force the hardware to perform thousands of mathematical iterations and allocate dedicated memory buffers, rendering parallel GPU and ASIC attacks cost-prohibitive. On our machine, adaptive hashing required **82.88 milliseconds per hash** (5,470 times slower than SHA-256). For an authenticating user, an 82ms delay is completely imperceptible. For an attacker attempting 50 billion guesses, it turns a 4-second crack into weeks or millennia of computational effort.

---

### Question 3: What is a salt and why do you need it?
A salt is a cryptographically secure, pseudo-random sequence of bits generated uniquely for every user account and appended to the plaintext password prior to hashing. The resulting salt is stored in plain text alongside the final password hash in the database (or encoded directly within the modular crypt format string, such as `$argon2id$v=19$m=65536...`).

A salt is mandatory to eliminate two devastating offline attack vectors: **rainbow tables** and **identical hash collision**. A rainbow table is a precomputed lookup table containing billions of plaintext passwords mapped to their corresponding cryptographic hashes. If passwords are saved without a salt, an attacker simply looks up the stolen hash in the table to recover the plaintext in constant time ($O(1)$). Furthermore, if two users in an unsalted system choose the same common password (e.g., `"FieldLog2026!"`), their stored hashes are identical. An attacker who cracks that single hash compromises both accounts simultaneously and immediately knows which users share passwords.

By prepending a unique, random 16-byte salt per user, identical passwords produce completely distinct, uncorrelated hashes. Rainbow tables become useless because the attacker would have to recompute a dedicated multi-gigabyte table for every single user's unique salt. Salting forces the adversary to crack hashes individually, multiplying the work factor linearly across the entire user base.

---

### Question 4: What salt rounds, or what work factor, should you use? Give a number and defend it.
For bcrypt, a production work factor between **12 and 14 rounds** is the modern standard; for Argon2id (FieldLog's chosen algorithm), the recommended parameters are **memory cost $m=64\text{ MB}$, time cost $t=3$ iterations, and parallelism $p=4$ threads**.

The defense of this number rests on the **latency-versus-defense trade-off budget**: password verification should take between **50 and 250 milliseconds** on your target production server. Any duration under 50ms makes offline cracking excessively cheap for attackers. Any duration over 300ms creates severe denial-of-service vulnerabilities on the server: because password hashing is CPU-bound and blocks worker threads, an attacker sending 20 concurrent login requests could easily saturate all CPU cores, starving legitimate requests.

On our benchmarked server hardware, this configuration yielded an average execution time of **82.88 milliseconds**. This duration fits cleanly within our latency budget: a field supervisor submitting a login experiences a responsive UI (well within human perceptual thresholds of 100ms), while an attacker attempting offline brute-force is constrained to roughly 12 operations per second per CPU core. Crucially, adaptive algorithms allow the work factor parameter to be incrementally increased as server hardware improves over time, without requiring users to reset their passwords.

---

### Question 5: You are storing user passwords in a database. Of plain text, SHA-256, AES-256 encryption and adaptive hashing, which is correct and why are the other three wrong? Note that one is wrong for a different reason.
**Adaptive hashing** (Argon2id, bcrypt) is the only correct choice. It provides one-way irreversibility, per-user salting, and calibrated computational and memory hardness that renders offline brute-force cracking economically unfeasible.

The other three are dangerous failures:
1. **Plain text is wrong** because it provides zero confidentiality. Any SQL injection, compromised backup, or rogue employee instantly compromises every credential across the organisation.
2. **SHA-256 is wrong** because it is a fast general-purpose digest lacking work-factor adaptation or memory hardness. An attacker with consumer GPUs can compute billions of SHA-256 hashes per second, cracking typical password keyspaces in seconds.
3. **AES-256 encryption is wrong for a completely different reason**: *encryption is two-way and reversible, whereas hashing is one-way*. Encryption requires an encryption key. If an attacker breaches the application server and the database, they inevitably recover both the ciphertext and the decryption key (from environment variables, key management stores, or memory dumps). Once the key is obtained, the attacker decrypts the entire database back into plain text with zero brute-force effort. An authentication system never needs to decrypt a password; it only needs to verify equivalence. Storing reversible ciphertext introduces catastrophic key-management risk with zero security benefit.

---

## Section 2: Server Boundary Validation & Defense

### Question 6: Why is client-side validation not enough?
Client-side validation is strictly an **ergonomic and accessibility feature**, not a security control. The client environment—whether a browser, mobile web view, or mobile application—is running on untrusted hardware completely under the control of the end user.

An attacker does not use a browser form to attack an API. As demonstrated in our Task 3 and Task 4 attack testing, an attacker uses tools like `curl`, Postman, Python scripts, or direct socket connections to dispatch arbitrary HTTP requests straight to the server endpoints. They can strip headers, modify query parameters, send negative integer seat allocations, inject strings thousands of characters long, or submit malformed JSON payloads. In our direct attack experiment (`evidence/12-direct-request-before-and-after.txt`), an adversarial payload with missing fields, negative seats (`-999`), and invalid email structures bypassed all browser checks and reached the endpoint unimpeded.

If the server relies on client validation, an attacker can bypass all business rules, corrupt database invariants, trigger unhandled exceptions, and potentially execute injection attacks. Client validation provides instant user feedback; server validation provides the immutable perimeter defense.

---

### Question 7: What security checks belong in the frontend, and what must the server enforce regardless?
**Frontend checks** belong to user experience and client performance:
- Instant format validation (e.g., regex checks on email structure, minimum length meters) to prevent wasted network round-trips.
- UI state gating (disabling submit buttons while fields are invalid to prevent accidental double-submissions).
- Client-side file size and MIME-type pre-checks (rejecting a 50MB file before consuming cellular bandwidth).
- Offline draft validations to ensure entries stored in local IndexedDB are complete before queueing for sync.

**The server must enforce every rule unconditionally**, regardless of frontend checks:
- Strict schema parsing and type coercion (Zod validation rejecting unexpected keys, out-of-range numbers, and invalid enums).
- Authentication, session validation, and tenant membership verification on every request.
- Authorisation and role-based permissions (verifying that the user possesses the `OrganisationAdmin` role before modifying seats or retention periods).
- Normalisation and sanitisation (normalising email casing to lowercase, stripping null bytes).
- Uniqueness and referential integrity constraints (checking if an email already exists in the database).
- Rate limiting, IP throttling, and brute-force lockout counters.
- Password breach checks via k-Anonymity against public breach corpuses.

---

### Question 8: The user interface hides the delete button for non-administrators. Is that enough? If not, what does an attacker do instead?
Hiding a button in the UI provides **zero security**; it is merely visual layout management ("security through obscurity"). The client DOM is completely inspectable and editable.

A non-administrator attacker can circumvent hidden buttons in seconds:
1. **DOM Manipulation**: They open browser Developer Tools, inspect the DOM tree, locate the conditionally hidden delete button or modal, remove the `display: none` or `disabled` attribute, and click it.
2. **Direct API Dispatch**: More commonly, the attacker opens the Network tab or inspects client-side JavaScript bundles to identify the backend route (e.g., `DELETE /api/users/[id]` or the corresponding Next.js Server Action ID). They then issue a direct HTTP `DELETE` or `POST` request using `fetch()` in the browser console or an external CLI tool like `curl`, sending their valid session cookie.

If the backend endpoint does not explicitly authenticate the session, query the user's role from the database, and verify that `session.user.role === 'ADMIN'`, the server will execute the deletion. Every server route handler and server action must treat all incoming calls as potentially adversarial and enforce strict role checks internally.

---

### Question 9: What is the difference between validation, encoding, and sanitisation?
These three controls address data integrity and security at different stages of the data lifecycle:

1. **Validation** is the process of testing an untrusted input against a strict, predefined set of rules (schema, type, length, format, allowed values) and **rejecting** the request if it fails. Validation is a binary gate: either the data conforms to specification or it is discarded. For example, a Zod schema validating that `seats` is an integer between 1 and 500, returning `HTTP 400 Bad Request` if `seats = -5`.
2. **Sanitisation** is the process of modifying or stripping dangerous content from input data to make it safe for storage or downstream processing, without rejecting the entire input. For example, stripping leading and trailing whitespace from a username, removing null bytes (`\0`), or removing unsafe HTML tags (`<script>`) from rich text input while preserving valid text.
3. **Encoding** (or escaping) transforms data from one representation into another so that characters with special syntactic meaning are treated as literal data by an interpreter. Crucially, encoding must happen **at the point of output**, tailored to the destination context. For example, converting `<` to `&lt;` when rendering user input into HTML (preventing Cross-Site Scripting), or using parameterized SQL queries with tagged template literals (preventing SQL Injection by ensuring user input is never interpreted as executable SQL syntax).

---

### Question 10: Why would you replace the incoming request body with the parsed and validated data rather than leaving both available?
Leaving the raw, unvalidated request body accessible alongside validated data introduces severe **mass assignment vulnerabilities** and downstream developer error.

In modern web frameworks, if a developer has access to `request.body` or `req.json()` after running a validator, they may inadvertently write:
```typescript
await prisma.user.update({ where: { id }, data: { ...rawBody } });
```
An attacker who includes extraneous properties in their JSON payload—such as `role: "ADMIN"`, `emailVerifiedAt: "2026-01-01"`, `organisationId: "victim-corp"`, or `balance: 999999`—can overwrite sensitive database fields that were never meant to be user-configurable. This is the classic mass-assignment / object injection attack.

By replacing the incoming data with the output of a strict parser (e.g., `zodSchema.parse(body)`), the application guarantees that:
1. Only explicitly allowed, whitelisted fields exist in the data object (`strip` mode removes unknown keys).
2. Data types are strictly coerced and validated (strings trimmed, integers guaranteed).
3. Downstream business logic and database queries interact exclusively with trusted, sanitized data, preventing internal confusion between what was checked and what was actually processed.

---

### Question 11: Why validate route parameters and query strings, not just the body?
Route parameters (e.g., `/api/projects/[projectId]/sites/[siteId]`) and query strings (e.g., `?page=1&limit=25&sort=date`) are completely untrusted client inputs, identical in risk to request bodies.

Failing to validate parameters exposes the system to several attack vectors:
1. **Type Confusion & Crash Exploits**: A route expecting an integer or UUID parameter (`/api/reports/[id]`) that directly passes `params.id` into an ORM query without validation can trigger database syntax errors, application crashes, or unhandled 500 exceptions if an attacker passes an array, SQL fragment, or string like `[id]=NaN` or `[id]=..%2F..%2Fetc%2Fpasswd`.
2. **Tenant Boundary Traversal (IDOR)**: In a multi-tenant platform like FieldLog, validating that `projectId` is a valid UUID is necessary, but the server must also validate that the authenticated user's organisation actually owns that specific project ID. Otherwise, an attacker can access records belonging to another company simply by altering the URL parameter (Insecure Direct Object Reference).
3. **Denial of Service via Query Strings**: Unvalidated query strings like `?limit=99999999` can force the database to perform massive, un-paginated table scans, exhausting server memory and starving other requests. Both route params and query strings must be parsed using Zod schemas at the boundary.

---

## Section 3: Rate Limiting & Denial of Service

### Question 12: How do you rate limit unauthenticated requests, and what is the problem with the header you would reach for first?
Unauthenticated requests (such as registration, login, and password reset endpoints) cannot be identified by session tokens or user IDs. Therefore, they must be throttled using incoming network and client attributes: primarily the **client IP address**, combined with the **target resource identifier** (e.g., IP + email address).

The header most developers reach for first is `X-Forwarded-For`. The critical problem with `X-Forwarded-For` is that **it is trivial to spoof unless strict proxy boundaries are enforced**. As proven in our test (`evidence/14-rate-limit-defeated.txt`), an attacker can simply attach `-H "X-Forwarded-For: 1.2.3.4"` to their request. If the server naively trusts this header, the attacker can rotate the header on every single request, completely bypassing the rate limiter.

To solve this, the application must run behind an edge reverse proxy (such as Cloudflare, AWS ALB, or NGINX) that is configured to strip incoming `X-Forwarded-For` headers from untrusted clients and append the verified TCP connection socket IP. On the application layer, the rate limiter must inspect only the trusted proxy IP, or use platform-specific trusted primitives like Next.js `request.ip` populated by the hosting provider's edge layer.

---

### Question 13: Which rate-limiting algorithm would you choose for a production API, and what is the boundary burst problem?
For a production API, the **Token Bucket** or **Sliding Window Counter** algorithm is the optimal choice.

The **boundary burst problem** is a severe flaw inherent in naive **Fixed Window** rate limiting. In a fixed-window system (e.g., allowing 100 requests per minute resetting at `:00` seconds of each minute), an attacker can exploit the boundary between windows:
- The attacker sends 100 requests at 00:59 (the end of window 1).
- The window resets at 01:00.
- The attacker sends another 100 requests at 01:01 (the start of window 2).

Although the fixed window counter reports that the user never exceeded 100 requests per clock minute, the server actually endured **200 requests within a 2-second span** across the window boundary. This burst can overwhelm backend database connections or exhaust thread pools.

A **Sliding Window Log** solves this by storing timestamps of every request, but it consumes prohibitive memory. A **Sliding Window Counter** approximates the sliding log with minimal memory: it computes a weighted sum of the current window's count and the previous window's count based on the current timestamp's percentage offset through the window. This smoothly amortizes bursts across boundaries while maintaining $O(1)$ memory overhead.

---

### Question 14: Why use a shared store for your counters rather than in-memory counters on each server?
In modern production environments, web applications are deployed as multiple horizontal instances (stateless containers, serverless functions, or multi-node clusters) behind a load balancer.

If rate-limiting counters are kept in local process memory (e.g., an in-memory `Map` or Node cache):
1. **The Capacity Multiplying Defect**: If an organisation runs 10 horizontal container instances, an attacker whose requests are distributed round-robin across the cluster can make **10 times the intended rate limit** before triggering a block on any single server instance.
2. **Serverless Ephemerality**: In serverless environments (AWS Lambda, Vercel Functions), container instances spin up and terminate dynamically. An in-memory counter is wiped every time a cold start occurs, effectively rendering rate limiting useless.

A **shared, distributed store** (such as Redis or dedicated PostgreSQL counter tables like FieldLog's `RateLimitCounter`) provides a single, atomic source of truth. Every server node queries and increments the identical key using atomic operations (`INCR` or `INSERT ... ON CONFLICT DO UPDATE`), ensuring that rate limits are globally enforced regardless of how many instances exist or how the load balancer distributes traffic.

---

### Question 15: What HTTP status code should a rate limiter return, and why is 403 the wrong choice?
A rate limiter should always return **`HTTP 429 Too Many Requests`**, accompanied by standard rate-limiting headers:
- `Retry-After: <seconds>` (telling the client exactly how long to wait before retrying).
- `RateLimit-Limit: <number>`
- `RateLimit-Remaining: 0`
- `RateLimit-Reset: <timestamp>`

**`HTTP 403 Forbidden` is fundamentally the wrong choice** because HTTP semantics define status codes based on their operational meaning:
- `403 Forbidden` indicates an **authorisation failure**: the server understood the request, but the client does not have permission to access the resource, and *re-authenticating or retrying will not change the outcome*. A 403 implies that the client should not attempt the request again.
- `429 Too Many Requests` indicates a **rate-based temporal condition**: the request itself is valid and permitted, but the rate of transmission has exceeded the server's policy threshold. Crucially, a 429 tells the client that the request *will succeed* if retried after the specified cooldown period indicated in the `Retry-After` header.

Using 403 breaks automated API clients, misleads developer debugging tools, and violates RFC 6585.

---

### Question 16: What do you do when your rate limit store is unavailable: fail open or fail closed? Answer for your own application specifically.
Whether to **fail open** (allow requests through if the rate limit store is down) or **fail closed** (reject all requests with an error) depends strictly on the application's core business model and security threat profile.

For **FieldLog**, the architectural decision is:
- **Registration and Authentication Routes (/api/auth/*) FAIL CLOSED**: If our database rate-limit store is down, we reject unauthenticated sign-up and sign-in attempts with `HTTP 503 Service Unavailable`. Allowing unauthenticated routes to fail open during an outage leaves the application completely vulnerable to automated credential-stuffing botnets and malicious database flooding, which could destroy database performance.
- **Field Data Capture and Sync Routes (/api/sync/*) FAIL OPEN**: FieldLog is an offline-first PWA for environmental remediation sites. Field supervisors capture vital site compliance photos, soil tests, and containment notes in remote areas. If the rate-limiting infrastructure experiences degraded connectivity, rejecting field sync operations violates our primary product charter: *never lose a captured field entry*. We allow sync operations from authenticated supervisor sessions to process, relying on backend transaction locks and client UUID idempotency to prevent duplication.

---

## Section 4: Machine Evidence & Scenario Analysis

### Question 17: You have two timing numbers for hashing from your own machine. Walk me through what they mean for an attacker who has stolen your user table.
From our empirical test on this machine (`evidence/08-timing-argon-vs-sha.txt`):
- **SHA-256 Duration**: **0.01515 ms** per hash (~66,000 hashes/sec on a single CPU core).
- **Adaptive Hashing (Argon2id) Duration**: **82.885 ms** per hash (~12 hashes/sec on a single CPU core).
- **Speed Ratio**: SHA-256 is **5,470 times faster** than adaptive hashing.

**What this means for an attacker who has stolen the database:**
Suppose the database table contains 10,000 users, and an adversary deploys an 8-GPU cracking cluster (capable of ~50 GH/s for SHA-256 vs ~200 kH/s for memory-hard Argon2id).
1. **If we used SHA-256**: The attacker targets an 8-character lowercase password keyspace ($26^8 \approx 208.8\text{ billion}$ combinations). At 50 billion SHA-256 hashes per second:
   $$\text{Crack Time} = \frac{208,827,064,576}{50,000,000,000} \approx 4.17\text{ seconds!}$$
   The attacker cracks the entire keyspace and unmasks the passwords of every user with an 8-character password in under 5 seconds.
2. **With our Adaptive Hashing (82.88ms work factor)**: The memory hardness ($m=64\text{MB}$) starves the GPUs of memory bandwidth, capping their cluster throughput at 200,000 hashes/sec:
   $$\text{Crack Time} = \frac{208,827,064,576}{200,000} \approx 1,044,135\text{ seconds} \approx 12.08\text{ days!}$$
   For a 10-character alphanumeric password ($95^{10} \approx 5.98 \times 10^{19}$ combinations), cracking requires over **9.4 million years**. The 82ms parameter completely transforms password theft from an immediate catastrophe into an insurmountable computational wall.

---

### Question 18: How does a breached password check avoid sending the password anywhere? Explain the mechanism in your own words, then say what the naive version would leak.
A secure breached password check (such as HaveIBeenPwned's Pwned Passwords API) uses the cryptographic principle of **$k$-Anonymity**.

**How the secure mechanism works:**
1. The client (or server) computes the SHA-1 hash of the candidate password locally. For example, the password `"password123"` produces the SHA-1 hash:
   `CBFDAC6008F9CAB4083784CBD1874F76618D2A97`.
2. The system splits the 40-character hex hash into two components:
   - A **5-character prefix**: `CBFDA`
   - A **35-character suffix**: `C6008F9CAB4083784CBD1874F76618D2A97`
3. The server sends **only the 5-character prefix** to the API: `GET https://api.pwnedpasswords.com/range/CBFDA`.
4. The API queries its database and returns a list of *every hash suffix in its breach corpus that begins with those 5 characters* (typically 500 to 1,000 matching suffixes), along with the count of times each appeared in breaches.
5. The local application inspects the returned list to see if its private 35-character suffix is present. If it matches, the password is confirmed breached.

**What the naive version would leak:**
A naive implementation would send the plaintext password (or the full hash) directly to an external API endpoint: `POST /check-password { password: "secret" }`. This is an egregious security failure: it transmits the user's raw password over the wire to an external third-party server, allowing an untrusted third party (or anyone inspecting transit traffic) to log, harvest, or intercept the exact plaintext password. Under $k$-Anonymity, the external service sees only a 5-character prefix shared by hundreds of unrelated passwords, making it mathematically impossible for the external service to deduce what password the user entered.

---

### Question 19: Wrong-Answer Analysis
**The candidate's statement:**
> *"I hash passwords with SHA-256 plus a random salt per user, which means even if the database is stolen the passwords cannot be reversed, because hashing is one way. I also rate limit login attempts by IP, so brute force is not possible."*

Every sentence contains a kernel of truth (salting stops rainbow tables; hashing is one-way; rate limiting slows online attacks). However, the candidate fundamentally misunderstands the **threat model** and makes severe security errors.

#### Flaws Ranked in Order of Severity:
1. **Critical Flaw 1: Misunderstanding the Threat Model (Offline vs. Online Attacks)**:
   The candidate claims that rate limiting login attempts by IP makes "brute force not possible." This conflates an **online attack** against a live web server with an **offline attack** against a stolen database dump. If an attacker breaches the database, they do not interact with the web server, the API, or the login endpoint. They run Hashcat locally on their own GPU rigs. The web server's IP rate limiting is completely irrelevant and provides zero protection against offline cracking.
2. **Critical Flaw 2: Using SHA-256 for Password Storage**:
   The candidate believes a random salt makes SHA-256 secure against offline cracking. While a salt defeats precomputed rainbow tables, it does nothing to slow down an active brute-force attack on a specific user's hash. Because SHA-256 is computationally trivial, an attacker can test billions of guesses against the salted hash every second. Salting a fast algorithm does not make it slow.
3. **High Flaw 3: Ineffective IP-Only Rate Limiting**:
   Even for online attacks, rate limiting solely by IP is trivially bypassed by modern attackers using distributed botnets, residential proxy rotation, or mobile CGNAT IP cycling.
4. **Moderate Flaw 4: Conflating "Irreversible" with "Uncrackable"**:
   Just because a function is mathematical one-way does not mean the input cannot be determined. Attackers do not "reverse" hashes; they guess candidate passwords, hash them, and compare digests. If the algorithm is fast, guessing is cheap and the password is recovered.

