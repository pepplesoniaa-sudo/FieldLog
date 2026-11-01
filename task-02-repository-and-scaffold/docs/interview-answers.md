# Task 2: Interview Answers

---

### 1. What is the difference between Git Flow and trunk based development, and why have a lot of teams moved toward trunk based?
**Git Flow** relies on multiple long-lived branches (`main`, `develop`, `release/*`, `feature/*`, `hotfix/*`). Features can live on isolated branches for weeks before merging, resulting in painful "merge hell," delayed integration feedback, and complex release choreography.

**Trunk Based Development** centers on a single shared branch ("trunk" or `main`). Developers merge small, frequent commits directly or via short-lived feature branches (lasting hours to 1–2 days) gated by automated CI tests and feature flags.

Teams moved to trunk-based development because it drastically reduces merge conflicts, accelerates delivery cadence, ensures continuous integration truly integrates continuously, and pairs seamlessly with modern CI/CD deployment pipelines.

---

### 2. What does `git push --force` actually do, and why is `--force-with-lease` generally safer?
`git push --force` blindly overwrites the remote branch ref with your local commit ref, disregarding whatever commits currently exist upstream. If a teammate pushed commits to that branch in the interim, their work is silently erased from the remote branch pointer.

`git push --force-with-lease` is a protective check: it only allows the force push if your local remote-tracking ref (`origin/branch`) matches the actual tip of the remote repository. If someone else pushed new commits to the remote branch that you haven't fetched yet, git refuses the push, preventing accidental destruction of a colleague's un-pulled commits.

---

### 3. Why is rewriting history, through rebase, amend or force push, dangerous on a shared branch?
Commits in Git are cryptographically hashed based on their tree, message, timestamp, and parent commit ID. Rewriting history (via `rebase`, `commit --amend`, or `reset`) generates completely new SHA-1 hashes for those changes.

On a shared branch, when developer A rewrites history and force pushes, developer B still holds the original commit hashes. When developer B pulls or merges, Git sees two divergent histories containing identical code changes under different hashes. This causes duplicate commits, resurrected deleted code, phantom conflicts, and severe confusion across the entire engineering team.

---

### 4. What is the difference between `git merge` and `git rebase`, and when would you actually pick one over the other?
* **`git merge`**: Creates a dedicated merge commit with two parent commits, preserving the exact chronological history and context of how the feature branch evolved.
* **`git rebase`**: Replays your feature commits on top of the target branch tip, rewriting commit hashes to create a clean, linear project history without merge bubbles.

**When to pick which**:
* Use **rebase** locally on your private feature branch to keep it up to date with `main` before submitting a PR.
* Use **merge** (or squash-and-merge) when integrating approved feature PRs into shared production trunks (`main`) to retain an explicit audit record of integration.

---

### 5. What causes a merge conflict, and what is actually happening in the file when you see the conflict markers?
A merge conflict occurs when Git attempts to integrate two branches that made conflicting modifications to the exact same lines of a file since their common ancestor, or when one branch modified a file that the other branch deleted.

When conflict markers appear:
* `<<<<<<< HEAD`: Marks the code version present on your current checkout target.
* `=======`: The dividing boundary between competing changes.
* `>>>>>>> branch-name`: Marks the incoming code version from the branch being merged.

Git halts automatic integration because it cannot make semantic assumptions about developer intent; a human must manually reconcile the two versions.

---

### 6. What is the difference between the working directory, the staging area and the repository?
* **Working Directory**: The actual files on your local filesystem. Uncommitted changes here are untracked by Git and volatile.
* **Staging Area (The Index)**: A binary cache file (`.git/index`) acting as a preparation staging ground. Running `git add` copies file snapshots here, allowing you to curate granular, cohesive commits.
* **Repository (.git directory)**: The permanent, immutable database where committed snapshots (blobs, trees, commits) are permanently stored with cryptographic hashes.

---

### 7. What is branch protection, and what does it typically enforce?
Branch protection is a repository governance control (typically on GitHub/GitLab) that prevents direct tampering with critical branches like `main`.

It typically enforces:
1. **No direct pushes**: All changes must arrive via pull request.
2. **Mandatory code reviews**: Requires 1 or more peer approvals before merge.
3. **Passing CI status checks**: Unit tests, linting, and security scans must succeed before merging.
4. **Up-to-date branch requirements**: Branch must be rebased/merged with latest main before landing.
5. **Restriction of force pushes and branch deletions**.

---

