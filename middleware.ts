import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';

const PUBLIC_PATHS = ['/login'];
const PUBLIC_API_PATHS = ['/api/auth', '/api/health'];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  if (PUBLIC_API_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
