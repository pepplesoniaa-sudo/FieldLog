# Rate Limiting Architecture: Thresholds, Evasion & Shared Networks

## 1. Configured Thresholds and Justifications
FieldLog enforces the rate limits specified in PRD Section 7.7:

| Flow / Endpoint | Threshold | Window | Justification |
| :--- | :--- | :--- | :--- |
| **Registration (`/api/auth/register`)** | 5 requests | 1 Hour / IP | Prevents automated spam account creation and database bloat while permitting multiple genuine signups from a field office. |
| **Sign-In (`/api/auth/sign-in`)** | 10 attempts | 15 Minutes / Account & IP | Blocks automated credential stuffing attacks and password spraying while allowing legitimate users to mistype credentials a few times before lockout (FR-07). |
| **Password Reset (`/api/auth/reset`)** | 3 requests | 1 Hour / Email | Thwarts email inbox bombing and code harvesting while allowing retries if an initial reset email is delayed. |
| **Mobile Sync (`/api/sync`)** | 120 requests| 1 Minute / User | Accommodates rapid multi-photo background synchronization when a supervisor returns to cellular coverage (FR-22). |

---

## 2. Why IP-Address Alone is Insufficient

Relying exclusively on client IP addresses for rate limiting is fundamentally flawed:
1. **Adversary IP Rotation**: Attackers deploy residential proxy networks, VPN services, or botnets (such as Mirai) to rotate across thousands of unique IP addresses per minute, completely bypassing IP-only limiters as demonstrated in Step 8 (`evidence/14-rate-limit-defeated.txt`).
2. **IPv6 Prefix Cycling**: An attacker with an IPv6 allocation can generate billions of distinct `/128` IP addresses within a single `/64` subnet without paying for proxy services.

---

## 3. What Serious Applications Key On (Compound Keying)
To achieve true abuse deterrence, modern platforms implement compound rate limiting keys:
1. **Target Account Identifier (Email / Username)**: Rate limiting by `email` prevents distributed credential stuffing attacks where an adversary tries passwords against a single target user from 10,000 different proxy IPs.
2. **Session / Refresh Token**: For authenticated endpoints, keying on cryptographic session tokens tracks abuse regardless of network switching.
3. **Device / Client Hardware Fingerprinting**: Combining TLS client hello fingerprints (JA3/JA4), canvas hashes, and client-generated UUIDs stored in secure local storage.

---

## 4. Counter Storage Architecture and Trade-offs
- **Current Development Implementation**: In-memory Map store (`Map<string, RateLimitRecord>`).
  - *Trade-off*: Zero external dependencies, ultra-fast (sub-microsecond memory lookups), but state is local to a single Node process and resets on application restart.
- **Production Architecture**: Distributed in-memory Redis cluster with sliding window logs.
  - *Trade-off*: Requires maintaining a Redis infrastructure tier with network latency overhead (~1ms per check), but synchronizes rate limits across all distributed serverless/container instances.

---

## 5. The Shared Connection Problem (Corporate Offices & University Campuses)
When hundreds of users share a single corporate NAT gateway or university campus IP:
- **The Failure Mode**: A strict IP rate limit (e.g. 5 signups/hour/IP) means that after 5 employees at an environmental engineering firm create their accounts, the 6th legitimate employee on that office Wi-Fi is locked out with HTTP 429 Too Many Requests!
- **Mitigation**:
  1. Rely on compound keys: when IP threshold is approached, switch to requiring CAPTCHA verification or email verification rather than hard blocking.
  2. Implement corporate IP whitelisting for verified enterprise client IP ranges.
