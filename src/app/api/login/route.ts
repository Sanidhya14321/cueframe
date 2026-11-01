import { NextResponse } from 'next/server';
import { clientAddress, takeRateLimit } from '@/local/rate-limit';
import {
  authenticate,
  browserSessionToken,
  localOrigin,
  ROLE_COOKIE,
  roleCookie,
  SESSION_COOKIE,
} from '@/local/security';

const FAILURE_DELAY_MS = 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const ATTEMPTS_PER_CLIENT = 10;
const ATTEMPTS_PER_SERVER = 100;

const toLogin = (reason: string) =>
  new NextResponse(null, { status: 303, headers: { location: `/login?failed=${reason}` } });

export const POST = async (request: Request) => {
  const limited =
    takeRateLimit(`login:${clientAddress(request)}`, ATTEMPTS_PER_CLIENT, ATTEMPT_WINDOW_MS) ??
    takeRateLimit('login', ATTEMPTS_PER_SERVER, ATTEMPT_WINDOW_MS);
  if (limited !== null) {
    return toLogin('limit');
  }
  const form = await request.formData().catch(() => new FormData());
  const password = form.get('password');
  const role = authenticate(String(form.get('email') ?? 'admin'), String(password ?? ''));
  if (role === null) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return toLogin('1');
  }
  const response = new NextResponse(null, { status: 303, headers: { location: '/' } });
  const cookie = {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: (localOrigin(request) ?? request.url).startsWith('https:'),
    maxAge: 60 * 60 * 24 * 30,
  } as const;
  response.cookies.set(SESSION_COOKIE, browserSessionToken(), cookie);
  response.cookies.set(ROLE_COOKIE, roleCookie(role), cookie);
  return response;
};
