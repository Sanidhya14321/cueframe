import { requireLocalSession } from '@/local/security';
import { publicSettings, readSettings, saveSettings } from '@/local/settings';
import { settingsChangeSchema } from '@/local/settings-schema';

export const GET = async (request: Request): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  return Response.json(publicSettings(await readSettings()), {
    headers: { 'cache-control': 'no-store' },
  });
};

export const PUT = async (request: Request): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const change = settingsChangeSchema.safeParse(await request.json().catch(() => null));
  if (!change.success) {
    return Response.json({ problem: 'Check the settings fields and base URL.' }, { status: 400 });
  }
  try {
    return Response.json(await saveSettings(change.data), {
      headers: { 'cache-control': 'no-store' },
    });
  } catch {
    return Response.json(
      {
        problem:
          'Could not save settings. Check that the data folder is an absolute, writable path.',
      },
      { status: 400 },
    );
  }
};
