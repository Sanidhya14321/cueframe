'use client';
import { Brain, CircleAlert, GitBranch, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentLogEntry } from '@/local/agent-log-schema';
import type { AgentEvent } from '@/local/event-schema';

type Row =
  | { at: number; id: string; type: 'message'; event: AgentEvent }
  | { at: number; id: string; type: 'log'; entry: AgentLogEntry };

const STEP = {
  thinking: { Icon: Brain, label: 'Thinking' },
  decision: { Icon: GitBranch, label: 'Decision' },
  tool: { Icon: Wrench, label: 'Action' },
  error: { Icon: CircleAlert, label: 'Problem' },
} as const;

const messageStatus = (event: AgentEvent, agent: string) => {
  if (event.status === 'queued') {
    return 'Waiting to be picked up';
  }
  return event.status === 'in-progress' ? `${agent} is on it` : 'Done';
};

export const AgentTimeline = ({
  events,
  entries,
  agent,
  onSelect,
}: {
  events: readonly AgentEvent[];
  entries: readonly AgentLogEntry[];
  agent: string;
  onSelect: (id: string) => void;
}) => {
  const rows: Row[] = [
    ...events
      .filter((event) => event.kind !== 'comment')
      .map((event) => ({
        at: event.createdAt,
        id: event.id,
        type: 'message' as const,
        event,
      })),
    ...entries.map((entry) => ({ at: entry.at, id: entry.id, type: 'log' as const, entry })),
  ].sort((a, b) => a.at - b.at);
  return (
    <ol className="flex flex-col gap-3 text-xs" aria-label="Conversation">
      {rows.map((row) => {
        if (row.type === 'message') {
          return (
            <li key={row.id} className="ml-6 rounded-lg bg-accent p-2">
              <p className="whitespace-pre-wrap">{row.event.text}</p>
              <p className="mt-1 text-muted-foreground">
                Frame {row.event.frame} · {messageStatus(row.event, agent)}
              </p>
            </li>
          );
        }
        const { entry } = row;
        if (entry.kind === 'reply') {
          return (
            <li key={row.id} className="whitespace-pre-wrap text-sm">
              {entry.text}
            </li>
          );
        }
        const { Icon, label } = STEP[entry.kind];
        const target = entry.itemIds[0];
        return (
          <li
            key={row.id}
            className={cn(
              'flex gap-2 text-muted-foreground',
              entry.kind === 'error' && 'text-destructive',
              entry.kind === 'decision' && 'text-foreground',
            )}
          >
            <Icon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            <p className="min-w-0 break-words">
              <span className="sr-only">{label}: </span>
              {target ? (
                <button
                  type="button"
                  className="text-left underline-offset-2 hover:underline"
                  onClick={() => onSelect(target)}
                >
                  {entry.text}
                </button>
              ) : (
                entry.text
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
};
