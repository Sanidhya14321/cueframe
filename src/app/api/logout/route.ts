import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/local/security';

export const POST = (): NextResponse => {
  const response = new NextResponse(null, { status: 303, headers: { location: '/login' } });
  response.cookies.delete(SESSION_COOKIE);
  return response;
};
