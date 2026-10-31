import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL } from './fonts';
import { KnitCuff } from './ornaments';
import { PartyIcon } from './party-icon';
import { SectionTitle } from './section-title';

const CUFFS = [
  'bg-(--sd-accent)',
  'bg-(--sd-primary)',
  'bg-(--sd-highlight)',
  'bg-(--sd-primary-soft)',
] as const;

export const ParentNotes = ({ content }: { content: SnowDayOneContent }) => {
  const { notes, faqs } = content;
  return (
    <section id="sd-notes" className="scroll-mt-16 px-5 py-16">
      <Reveal>
        <SectionTitle kicker="for the grown-ups" title="Good to know" />
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 @md:grid-cols-2">
        {notes.map((note, index) => (
          <Reveal
            key={index}
            delay={(index % 2) * 120}
            className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_36px_-28px_rgba(30,40,110,0.7)]"
          >
            <KnitCuff className={cn('h-5', CUFFS[index % CUFFS.length])} />
            <div className="flex gap-4 px-5 pt-5 pb-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-(--sd-frost) text-(--sd-primary)">
                <PartyIcon icon={note.icon} className="size-6" />
              </span>
              <div className="flex min-w-0 flex-col items-start">
                <h3
                  className={cn(
                    DISPLAY,
                    'font-semibold text-(--sd-primary) text-2xl leading-tight',
                  )}
                >
                  {note.title}
                </h3>
                <p className="mt-1 whitespace-pre-line text-(--sd-text) leading-relaxed">
                  {note.text}
                </p>
                {note.linkUrl === '' || note.linkLabel === '' ? null : (
                  <a
                    href={note.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      LABEL,
                      'mt-4 rounded-full bg-(--sd-accent) px-5 py-2.5 text-[11px] text-white transition hover:brightness-110',
                    )}
                  >
                    {note.linkLabel}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {faqs.length === 0 ? null : (
        <div className="mx-auto mt-16 max-w-2xl">
          <Reveal>
            <h3 className={cn(DISPLAY, 'text-center font-semibold text-(--sd-primary) text-3xl')}>
              Little questions
            </h3>
          </Reveal>
          <div className="mt-6 flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 60}>
                <details className="group rounded-2xl bg-white px-5 py-4 shadow-[0_10px_24px_-20px_rgba(30,40,110,0.7)] ring-1 ring-(--sd-frost) open:ring-(--sd-secondary)">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-(--sd-text) [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--sd-frost) text-(--sd-primary) transition group-open:rotate-45 group-open:bg-(--sd-highlight)">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-(--sd-muted) leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
