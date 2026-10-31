import { type NextRequest, NextResponse } from 'next/server';
import {
  hasBrowserSession,
  isHosted,
  localRequestProblem,
  requireLocalSession,
  SESSION_COOKIE,
  sessionToken,
} from '@/local/security';

export const proxy = (request: NextRequest) => {
  const problem = localRequestProblem(request);
  if (problem !== null) {
    return problem;
  }
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || pathname === '/api/login') {
    return NextResponse.next();
  }
  if (
    isHosted() &&
    !hasBrowserSession(request) &&
    !pathname.startsWith('/api/') &&
    pathname !== '/mcp'
  ) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }
  if (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname === '/mcp') {
    return requireLocalSession(request) ?? NextResponse.next();
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    return requireLocalSession(request) ?? NextResponse.next();
  }
  const response = NextResponse.next();
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set(
    'X-Frame-Options',
    request.nextUrl.pathname === '/opencut/index.html' ? 'SAMEORIGIN' : 'DENY',
  );
  if (!isHosted()) {
    response.cookies.set(SESSION_COOKIE, sessionToken(), {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: request.nextUrl.protocol === 'https:',
    });
  }
  return response;
};

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
