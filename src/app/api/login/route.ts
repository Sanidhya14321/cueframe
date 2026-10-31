import { NextResponse } from 'next/server';
import { isHosted, passwordMatches, SESSION_COOKIE, sessionToken } from '@/local/security';

const FAILURE_DELAY_MS = 1000;

export const POST = async (request: Request) => {
  const form = await request.formData();
  const password = form.get('password');
  if (!isHosted() || typeof password !== 'string' || !passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return NextResponse.redirect(new URL('/login?failed=1', request.url), 303);
  }
  const response = NextResponse.redirect(new URL('/', request.url), 303);
  response.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
};
