# Breached Password Verification: k-Anonymity Mathematical Mechanism

## 1. How the Breached Password Check Works (k-Anonymity Model)
FieldLog integrates a compromised credential verification check during registration in compliance with NIST SP 800-63B guidelines. Crucially, this check does **not** transmit the user's password or its full hash to any external server.

### The Exact 4-Step Mechanism:
1. **Local SHA-1 Hashing**:
   When the user submits a password (e.g. `"password123"`), the server computes its 40-character hexadecimal SHA-1 hash locally:
   $$\text{SHA-1}(\text{"password123"}) = \text{CBFDAC6008F9CAB4083784CBD1874F76618D2A97}$$
2. **Prefix Extraction (k-Anonymity Slice)**:
   The server splits the 40-character hash into two parts:
   - **Prefix (First 5 characters)**: `CBFDA`
   - **Suffix (Remaining 35 characters)**: `C6008F9CAB4083784CBD1874F76618D2A97`
3. **Range Query to HaveIBeenPwned API**:
   The server transmits *only the 5-character prefix* over HTTPS:
   `GET https://api.pwnedpasswords.com/range/CBFDA`
4. **Local Suffix Matching**:
   The API responds with a list of several hundred 35-character suffixes matching that 5-character prefix, along with their compromise counts. The FieldLog server searches this returned list locally in memory for `C6008F9CAB4083784CBD1874F76618D2A97`. If a match is found (in this case, 182,492 times), the server immediately rejects the registration with HTTP 400 Bad Request.

---

## 2. Why the Naive Version Would Be an Unacceptable Disaster

The naive version of a breach check would involve sending the user's plaintext password or full hash directly to an external API (e.g. `POST /api/check-password { "password": "..." }`).

**Why this is completely unacceptable and disqualifying**:
1. **Third-Party Credential Exfiltration**: Sending a customer's prospective password to a third-party service gives that external service unencrypted access to your users' credentials. If that service is breached, logging queries, or intercepted in transit, your users' passwords are stolen at the moment of registration.
2. **Regulatory & GDPR Violations**: Transmitting user passwords to external third parties without cryptographic anonymization violates Article 32 of UK GDPR and NDPR data protection regulations.
3. **The Beauty of k-Anonymity**: Under the 5-character prefix model, millions of completely different passwords share the same 5-character hash prefix ($16^5 = 1,048,576$ buckets across billions of passwords). The external API provider learns nothing about which specific password the user typed.
