import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionToken } from '@/lib/auth';
import { getUserSubmissions } from '@/lib/incidentsStore';

export async function GET() {
  const cookieStore = await cookies();
  const citizenCookie = cookieStore.get('civicpulse_citizen_session');
  const session = citizenCookie ? parseSessionToken(citizenCookie.value) : null;

  if (!session) {
    return NextResponse.json({ authenticated: false, submissions: [] });
  }

  const submissions = await getUserSubmissions(session.id);
  return NextResponse.json({ authenticated: true, user: session, submissions });
}

