import 'server-only';
import { subscribeFile } from './file-events';

export const snapshotStream = (
  paths: () => Promise<string[]>,
  read: () => Promise<unknown>,
  signal: AbortSignal,
) => {
  const encoder = new TextEncoder();
  let cancel: () => void = () => undefined;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let ended = false;
      let busy = false;
      let dirty = false;
      let last = '';
      let fallback: ReturnType<typeof setInterval> | undefined;
      let heartbeat: ReturnType<typeof setInterval> | undefined;
      const subscriptions: (() => void)[] = [];
      const stop = () => {
        if (ended) {
          return;
        }
        ended = true;
        clearInterval(fallback);
        clearInterval(heartbeat);
        for (const unsubscribe of subscriptions) {
          unsubscribe();
        }
        signal.removeEventListener('abort', finish);
      };
      const finish = () => {
        if (ended) {
          return;
        }
        stop();
        controller.close();
      };
      cancel = stop;
      const send = async (): Promise<void> => {
        if (ended) {
          return;
        }
        if (busy) {
          dirty = true;
          return;
        }
        busy = true;
        try {
          const next = JSON.stringify(await read());
          if (!ended && next !== last) {
            last = next;
            controller.enqueue(encoder.encode(`data: ${next}\n\n`));
          }
        } finally {
          busy = false;
          if (dirty && !ended) {
            dirty = false;
            queueMicrotask(() => {
              send().catch(finish);
            });
          }
        }
      };
      signal.addEventListener('abort', finish, { once: true });
      if (signal.aborted) {
        finish();
        return;
      }
      paths()
        .then((files) => {
          if (ended) {
            return;
          }
          for (const path of files) {
            subscriptions.push(
              subscribeFile(path, () => {
                send().catch(finish);
              }),
            );
          }
          fallback = setInterval(() => {
            send().catch(finish);
          }, 5000);
          heartbeat = setInterval(() => {
            if (!ended) {
              controller.enqueue(encoder.encode(': heartbeat\n\n'));
            }
          }, 15000);
          return send();
        })
        .catch(finish);
    },
    cancel() {
      cancel();
    },
  });
};
