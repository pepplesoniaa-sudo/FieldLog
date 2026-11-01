# Security Controls Considered and Not Implemented (Omissions & Justifications)

## Overview & Philosophy
Security engineering is the discipline of managing risk within operational constraints, not blindly accumulating defensive controls from a compliance checklist. Every defensive mechanism introduces measurable costs: latency, implementation complexity, failure surface, maintenance overhead, and user friction.

For **FieldLog**—an offline-first Progressive Web App designed for environmental remediation and restoration field supervisors working in remote, low-bandwidth environments (marshes, pipeline easements, remote containment zones)—controls that assume high-speed always-on internet connectivity, desktop hardware, or corporate office environments create severe operational failure modes.

Below are four major security controls that were actively evaluated, deliberately rejected for this phase, and documented with the explicit conditions that would warrant their future introduction.

---

## 1. Multi-Factor Authentication (MFA / TOTP) on Routine Field Login

### What it is
Multi-Factor Authentication (MFA) requires users to provide two or more verification factors before granting a valid session: typically a knowledge factor (password) combined with a possession factor (Time-based One-Time Password via Google Authenticator, SMS OTP, or hardware security key).

### Why it was omitted at this stage
1. **The Remote Field Connectivity Constraint**: Field supervisors operate in locations with degraded cellular signals (Edge/2G) or zero connectivity. SMS delivery in remote areas is notoriously delayed or completely dropped. While TOTP authenticator apps function offline, mobile clock drift on ruggedized Android devices operating disconnected for days desynchronizes TOTP time-step windows (30-second intervals), causing legitimate workers to be locked out of the app when attempting to sign in on site.
2. **PRD Alignment**: The canonical FieldLog specification (PRD 3.2) explicitly categorizes Multi-Factor Authentication as **Won't in V1**.
3. **Compensating Controls**: We enforce strict adaptive hashing (Argon2id/scrypt), a 10-failed-login lockout policy within 15 minutes (PRD 7.7, FR-07), breached password checks via k-Anonymity (FR-61), and persistent database-backed session tokens that survive intermittent offline transitions without forcing daily credential re-entry.

### What would have to change to implement it
1. **Desktop/Reviewer Tiering**: If enterprise clients mandate MFA under SOC 2 Type II or ISO 27001 audit standards, we will enforce MFA exclusively on the desktop browser role (**Organisation Admin** and **Reviewer**), while maintaining single-factor biometric/passkey sessions for field supervisors.
2. **WebAuthn / FIDO2 Passkeys**: Implementing local biometric device binding (fingerprint / face unlock via WebAuthn) that caches public keys in hardware without relying on real-time SMS or third-party TOTP apps.

---

## 2. Client Device Fingerprinting (Canvas & WebGL Profiling)

### What it is
Client device fingerprinting involves executing JavaScript in the client browser to collect hardware and environmental attributes—such as canvas rendering quirks, WebGL vendor strings, installed system fonts, audio buffer latency, screen color depth, and CPU core counts—generating a pseudonymous device identifier used to detect anomalous logins or automate bot detection.

### Why it was omitted at this stage
1. **Extreme False-Positive Rate on Field Hardware**: Remediation field teams frequently rotate between shared ruggedized field tablets (Panasonic Toughbooks, Samsung Active tablets), personal phones, and trailer desktop workstations. Canvas and WebGL rendering outputs vary widely across mobile OS updates, low-power battery-saver modes, and ruggedized display drivers.
2. **Browser Privacy Mitigations**: Modern privacy-preserving browsers (Safari ITP, Firefox, and Chromium privacy features) actively randomize canvas noise and spoof WebGL strings, rendering deterministic fingerprinting fragile and prone to false security alerts.
3. **Codebase Overhead and Latency**: Third-party fingerprinting scripts add 40–100 KB of minified JavaScript, conflicting directly with FieldLog's performance budget (NFR-03: 170 KB gzipped JavaScript limit on capture screens).

