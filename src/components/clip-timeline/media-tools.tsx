'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { LocalJob } from '@/local/jobs';
import {
  type AudioElement,
  createId,
  createImageElement,
  createTrack,
  createVideoElement,
  identityTransform,
  type Project,
} from '@/project';

const durationOf = (file: File): Promise<number> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
    const done = (duration: number) => {
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    media.preload = 'metadata';
    media.onloadedmetadata = () => done(Number.isFinite(media.duration) ? media.duration : 3);
    media.onerror = () => done(3);
    media.src = url;
  });
const taskBody = (
  kind: 'transcribe' | 'voice' | 'render',
  selectedId: string | null,
  emphasis: string,
  setup: boolean,
  referenceId: string,
  voiceText: string,
) => {
  const body =
    kind === 'transcribe'
      ? {
          itemId: selectedId,
          emphasis: emphasis
            .split(',')
            .map((word) => word.trim())
            .filter(Boolean),
          setup,
        }
      : kind === 'voice'
        ? {
            referenceId,
            ...(voiceText && selectedId
              ? { lines: [{ itemId: selectedId, text: voiceText }] }
              : {}),
          }
        : {};
  return body;
};
export const MediaTools = ({
  projectId,
  project,
  selectedId,
  onChange,
}: {
  projectId: string;
  project: Project;
  selectedId: string | null;
  onChange: (project: Project) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const latest = useRef(project);
  latest.current = project;
  const [job, setJob] = useState<LocalJob | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [emphasis, setEmphasis] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [voiceText, setVoiceText] = useState('');
  useEffect(() => {
    if (!job || job.status === 'done' || job.status === 'error') {
      return;
    }
    const timer = setInterval(() => {
      fetch(`/api/projects/${projectId}/jobs/${job.id}`, { cache: 'no-store' })
        .then((response) => response.json())
        .then((next: LocalJob) => setJob(next))
        .catch(() => setMessage('Reconnecting to local media task…'));
    }, 1000);
    return () => clearInterval(timer);
  }, [job, projectId]);
  const importFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setBusy(true);
    setMessage('Saving media locally…');
    try {
      const response = await fetch(`/api/projects/${projectId}/media`, {
        method: 'POST',
        headers: { 'content-type': file.type },
        body: file,
      });
      if (!response.ok) {
        throw new Error('Choose an image, audio or video file up to 256 MB.');
      }
      const saved = (await response.json()) as { url: string };
      const current = latest.current;
      const duration = file.type.startsWith('image/')
        ? current.durationInFrames
        : Math.max(1, Math.round((await durationOf(file)) * current.fps));
      const track = createTrack(file.name);
      if (file.type.startsWith('video/')) {
        track.elements.push(createVideoElement({ src: saved.url, durationInFrames: duration }));
      } else if (file.type.startsWith('audio/')) {
        const audio: AudioElement = {
          type: 'audio',
          id: createId('audio'),
          src: saved.url,
          from: 0,
          durationInFrames: duration,
          transform: identityTransform(),
          role: 'music',
          volume: 0.5,
        };
        track.elements.push(audio);
      } else {
        track.elements.push(createImageElement({ src: saved.url, durationInFrames: duration }));
      }
      onChange({
        ...current,
        durationInFrames: Math.max(current.durationInFrames, duration),
        tracks: [track, ...current.tracks],
      });
      setMessage('Media saved. Select its timeline item to edit or transcribe it.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Media import failed.');
    } finally {
      setBusy(false);
    }
  };
  const start = async (kind: 'transcribe' | 'voice' | 'render', setup = false) => {
    setBusy(true);
    setMessage('');
    try {
      const body = taskBody(kind, selectedId, emphasis, setup, referenceId, voiceText);
      const response = await fetch(`/api/projects/${projectId}/${kind}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const result = (await response.json()) as { problem?: string };
        throw new Error(result.problem ?? 'Could not start the task.');
      }
      setJob((await response.json()) as LocalJob);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start the task.');
    } finally {
      setBusy(false);
    }
  };
  const result = job?.result as { url?: string; fileName?: string; message?: string } | undefined;
  const working = busy || job?.status === 'queued' || job?.status === 'working';
  const selected = project.tracks
    .flatMap((track) => track.elements)
    .find((item) => item.id === selectedId);
  return (
    <details className="text-xs">
      <summary className="cursor-pointer">Media & render</summary>
      <div className="absolute right-3 z-40 mt-2 flex w-80 flex-col gap-3 rounded-xl border bg-background p-4 shadow-xl">
        <Button
          type="button"
          size="sm"
          disabled={working}
          onClick={() => input.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            importFile(event.dataTransfer.files[0]).catch(() => setMessage('Media import failed.'));
          }}
        >
          Import video, image or audio
        </Button>
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime,audio/*"
          className="hidden"
          aria-label="Import project media"
          onChange={(event) => {
            importFile(event.target.files?.[0]).catch(() => setMessage('Media import failed.'));
          }}
        />
        <label>
          Emphasis words (comma-separated)
          <input
            className="mt-1 w-full rounded border bg-background p-2"
            value={emphasis}
            onChange={(event) => setEmphasis(event.target.value)}
          />
        </label>
        <Button
          type="button"
          size="sm"
          disabled={working || selected?.type !== 'video'}
          onClick={() => start('transcribe')}
        >
          Cut and caption selected video
        </Button>
        <button
          type="button"
          disabled={working}
          className="text-left underline"
          onClick={() => start('transcribe', true)}
        >
          Set up local Whisper
        </button>
        <p className="text-muted-foreground">
          First setup downloads the MIT-licensed engine and an English model (about 75 MB), and
          builds locally. Your video stays on this computer.
        </p>
        <label>
          Fish Audio voice ID
          <input
            className="mt-1 w-full rounded border bg-background p-2"
            value={referenceId}
            onChange={(event) => setReferenceId(event.target.value)}
          />
        </label>
        <label>
          Voice text for selected item (leave blank to use beat-sheet lines)
          <textarea
            className="mt-1 w-full rounded border bg-background p-2"
            value={voiceText}
            onChange={(event) => setVoiceText(event.target.value)}
          />
        </label>
        <Button type="button" size="sm" disabled={working} onClick={() => start('voice')}>
          Generate voiceover
        </Button>
        <Button type="button" size="sm" disabled={working} onClick={() => start('render')}>
          Render full-fidelity MP4
        </Button>
        <p aria-live="polite">{message || job?.label}</p>
        {job && working ? <progress className="w-full" max={1} value={job.progress} /> : null}
        {result?.message ? <p>{result.message}</p> : null}
        {result?.url ? (
          <a className="underline" href={result.url} download={result.fileName}>
            Download rendered MP4
          </a>
        ) : null}
      </div>
    </details>
  );
};
