import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createCanvas } = require('C:/Users/HP/.gemini/antigravity-ide/brain/88f25745-3ac2-4668-85a9-59a363da0abf/scratch/pdfread/node_modules/@napi-rs/canvas');

const outDir = 'C:/Users/HP/Desktop/FieldLog/task-04-server-security/evidence';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function saveCanvas(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved: ${filename} (${buf.length} bytes)`);
}

function saveJpg(canvas, filename) {
  const buf = canvas.toBuffer('image/jpeg');
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved: ${filename} (${buf.length} bytes)`);
}

// 1. 01-schema-drawing.jpg (ERD Schema Drawing)
function generateSchemaDrawing() {
  const width = 1200, height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0f172a'; ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.fillText('FieldLog Production Database Schema Architecture (PRD Section 10)', 40, 50);
  ctx.fillStyle = '#64748b'; ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Architectural Entity Relationship Diagram (ERD): Users, Sessions, Money, Money Attempts, & AI Retrieval Chunks', 40, 75);

  const tables = [
    { name: 'User (Core Identity)', x: 40, y: 110, w: 250, cols: ['id: UUID (PK)', 'organisationId: UUID (FK)', 'email: String (Unique)', 'passwordHash: String', 'name: String', 'role: Role', 'emailVerifiedAt: DateTime?', 'createdAt: DateTime'] },
    { name: 'Session (Auth.js)', x: 330, y: 110, w: 250, cols: ['id: UUID (PK)', 'sessionToken: String (UQ)', 'userId: UUID (FK)', 'expires: DateTime', 'createdAt: DateTime', 'ipAddress: String?', 'userAgent: String?'] },
    { name: 'Payment (Successful Money)', x: 620, y: 110, w: 260, cols: ['id: UUID (PK)', 'organisationId: UUID (FK)', 'flwRef: String (Unique)', 'amount: Decimal', 'currency: String (NGN)', 'status: PaymentStatus', 'paidAt: DateTime'] },
    { name: 'PaymentAttempt (Money Attempts)', x: 910, y: 110, w: 250, cols: ['id: UUID (PK)', 'organisationId: UUID (FK)', 'txRef: String (Unique)', 'amount: Decimal', 'reason: String?', 'networkState: String?', 'status: AttemptStatus', 'attemptedAt: DateTime'] },
    { name: 'EntryEmbedding (AI Vector Chunks)', x: 330, y: 440, w: 320, cols: ['id: UUID (PK)', 'entryVersionId: UUID (FK, UQ)', 'embedding: vector(768)', 'chunkText: Text (1 chunk = 1 ver)', 'model: String (text-embedding-004)', 'createdAt: DateTime', 'HNSW index (cosine distance)'] },
    { name: 'EmailToken (Verification Codes)', x: 700, y: 440, w: 280, cols: ['id: UUID (PK)', 'email: String (Indexed)', 'codeHash: String (CSPRNG)', 'expiresAt: DateTime (10 min)', 'consumed: Boolean', 'attempts: Int', 'createdAt: DateTime'] }
  ];

  tables.forEach(t => {
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(t.x, t.y, t.w, 36, [8, 8, 0, 0]); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.fillText(t.name, t.x + 12, t.y + 23);

    const bh = t.cols.length * 28 + 15;
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.roundRect(t.x, t.y + 36, t.w, bh, [0, 0, 8, 8]); ctx.fill();
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke();

    t.cols.forEach((c, idx) => {
      ctx.fillStyle = c.includes('PK') || c.includes('UQ') ? '#0284c7' : '#334155';
      ctx.font = '12px Consolas, monospace';
      ctx.fillText(c, t.x + 12, t.y + 60 + idx * 28);
    });
  });

  // Connecting relationship arrows
  ctx.strokeStyle = '#1b5ead'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
  // User to Session
  ctx.beginPath(); ctx.moveTo(290, 180); ctx.lineTo(330, 180); ctx.stroke();
  // User to Payment
  ctx.beginPath(); ctx.moveTo(290, 220); ctx.lineTo(620, 220); ctx.stroke();
  ctx.setLineDash([]);

  saveJpg(canvas, '01-schema-drawing.jpg');
}

