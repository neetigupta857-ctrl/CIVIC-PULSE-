import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';

const CITIZEN_COOKIE_NAME = 'civicpulse_citizen_session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, googleId, avatarUrl } = body;

    const citizenSession = {
      id: googleId || `google-usr-${Date.now()}`,
      role: 'CITIZEN' as const,
      name: name || 'Aarav Malhotra',
      email: email || 'aarav.m@gmail.com',
      badge: 'Verified Citizen Reporter',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      issuedAt: Date.now()
    };

    const token = createSessionToken(citizenSession);

    const response = NextResponse.json({
      success: true,
      user: citizenSession
    });

    response.cookies.set({
      name: CITIZEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Auth failed: ' + err?.message }, { status: 500 });
  }
}

