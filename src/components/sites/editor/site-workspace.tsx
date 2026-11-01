'use client';

import { ExternalLink, Lock, Monitor, RotateCw, Smartphone } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { Button } from '@/components/ui/button';
import { resolveClipControls } from '@/core/clip-controls';
import { cn } from '@/lib/utils';
import type { SiteTemplate } from '@/sites/types';
import { SiteCanvas } from '../site-canvas';
import { type BoundSite, bindSite } from '../site-registry';

type Device = 'phone' | 'desktop';

interface SiteWorkspaceProps {
  template: SiteTemplate;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  toolbar: ReactNode;
  status: ReactNode;
  address: string;
  liveUrl: string | null;
}

const useLastValidSite = (templateId: string, values: unknown): BoundSite | null => {
  const last = useRef<BoundSite | null>(null);
  const site = bindSite(templateId, values);
  if (site !== null) {
    last.current = site;
  }
  return site ?? last.current;
};

const BrowserBar = ({
  address,
  liveUrl,
  device,
  onDevice,
  onReload,
}: {
  address: string;
  liveUrl: string | null;
  device: Device;
  onDevice: (device: Device) => void;
  onReload: () => void;
}) => (
  <div className="flex h-11 shrink-0 items-center gap-2 border-border border-b bg-muted/70 px-3">
    <div className={cn('hidden gap-1.5', device === 'desktop' && 'sm:flex')}>
      <span className="size-3 rounded-full bg-[#ff5f57]" />
      <span className="size-3 rounded-full bg-[#febc2e]" />
      <span className="size-3 rounded-full bg-[#28c840]" />
    </div>
    <Button
      type="button"
      size="icon-xs"
      variant="ghost"
      aria-label="Reload website"
      onClick={onReload}
      className="text-muted-foreground"
    >
      <RotateCw />
    </Button>
    <div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-background px-3 text-muted-foreground text-xs">
      <Lock className="size-3 shrink-0" />
      <span className="truncate">{address}</span>
    </div>
    {liveUrl === null ? null : (
      <Button asChild size="icon-xs" variant="ghost" className="text-muted-foreground">
        <a href={liveUrl} target="_blank" rel="noreferrer" aria-label="Open website in a new tab">
          <ExternalLink />
        </a>
      </Button>
    )}
    <div className="hidden items-center sm:flex">
      {(['phone', 'desktop'] as const).map((option) => (
        <Button
          key={option}
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label={option === 'phone' ? 'Phone size' : 'Desktop size'}
          aria-pressed={device === option}
          onClick={() => onDevice(option)}
          className={cn(
            'text-muted-foreground',
            device === option && 'bg-background text-foreground',
          )}
        >
          {option === 'phone' ? <Smartphone /> : <Monitor />}
        </Button>
      ))}
    </div>
  </div>
);

const DESKTOP_VIEWPORT = 1280;

export const SiteWorkspace = ({
  template,
  values,
  onChange,
  toolbar,
  status,
  address,
  liveUrl,
}: SiteWorkspaceProps) => {
  const [device, setDevice] = useState<Device>('desktop');
  const [pane, setPane] = useState<'preview' | 'content'>('preview');
  const [surfaceWidth, setSurfaceWidth] = useState(DESKTOP_VIEWPORT);
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = surface.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setSurfaceWidth(entry?.contentRect.width ?? DESKTOP_VIEWPORT);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const scale = device === 'desktop' ? Math.min(1, surfaceWidth / DESKTOP_VIEWPORT) : 1;
  const [reloads, setReloads] = useState(0);
  const sections = useMemo(
    () => resolveClipControls(template.schema, template.controls, template.defaults),
    [template],
  );
  const site = useLastValidSite(template.id, values);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
      <div className="flex shrink-0 border-b lg:hidden">
        {(['preview', 'content'] as const).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={pane === name}
            onClick={() => setPane(name)}
            className={cn(
              'min-h-11 flex-1 text-sm capitalize',
              pane === name ? 'bg-accent text-foreground' : 'text-muted-foreground',
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        className={cn(
          'min-h-0 flex-1 flex-col gap-3 bg-muted/40 p-3 sm:p-4 lg:flex',
          pane === 'preview' ? 'flex' : 'hidden',
        )}
      >
        <div className="flex min-h-8 flex-wrap items-center gap-2">
          <div className="text-muted-foreground text-xs">{status}</div>
          <div className="ml-auto flex flex-wrap items-center gap-2">{toolbar}</div>
        </div>
        <div className="flex min-h-0 flex-1 justify-center">
          <div
            className={cn(
              'flex h-full flex-col overflow-hidden bg-background shadow-xl ring-1 ring-foreground/10 transition-[width] duration-300',
              device === 'phone' ? 'w-[390px] max-w-full rounded-[22px]' : 'w-full rounded-xl',
            )}
          >
            <BrowserBar
              address={address}
              liveUrl={liveUrl}
              device={device}
              onDevice={setDevice}
              onReload={() => setReloads(reloads + 1)}
            />
            <div ref={surface} className="min-h-0 flex-1 overflow-hidden">
              {site === null ? (
                <p className="p-8 text-center text-muted-foreground text-sm">
                  Some values are not valid yet.
                </p>
              ) : (
                <div
                  className="h-full origin-top-left"
                  style={
                    scale < 1
                      ? {
                          width: DESKTOP_VIEWPORT,
                          height: `${100 / scale}%`,
                          transform: `scale(${scale})`,
                        }
                      : undefined
                  }
                >
                  <SiteCanvas key={reloads} site={site} layout="frame" introRun={reloads} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <aside
        className={cn(
          'min-h-0 flex-1 overflow-y-auto px-4 lg:block lg:w-[360px] lg:flex-none lg:border-l',
          pane === 'content' ? 'block' : 'hidden',
        )}
      >
        <PropertiesPanel sections={sections} values={values} onChange={onChange} />
      </aside>
    </div>
  );
};
