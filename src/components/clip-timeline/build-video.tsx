'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const beatRole = (index: number, total: number) => {
  if (index === 0) {
    return 'hook';
  }
  if (index === total - 1) {
    return 'cta';
  }
  if (index === Math.floor((total * 2) / 3)) {
    return 'turn';
  }
  return index % 4 === 0 ? 'proof' : 'point';
};
export const BuildVideo = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState(
    'Meet ClipKit\nCreate with agents\nWatch every change\nKeep full control\nPick a look\nMake it yours\nTiming that lands\nWords that move\nProof in motion\nOne clear story\nBuild in real time\nNow the drop\nYour voice matters\nPolish every frame\nExport your video\nStart creating today',
  );
  const [message, setMessage] = useState('');
  const build = async () => {
    setBusy(true);
    setMessage('Building…');
    try {
      const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const response = await fetch(`/api/projects/${projectId}/build`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          targetSeconds: 30,
          aspect: 'landscape',
          segments: lines.map((line, index) => ({
            role: beatRole(index, lines.length),
            text: line,
            energy: index === Math.floor((lines.length * 2) / 3) ? 5 : 3,
          })),
        }),
      });
      const result = (await response.json()) as { problem?: string };
      if (!response.ok) {
        throw new Error(result.problem ?? 'Build failed.');
      }
      setMessage('Built a 30-second video. Play it below.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Build failed.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)} className="text-xs">
      <summary className="cursor-pointer">Build from beats</summary>
      {open ? (
        <div className="absolute left-3 z-40 mt-2 w-80 rounded-xl border bg-background p-4 shadow-xl">
          <label htmlFor="beat-lines" className="block pb-2 font-medium">
            16 beats, one short line each
          </label>
          <textarea
            id="beat-lines"
            className="h-52 w-full rounded border bg-background p-2"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button size="sm" type="button" disabled={busy} onClick={build}>
            Build 30-second video
          </Button>
          <p aria-live="polite" className="mt-2">
            {message}
          </p>
        </div>
      ) : null}
    </details>
  );
};
