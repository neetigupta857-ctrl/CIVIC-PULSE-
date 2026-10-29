import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

const CITIZEN_COOKIE_NAME = 'civicpulse_citizen_session';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: CITIZEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}


