'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeroReel } from './hero-reel';

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
    <section
      aria-label="Start a video"
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14"
    >
      <div className="flex min-w-0 flex-col gap-8">
        <h1 className="text-balance font-display text-5xl leading-[1.05] xl:text-7xl">
          Your coding agent, now a video editor. Watch it build, then take over.
        </h1>
        <div className="flex flex-wrap gap-2">
          {STARTS.map((start, index) => (
            <Link
              key={start.href}
              href={start.href}
              className={`inline-flex min-h-11 items-center rounded-md px-4 text-sm transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${index === 0 ? 'bg-primary font-medium text-primary-foreground hover:bg-primary/90' : 'border hover:bg-accent'}`}
            >
              {start.label}
            </Link>
          ))}
        </div>
        {recent.length > 0 ? (
          <nav aria-label="Recent projects" className="flex flex-wrap items-center gap-x-3 text-sm">
            <span className="text-muted-foreground">Resume</span>
            {recent.map((project) => (
              <Link
                key={project.id}
                href={`/video/${project.id}`}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {project.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <HeroReel />
    </section>
  );
};
