'use client';

import { CircleAlert, LoaderCircle, Plug, Unplug } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Connection = { connected: boolean; name: string; unavailable: boolean };

const connectionDisplay = (state: Connection | null) => {
  if (!state) {
    return {
      label: 'Checking agent connection',
      shortLabel: 'Checking agent',
      compactLabel: 'Checking',
      Icon: LoaderCircle,
    };
  }
  if (state.unavailable) {
    return {
      label: 'Agent connection unavailable',
      shortLabel: 'Unavailable',
      compactLabel: 'Error',
      Icon: CircleAlert,
    };
  }
  return state.connected
    ? {
        label: `Connected: ${state.name}`,
        shortLabel: state.name,
        compactLabel: 'Online',
        Icon: Plug,
      }
    : {
        label: 'No agent connected',
        shortLabel: 'Connect agent',
        compactLabel: 'Offline',
        Icon: Unplug,
      };
};

export const StudioConnection = () => {
  const [state, setState] = useState<Connection | null>(null);
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const refresh = async () => {
      if (document.visibilityState === 'hidden') {
        return;
      }
      try {
        const response = await fetch('/api/connect', {
          cache: 'no-store',
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
        });
        if (!response.ok) {
          throw new Error('Connection unavailable');
        }
        const data = (await response.json()) as { connected: boolean; name: string };
        if (!disposed) {
          setState({ connected: data.connected, name: data.name, unavailable: false });
        }
      } catch {
        if (!disposed) {
          setState({ connected: false, name: '', unavailable: true });
        }
      }
    };
    refresh().catch(() => undefined);
    const timer = window.setInterval(() => refresh().catch(() => undefined), 5000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  const { label, shortLabel, compactLabel, Icon } = connectionDisplay(state);
  return (
    <>
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {label}
      </span>
      <Link
        href="/connect"
        aria-label={`${label}. Open agent connections`}
        title={label}
        className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-md px-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground md:flex-row md:gap-2 md:px-2 xl:px-3"
      >
        <Icon className={cn('size-3.5 md:size-4', state?.connected && 'text-success')} />
        <span className="md:hidden">{compactLabel}</span>
        <span className="hidden max-w-24 truncate md:block">{shortLabel}</span>
      </Link>
    </>
  );
};
