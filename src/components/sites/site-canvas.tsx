'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { BoundSite } from './site-registry';

interface SiteCanvasProps {
  site: BoundSite;
  layout: 'page' | 'frame';
  introRun: number;
}

export const SiteCanvas = ({ site, layout, introRun }: SiteCanvasProps) => {
  const [introOpen, setIntroOpen] = useState(introRun > 0);
  const closeIntro = useCallback(() => setIntroOpen(false), []);

  useEffect(() => {
    setIntroOpen(introRun > 0);
  }, [introRun]);

  useEffect(() => {
    if (layout !== 'page' || !introOpen) {
      return;
    }
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [layout, introOpen]);

  const body = site.body();
  return (
    <div
      className={cn(site.scope.className, layout === 'frame' && 'relative h-full')}
      style={site.scope.style}
    >
      {layout === 'frame' ? (
        <div className={cn('h-full', introOpen ? 'overflow-hidden' : 'overflow-y-auto')}>
          {body}
        </div>
      ) : (
        body
      )}
      {introOpen && site.hasIntro ? (
        <div data-site-intro className="contents">
          {site.intro(layout === 'frame' ? 'absolute' : 'fixed', closeIntro)}
        </div>
      ) : null}
    </div>
  );
};
