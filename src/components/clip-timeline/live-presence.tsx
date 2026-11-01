'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AgentPresence } from '@/local/presence';
import type { PublicProjectState } from '@/local/project-state';

const LivePresenceContext = createContext<{
  agent: AgentPresence | null;
  recentIds: string[];
}>({ agent: null, recentIds: [] });
export const useItemPresence = (id: string) => {
  const { agent, recentIds } = useContext(LivePresenceContext);
  return {
    locked: agent?.status === 'working' && agent.itemIds.includes(id),
    recent: recentIds.includes(id),
  };
};
export const LivePresence = ({
  state,
  undoAgent,
  onSelect,
  children,
  hideBar = false,
}: {
  state: PublicProjectState | null;
  undoAgent: () => void;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  hideBar?: boolean;
}) => {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const latest = state?.activity.at(-1);
  useEffect(() => {
    setRecentIds(latest?.itemIds ?? []);
    const timer = setTimeout(() => setRecentIds([]), 900);
    return () => clearTimeout(timer);
  }, [latest?.itemIds]);
  return (
    <LivePresenceContext.Provider value={{ agent: state?.agent ?? null, recentIds }}>
      <div
        hidden={hideBar}
        className="flex h-10 shrink-0 items-center gap-4 border-b px-3 text-xs"
        data-testid="agent-bar"
      >
        <span
          className={state?.agent?.status === 'working' ? 'text-agent' : 'text-muted-foreground'}
        >
          {state?.agent?.name ?? 'Agent'} · {state?.agent?.status ?? 'idle'}{' '}
          {state?.agent?.label ? `· ${state.agent.label}` : ''}
        </span>
        <button
          type="button"
          onClick={undoAgent}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          disabled={!state?.activity.some((entry) => entry.actor.startsWith('agent:'))}
        >
          Undo agent turn
        </button>
        <details>
          <summary className="flex cursor-pointer items-center text-muted-foreground hover:text-foreground">
            Activity
          </summary>
          <div className="absolute z-40 mt-2 max-h-60 max-w-sm overflow-y-auto rounded-lg border bg-background p-3 shadow-lg">
            {state?.activity.toReversed().map((entry) => (
              <button
                type="button"
                className="block w-full py-1 text-left"
                key={entry.id}
                onClick={() => {
                  const id = entry.itemIds[0];
                  if (id) {
                    onSelect(id);
                  }
                }}
              >
                {entry.author} · {entry.label}
              </button>
            ))}
          </div>
        </details>
      </div>
      {children}
    </LivePresenceContext.Provider>
  );
};