### What would have to change to implement it
1. **Enterprise MDM Integration**: If clients issue dedicated corporate devices managed via Mobile Device Management (MDM) software (such as Microsoft Intune or Jamf), we would replace probabilistic browser fingerprinting with cryptographic client certificate authentication (Mutual TLS / mTLS) embedded at the OS level.

---

## 3. Third-Party IP Reputation & Automated CAPTCHA Services (e.g. Cloudflare Turnstile, reCAPTCHA Enterprise)

### What it is
Integrating external anti-bot scoring services that inspect incoming HTTP requests, evaluate client IP reputation against global threat feeds, and challenge suspicious requests with interactive puzzles or invisible cryptographic browser proofs before allowing registration or login.

### Why it was omitted at this stage
1. **African Mobile Carrier Network Topology (CGNAT)**: In regions where environmental remediation sites operate (e.g., the Niger Delta and West African industrial corridors), major cellular providers (MTN, Airtel, Glo) route hundreds of thousands of mobile subscribers through small pools of Carrier-Grade NAT (CGNAT) gateway IP addresses. Third-party IP reputation databases routinely score these shared gateway IPs as "high-risk proxies" or "spammers," triggering aggressive CAPTCHA challenges that fail to load on poor bandwidth.
2. **Offline-First Resilience**: An external CAPTCHA provider introduces a hard third-party runtime dependency in the critical authentication path. If Cloudflare or Google APIs experience latency or regional routing blocks, field workers cannot access their tools.
3. **Compensating Controls**: We enforce deterministic, database-backed rate limiting per IP and per account (PRD 7.7: max 5 sign-ups/hr/IP, max 10 sign-ins/15min/account) directly in PostgreSQL via `RateLimitCounter`, accompanied by cryptographic email verification codes.

### What would have to change to implement it
1. **Sustained Distributed Credential Stuffing**: If FieldLog experiences a large-scale, distributed botnet attack that rotates across tens of thousands of residential proxy IPs—bypassing our IP-level rate limits—we would deploy an unobtrusive, zero-dependency cryptographic Proof-of-Work (PoW) puzzle computed in a background Web Worker prior to form submission.

---

## 4. End-to-End Field Photo Encryption at Rest (Client-Side Public Key Cryptography)

### What it is
Encrypting all captured environmental evidence photos on the mobile device using an organisation's public key before writing to IndexedDB or uploading to private S3 object storage, ensuring that only users with the private key can decrypt and view site photographs.

### Why it was omitted at this stage
1. **Computational & Battery Penalty on Low-End Devices**: Encrypting up to ten high-resolution site photos (up to 25 MB input, compressed to 1,600 px JPEG, ~450 KB each) using client-side AES-GCM or RSA-OAEP drains mobile battery life and severely violates our performance requirement: saving an entry within 2 seconds at p95 (G3, NFR-01).
2. **Server-Side Integrity & AI Pipeline Incompatibility**: FieldLog's core architecture requires the server to verify photo file integrity by recomputing SHA-256 checksums on the compressed binary (P10) and, when enabled by organisation admins, generating automated site report summaries via regional Vertex AI (FR-58). Client-side opaque ciphertext prevents server-side integrity validation, PDF export rendering (@react-pdf/renderer), and thumbnail generation.
3. **Compensating Controls**: Photos are encrypted at rest on AWS S3 / Cloud Storage using AES-256 server-side encryption (SSE-S3/KMS), stored in private, unlisted buckets, and accessed exclusively via short-lived (15-minute) presigned URLs generated after strict session and organisation-tenant authorization checks.

### What would have to change to implement it
1. **Zero-Trust Defence Mandate**: If an enterprise client in defense or nuclear remediation requires zero-knowledge infrastructure where cloud hosting providers cannot access site photos under any legal subpoena, we would implement envelope encryption with hardware-backed WebCrypto modules and offload PDF report rendering entirely to client devices.

