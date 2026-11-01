import { type NextRequest, NextResponse } from 'next/server';
import {
  browserSessionToken,
  hasBrowserSession,
  isHosted,
  localOrigin,
  localRequestProblem,
  requireLocalSession,
  SESSION_COOKIE,
} from '@/local/security';

const PUBLIC_PAGES = ['/', '/library', '/pricing'];
const PUBLIC_FOLDERS =
  /^\/(previews|poster-previews|site-previews|site-assets|design-assets|preview)\//;
const isPublicPath = (pathname: string) =>
  PUBLIC_PAGES.includes(pathname) ||
  PUBLIC_FOLDERS.test(pathname) ||
  pathname.endsWith('/opengraph-image');

const MAX_UPLOAD_BYTES = 256 * 1024 * 1024 + 1024;
const MAX_JSON_BYTES = 64 * 1024 * 1024;
const UPLOAD_PATH = /^\/api\/projects\/[^/]+\/media$/;
const bodyTooLarge = (request: NextRequest) =>
  Number(request.headers.get('content-length') ?? 0) >
  (UPLOAD_PATH.test(request.nextUrl.pathname) ? MAX_UPLOAD_BYTES : MAX_JSON_BYTES);

const harden = (response: NextResponse, pathname: string) => {
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set(
    'X-Frame-Options',
    pathname === '/opencut/index.html' ? 'SAMEORIGIN' : 'DENY',
  );
  return response;
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (pathname === '/api/health') {
    return NextResponse.next();
  }
  const problem = localRequestProblem(request);
  if (problem !== null) {
    return problem;
  }
  if (bodyTooLarge(request)) {
    return NextResponse.json({ problem: 'That request is too large.' }, { status: 413 });
  }
  if (
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname === '/api/logout' ||
    (isHosted() && isPublicPath(pathname))
  ) {
    return harden(NextResponse.next(), pathname);
  }
  if (
    isHosted() &&
    !hasBrowserSession(request) &&
    !pathname.startsWith('/api/') &&
    pathname !== '/mcp'
  ) {
    return NextResponse.redirect(new URL('/login', localOrigin(request) ?? request.url));
  }
  if (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname === '/mcp') {
    return requireLocalSession(request) ?? NextResponse.next();
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    return requireLocalSession(request) ?? NextResponse.next();
  }
  const response = harden(NextResponse.next(), pathname);
  if (!isHosted()) {
    response.cookies.set(SESSION_COOKIE, browserSessionToken(), {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: request.nextUrl.protocol === 'https:',
    });
  }
  return response;
};

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
