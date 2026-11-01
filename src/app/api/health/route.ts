import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { readSettings } from '@/local/settings';

export const dynamic = 'force-dynamic';

export const GET = async (): Promise<Response> => {
  const headers = { 'cache-control': 'no-store' };
  try {
    await access((await readSettings()).dataFolder, constants.W_OK);
    return Response.json({ status: 'ok' }, { headers });
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503, headers });
  }
};
