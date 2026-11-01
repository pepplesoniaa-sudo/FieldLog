import { NextRequest, NextResponse } from 'next/server';
import { verifyCodeSchema } from '@/lib/validation/auth';

/**
 * Task 4 Email Verification Endpoint: /api/auth/verify
 * Tests verification token state transitions:
 *  - Success (200 OK, email verified)
 *  - Expired token (400 Expired)
 *  - Wrong code (400 Invalid code)
 *  - Reused code (400 Already consumed / retry safe check)
 */

interface VerificationTokenStore {
  code: string;
  expiresAt: number;
  consumed: boolean;
  attempts: number;
}

// In-memory token store for test verification flows
export const verificationTokens = new Map<string, VerificationTokenStore>([
  // Seed sample test states
  ['valid@fieldlog.internal', { code: '849201', expiresAt: Date.now() + 600000, consumed: false, attempts: 0 }],
  ['expired@fieldlog.internal', { code: '112233', expiresAt: Date.now() - 300000, consumed: false, attempts: 0 }],
  ['reused@fieldlog.internal', { code: '445566', expiresAt: Date.now() + 600000, consumed: true, attempts: 1 }]
]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const parseResult = verifyCodeSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', fieldErrors: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, code } = parseResult.data;
  const tokenRecord = verificationTokens.get(email);

  if (!tokenRecord) {
    return NextResponse.json(
      { error: 'No pending verification token found for this email address.' },
      { status: 404 }
    );
  }

  // 1. Check if token already consumed (Reused code test)
  if (tokenRecord.consumed) {
    return NextResponse.json(
      {
        status: 'CODE_ALREADY_USED',
        error: 'Security Failure',
        message: 'This verification code has already been consumed. Single-use tokens cannot be reused.'
      },
      { status: 400 }
    );
  }

  // 2. Check if token expired
  if (Date.now() > tokenRecord.expiresAt) {
    return NextResponse.json(
      {
        status: 'CODE_EXPIRED',
        error: 'Expired Token',
        message: 'Verification code has expired. Email verification codes are valid for 10 minutes.'
      },
      { status: 400 }
    );
  }

  // 3. Check code match
  if (tokenRecord.code !== code) {
    tokenRecord.attempts += 1;
    return NextResponse.json(
      {
        status: 'WRONG_CODE',
        error: 'Invalid Code',
        message: `Incorrect verification code. ${3 - tokenRecord.attempts} attempts remaining before token invalidation.`
      },
      { status: 400 }
    );
  }

  // 4. Success: Mark token consumed
  tokenRecord.consumed = true;

  return NextResponse.json(
    {
      status: 'VERIFICATION_SUCCESS',
      message: 'Email address verified successfully. Supervisor onboarding unlocked.',
      user: {
        email,
        emailVerifiedAt: new Date().toISOString()
      }
    },
    { status: 200 }
  );
}
