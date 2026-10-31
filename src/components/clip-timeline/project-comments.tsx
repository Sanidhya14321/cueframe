'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import type { PublicProjectState } from '@/local/project-state';
export const ProjectComments = ({
  state,
  frames,
  selectedId,
  onSelect,
  onSeek,
}: {
  state: PublicProjectState;
  frames: FrameStore;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSeek: (frame: number) => void;
}) => {
  const frame = useFrame(frames);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/projects/${state.id}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, frame, ...(selectedId ? { itemId: selectedId } : {}) }),
      });
      if (!response.ok) {
        throw new Error('Could not send comment.');
      }
      setText('');
      setMessage('Comment sent to the agent.');
    } catch {
      setMessage('Could not send comment.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <details className="text-xs">
      <summary className="cursor-pointer">
        Comments ({state.comments.filter((comment) => comment.status !== 'done').length})
      </summary>
      <div className="absolute right-3 z-40 mt-2 w-80 rounded-xl border bg-background p-4 shadow-xl">
        <label htmlFor="project-comment" className="block pb-2">
          {selectedId ? 'Comment on selected item' : 'Comment at playhead'} · frame {frame}
        </label>
        <textarea
          id="project-comment"
          aria-label="Comment for agent"
          className="w-full rounded border bg-background p-2"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="button" size="sm" disabled={!text.trim() || busy} onClick={send}>
          Send to agent
        </Button>
        <p className="py-2" aria-live="polite">
          {message}
        </p>
        <ol className="max-h-52 overflow-y-auto">
          {state.comments.toReversed().map((comment) => (
            <li key={comment.id} className="border-t py-2">
              <button
                type="button"
                className="text-left"
                onClick={() => {
                  if (comment.itemId) {
                    onSelect(comment.itemId);
                  }
                  onSeek(comment.frame);
                }}
              >
                <span className="font-medium">
                  {comment.status} · frame {comment.frame}
                </span>
                <p>{comment.text}</p>
                {comment.note ? <p className="text-emerald-600">{comment.note}</p> : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
};
