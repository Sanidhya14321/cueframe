'use client';
import { Copy, LoaderCircle, Mic, Pin, Send, Square, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { StickToBottom } from 'use-stick-to-bottom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import { useDictation } from '@/lib/use-dictation';
import type { useLiveProject } from '@/lib/use-live-project';
import { findElement } from '@/project';
import { AgentLibraryPicker, type LibraryRef } from './agent-library-picker';
import { AgentTimeline } from './agent-timeline';
import { useAgentLog } from './use-agent-log';

type Props = {
  editor: ReturnType<typeof useLiveProject>;
  frames: FrameStore;
  selectedId: string | null;
  select: (id: string) => void;
  onClose: () => void;
};

const listenPrompt = (id: string) =>
  `Open cueframe project ${id}, then keep calling wait_for_events and handle each request until I say stop.`;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: one panel owns its chat states
export const AgentPanel = ({ editor, frames, selectedId, select, onClose }: Props) => {
  const state = editor.state;
  const frame = useFrame(frames);
  const log = useAgentLog(state?.id ?? '');
  const [text, setText] = useState('');
  const [refs, setRefs] = useState<LibraryRef[]>([]);
  const [pinned, setPinned] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { recording, busy, toggle } = useDictation(
    (spoken) => setText((current) => `${current} ${spoken}`.trim()),
    setMessage,
  );
  if (!state) {
    return null;
  }
  const agentName = state.agent?.name ?? 'Claude Code';
  const selected = selectedId ? findElement(editor.value, selectedId)?.element : null;
  const selectedName = selected?.type === 'composition' ? selected.clipId : selected?.type;
  const itemCount = editor.value.tracks.reduce((sum, track) => sum + track.elements.length, 0);
  const queued = state.events.some((event) => event.status === 'queued');
  const handling = state.events.some((event) => event.status === 'in-progress');
  const working = handling || state.agent?.status === 'working';
  const send = async (event: FormEvent) => {
    event.preventDefault();
    const body = [
      text.trim(),
      ...refs.map((item) => `Use the ${item.type} "${item.title}" (${item.id}).`),
    ]
      .filter(Boolean)
      .join('\n');
    setSending(true);
    try {
      const response = await fetch(`/api/projects/${state.id}/agent-events`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'voice',
          text: body,
          frame: frames.get(),
          itemId: pinned ? selectedId : null,
        }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      setText('');
      setRefs([]);
      setPinned(false);
      setMessage('Sent');
    } catch {
      setMessage('Could not send this message. Try again.');
    } finally {
      setSending(false);
    }
  };
  return (
    <aside
      aria-label="Agent"
      className="fixed inset-0 z-50 flex flex-col bg-background lg:static lg:z-auto lg:w-96 lg:shrink-0 lg:border-l"
    >
      <header className="flex h-10 shrink-0 items-center gap-2 border-b px-3 text-xs">
        <span className="min-w-0 flex-1 truncate">
          {agentName} ·{' '}
          <span className={working ? 'text-agent' : 'text-muted-foreground'}>
            {working ? 'Working' : log.listening ? 'Listening' : 'Not listening'}
          </span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={!state.activity.some((entry) => entry.actor.startsWith('agent:'))}
          onClick={editor.undoAgent}
        >
          Undo agent turn
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Close agent panel" onClick={onClose}>
          <X />
        </Button>
      </header>
      <details className="shrink-0 border-b px-3 py-2 text-xs">
        <summary className="cursor-pointer text-muted-foreground">Shared with the agent</summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="text-muted-foreground">Project</dt>
          <dd className="truncate">{state.title}</dd>
          <dt className="text-muted-foreground">Timeline</dt>
          <dd>
            {itemCount} items · revision {state.revision}
          </dd>
          <dt className="text-muted-foreground">Playhead</dt>
          <dd className="tabular-nums">Frame {frame}</dd>
          <dt className="text-muted-foreground">Selected</dt>
          <dd className="truncate">{selectedName ?? 'Nothing'}</dd>
          <dt className="text-muted-foreground">Brief</dt>
          <dd className="line-clamp-3">{state.brief || 'None'}</dd>
        </dl>
      </details>
      <StickToBottom className="relative min-h-0 flex-1" initial="instant" resize="smooth">
        <StickToBottom.Content className="flex flex-col gap-3 p-3">
          {state.events.length === 0 && log.entries.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Ask for an edit. The agent's reasoning, decisions and actions appear here and stay
              with this project.
            </p>
          ) : (
            <AgentTimeline
              events={state.events}
              entries={log.entries}
              agent={agentName}
              onSelect={select}
            />
          )}
          {working ? (
            <p role="status" className="flex items-center gap-2 text-xs text-agent">
              <LoaderCircle
                aria-hidden
                className="size-3.5 animate-spin motion-reduce:animate-none"
              />
              {state.agent?.label || 'Working on your request'}
            </p>
          ) : null}
        </StickToBottom.Content>
      </StickToBottom>
      {queued && !log.listening ? (
        <div role="alert" className="shrink-0 border-t p-3 text-xs">
          <p>
            Your message is saved, but no agent is reading this project. Paste this into Claude Code
            to start it.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              navigator.clipboard
                .writeText(listenPrompt(state.id))
                .then(() => setMessage('Copied'))
                .catch(() => setMessage(listenPrompt(state.id)));
            }}
          >
            <Copy />
            Copy prompt
          </Button>
        </div>
      ) : null}
      <form className="flex shrink-0 flex-col gap-2 border-t p-3" onSubmit={send}>
        {refs.length > 0 ? (
          <ul className="flex flex-wrap gap-1 text-xs">
            {refs.map((item) => (
              <li key={`${item.type}:${item.id}`}>
                <button
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1"
                  onClick={() => setRefs(refs.filter((entry) => entry !== item))}
                >
                  {item.title}
                  <X aria-hidden className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <Textarea
          aria-label="Message your agent"
          placeholder="Ask for an edit"
          className="max-h-40 min-h-16 text-xs"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="flex items-center gap-1">
          <AgentLibraryPicker
            onPick={(item) => setRefs(refs.includes(item) ? refs : [...refs, item])}
          />
          {selectedName ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Limit this request to ${selectedName}`}
              aria-pressed={pinned}
              className={pinned ? 'text-primary' : ''}
              onClick={() => setPinned(!pinned)}
            >
              <Pin />
            </Button>
          ) : null}
          <span
            role="status"
            aria-label="Voice request status"
            className="min-w-0 flex-1 truncate text-xs text-muted-foreground"
          >
            {message}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={recording ? 'Stop recording' : 'Record voice request'}
            aria-pressed={recording}
            disabled={busy || sending}
            onClick={toggle}
          >
            {recording ? <Square /> : <Mic />}
          </Button>
          <Button
            type="submit"
            size="icon-sm"
            aria-label="Send"
            disabled={busy || recording || sending || (!text.trim() && refs.length === 0)}
          >
            <Send />
          </Button>
        </div>
      </form>
    </aside>
  );
};
