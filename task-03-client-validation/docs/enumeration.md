# Anti-Enumeration Analysis: Field Secrecy & UX Trade-offs

## 1. Sensitive Field Identification
In FieldLog, two sensitive fields were hardened against enumeration attacks:
1. **The 6-Digit Email Verification Code (`EmailToken.token`, FR-62)**:
   A single-use numeric code sent during registration and password reset.
2. **The Password / Credential Validation Error State**:
   The response returned upon authentication failure.

### Why the Shape is Sensitive:
When forms reveal the exact structural shape of sensitive credentials—such as placing a placeholder like `•••••• (6 digits)` or revealing that a verification code is strictly numeric—it drastically collapses the search space for brute-force attacks. 

Similarly, revealing specific feedback on login failures (e.g. *"Account does not exist"* vs. *"Incorrect password"*) tells an adversary whether a targeted corporate email exists in the system.

---

## 2. What an Attacker Gains from Knowing the Shape
If the shape and verification rules are exposed:
1. **Search Space Reduction**:
   Knowing that a token is exactly 6 digits reduces the keyspace from an alphanumeric space of $62^6 \approx 5.6 \times 10^{10}$ possibilities down to exactly $10^6 = 1,000,000$ combinations. If rate limits are improperly configured or distributed over multiple IPs, an attacker can brute-force 1,000,000 requests in minutes.
2. **Account Enumeration**:
   Differentiated login error messages allow malicious actors to script a dictionary of corporate email addresses (e.g. scraping LinkedIn for environmental engineers at a target remediation firm) to verify who has an active FieldLog account. This list is subsequently weaponized for targeted phishing, SIM swapping, and spear-phishing attacks.
3. **Password Pattern Profiling**:
   Exposing rigid, mandatory symbol requirements (e.g. *"Must contain 1 uppercase, 1 number, 1 special character"*) telegraphs the predictable human substitution patterns (e.g. capitalizing the first letter and putting `!` at the end: `Remediation2026!`), accelerating hash cracking by orders of magnitude.

---

## 3. The Trade-off Accepted and Defense of the Cost
By removing placeholder hints and enforcing uniform error messaging (*"Incorrect email or password. Please verify your credentials."*), we deliberately introduced friction for legitimate users:

* **How much harder it is for legitimate users**:
  A legitimate user who mistypes their email address by one letter cannot tell whether they got their password wrong or mistyped their username. They may spend time trying multiple password variations before realizing the email had a typo.
* **Is it worth it? Defending the decision**:
  Yes, without hesitation. In environmental remediation and civil engineering, site reports document contractual disputes, toxic contamination liability, and million-pound remediation claims. Allowing attackers to enumerate supervisor accounts and launch targeted credential stuffing creates catastrophic corporate liability. Uniform error responses and minimal shape hints are foundational defenses mandated by OWASP ASVS Section 2.1 and NIST SP 800-63B.
