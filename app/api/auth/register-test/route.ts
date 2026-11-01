import { NextRequest, NextResponse } from 'next/server';

/**
 * Task 3 Direct Request Target Endpoint: /api/auth/register-test
 * 
 * Demonstrates what happens when a client sends an HTTP POST directly to the server,
 * skipping the browser and all client-side validation rules.
 * At Task 3 stage, this endpoint ingests raw payloads without server validation,
 * proving that client-side validation is zero security against direct API requests.
 * Comprehensive server-side Zod validation and rate limiting will be enforced in Task 4.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Log the unvalidated direct attack payload arriving on the server
    console.log('[Direct-Request Attack] Received unvalidated registration payload:', JSON.stringify(rawBody));

    // Return the server response showing what was accepted directly
    return NextResponse.json(
      {
        status: 'RECEIVED_AT_ENDPOINT',
        accepted: true,
        message: 'Endpoint accepted payload directly without client validation intervention.',
        clientValidationBypassed: true,
        dataReceived: rawBody,
        serverChecksEnforced: [],
        timestamp: new Date().toISOString(),
        warning: 'CRITICAL SECURITY DEFECT: Client-side validation was completely bypassed by direct HTTP request. Server validation (Task 4) is mandatory.'
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error parsing request body';
    return NextResponse.json(
      {
        status: 'ERROR',
        error: message
      },
      { status: 400 }
    );
  }
}
