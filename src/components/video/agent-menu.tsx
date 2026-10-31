'use client';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FrameStore } from '@/lib/frame-store';
import type { useLiveProject } from '@/lib/use-live-project';
import { VoiceRequest } from './voice-request';

type Props = {
  editor: ReturnType<typeof useLiveProject>;
  frames: FrameStore;
  selectedId: string | null;
  select: (id: string) => void;
};

export const AgentMenu = ({ editor, frames, selectedId, select }: Props) => {
  const state = editor.state;
  if (!state) {
    return null;
  }
  const working = state.agent?.status === 'working';
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={working ? 'text-agent' : ''}>
          <Bot />
          Agent
          {working ? <span className="size-1.5 animate-pulse rounded-full bg-current" /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-96 flex-col gap-3 text-xs">
        <p className="text-muted-foreground">
          {state.agent?.name ?? 'Agent'} · {state.agent?.status ?? 'idle'}
          {state.agent?.label ? ` · ${state.agent.label}` : ''}
        </p>
        <VoiceRequest projectId={state.id} frames={frames} selectedId={selectedId} />
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          disabled={!state.activity.some((entry) => entry.actor.startsWith('agent:'))}
          onClick={editor.undoAgent}
        >
          Undo agent turn
        </Button>
        <section aria-label="Activity" className="max-h-48 overflow-y-auto">
          {state.activity.toReversed().map((entry) => (
            <button
              type="button"
              className="block w-full truncate py-1 text-left text-muted-foreground hover:text-foreground"
              key={entry.id}
              onClick={() => {
                const id = entry.itemIds[0];
                if (id) {
                  select(id);
                }
              }}
            >
              {entry.author} · {entry.label}
            </button>
          ))}
        </section>
      </PopoverContent>
    </Popover>
  );
};
