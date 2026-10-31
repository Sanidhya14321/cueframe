'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import type { AgentEvent } from '@/local/event-schema';
import type { PublicProjectState } from '@/local/project-state';
import type { Project } from '@/project';
import { splitVideoAtFrame } from '@/project/opencut/split-video';

export const AgentRequests = ({
  state,
  frames,
  selectedId,
  project,
  onChange,
}: {
  state: PublicProjectState;
  frames: FrameStore;
  selectedId: string | null;
  project: Project;
  onChange: (project: Project) => void;
}) => {
  const frame = useFrame(frames);
  const [kind, setKind] = useState<AgentEvent['kind']>('job');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const selected = project.tracks
    .flatMap((track) => track.elements)
    .find((item) => item.id === selectedId);
  const send = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/projects/${state.id}/agent-events`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          text,
          frame,
          itemId: kind === 'brief' || kind === 'job' ? null : selectedId,
        }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      setText('');
      setMessage('Queued locally. Open Connect to check your agent.');
    } catch {
      setMessage('Could not queue this request. Check the local server and try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="min-h-11 text-xs">
          Agent requests & video tools
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Agent requests and video tools" className="space-y-3 text-xs">
        <h2 className="font-display text-2xl">Send work to your agent</h2>
        <p className="text-muted-foreground">
          Requests wait on this computer until an agent picks them up.
        </p>
        <label htmlFor="agent-request-type" className="block">
          Request type
          <select
            id="agent-request-type"
            aria-label="Agent request type"
            className="mt-1 h-11 w-full rounded-md bg-input px-2"
            value={kind}
            onChange={(event) => setKind(event.target.value as AgentEvent['kind'])}
          >
            <option value="job">New job</option>
            <option value="comment">Timeline comment</option>
            <option value="voice">Voice request (text)</option>
            <option value="brief">Update brief</option>
          </select>
        </label>
        <label htmlFor="agent-request-text" className="block">
          Request
          <Textarea
            id="agent-request-text"
            aria-label="Agent request"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-1"
          />
        </label>
        <p className="text-muted-foreground">
          Frame {frame}
          {selectedId
            ? ` · ${selected?.type === 'composition' ? selected.clipId.replaceAll('-', ' ') : (selected?.type ?? 'Selected item')}`
            : ' · No item selected'}
        </p>
        <Button className="min-h-11" disabled={busy || !text.trim()} onClick={send}>
          Queue request
        </Button>
        <p role="status" aria-label="Agent request feedback">
          {message}
        </p>
        {state.brief ? (
          <p className="whitespace-pre-wrap">
            <strong>Current brief:</strong> {state.brief}
          </p>
        ) : null}
        <Link href="/connect" className="inline-flex min-h-11 items-center underline">
          Connect an agent
        </Link>
        <ol className="space-y-2" aria-label="Agent request queue">
          {state.events.toReversed().map((event) => (
            <li key={event.id} className="border-t pt-2">
              <p>
                {event.kind} · {event.status}
              </p>
              <p>{event.text}</p>
              {event.note ? <p className="text-success">{event.note}</p> : null}
            </li>
          ))}
        </ol>
        <div className="space-y-2 border-t pt-3">
          <h3 className="font-medium">Split video</h3>
          <p className="text-muted-foreground">
            Select a video and seek inside it. Split keeps the original source and saves both halves
            as one undoable edit.
          </p>
          <Input readOnly aria-label="Split frame" value={frame} />
          <Button
            className="min-h-11"
            disabled={
              selected?.type !== 'video' ||
              frame <= selected.from ||
              frame >= selected.from + selected.durationInFrames
            }
            onClick={() => onChange(splitVideoAtFrame(project, selectedId ?? '', frame))}
          >
            Split video at playhead
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
