import { NextResponse } from 'next/server';
import {
  authenticate,
  ROLE_COOKIE,
  roleCookie,
  SESSION_COOKIE,
  sessionToken,
} from '@/local/security';

const FAILURE_DELAY_MS = 1000;

export const POST = async (request: Request) => {
  const form = await request.formData();
  const password = form.get('password');
  const role = authenticate(String(form.get('email') ?? 'admin'), String(password ?? ''));
  if (role === null) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return new NextResponse(null, { status: 303, headers: { location: '/login?failed=1' } });
  }
  const response = new NextResponse(null, { status: 303, headers: { location: '/' } });
  const cookie = {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: new URL(request.url).protocol === 'https:',
    maxAge: 60 * 60 * 24 * 30,
  } as const;
  response.cookies.set(SESSION_COOKIE, sessionToken(), cookie);
  response.cookies.set(ROLE_COOKIE, roleCookie(role), cookie);
  return response;
};
