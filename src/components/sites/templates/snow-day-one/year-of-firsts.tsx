import { cn } from '@/lib/utils';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { DISPLAY, HAND, LABEL } from './fonts';
import { SectionTitle } from './section-title';

const TILTS = ['-rotate-3', 'rotate-2', '-rotate-1'] as const;
const PINS = ['bg-(--sd-accent)', 'bg-(--sd-highlight)', 'bg-(--sd-primary)'] as const;

const Snapshot = ({ src, caption, index }: { src: string; caption: string; index: number }) => (
  <Reveal delay={index * 120} className="flex justify-center">
    <figure
      className={cn(
        'relative w-full max-w-64 rounded-2xl bg-white p-3 pb-4 shadow-[0_18px_40px_-22px_rgba(30,40,110,0.55)] transition hover:rotate-0',
        TILTS[index % TILTS.length],
      )}
    >
      <span
        className={cn(
          '-top-3 -translate-x-1/2 absolute left-1/2 h-6 w-16 rounded-md opacity-80',
          PINS[index % PINS.length],
        )}
      />
      <SitePhoto
        src={src}
        alt={caption}
        className="aspect-[4/5] w-full rounded-xl"
        emptyClassName="bg-(--sd-frost)"
      />
      <figcaption className={cn(HAND, 'mt-3 text-center text-(--sd-text) text-2xl')}>
        {caption}
      </figcaption>
    </figure>
  </Reveal>
);

export const YearOfFirsts = ({ content }: { content: SnowDayOneContent }) => {
  const { story, photos, firsts } = content;
  const snaps = [
    { src: photos.snapOne, caption: story.captionOne },
    { src: photos.snapTwo, caption: story.captionTwo },
    { src: photos.snapThree, caption: story.captionThree },
  ];
  return (
    <section id="sd-firsts" className="scroll-mt-16 px-5 pt-10 pb-20">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
        <SectionTitle kicker="one whole year" title="A year of firsts" />
        <p className="mt-5 whitespace-pre-line text-center text-(--sd-text) text-lg leading-relaxed">
          {story.text}
        </p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 @md:grid-cols-3 @md:gap-5">
        {snaps.map((snap, index) => (
          <Snapshot key={index} src={snap.src} caption={snap.caption} index={index} />
        ))}
      </div>
      {firsts.length === 0 ? null : (
        <ol className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-4">
          {firsts.map((first, index) => (
            <li key={index}>
              <Reveal
                delay={index * 90}
                className="flex size-32 flex-col items-center justify-center rounded-full bg-white px-3 text-center shadow-[inset_0_-8px_0_var(--sd-frost),0_14px_28px_-20px_rgba(30,40,110,0.6)] ring-2 ring-(--sd-frost) @md:size-36"
              >
                <span className={cn(LABEL, 'text-(--sd-accent) text-[10px]')}>{first.when}</span>
                <span
                  className={cn(
                    DISPLAY,
                    'mt-1 font-medium text-(--sd-primary) text-base leading-tight',
                  )}
                >
                  {first.what}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
