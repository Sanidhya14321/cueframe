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
      'group inline-flex items-center gap-1.5 border-current border-b pb-1 transition-opacity hover:opacity-70',
      className,
    )}
  >
    {children}
    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </a>
);
