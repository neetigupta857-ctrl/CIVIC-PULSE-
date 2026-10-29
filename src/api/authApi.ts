/**
 * CivicPulse Authentication Service
 * Communicates with server-side HTTP-only session endpoints for ADMIN authorization.
 */

import { UserSession } from '../types/incident';

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const res = await fetch('/api/auth/session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.authenticated && data.user) {
      return data.user as UserSession;
    }
    return null;
  } catch (err) {
    console.warn('Session verification error:', err);
    return null;
  }
}

export async function loginAsAdmin(officerId: string, passkey: string): Promise<UserSession> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ officerId, passkey }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }

  return data.user as UserSession;
}

export async function signOutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (err) {
    console.warn('Logout error:', err);
  }
}
