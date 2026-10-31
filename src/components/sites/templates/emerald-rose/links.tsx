import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LABEL } from './fonts';

export const TextLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={cn(
      LABEL,
      'inline-flex items-center gap-1.5 border-current/40 border-b pb-1 text-[11px] transition hover:border-current',
      className,
    )}
  >
    {children}
    <ArrowUpRight className="size-3.5" />
  </a>
);

export const BUTTON = cn(
  LABEL,
  'inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[11px] transition hover:brightness-110',
);