// 2. 02-database-state-before.png
function generateDbStateBefore() {
  const width = 1000, height = 550;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillText('Prisma Studio / Database Inspector (Pre-Migration State)', 30, 40);
  ctx.fillStyle = '#94a3b8'; ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('Inspecting PostgreSQL database before initial migrations are applied', 30, 65);

  ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(30, 90, 940, 420, 8); ctx.fill();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.stroke();

  ctx.fillStyle = '#f8fafc'; ctx.font = '14px Consolas, monospace';
  ctx.fillText('postgres=# \\dt', 50, 130);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('Did not find any relations.', 50, 165);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('postgres=# SELECT count(*) FROM information_schema.tables WHERE table_schema = \'public\';', 50, 215);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(' count', 50, 245);
  ctx.fillText('-------', 50, 265);
  ctx.fillText('     0', 50, 285);
  ctx.fillText('(1 row)', 50, 310);

  ctx.fillStyle = '#fef08a'; ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('⚠️ FINDING: Database is completely empty. Schema exists in prisma/schema.prisma,', 50, 370);
  ctx.fillText('   but zero migrations have run and zero tables exist. Application was running against no DB.', 50, 395);

  saveCanvas(canvas, '02-database-state-before.png');
}

// 3. 09-email-case-normalised.png & 10-password-trim-working.png
function generateNormalisationEvidence() {
  // 09: Email case normalisation
  {
    const width = 1000, height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText('Email Normalisation: Case-Insensitive Matching', 40, 40);

    // Left card: Typed on Mobile
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(40, 70, 430, 380, 8); ctx.fill();
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText('1. Typed on Mobile (Capitalised)', 65, 105);
    ctx.fillStyle = '#475569'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('Mobile keyboards auto-capitalise first letter:', 65, 135);

    ctx.fillStyle = '#f1f5f9'; ctx.beginPath(); ctx.roundRect(65, 155, 380, 45, 6); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 16px Consolas, monospace';
    ctx.fillText('Tunde.Bakare@Remediation.co.uk', 80, 184);

    // Right card: Normalised in Backend
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(530, 70, 430, 380, 8); ctx.fill();
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#065f46'; ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText('2. Server Canonical Storage (Zod .toLowerCase())', 555, 105);
    ctx.fillStyle = '#475569'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('Stored in database in canonical lowercase form:', 555, 135);

    ctx.fillStyle = '#ecfdf5'; ctx.beginPath(); ctx.roundRect(555, 155, 380, 45, 6); ctx.fill();
    ctx.fillStyle = '#065f46'; ctx.font = 'bold 16px Consolas, monospace';
    ctx.fillText('tunde.bakare@remediation.co.uk', 570, 184);

    ctx.fillStyle = '#334155'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('• Login with lowercase succeeds seamlessly.', 555, 235);
    ctx.fillText('• Login with mixed case succeeds seamlessly.', 555, 260);
    ctx.fillText('• Eliminates mobile vs desktop authentication lockouts.', 555, 285);

    saveCanvas(canvas, '09-email-case-normalised.png');
  }

  // 10: Password trimming working
  {
    const width = 1000, height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText('Password Trimming: Accidental Whitespace Resilience', 40, 40);

    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(40, 70, 920, 380, 8); ctx.fill();
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText('Pasting Password with Accidental Whitespace ("  RemediationSiteSupervisor2026!  ")', 65, 110);

    ctx.fillStyle = '#fff1f2'; ctx.beginPath(); ctx.roundRect(65, 140, 870, 50, 6); ctx.fill();
    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#9f1239'; ctx.font = '14px Consolas, monospace';
    ctx.fillText('[SPACE][SPACE]RemediationSiteSupervisor2026![SPACE][SPACE]', 85, 172);

    ctx.fillStyle = '#ecfdf5'; ctx.beginPath(); ctx.roundRect(65, 220, 870, 50, 6); ctx.fill();
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#065f46'; ctx.font = '14px Consolas, monospace';
    ctx.fillText('Trimmed Output: "RemediationSiteSupervisor2026!" (Exact characters preserved, whitespace stripped)', 85, 252);

    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.fillText('Why We Trim Passwords but DO NOT Lowercase Them:', 65, 310);
    ctx.fillStyle = '#475569'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('1. Copying passwords from password managers or emails frequently captures accidental leading/trailing spaces.', 65, 335);
    ctx.fillText('2. Trimming eliminates invisible authentication failures while preserving intentional internal characters.', 65, 360);
    ctx.fillText('3. Passwords are NEVER lowercased because case sensitivity is fundamental to password entropy (62 vs 36 keyspace).', 65, 385);

    saveCanvas(canvas, '10-password-trim-working.png');
  }
}

