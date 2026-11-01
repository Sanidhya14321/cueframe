'use client';
import { Download, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Job = {
  id: string;
  status: 'queued' | 'working' | 'done' | 'error';
  progress: number;
  label: string;
  result?: { url?: string; fileName?: string };
};
const POLL_MS = 1000;
const MAX_MISSED_POLLS = 5;

export const ExportVideo = ({
  projectId,
  checkpoint,
}: {
  projectId: string;
  checkpoint: () => Promise<void>;
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [problem, setProblem] = useState('');
  const [saving, setSaving] = useState(false);
  const [missed, setMissed] = useState(0);
  const active = job?.status === 'queued' || job?.status === 'working';
  useEffect(() => {
    if (!(job && active)) {
      return;
    }
    const timer = setTimeout(
      () => {
        fetch(`/api/projects/${projectId}/jobs/${job.id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Could not read the export.');
            }
            return response.json() as Promise<Job>;
          })
          .then((next) => {
            setMissed(0);
            setJob(next);
            if (next.status === 'error') {
              setProblem(next.label);
            }
            if (next.status === 'done' && next.result?.url) {
              const link = document.createElement('a');
              link.href = next.result.url;
              link.download = next.result.fileName ?? 'video.mp4';
              link.click();
            }
          })
          .catch(() => {
            if (missed + 1 < MAX_MISSED_POLLS) {
              setMissed(missed + 1);
              return;
            }
            setMissed(0);
            setJob(null);
            setProblem('Lost track of the export. Try again.');
          });
      },
      POLL_MS * 2 ** missed,
    );
    return () => clearTimeout(timer);
  }, [job, active, missed, projectId]);
  const start = async () => {
    setProblem('');
    setSaving(true);
    try {
      await checkpoint();
      const response = await fetch(`/api/projects/${projectId}/render`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        throw new Error('Could not start the export.');
      }
      setJob((await response.json()) as Job);
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'Could not start the export.');
    } finally {
      setSaving(false);
    }
  };
  const busy = saving || active;
  return (
    <>
      {problem ? (
        <span role="alert" className="min-w-0 truncate text-destructive" title={problem}>
          {problem}
        </span>
      ) : null}
      <Button
        size="sm"
        className="shrink-0"
        disabled={busy}
        onClick={() => {
          start().catch(() => undefined);
        }}
      >
        {busy ? <LoaderCircle className="animate-spin" /> : <Download />}
        {saving
          ? 'Saving'
          : active
            ? `Exporting ${Math.round((job?.progress ?? 0) * 100)}%`
            : 'Export'}
      </Button>
    </>
  );
};
