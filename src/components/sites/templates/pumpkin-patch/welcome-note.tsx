import { cn } from '@/lib/utils';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY, HAND, LABEL } from './fonts';
import { GINGHAM, Pumpkin } from './ornaments';

const LINED_PAPER =
  'bg-(--pp-card) bg-[repeating-linear-gradient(transparent_0,transparent_31px,color-mix(in_oklab,var(--pp-accent)_22%,transparent)_31px,color-mix(in_oklab,var(--pp-accent)_22%,transparent)_32px)]';

export const WelcomeNote = ({ content }: { content: PumpkinPatchContent }) => {
  const { welcome, family, photos } = content;
  const paragraphs = welcome.text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '');
  return (
    <section id="pp-welcome" className={cn('scroll-mt-16 px-5 py-20', GINGHAM)}>
      <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="relative mx-auto w-full max-w-xs">
          <div className="aspect-square overflow-hidden rounded-full border-(--pp-card) border-[10px] shadow-[0_24px_48px_-28px_rgba(60,30,10,0.6)]">
            <SitePhoto
              src={photos.welcome}
              alt={welcome.title}
              className="size-full"
              emptyClassName="bg-(--pp-oat)"
            />
          </div>
          <div className="absolute -right-2 -bottom-2 flex size-28 rotate-12 flex-col items-center justify-center rounded-full bg-(--pp-secondary) text-center text-(--pp-card) shadow-lg">
            <span className={cn(LABEL, 'text-[8px]')}>Hosted by</span>
            <span className={cn(HAND, 'px-2 font-bold text-lg leading-tight')}>
              {family.hostedBy}
            </span>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div
            className={cn(
              'relative -rotate-1 rounded-sm px-7 pt-10 pb-8 shadow-[0_20px_40px_-26px_rgba(60,30,10,0.55)] @md:px-10',
              LINED_PAPER,
            )}
          >
            <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-(--pp-accent)/45" />
            <Pumpkin tone="cream" className="absolute -top-8 -right-5 w-20 rotate-12" />
            <h2 className={cn(DISPLAY, 'text-4xl leading-tight')}>{welcome.title}</h2>
            <div className={cn(BODY, 'mt-5 flex flex-col gap-4 text-lg leading-8')}>
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className={cn(HAND, 'mt-6 text-(--pp-primary) text-3xl')}>
              with love, {welcome.signature}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