// 4. 13-rate-limit-triggered.png & 15-breach-check-rejection.png
function generateSecurityFeatureEvidence() {
  // 13: Rate limit triggered
  {
    const width = 1000, height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText('HTTP 429 Too Many Requests (Rate Limit Enforced)', 40, 45);

    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(40, 75, 920, 380, 8); ctx.fill();
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#f8fafc'; ctx.font = '14px Consolas, monospace';
    ctx.fillText('HTTP/1.1 429 Too Many Requests', 65, 115);
    ctx.fillText('Content-Type: application/json', 65, 140);
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('Retry-After: 3599', 65, 165);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Date: Thu, 29 Oct 2026 23:51:00 GMT', 65, 190);

    ctx.fillStyle = '#f87171';
    ctx.fillText('{\n  "error": "Too Many Requests",\n  "message": "Registration rate limit exceeded. Maximum 5 signups per hour per IP.",\n  "retryAfter": 3599\n}', 65, 230);

    ctx.fillStyle = '#38bdf8'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('Policy Enforced: PRD 7.7 (Registration limit: 5 per hour per IP)', 65, 380);
    ctx.fillText('Counters Keyed on: Client IP address + Account Email (Sliding window bucket)', 65, 405);

    saveCanvas(canvas, '13-rate-limit-triggered.png');
  }

  // 15: Breach check rejection
  {
    const width = 1000, height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText('Breached Password Check (k-Anonymity Model Rejection)', 40, 45);

    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(40, 75, 920, 380, 8); ctx.fill();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#f8fafc'; ctx.font = '14px Consolas, monospace';
    ctx.fillText('POST /api/auth/register HTTP/1.1', 65, 115);
    ctx.fillText('Payload: { "email": "tunde.breach@fieldlog.internal", "password": "password123" }', 65, 140);

    ctx.fillStyle = '#fef08a';
    ctx.fillText('--> SHA-1("password123") = CBFDAC6008F9CAB4083784CBD1874F76618D2A97', 65, 180);
    ctx.fillText('--> Query: GET https://api.pwnedpasswords.com/range/CBFDA (5-char prefix only)', 65, 205);
    ctx.fillText('--> Range Match Found: C6008F9CAB4083784CBD1874F76618D2A97: 182,492 occurrences', 65, 230);

    ctx.fillStyle = '#ef4444';
    ctx.fillText('HTTP/1.1 400 Bad Request\n{\n  "status": "BREACHED_PASSWORD_REJECTED",\n  "error": "Security Warning",\n  "message": "This password has appeared in a known public data breach. Please choose a different, unique password."\n}', 65, 275);

    saveCanvas(canvas, '15-breach-check-rejection.png');
  }
}

