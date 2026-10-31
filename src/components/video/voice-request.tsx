'use client';
import { Mic, Square } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FrameStore } from '@/lib/frame-store';
import { useDictation } from '@/lib/use-dictation';

type Props = { projectId: string; frames: FrameStore; selectedId: string | null };
export const VoiceRequest = ({ projectId, frames, selectedId }: Props) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<'idle' | 'sending'>('idle');
  const { recording, busy, toggle } = useDictation(
    (spoken) => setText((current) => `${current} ${spoken}`.trim()),
    setMessage,
  );
  const send = async () => {
    setPhase('sending');
    try {
      const response = await fetch(`/api/projects/${projectId}/agent-events`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'voice',
          text: text.trim(),
          frame: frames.get(),
          itemId: selectedId,
        }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      setText('');
      setMessage('Sent. Your connected agent will pick this up.');
    } catch {
      setMessage('Could not send this request. Try again.');
    } finally {
      setPhase('idle');
    }
  };
  return (
    <form
      className="flex w-full flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        send().catch(() => undefined);
      }}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        aria-label={recording ? 'Stop recording' : 'Record voice request'}
        aria-pressed={recording}
        disabled={busy || phase === 'sending'}
        onClick={toggle}
      >
        {recording ? <Square /> : <Mic />}
      </Button>
      <Input
        aria-label="Voice request"
        className="h-9 min-w-40 flex-1 text-xs"
        placeholder="Speak or type an edit for your agent"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button
        type="submit"
        variant="outline"
        className="min-h-11 text-xs"
        disabled={busy || recording || phase !== 'idle' || !text.trim()}
      >
        Send
      </Button>
      <span role="status" aria-label="Voice request status" className="basis-full empty:hidden">
        {message}
      </span>
    </form>
  );
};
