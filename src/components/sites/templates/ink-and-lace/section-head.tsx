import { cn } from '@/lib/utils';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL } from './fonts';
import type { IssueSection } from './issue-sections';

export const SectionHead = ({
  section,
  tone = 'paper',
}: {
  section: IssueSection;
  tone?: 'paper' | 'ink';
}) => (
  <Reveal className="flex items-end gap-4 border-current/25 border-b pb-5 @3xl:gap-8">
    <span
      className={cn(
        DISPLAY,
        'text-[5.5rem] leading-[0.74] tracking-tight [font-variation-settings:"opsz"_96] @3xl:text-[9rem]',
        tone === 'ink' ? 'text-(--il-accent-on-ink)' : 'text-(--il-accent)',
      )}
    >
      {section.number}
    </span>
    <div className="flex min-w-0 flex-col gap-2 pb-1">
      <span className={cn(LABEL, 'opacity-70')}>{section.kicker}</span>
      <h2 className={cn(DISPLAY, 'text-4xl italic leading-none @3xl:text-6xl')}>{section.label}</h2>
    </div>
  </Reveal>
);
