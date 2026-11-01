import crypto from 'crypto';

const password = 'RemediationSiteSupervisor2026!';

// 1. Hash the same password twice with adaptive salt
function hashAdaptive(pwd) {
  const salt = crypto.randomBytes(16);
  // scrypt / bcrypt work factor parameters (N=16384, r=8, p=1)
  const derivedKey = crypto.scryptSync(pwd, salt, 64, { N: 16384, r: 8, p: 1 });
  return `$scrypt$ln=14,r=8,p=1$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
}

const hash1 = hashAdaptive(password);
const hash2 = hashAdaptive(password);

console.log('=== STEP 4.1: HASH TWICE WITH SAME PASSWORD ===');
console.log('Password:', password);
console.log('Output 1:', hash1);
console.log('Output 2:', hash2);
console.log('Outputs identical?', hash1 === hash2);
console.log('Explanation: Each invocation generates a cryptographically fresh 16-byte random salt, producing completely different ciphertext even for identical plaintext.\n');

// 2. Benchmark Adaptive (scrypt/bcrypt equivalent) vs SHA-256
console.log('=== STEP 4.2: BENCHMARK TIMING ON THIS MACHINE ===');
const ITERATIONS = 100;

// Benchmark SHA-256
const shaStart = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  crypto.createHash('sha256').update(password).digest('hex');
}
const shaEnd = performance.now();
const shaAvgMs = (shaEnd - shaStart) / ITERATIONS;
const shaGuessesPerSec = Math.round(1000 / shaAvgMs);

// Benchmark Adaptive (scrypt: N=16384, r=8, p=1)
const salt = crypto.randomBytes(16);
const adaptiveStart = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
}
const adaptiveEnd = performance.now();
const adaptiveAvgMs = (adaptiveEnd - adaptiveStart) / ITERATIONS;
const adaptiveGuessesPerSec = Math.round(1000 / adaptiveAvgMs);

console.log(`SHA-256 Average Duration: ${shaAvgMs.toFixed(5)} ms per hash`);
console.log(`SHA-256 Single-Core Throughput: ${shaGuessesPerSec.toLocaleString()} hashes/sec`);
console.log(`Adaptive (scrypt/bcrypt) Average Duration: ${adaptiveAvgMs.toFixed(3)} ms per hash`);
console.log(`Adaptive Single-Core Throughput: ${adaptiveGuessesPerSec.toLocaleString()} hashes/sec\n`);

// 3. Attack Hardware Arithmetic
console.log('=== STEP 4.3: ATTACK ARITHMETIC ===');
const speedupFactor = Math.round(adaptiveAvgMs / shaAvgMs);
console.log(`Ratio: SHA-256 is ${speedupFactor.toLocaleString()}x faster than adaptive hashing on this CPU.`);
console.log(`On an 8-GPU cracking cluster (e.g., RTX 4090 executing ~50 billion SHA-256/sec vs ~200,000 scrypt/sec):`);
console.log(`- Time to crack an 8-character lowercase password (208 billion combinations) at 50 GH/s: ~4.16 seconds.`);
console.log(`- Time to crack the same password against adaptive hashing at 200 kH/s: ~12.04 days.`);
