# Cryptographic Password Hashing: Why Slow is Correct

## 1. Hashing the Same Password Twice
When hashing the plaintext `"RemediationSiteSupervisor2026!"` twice using our adaptive algorithm:

- **Output 1**: `$scrypt$ln=14,r=8,p=1$U2Y33cEJTH4+V8hItpUT6A==$EYpGaAJVSa98ra5u2MH3Bjrk7w5IErpHPZHoMMfa39yE18sYpVhxOH22uV2bjGR4jDAD/Xnqy9KnuskHzKh3Pw==`
- **Output 2**: `$scrypt$ln=14,r=8,p=1$fz/W9NVzYEbcWimdKD2pXw==$rsy+lgpCfHkFZdzX8qeLEsSdTHQrOuzpL5b2jfa/VzlV534lOMgdVdlxvgeSzu+3O+ZVIlxnu7jo7/DssPWy4w==`

**Explanation in One Line**:
Each invocation generates a cryptographically fresh, unique 16-byte random salt, producing completely different ciphertext even when hashing identical plaintext.

---

## 2. Empirical Benchmark Timings on This Hardware
Benchmarked on host machine (Intel Core i7, 100 iterations per algorithm):

- **SHA-256 Average Duration**: `0.01515 ms` (Single-core throughput: `65,994` hashes/sec)
- **Adaptive Hashing (scrypt/bcrypt) Duration**: `82.88500 ms` (Single-core throughput: `12` hashes/sec)

**Hardware Speedup Ratio**:
$$\text{Ratio} = \frac{82.885\text{ ms}}{0.01515\text{ ms}} = 5,470\times$$
SHA-256 is **5,470 times faster** to compute on this processor than our adaptive password algorithm.

---

## 3. The Attack Arithmetic on Cracking Clusters

Consider an adversary who has exfiltrated the `User` table and sets up an 8-GPU offline cracking cluster (e.g. 8x NVIDIA RTX 4090):
- **Adversary SHA-256 Cluster Hashrate**: $\approx 50,000,000,000$ hashes/sec ($50\text{ GH/s}$).
- **Adversary scrypt/bcrypt Cluster Hashrate**: $\approx 200,000$ hashes/sec ($200\text{ kH/s}$) due to high memory bandwidth requirements.

### Target: Brute-forcing an 8-character lowercase password:
- Keyspace: $26^8 = 208,827,064,576$ combinations ($\approx 208.8\text{ billion}$).

#### Arithmetic for Fast Algorithm (SHA-256):
$$\text{Time} = \frac{208,827,064,576}{50,000,000,000\text{ hashes/sec}} = 4.17\text{ seconds!}$$
*Result*: The attacker cracks **every 8-character password in the entire database in under 5 seconds!*

#### Arithmetic for Adaptive Algorithm (scrypt / bcrypt):
$$\text{Time} = \frac{208,827,064,576}{200,000\text{ hashes/sec}} = 1,044,135\text{ seconds} = 12.08\text{ DAYS!}$$
For a standard 10-character password ($95^{10} \approx 5.98 \times 10^{19}$ combinations), cracking requires over **9.4 million years**.

---

## 4. The Core Inversion

> **The Inversion**:
> As an application, you execute the hash function exactly **once** per legitimate user login; spending 82 milliseconds costs your user nothing measurable and introduces zero perceptible friction. An attacker attempting offline brute-force must compute the hash function **billions of times**, so intentionally slowing the algorithm down costs the application nothing and costs the attacker everything.

---

## 5. Salting: Purpose, Automation, and Skipping Consequences

- **What Salting Does**: A salt is a cryptographically random byte sequence appended to the plaintext password before hashing. It ensures that two users with identical passwords have completely different hashes, and prevents precomputed dictionary attacks.
- **Does Our Algorithm Handle It?**: Yes. Adaptive algorithms (bcrypt, Argon2id, scrypt) automatically generate a fresh 16-byte random salt per hash and embed the salt parameters directly into the modular crypt format string.
- **What an Attacker Could Do If You Skipped It**: If salting is omitted, an attacker uses precomputed **Rainbow Tables** (multi-terabyte lookup tables of pre-hashed passwords) to instantly reverse stolen password hashes in constant time ($O(1)$ lookup), rendering brute-force cracking completely unnecessary.
