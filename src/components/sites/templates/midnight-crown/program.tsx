import { cn } from '@/lib/utils';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DECO, DISPLAY, FOIL } from './fonts';
import { Crown, SectionTitle, Sparkle } from './ornaments';
import { Starfield } from './starfield';

export const Program = ({ content }: { content: MidnightCrownContent }) => (
  <section
    id="mc-program"
    className="relative scroll-mt-14 overflow-hidden bg-(--mc-surface-deep) px-5 py-20"
  >
    <Starfield variant="band" />
    <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-12">
      <Reveal>
        <SectionTitle kicker="Programa" title="Program of the night" />
      </Reveal>
      <ol className="relative flex w-full flex-col">
        <span className="absolute top-3 bottom-3 left-[6.75rem] w-px bg-linear-to-b from-transparent via-(--mc-gold)/70 to-transparent @md:left-1/2" />
        {content.schedule.map((moment, index) => (
          <li key={index}>
            <Reveal
              delay={index * 80}
              className="relative grid grid-cols-[5.5rem_1.5rem_minmax(0,1fr)] items-center gap-2 py-4 @md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] @md:gap-6"
            >
              <span
                className={cn(
                  DISPLAY,
                  FOIL,
                  'whitespace-nowrap text-right text-xl italic leading-none @md:text-3xl',
                )}
              >
                {moment.time}
              </span>
              <span className="flex justify-center">
                <span className="flex size-3.5 rotate-45 items-center justify-center border border-(--mc-gold) bg-(--mc-bg)">
                  <span className="size-1.5 bg-(--mc-blush)" />
                </span>
              </span>
              <span className="flex flex-col">
                <span className={cn(DISPLAY, 'text-(--mc-text) text-xl @md:text-2xl')}>
                  {moment.title}
                </span>
                {moment.note === '' ? null : (
                  <span className={cn(BODY, 'text-(--mc-muted) text-base italic')}>
                    {moment.note}
                  </span>
                )}
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export const Court = ({ content }: { content: MidnightCrownContent }) => {
  const { court, photos } = content;
  if (court.escort === '' && court.pairs.length === 0) {
    return null;
  }
  return (
    <section id="mc-court" className="relative scroll-mt-14 overflow-hidden px-5 py-20">
      <SitePhoto
        src={photos.court}
        alt=""
        className="absolute inset-0 size-full opacity-30"
        emptyClassName="hidden"
      />
      <div className="absolute inset-0 bg-linear-to-b from-(--mc-bg) via-(--mc-bg)/80 to-(--mc-bg)" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-12">
        <Reveal>
          <SectionTitle kicker="Damas y chambelanes" title="Court of honour" />
        </Reveal>
        {court.escort === '' ? null : (
          <Reveal className="flex flex-col items-center gap-2 text-center">
            <Crown className="w-10" />
            <span className={cn(DECO, 'text-(--mc-blush) text-[11px]')}>Chambelán de honor</span>
            <span className={cn(DISPLAY, 'text-(--mc-text) text-3xl italic @3xl:text-4xl')}>
              {court.escort}
            </span>
          </Reveal>
        )}
        {court.pairs.length === 0 ? null : (
          <Reveal className="w-full max-w-2xl border-(--mc-gold)/40 border-y bg-(--mc-surface)/70 px-4 py-8 backdrop-blur-sm @md:px-10">
            <div className="grid grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 @md:gap-x-6">
              <span className={cn(DECO, 'text-right text-(--mc-blush) text-[11px]')}>Damas</span>
              <span />
              <span className={cn(DECO, 'text-(--mc-gold) text-[11px]')}>Chambelanes</span>
              {court.pairs.map((pair, index) => (
                <div key={index} className="contents">
                  <span className={cn(DISPLAY, 'text-right text-(--mc-text) text-lg @md:text-xl')}>
                    {pair.dama}
                  </span>
                  <Sparkle className="size-3 justify-self-center text-(--mc-gold)" />
                  <span className={cn(DISPLAY, 'text-(--mc-text) text-lg @md:text-xl')}>
                    {pair.chambelan}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};
