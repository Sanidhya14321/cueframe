import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DISPLAY, HAND, LABEL } from './fonts';

export const PILL = cn(
  LABEL,
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[11px] transition hover:-translate-y-0.5 hover:shadow-md',
);

export const PILL_SOLID =
  'bg-(--pp-primary) text-(--pp-card) shadow-[0_6px_0_-2px_var(--pp-primary-deep)]';

export const PILL_OUTLINE = 'border-2 border-(--pp-text)/80 text-(--pp-text) hover:bg-(--pp-card)';

export const PillLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noreferrer" className={cn(PILL, className)}>
    {children}
  </a>
);

export const SectionTitle = ({
  kicker,
  title,
  className,
  kickerClassName,
}: {
  kicker: string;
  title: string;
  className?: string;
  kickerClassName?: string;
}) => (
  <div className={cn('flex flex-col items-center text-center', className)}>
    <span className={cn(HAND, 'text-(--pp-primary) text-3xl', kickerClassName)}>{kicker}</span>
    <h2 className={cn(DISPLAY, 'text-4xl leading-tight @md:text-5xl')}>{title}</h2>
  </div>
);
