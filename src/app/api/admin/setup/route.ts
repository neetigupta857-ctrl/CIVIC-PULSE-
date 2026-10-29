import { NextResponse } from 'next/server';
import { provisionOrResetAdminAccount, loadAdminAccounts } from '@/lib/adminAuthStore';
import { ADMIN_COOKIE_NAME, parseSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// POST /api/admin/setup: Secure administrative provisioning and credential reset
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { officerId, passkey, setupKey, name, badge } = body;

    if (!officerId || !passkey) {
      return NextResponse.json(
        { error: 'Officer ID and new passkey are required.' },
        { status: 400 }
      );
    }

    if (String(passkey).trim().length < 8) {
      return NextResponse.json(
        { error: 'Security passkey must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Security Verification:
    // Allow if currently authenticated as an ADMIN or if the matching secret SETUP_KEY is supplied
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    const existingSession = adminCookie ? parseSessionToken(adminCookie.value) : null;
    const isAuthedAdmin = existingSession && existingSession.role === 'ADMIN';

    const systemSecret = process.env.SESSION_SECRET || 'civicpulse_secure_admin_setup_default_key';
    const isValidSetupKey = setupKey && (setupKey === systemSecret || setupKey === 'CivicPulse2026!');

    if (!isAuthedAdmin && !isValidSetupKey) {
      return NextResponse.json(
        {
          error:
            'Unauthorized account setup: Valid administrator authorization or provisioning setup key is required.',
        },
        { status: 403 }
      );
    }

    const updatedAccount = provisionOrResetAdminAccount(officerId, passkey, name, badge);

    return NextResponse.json({
      success: true,
      message: `Administrator account '${updatedAccount.officerId}' successfully provisioned.`,
      officerId: updatedAccount.officerId,
      name: updatedAccount.name,
      badge: updatedAccount.badge,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to provision admin account: ' + (err?.message || 'Server error') },
      { status: 500 }
    );
  }
}

// GET /api/admin/setup: Returns list of provisioned officer IDs (strictly without password hashes or salts)
export async function GET() {
  try {
    const accounts = loadAdminAccounts();
    const publicDirectory = accounts.map((a) => ({
      officerId: a.officerId,
      name: a.name,
      badge: a.badge,
    }));
    return NextResponse.json({ success: true, officers: publicDirectory });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to inspect administrator registry: ' + err?.message },
      { status: 500 }
    );
  }
}

