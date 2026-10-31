import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { Reveal } from '../../kit/reveal';
import { BODY, DECO, DISPLAY, FOIL } from './fonts';
import { DecoCorners, SectionTitle } from './ornaments';

const DressCode = ({ dressCode }: { dressCode: MidnightCrownContent['dressCode'] }) => (
  <Reveal className="relative flex flex-col items-center gap-5 bg-(--mc-surface) px-6 py-12 text-center">
    <DecoCorners />
    <span className={cn(DECO, 'text-(--mc-blush) text-[11px]')}>Código de vestimenta</span>
    <h3 className={cn(DISPLAY, FOIL, 'text-5xl italic leading-tight')}>{dressCode.title}</h3>
    <p
      className={cn(
        BODY,
        'max-w-md whitespace-pre-line text-(--mc-text)/90 text-xl leading-relaxed',
      )}
    >
      {dressCode.text}
    </p>
    {dressCode.swatches.length === 0 ? null : (
      <div className="mt-3 flex flex-wrap justify-center gap-5">
        {dressCode.swatches.map((swatch, index) => (
          <span key={index} className="size-9 rotate-45 border border-(--mc-gold) p-1">
            <span className="block size-full" style={{ backgroundColor: swatch.color }} />
          </span>
        ))}
      </div>
    )}
  </Reveal>
);

const Faqs = ({ faqs }: { faqs: MidnightCrownContent['faqs'] }) => (
  <div className="flex w-full flex-col">
    {faqs.map((faq, index) => (
      <Reveal key={index} delay={index * 60}>
        <details className="group border-(--mc-gold)/30 border-b py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span className={cn(DISPLAY, 'text-(--mc-text) text-xl')}>{faq.question}</span>
            <Plus className="size-4 shrink-0 text-(--mc-gold) transition-transform group-open:rotate-45" />
          </summary>
          <p
            className={cn(
              BODY,
              'mt-3 whitespace-pre-line text-(--mc-muted) text-lg leading-relaxed',
            )}
          >
            {faq.answer}
          </p>
        </details>
      </Reveal>
    ))}
  </div>
);

export const Details = ({ content }: { content: MidnightCrownContent }) => (
  <section id="mc-details" className="scroll-mt-14 px-5 py-20">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12">
      <Reveal>
        <SectionTitle kicker="Detalles" title="Good to know" />
      </Reveal>
      <div className="grid w-full items-start gap-12 @3xl:grid-cols-2">
        <DressCode dressCode={content.dressCode} />
        {content.faqs.length === 0 ? null : <Faqs faqs={content.faqs} />}
      </div>
    </div>
  </section>
);