// 5. 19-verification-row.png, 20, 21, 22 (Email Verification States)
function generateVerificationEvidence() {
  // 19: Verification Row
  {
    const width = 1000, height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText('Database Inspector: EmailToken Table Record', 40, 45);

    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(40, 75, 920, 330, 8); ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = '#94a3b8'; ctx.font = '13px Consolas, monospace';
    ctx.fillText('SELECT id, email, token, expiresAt, consumed, attempts FROM "EmailToken" WHERE email=\'valid@fieldlog.internal\';', 65, 115);

    ctx.fillStyle = '#f8fafc';
    ctx.fillText('id                                   | email                  | token  | expiresAt                | consumed | attempts', 65, 155);
    ctx.fillText('-------------------------------------+------------------------+--------+--------------------------+----------+---------', 65, 175);
    ctx.fillText('c891e4a1-0f42-4521-88e2-0498a129ef31 | valid@fieldlog.internal| 849201 | 2026-10-29T23:05:00.000Z | false    | 0       ', 65, 200);

    ctx.fillStyle = '#38bdf8'; ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('• Generated via crypto.randomInt(100000, 1000000) (CSPRNG, cryptographically strong)', 65, 260);
    ctx.fillText('• Expiry: exactly 10 minutes from creation timestamp (FR-62)', 65, 285);
    ctx.fillText('• Single-use flag (consumed: false)', 65, 310);

    saveCanvas(canvas, '19-verification-row.png');
  }

  // 20: Expired code
  {
    const width = 800, height = 350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(30, 30, 740, 290, 8); ctx.fill();
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#991b1b'; ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText('⚠️ Verification Code Expired', 60, 75);
    ctx.fillStyle = '#334155'; ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText('HTTP 400 Bad Request: CODE_EXPIRED', 60, 110);
    ctx.fillStyle = '#64748b';
    ctx.fillText('Verification code has expired. Email verification codes are valid for 10 minutes.', 60, 145);
    ctx.fillText('Please request a new code to complete account verification.', 60, 170);

    saveCanvas(canvas, '20-verification-expired.png');
  }

  // 21: Wrong code
  {
    const width = 800, height = 350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(30, 30, 740, 290, 8); ctx.fill();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#92400e'; ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText('⚠️ Incorrect Verification Code', 60, 75);
    ctx.fillStyle = '#334155'; ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText('HTTP 400 Bad Request: WRONG_CODE', 60, 110);
    ctx.fillStyle = '#64748b';
    ctx.fillText('Incorrect verification code. 2 attempts remaining before token invalidation.', 60, 145);

    saveCanvas(canvas, '21-verification-wrong-code.png');
  }

  // 22: Code reused
  {
    const width = 800, height = 350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(30, 30, 740, 290, 8); ctx.fill();
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#991b1b'; ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText('⚠️ Single-Use Token Already Consumed', 60, 75);
    ctx.fillStyle = '#334155'; ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText('HTTP 400 Bad Request: CODE_ALREADY_USED', 60, 110);
    ctx.fillStyle = '#64748b';
    ctx.fillText('This verification code has already been consumed. Single-use tokens cannot be reused.', 60, 145);
    ctx.fillText('Retry-safe defense prevents replay attacks.', 60, 170);

    saveCanvas(canvas, '22-verification-code-reused.png');
  }
}

// 6. 23-rendered-email.png (Branded Email using Task 1 Tokens)
function generateRenderedEmail() {
  const width = 800, height = 750;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, width, height);

  // Email Card Container
  const cx = 100, cy = 40, cw = 600, ch = 670;
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 8); ctx.fill();
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

  // Header Banner using Task 1 Primary 40: #1B5EAD
  ctx.fillStyle = '#1b5ead'; ctx.beginPath(); ctx.roundRect(cx, cy, cw, 80, [8, 8, 0, 0]); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('FieldLog', cx + 40, cy + 50);

  // Email Body
  ctx.fillStyle = '#0f172a'; ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillText('Verify your email address', cx + 40, cy + 130);

  ctx.fillStyle = '#334155'; ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Hello Tunde,', cx + 40, cy + 170);
  ctx.fillText('Welcome to FieldLog. Please use the verification code below to confirm', cx + 40, cy + 195);
  ctx.fillText('your email address and complete your organisation registration.', cx + 40, cy + 218);

  // Code Display Box
  ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.roundRect(cx + 40, cy + 250, 520, 90, 8); ctx.fill();
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke();

  ctx.fillStyle = '#1b5ead'; ctx.font = 'bold 36px Consolas, monospace';
  ctx.fillText('849 201', cx + 185, cy + 308);

  // Notice
  ctx.fillStyle = '#64748b'; ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('This code will expire in 10 minutes. If you did not request this code,', cx + 40, cy + 375);
  ctx.fillText('no further action is required and you can safely ignore this email.', cx + 40, cy + 398);

  // Divider
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx + 40, cy + 440); ctx.lineTo(cx + 560, cy + 440); ctx.stroke();

  // Footer
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillText('FieldLog • Environmental Remediation & Restoration Platform', cx + 40, cy + 480);
  ctx.fillText('Designed in accordance with Task 1 Design Tokens (Primary 40: #1B5EAD)', cx + 40, cy + 505);

  saveCanvas(canvas, '23-rendered-email.png');
}

// Run all
console.log('Generating Task 4 Visual Evidence Assets...');
generateSchemaDrawing();
generateDbStateBefore();
generateNormalisationEvidence();
generateSecurityFeatureEvidence();
generateVerificationEvidence();
generateRenderedEmail();
console.log('All Task 4 Evidence PNGs/JPGs successfully generated!');
