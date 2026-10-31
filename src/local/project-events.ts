import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { publicProjectState } from './project-state';
import { projectDirectory, readProject } from './projects';

const PRESENCE_CHECK_MS = 5000;
export const projectEvents = (id: string, signal: AbortSignal) => {
  const encoder = new TextEncoder();
  let stop = () => undefined;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let revision = -1;
      let modified = -1;
      let checked = 0;
      let busy = false;
      let ended = false;
      const send = async () => {
        if (busy || ended) {
          return;
        }
        busy = true;
        try {
          const file = await stat(join(await projectDirectory(id), 'project.json'));
          if (file.mtimeMs === modified && Date.now() - checked < PRESENCE_CHECK_MS) {
            return;
          }
          modified = file.mtimeMs;
          checked = Date.now();
          const state = await readProject(id);
          if (ended || state.revision === revision) {
            return;
          }
          revision = state.revision;
          controller.enqueue(
            encoder.encode(
              `id: ${revision}\ndata: ${JSON.stringify(publicProjectState(state))}\n\n`,
            ),
          );
        } finally {
          busy = false;
        }
      };
      const timer = setInterval(() => {
        send().catch(() => finish());
      }, 250);
      const heartbeat = setInterval(() => {
        if (!ended) {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        }
      }, 15000);
      const finish = () => {
        if (ended) {
          return;
        }
        ended = true;
        clearInterval(timer);
        clearInterval(heartbeat);
        controller.close();
      };
      stop = () => {
        if (!ended) {
          ended = true;
          clearInterval(timer);
          clearInterval(heartbeat);
        }
      };
      signal.addEventListener('abort', finish, { once: true });
      send().catch(finish);
    },
    cancel() {
      stop();
    },
  });
};
