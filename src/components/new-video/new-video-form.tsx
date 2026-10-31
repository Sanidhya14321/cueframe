'use client';
import { Mic, Square } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDictation } from '@/lib/use-dictation';
import { createTrack } from '@/project';

const ASPECTS = {
  '9:16': [1080, 1920],
  '1:1': [1080, 1080],
  '16:9': [1920, 1080],
} as const;
type Aspect = keyof typeof ASPECTS;
const LENGTHS = [15, 30, 45, 60];
const FPS = 30;

export const NewVideoForm = () => {
  const router = useRouter();
  const upload = useSearchParams().get('tab') === 'upload';
  const [prompt, setPrompt] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [aspect, setAspect] = useState<Aspect>('9:16');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const dictation = useDictation(
    (text) => setPrompt((current) => `${current} ${text}`.trim()),
    setMessage,
  );
  const post = async (url: string, init: RequestInit) => {
    const response = await fetch(url, { method: 'POST', ...init });
    if (!response.ok) {
      throw new Error('request failed');
    }
    return response.json();
  };
  const json = { 'content-type': 'application/json' };
  const start = async () => {
    setBusy(true);
    setMessage('');
    try {
      const [width, height] = ASPECTS[aspect];
      const state = (await post('/api/projects', {
        headers: json,
        body: JSON.stringify({
          title: prompt.trim().slice(0, 60) || file?.name.slice(0, 60) || 'Untitled video',
          project: {
            width,
            height,
            fps: FPS,
            durationInFrames: seconds * FPS,
            background: '#0a0a0a',
            tracks: [createTrack('Clips')],
          },
        }),
      })) as { id: string };
      if (file) {
        await post(`/api/projects/${state.id}/media`, {
          headers: { 'content-type': file.type },
          body: file,
        });
      }
      if (prompt.trim()) {
        await post(`/api/projects/${state.id}/compose`, {
          headers: json,
          body: JSON.stringify({ brief: prompt.trim() }),
        });
        const text = `${prompt.trim()}\nLength: ${seconds}s. Aspect: ${aspect}.`;
        await post(`/api/projects/${state.id}/agent-events`, {
          headers: json,
          body: JSON.stringify({ kind: 'job', text }),
        });
      }
      router.push(`/video/${state.id}`);
    } catch {
      setMessage('Could not create this video. Check the file type and try again.');
      setBusy(false);
    }
  };
  return (
    <form
      className="flex max-w-2xl flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        start().catch(() => undefined);
      }}
    >
      {upload ? (
        <label htmlFor="new-video-file" className="flex flex-col gap-1 text-sm">
          Video to edit
          <Input
            id="new-video-file"
            type="file"
            accept="video/*"
            className="min-h-11"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      ) : null}
      <label htmlFor="new-video-prompt" className="flex flex-col gap-1 text-sm">
        {upload ? 'What should the agent do?' : 'What should this video show?'}
        <Textarea
          id="new-video-prompt"
          value={prompt}
          rows={4}
          placeholder="A 30 second launch video for a note-taking app"
          onChange={(event) => setPrompt(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-4">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          aria-pressed={dictation.recording}
          disabled={dictation.busy}
          onClick={dictation.toggle}
        >
          {dictation.recording ? <Square /> : <Mic />}
          {dictation.recording ? 'Stop' : 'Speak'}
        </Button>
        <label className="flex items-center gap-2 text-sm">
          Length
          <select
            className="h-11 rounded-md bg-input px-2"
            value={seconds}
            onChange={(event) => setSeconds(Number(event.target.value))}
          >
            {LENGTHS.map((length) => (
              <option key={length} value={length}>
                {length} s
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          Aspect
          <select
            className="h-11 rounded-md bg-input px-2"
            value={aspect}
            onChange={(event) => setAspect(event.target.value as Aspect)}
          >
            {Object.keys(ASPECTS).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <Button
        type="submit"
        className="min-h-11 self-start"
        disabled={busy || dictation.recording || (upload ? !file : !prompt.trim())}
      >
        {busy ? 'Creating…' : 'Start'}
      </Button>
      <p role="status" aria-label="New video status" className="text-sm empty:hidden">
        {message}
      </p>
    </form>
  );
};