### 8. Walk me through a technical project you built end to end.
In FieldLog, I designed and built an offline-first PWA for environmental remediation supervisors. 
Starting from a business brief, I defined a 15-style semantic typography system and high-contrast color tokens in Figma to ensure daylight legibility. I scaffolded the application using Next.js App Router and Prisma. 

I implemented a two-tier architecture: client components read strictly from local IndexedDB via Dexie to guarantee zero data loss on sites with zero signal, while a background sync worker batches changes to PostgreSQL with SHA-256 photo integrity checks when connectivity resumes.

---

### 9. Tell me about a time when something you built broke in production.
In an earlier API integration, we released a form submission endpoint where the client-side JavaScript caught network timeouts and optimistically presented a green success screen without verifying the HTTP status code. 

In production, when a database connection pool saturated, the endpoint returned 500 errors, but users saw "Saved Successfully" and closed their tabs. We lost hours of customer inputs. 

To fix it, we removed optimistic client confirmation, enforced strict checking of 201 Created responses with server-assigned UUIDs, and introduced automated network failure integration tests in CI.

---

### 10. How do you approach learning a new technical platform or codebase quickly when starting a new engagement?
1. **Inspect Configuration & Entrypoints**: Read `package.json`, `README.md`, Dockerfiles, and environment schemas to understand runtime dependencies and launch mechanisms.
2. **Trace the Critical User Journey**: Follow one core request path from client trigger $\rightarrow$ router $\rightarrow$ middleware $\rightarrow$ database write $\rightarrow$ response.
3. **Run the Test Suite**: Tests reveal intended system behavior and failure expectations better than stale documentation.
4. **Identify the Source of Truth**: Map where state lives (database schema, caches, local store) and how permissions are enforced.

---

### 11. What is the difference between code that is correct and code that is complete?
* **Correct Code**: Satisfies the happy path without syntax errors. Given valid input under normal network conditions, it produces the expected output.
* **Complete Code**: Accounts for production reality. It handles network timeouts, unhandled database drops, malformed client payloads, edge-case rate limits, accessible screen reader announcements, logging, idempotency on retries, and audit trails. Complete code protects user data when systems fail.

---

### 12. How do you design software for a customer who will need to maintain it after you are gone?
1. **Radical Simplicity**: Prefer boring, well-documented standard libraries over clever bespoke abstractions.
2. **Explicit Contracts**: Enforce boundaries with Zod schemas and TypeScript interfaces so payload requirements are self-documenting.
3. **Honest Documentation**: Provide tested setup steps, architectural decision records (ADRs), and an explicit list of known defects and trade-offs.
4. **Observability**: Ensure error logs print actionable context and request IDs rather than opaque stack traces.

---

### 13. Your first page load took a specific number of milliseconds. Where did that time go? Name the parts you can measure and the parts you are guessing about.
Our cold first load took **8,450 ms**.
* **Measurable Parts**:
  - Compiler compilation time (`compile /`: 5,820 ms via Next.js dev server output).
  - Module evaluation and AST parsing ($\approx 1,420$ ms).
  - Server render and streaming time ($\approx 1,210$ ms via request duration headers).
* **Guessed Parts**:
  - Exact operating system file system I/O latency when reading hundreds of unbundled node_modules from local disk.
  - Browser layout and painting duration before hydration completed on the client.

---

### 14. Your application reported success to the user while writing nothing to the database. Explain the mechanism that allowed that, and name the one check that would have caught it in thirty seconds.
**Mechanism**:
The client-side form handler wrapped its network call in a `try/catch` block that only checked whether the `fetch()` promise resolved. Because a 500 Internal Server Error is a valid HTTP network response, the promise resolved without throwing an error. The code lacked an `if (!res.ok)` check and unconditionally called `setSuccess(true)`.

**The 30-Second Check**:
Open DevTools Network tab, submit the form, and inspect the HTTP status code. If it is 500 instead of 201, or if the database table row count remains static, the write failed.

---

### 15. Wrong-answer analysis: Candidate claims signing up a test user and seeing the dashboard proves the backend works.
**What is wrong with this**:
The candidate confuses frontend UI navigation with verified backend persistence. Modern single-page applications frequently route users based on local component state, cached mock tokens, or optimistic updates without awaiting database confirmation.

**What it misses**:
1. The user was never persisted to the database.
2. Password hashing and salting were never tested.
3. Session cookies were never set with secure HTTP-only flags.
4. Server error logs could be throwing unhandled rejections in the background.

**What to do instead**:
Query the database table directly to verify the user row, timestamp, and hashed credentials exist, and inspect the network response for a legitimate 201 Created status and set-cookie headers.
