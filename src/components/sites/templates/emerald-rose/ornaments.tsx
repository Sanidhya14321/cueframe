import { cn } from '@/lib/utils';

export const RoseSprig = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 200"
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('pointer-events-none', className)}
  >
    <path d="M60 196 C57 166 66 134 60 92" />
    <path d="M60 150 C42 142 30 148 20 134 C36 126 52 132 60 150 Z" />
    <path d="M60 150 Q40 138 22 134" strokeWidth="0.8" />
    <path d="M61 124 C78 112 92 118 102 102 C86 96 70 104 61 124 Z" />
    <path d="M61 124 Q82 110 100 103" strokeWidth="0.8" />
    <path d="M60 108 C70 100 76 92 80 80" />
    <path d="M80 80 C73 76 73 64 80 60 C87 64 87 76 80 80 Z" />
    <path d="M38 66 C34 44 50 32 60 34 C72 32 88 42 82 66 C78 80 66 88 60 92 C52 88 40 80 38 66 Z" />
    <path d="M46 58 C48 46 58 42 64 46 C72 44 76 54 72 62" />
    <path d="M60 52 C64 50 68 54 66 58 C64 63 56 63 54 58 C51 51 59 44 66 47" />
    <path d="M42 70 C50 75 70 75 78 70" />
    <path d="M47 79 C54 83 66 83 73 79" strokeWidth="0.9" />
  </svg>
);

export const Flourish = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 240 20"
    aria-hidden
    fill="none"
    stroke="currentColor"
    className={cn('pointer-events-none', className)}
  >
    <path d="M0 10 H96 M144 10 H240" strokeWidth="1" />
    <path d="M120 2 L128 10 L120 18 L112 10 Z" strokeWidth="1.2" />
    <circle cx="104" cy="10" r="2" fill="currentColor" stroke="none" />
    <circle cx="136" cy="10" r="2" fill="currentColor" stroke="none" />
  </svg>
);
