import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/adminAuthStore';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request: Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { officerId, passkey } = body || {};

    if (!officerId || !passkey) {
      return NextResponse.json(
        { error: 'Officer ID and Security Passkey are required.' },
        { status: 400 }
      );
    }

    const result = verifyAdminCredentials(String(officerId), String(passkey));

    if (!result.success || !result.account) {
      return NextResponse.json(
        { error: result.error || 'Invalid administrator credentials. Access denied.' },
        { status: 401 }
      );
    }

    const sessionData = {
      id: result.account.officerId,
      role: 'ADMIN' as const,
      name: result.account.name,
      badge: result.account.badge,
      issuedAt: Date.now(),
    };

    const token = createSessionToken(sessionData);

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: 'Authentication successful. Redirecting to Admin Console...',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication service internal error: ' + (err?.message || 'Unknown server error') },
      { status: 500 }
    );
  }
}
