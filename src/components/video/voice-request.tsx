'use client';
import { Mic, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FrameStore } from '@/lib/frame-store';

type Props = { projectId: string; frames: FrameStore; selectedId: string | null };
export const VoiceRequest = ({ projectId, frames, selectedId }: Props) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<'idle' | 'recording' | 'transcribing' | 'sending'>('idle');
  const recorder = useRef<MediaRecorder | null>(null);
  const transcribe = async (audio: Blob) => {
    setPhase('transcribing');
    setMessage('Transcribing on this computer. First use also sets up Whisper.');
    try {
      const response = await fetch('/api/voice-input', { method: 'POST', body: audio });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.problem);
      }
      setText((current) => `${current} ${result.text}`.trim());
      setMessage(result.text ? 'Check the text, then send it.' : 'No speech was heard.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not transcribe that recording.');
    } finally {
      setPhase('idle');
    }
  };
  const toggleRecording = async () => {
    if (recorder.current) {
      recorder.current.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const next = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      next.ondataavailable = (event) => chunks.push(event.data);
      next.onstop = () => {
        recorder.current = null;
        for (const track of stream.getTracks()) {
          track.stop();
        }
        transcribe(new Blob(chunks, { type: next.mimeType })).catch(() => undefined);
      };
      recorder.current = next;
      next.start();
      setPhase('recording');
      setMessage('Listening. Press stop when you finish.');
    } catch {
      setMessage('Allow microphone access in your browser, or type your request.');
    }
  };
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
  const recording = phase === 'recording';
  return (
    <form
      className="flex min-w-64 flex-1 flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        send().catch(() => undefined);
      }}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11"
        aria-label={recording ? 'Stop recording' : 'Record voice request'}
        aria-pressed={recording}
        disabled={phase === 'transcribing' || phase === 'sending'}
        onClick={toggleRecording}
      >
        {recording ? <Square /> : <Mic />}
      </Button>
      <Input
        aria-label="Voice request"
        className="min-h-11 min-w-40 flex-1 text-xs"
        placeholder="Speak or type an edit for your agent"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button
        type="submit"
        variant="outline"
        className="min-h-11 text-xs"
        disabled={phase !== 'idle' || !text.trim()}
      >
        Send
      </Button>
      <span role="status" aria-label="Voice request status" className="basis-full empty:hidden">
        {message}
      </span>
    </form>
  );
};
