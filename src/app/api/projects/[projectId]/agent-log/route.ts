import { join } from 'node:path';
import { readAgentLog } from '@/local/agent-log';
import { connectionState } from '@/local/connections';
import { projectApi } from '@/local/project-api';
import { projectDirectory } from '@/local/projects';
import { readSettings } from '@/local/settings';
import { snapshotStream } from '@/local/snapshot-stream';

export const dynamic = 'force-dynamic';
export const GET = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    await readAgentLog(projectId);
    const stream = snapshotStream(
      async () => {
        const { dataFolder } = await readSettings();
        return [
          join(await projectDirectory(projectId), 'agent-log.json'),
          join(dataFolder, 'settings.json'),
          join(dataFolder, 'connection.json'),
        ];
      },
      async () => {
        const [log, external, settings] = await Promise.all([
          readAgentLog(projectId),
          connectionState(),
          readSettings(),
        ]);
        return {
          ...log,
          external: { name: external.name, connected: external.connected },
          modelReady: settings.providerType === 'openai-compatible' && settings.model !== '',
        };
      },
      request.signal,
    );
    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      },
    });
  });
