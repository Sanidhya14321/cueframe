import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { BODY, DISPLAY, LABEL } from './fonts';

export const Faqs = ({ faqs }: { faqs: EmeraldRoseContent['faqs'] }) =>
  faqs.length === 0 ? null : (
    <section id="er-faqs" className="scroll-mt-16 px-5 py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-[0.8fr_1.2fr] @3xl:gap-20">
        <Reveal>
          <span className={cn(LABEL, 'text-(--er-secondary) text-[10px]')}>Before you ask</span>
          <h2 className={cn(DISPLAY, 'mt-3 text-5xl italic leading-tight @3xl:text-6xl')}>
            Questions, answered
          </h2>
        </Reveal>
        <Reveal delay={150} className="border-(--er-accent)/60 border-t">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border-(--er-accent)/60 border-b"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className={cn(DISPLAY, 'text-xl @md:text-2xl')}>{faq.question}</span>
                <Plus className="size-5 shrink-0 text-(--er-accent) transition-transform group-open:rotate-45" />
              </summary>
              <p
                className={cn(
                  BODY,
                  'whitespace-pre-line pb-6 text-(--er-muted) text-xl leading-relaxed',
                )}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
