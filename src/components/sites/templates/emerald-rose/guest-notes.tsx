import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { BODY, DISPLAY, LABEL } from './fonts';
import { TextLink } from './links';

const DressCode = ({ dressCode }: { dressCode: EmeraldRoseContent['dressCode'] }) => (
  <Reveal className="flex flex-col gap-8 bg-(--er-secondary) px-6 py-10 text-(--er-bg) @md:col-span-2 @md:px-10 @3xl:flex-row @3xl:items-center @3xl:justify-between">
    <div className="max-w-md">
      <span className={cn(LABEL, 'text-(--er-bg)/70 text-[10px]')}>What to wear</span>
      <h3 className={cn(DISPLAY, 'mt-2 text-4xl italic')}>Dress code</h3>
      <p className={cn(BODY, 'mt-3 whitespace-pre-line text-xl leading-relaxed')}>
        {dressCode.text}
      </p>
    </div>
    {dressCode.swatches.length === 0 ? null : (
      <div className="flex items-end gap-2 @md:gap-3">
        {dressCode.swatches.map((swatch, index) => (
          <span
            key={index}
            className="relative h-24 w-9 overflow-hidden rounded-t-full shadow-[0_10px_20px_-10px_rgba(0,0,0,0.6)] ring-(--er-bg)/50 ring-1 @md:h-28 @md:w-12"
            style={{ backgroundColor: swatch.color, marginBottom: `${(index % 2) * 12}px` }}
          >
            <span className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white/20 to-transparent" />
          </span>
        ))}
      </div>
    )}
  </Reveal>
);

export const GuestNotes = ({ content }: { content: EmeraldRoseContent }) => {
  const { details, dressCode } = content;
  return (
    <section id="er-details" className="scroll-mt-16 bg-(--er-paper) px-5 py-20 @3xl:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex flex-col items-center text-center">
          <span className={cn(LABEL, 'text-(--er-muted) text-[10px]')}>Good to know</span>
          <h2 className={cn(DISPLAY, 'mt-3 text-5xl italic @3xl:text-6xl')}>Guest notes</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 @md:grid-cols-2">
          {details.map((detail, index) => (
            <Reveal key={index} className="border-(--er-accent)/60 border-t pt-6">
              <div className="flex items-baseline gap-4">
                <span className={cn(DISPLAY, 'text-(--er-accent) text-2xl tabular-nums')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={cn(DISPLAY, 'text-3xl italic')}>{detail.title}</h3>
              </div>
              <p className={cn(BODY, 'mt-3 whitespace-pre-line text-xl leading-relaxed')}>
                {detail.text}
              </p>
              {detail.linkUrl === '' || detail.linkLabel === '' ? null : (
                <TextLink href={detail.linkUrl} className="mt-5 text-(--er-primary)">
                  {detail.linkLabel}
                </TextLink>
              )}
            </Reveal>
          ))}
          <DressCode dressCode={dressCode} />
        </div>
      </div>
    </section>
  );
};
