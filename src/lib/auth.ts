

export const ADMIN_COOKIE_NAME = 'civicpulse_admin_session';

export interface SessionData {
  id: string;
  role: 'ADMIN' | 'CITIZEN';
  name: string;
  email?: string;
  avatarUrl?: string;
  badge?: string;
  issuedAt: number;
}

// In Next.js Edge runtime / Middleware compatible encoding
export function createSessionToken(data: SessionData): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64url');
}

export function parseSessionToken(token: string): SessionData | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const data = JSON.parse(raw);
    if (data && data.role && data.id) {
      return data as SessionData;
    }
    return null;
  } catch {
    return null;
  }
}

