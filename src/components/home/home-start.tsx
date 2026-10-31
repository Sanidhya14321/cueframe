'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Recent = { id: string; title: string };
const STARTS = [
  { href: '/new', label: 'Create from a prompt' },
  { href: '/new?tab=upload', label: 'Edit a video' },
  { href: '/library', label: 'Start from a clip' },
];
export const HomeStart = () => {
  const [recent, setRecent] = useState<Recent[]>([]);
  useEffect(() => {
    fetch('/api/projects')
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: Recent[]) => setRecent(rows.slice(0, 4)))
      .catch(() => setRecent([]));
  }, []);
  return (
    <section aria-label="Start a video" className="flex flex-col gap-6">
      <h1 className="max-w-4xl font-display text-4xl sm:text-6xl">
        Your coding agent, now a video editor. Watch it build, then take over.
      </h1>
      <div className="flex flex-wrap gap-2">
        {STARTS.map((start) => (
          <Link
            key={start.href}
            href={start.href}
            className="inline-flex min-h-11 items-center rounded-md border px-4 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            {start.label}
          </Link>
        ))}
      </div>
      {recent.length > 0 ? (
        <nav aria-label="Recent projects" className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Resume</span>
          {recent.map((project) => (
            <Link
              key={project.id}
              href={`/video/${project.id}`}
              className="inline-flex min-h-11 items-center underline"
            >
              {project.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
};
