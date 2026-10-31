import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { BODY, DISPLAY, LABEL } from './fonts';
import { LeafIcon, MAPLE, OVAL_LEAF, Pumpkin } from './ornaments';
import { SectionTitle } from './pill';

const BADGES = [
  { shape: MAPLE, fill: 'var(--pp-primary)', ring: 'bg-(--pp-primary-soft)' },
  { shape: OVAL_LEAF, fill: 'var(--pp-secondary)', ring: 'bg-(--pp-sage-soft)' },
  { shape: MAPLE, fill: 'var(--pp-accent)', ring: 'bg-(--pp-accent-soft)' },
] as const;

export const LittleDetails = ({ content }: { content: PumpkinPatchContent }) => {
  const { details, faqs } = content;
  return (
    <section id="pp-details" className="scroll-mt-16 bg-(--pp-oat) px-5 py-20">
      {details.length === 0 ? null : (
        <>
          <Reveal>
            <SectionTitle kicker="good to know" title="A few little things" />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
            {details.map((detail, index) => {
              const badge = BADGES[index % BADGES.length] ?? BADGES[0];
              return (
                <Reveal
                  key={index}
                  delay={(index % 3) * 120}
                  className="relative flex flex-col items-center rounded-[1.75rem] bg-(--pp-card) px-6 pt-12 pb-8 text-center shadow-[0_18px_36px_-28px_rgba(60,30,10,0.6)]"
                >
                  <span className="pointer-events-none absolute inset-2.5 rounded-[1.4rem] border-(--pp-primary)/30 border-2 border-dashed" />
                  <span
                    className={cn(
                      'absolute -top-7 grid size-14 place-items-center rounded-full ring-4 ring-(--pp-oat)',
                      badge.ring,
                    )}
                  >
                    <LeafIcon shape={badge.shape} fill={badge.fill} className="size-7" />
                  </span>
                  <h3 className={cn(DISPLAY, 'text-2xl')}>{detail.title}</h3>
                  <p
                    className={cn(
                      BODY,
                      'mt-3 whitespace-pre-line text-(--pp-muted) leading-relaxed',
                    )}
                  >
                    {detail.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </>
      )}
      {faqs.length === 0 ? null : (
        <div className="mx-auto mt-20 max-w-2xl">
          <Reveal className="flex items-end justify-center gap-3">
            <Pumpkin tone="accent" leaf={false} className="w-12" />
            <h2 className={cn(DISPLAY, 'text-4xl')}>Questions</h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 80}>
                <details className="group rounded-2xl bg-(--pp-card) px-6 py-4 shadow-[0_10px_24px_-22px_rgba(60,30,10,0.7)]">
                  <summary
                    className={cn(
                      LABEL,
                      'flex cursor-pointer list-none items-center justify-between gap-4 text-[12px] leading-relaxed [&::-webkit-details-marker]:hidden',
                    )}
                  >
                    {faq.question}
                    <Plus className="size-4 shrink-0 text-(--pp-primary) transition-transform group-open:rotate-45" />
                  </summary>
                  <p
                    className={cn(
                      BODY,
                      'mt-3 whitespace-pre-line text-(--pp-muted) leading-relaxed',
                    )}
                  >
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
