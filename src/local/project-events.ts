import { publicProjectState } from './project-state';
import { readProject } from './projects';
export const projectEvents = (id: string, signal: AbortSignal) => {
  const encoder = new TextEncoder();
  let stop = () => undefined;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let revision = -1;
      let busy = false;
      let ended = false;
      const send = async () => {
        if (busy || ended) {
          return;
        }
        busy = true;
        try {
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
