'use client';
import { compare } from 'fast-json-patch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dropObjectUrls } from '@/agent/assets';
import type { PublicProjectState } from '@/local/project-state';
import type { Project } from '@/project';
import { projectActionSchema } from '@/project/actions';
import { persistProjectAssets } from './persist-project-assets';

export const useLiveProject = (
  title: string,
  storageKey: string,
  initial: Project,
  requestedId?: string,
) => {
  const [state, setState] = useState<PublicProjectState | null>(null);
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState('Opening project…');
  const [problem, setProblem] = useState('');
  const latest = useRef(state);
  const view = useRef(value);
  const turn = useRef<string | null>(null);
  const assets = useRef(new Map<string, string>());
  const queue = useRef(Promise.resolve());
  const clientId = useRef('');
  const pending = useRef(0);
  const failure = useRef('');
  latest.current = state;
  view.current = value;
  const accept = useCallback((next: PublicProjectState) => {
    latest.current = next;
    setState(next);
    setValue(next.project);
    view.current = next.project;
  }, []);
  useEffect(() => {
    let disposed = false;
    let events: EventSource | null = null;
    clientId.current = crypto.randomUUID();
    let seed: unknown = initial;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        seed = dropObjectUrls(JSON.parse(saved));
      }
    } catch {
      seed = initial;
    }
    const open = requestedId
      ? fetch(`/api/projects/${requestedId}`)
      : fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, sourceKey: storageKey, project: seed }),
        });
    open
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not open the local project.');
        }
        return response.json() as Promise<PublicProjectState>;
      })
      .then((next) => {
        if (disposed) {
          return;
        }
        accept(next);
        setStatus('Saved locally');
        events = new EventSource(`/api/projects/${next.id}/events`);
        events.onmessage = (event) => {
          const incoming = JSON.parse(event.data) as PublicProjectState;
          setStatus('Saved locally');
          if (pending.current === 0 && incoming.revision > (latest.current?.revision ?? -1)) {
            accept(incoming);
          }
        };
        events.onerror = () => setStatus('Reconnecting…');
        events.onopen = () => setStatus('Saved locally');
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setProblem(error instanceof Error ? error.message : 'Could not open project.');
          setStatus('Offline');
        }
      });
    return () => {
      disposed = true;
      events?.close();
    };
  }, [title, storageKey, initial, requestedId, accept]);
  const send = useCallback(
    (payload: Record<string, unknown>) => {
      pending.current += 1;
      setStatus('Saving…');
      queue.current = queue.current
        .then(async () => {
          const current = latest.current;
          if (current === null) {
            return;
          }
          const response = await fetch(`/api/projects/${current.id}/actions`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              ...((await persistProjectAssets(payload, current.id, assets.current)) as Record<
                string,
                unknown
              >),
              revision: current.revision,
              clientId: clientId.current,
            }),
          });
          if (!response.ok) {
            const error = (await response.json()) as { problem: string };
            const refreshed = await fetch(`/api/projects/${current.id}`);
            if (refreshed.ok) {
              accept((await refreshed.json()) as PublicProjectState);
            }
            throw new Error(error.problem);
          }
          const next = (await response.json()) as PublicProjectState;
          latest.current = next;
          setState(next);
          if (pending.current === 1) {
            setValue(next.project);
            view.current = next.project;
          }
          failure.current = '';
          setProblem('');
        })
        .catch((error: unknown) => {
          failure.current = error instanceof Error ? error.message : 'Save failed.';
          setProblem(failure.current);
        })
        .finally(() => {
          pending.current -= 1;
          setStatus(pending.current === 0 ? 'Saved locally' : 'Saving…');
        });
    },
    [accept],
  );
  const change = useCallback(
    (next: Project, live: boolean) => {
      if (latest.current === null) {
        return;
      }
      const operations = compare(view.current, next);
      if (operations.length === 0) {
        return;
      }
      if (live && turn.current === null) {
        turn.current = crypto.randomUUID();
      }
      const turnId = live ? turn.current : crypto.randomUUID();
      setValue(next);
      view.current = next;
      const action = projectActionSchema.parse({ type: 'patch', operations });
      send({ action, turnId, label: 'Browser edit' });
    },
    [send],
  );
  const settled = useCallback(async () => {
    await queue.current;
    if (failure.current) {
      throw new Error(failure.current);
    }
  }, []);
  return {
    value,
    state,
    status,
    settled,
    problem,
    clearProblem: () => setProblem(''),
    set: (next: Project) => change(next, false),
    setLive: (next: Project) => change(next, true),
    seal: () => {
      turn.current = null;
    },
    undo: () => send({ history: 'undo' }),
    redo: () => send({ history: 'redo' }),
    reset: (next: Project) => change(next, false),
    canUndo: state?.canUndo ?? false,
    canRedo: state?.canRedo ?? false,
    undoAgent: () => send({ history: 'undo-agent' }),
  };
};
