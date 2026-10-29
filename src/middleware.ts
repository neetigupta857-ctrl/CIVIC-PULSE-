import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, parseSessionToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes, EXCEPT /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const session = sessionCookie ? parseSessionToken(sessionCookie.value) : null;

    // If no valid session or role is not ADMIN, redirect to /admin/login
    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Also protect internal admin API endpoints under /api/admin (except the setup endpoint which has its own key-based security)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/setup') {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
    const session = sessionCookie ? parseSessionToken(sessionCookie.value) : null;

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

