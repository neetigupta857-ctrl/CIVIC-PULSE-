import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, parseSessionToken } from '@/lib/auth';

const CITIZEN_COOKIE_NAME = 'civicpulse_citizen_session';

export async function GET() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (adminCookie) {
    const session = parseSessionToken(adminCookie.value);
    if (session && session.role === 'ADMIN') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          role: session.role,
          name: session.name,
          badge: session.badge,
        },
      });
    }
  }

  // Check citizen session cookie
  const citizenCookie = cookieStore.get(CITIZEN_COOKIE_NAME);
  if (citizenCookie) {
    const session = parseSessionToken(citizenCookie.value);
    if (session && session.role === 'CITIZEN') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          role: session.role,
          name: session.name,
          email: session.email,
          badge: session.badge,
          avatarUrl: session.avatarUrl
        },
      });
    }
  }

  return NextResponse.json({ authenticated: false, user: null });
}


