# Validation Rules: Derivation, Business Rationale & Costs

## Principles of Validation Design
Every validation rule is a trade-off between data integrity and user exclusion. Claiming a rule has zero cost to legitimate users is a failure of software design. Every constraint blocks someone. In FieldLog, we explicitly derived each rule, documented the operational failure it prevents, and acknowledged the legitimate user cohort it inadvertently harms.

---

## The Four Validation Categories

### Category 1: Empty Required Fields
- **The Rule**: If a user tabs into any required field (`fullName`, `orgName`, `email`, `password`, `seats`) and blurs without inputting data, an inline error with caution icon (`⚠️`) appears immediately.
- **What goes wrong without it**: Users complete partial forms, click submit, and are confronted with an overwhelming wall of red error messages at the end, resulting in high cognitive fatigue and drop-off.
- **Who it wrongly blocks / harms**: Users who navigate forms out of order (e.g. pasting an email from a clipboard before typing their name) receive an anxiety-inducing error state before they have even finished reading the form.

---

### Category 2: Length and Structure Rules

#### Rule 1: Full Name Structure (Minimum 2 Characters & At Least Two Words)
- **The Rule**: Full name must be >= 2 characters and contain at least two whitespace-separated tokens (`split(/\s+/).length >= 2`).
- **What goes wrong without it**: Automated bots and careless users enter single tokens ("a", "test", "admin"). When FieldLog generates official Daily Site Reports (PRD 1, P12) submitted to environmental regulators (e.g. UK Environment Agency) or client audit teams, single-name signatures invalidate the legal defensibility of the site report.
- **What legitimate user it wrongly blocks**: **Mononymous individuals**. Millions of people globally, notably in Indonesia, parts of Nigeria (e.g. Northern traditional communities), and Myanmar, have only one single legal name. Under this rule, a supervisor named *"Suharto"* or *"Balarabe"* cannot register without entering an artificial duplicate ("Suharto Suharto") or a dummy initial, which degrades the legal integrity of the record.

#### Rule 2: Organisation Name Length (Minimum 3 Characters)
- **The Rule**: Organisation name must be at least 3 non-whitespace characters long.
- **What goes wrong without it**: Single-letter or two-letter placeholders ("X", "OK") populate the database, causing confusion in multi-tenant management and rendering illegible branding on exported PDF report headers (FR-42).
- **What legitimate user it wrongly blocks**: Legitimate corporate entities with two-letter legal names or famous joint ventures (e.g. *"BP"*, *"HP"*, *"EY"*, or local environmental survey partnerships like *"GE"*). They are forced to append unnecessary descriptors (e.g. *"BP UK"*).

#### Rule 3: Password Length (Minimum 10 Characters, No Arbitrary Symbol Complexity)
- **The Rule**: Passwords must contain a minimum of 10 characters. Character complexity (forcing uppercase, lowercase, numbers, and symbols) is deliberately omitted.
- **What goes wrong without it**: Short passwords (e.g. 6 to 8 characters) are vulnerable to offline brute-force cracking and credential stuffing attacks from breached environmental industry databases.
- **What legitimate user it wrongly blocks**: Supervisors on rugged field tablets typing on virtual keyboards with thick gloves or dirty hands. Typing 10 characters without sight of keyboard feedback increases input errors and lockout risk.

#### Rule 4: Supervisor Seats Allocation (Integer Between 1 and 500)
- **The Rule**: Seats must be a positive integer between 1 and 500.
- **What goes wrong without it**: Negative numbers break billing algorithms; zero causes division-by-zero crashes in utilization reporting; numbers above 500 exceed single-tier automated Flutterwave payment limits (FR-63).
- **What legitimate user it wrongly blocks**: Enterprise civil engineering conglomerates operating nationwide remediation frameworks with 800+ field supervisors across multiple regions. They cannot self-serve and must be handled via custom manual database provisioning.

---

### Category 3: Format in Real Time (Registration vs. Login Divergence)

#### Registration Real-Time Enforcement:
- **Implementation**: The email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) is evaluated on every keystroke (`onChange`).
- **Rationale**: Friction is appropriate during initial onboarding. Catching a typo (e.g. `user@remediation` missing `.co.uk`) while the user is looking at the field prevents them from submitting a corrupted address and never receiving the 6-digit verification code (FR-62).

#### Login Submit-Only Enforcement:
- **Implementation**: Email format is evaluated only when the user clicks *"Sign In"* (`onSubmit`).
- **Rationale**: Returning supervisors know their email address. Screaming red error banners while they are halfway through typing their address creates irritation and user hostility.

#### Why Checking Email Existence is Pointless Even if Possible:
Pinging a mail server (via SMTP `RCPT TO` or DNS MX lookups) to verify if an email exists is completely useless because modern mail servers deliberately accept all incoming recipient probes (catch-all or silent drop) to prevent directory harvest attacks. Furthermore, verifying that a mailbox exists tells you nothing about whether the person sitting at the keyboard owns it or has access to it; ownership can only ever be established by dispatching a cryptographically random, time-limited verification code (FR-62).
