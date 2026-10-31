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

export const ExportVideo = ({ projectId }: { projectId: string }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [problem, setProblem] = useState('');
  const active = job?.status === 'queued' || job?.status === 'working';
  useEffect(() => {
    if (!(job && active)) {
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/projects/${projectId}/jobs/${job.id}`)
        .then((response) => response.json() as Promise<Job>)
        .then((next) => {
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
        .catch(() => setProblem('Lost track of the export. Try again.'));
    }, POLL_MS);
    return () => clearTimeout(timer);
  }, [job, active, projectId]);
  const start = () => {
    setProblem('');
    fetch(`/api/projects/${projectId}/render`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not start the export.');
        }
        return response.json() as Promise<Job>;
      })
      .then(setJob)
      .catch((error: Error) => setProblem(error.message));
  };
  return (
    <>
      {problem ? (
        <span role="alert" className="truncate text-destructive">
          {problem}
        </span>
      ) : null}
      <Button size="sm" disabled={active} onClick={start}>
        {active ? <LoaderCircle className="animate-spin" /> : <Download />}
        {active ? `Exporting ${Math.round((job?.progress ?? 0) * 100)}%` : 'Export'}
      </Button>
    </>
  );
};
