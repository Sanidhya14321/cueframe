import { NextResponse } from 'next/server';
import { ROLE_COOKIE, SESSION_COOKIE } from '@/local/security';

export const POST = (): NextResponse => {
  const response = new NextResponse(null, { status: 303, headers: { location: '/login' } });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(ROLE_COOKIE);
  return response;
};
