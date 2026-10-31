import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { romanNumeral } from './date-words';
import { BODY, DISPLAY, LABEL } from './fonts';
import { Flourish } from './ornaments';

type Entry =
  | { kind: 'photo'; src: string; caption: string }
  | { kind: 'chapter'; numeral: string; text: string };

const Node = ({ filled }: { filled: boolean }) => (
  <span
    className={cn(
      'absolute top-2 -left-8 size-3 -translate-x-1/2 rotate-45 border border-(--er-accent) @3xl:left-1/2',
      filled ? 'bg-(--er-accent)' : 'bg-(--er-paper)',
    )}
  />
);

const EntryBody = ({ entry }: { entry: Entry }) =>
  entry.kind === 'photo' ? (
    <figure className="w-full max-w-xs">
      <div className="bg-(--er-bg) p-2 shadow-[0_18px_36px_-22px_rgba(0,0,0,0.6)]">
        <SitePhoto
          src={entry.src}
          alt={entry.caption}
          className="aspect-[4/3] w-full"
          emptyClassName="bg-(--er-primary)/15"
        />
      </div>
      <figcaption className={cn(DISPLAY, 'mt-3 text-(--er-secondary) text-3xl italic')}>
        {entry.caption}
      </figcaption>
    </figure>
  ) : (
    <div className="max-w-md">
      <span className={cn(LABEL, 'text-(--er-accent) text-[10px]')}>Chapter {entry.numeral}</span>
      <p className={cn(BODY, 'mt-3 whitespace-pre-line text-xl leading-relaxed')}>{entry.text}</p>
    </div>
  );

export const LoveStory = ({ content }: { content: EmeraldRoseContent }) => {
  const { story, photos } = content;
  const chapters = story.text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '');
  const entries: Entry[] = [
    { kind: 'photo', src: photos.storyThen, caption: story.thenLabel },
    ...chapters.map(
      (text, index): Entry => ({ kind: 'chapter', numeral: romanNumeral(index), text }),
    ),
    { kind: 'photo', src: photos.storyNow, caption: story.nowLabel },
  ];
  return (
    <section id="er-story" className="scroll-mt-16 bg-(--er-paper) px-5 py-20 @3xl:py-28">
      <Reveal className="flex flex-col items-center text-center">
        <span className={cn(LABEL, 'text-(--er-muted) text-[10px]')}>How we got here</span>
        <h2 className={cn(DISPLAY, 'mt-3 text-5xl italic @3xl:text-6xl')}>Our story</h2>
        <Flourish className="mt-5 w-40 text-(--er-accent)" />
      </Reveal>
      <div className="relative mx-auto mt-14 max-w-5xl pl-8 @3xl:pl-0">
        <span className="absolute top-2 bottom-2 left-0 w-px bg-(--er-accent)/60 @3xl:left-1/2" />
        <ol>
          {entries.map((entry, index) => {
            const right = index % 2 === 1;
            return (
              <li
                key={index}
                className="relative pb-14 last:pb-0 @3xl:grid @3xl:grid-cols-2 @3xl:gap-16"
              >
                <Node filled={entry.kind === 'photo'} />
                <Reveal
                  className={cn(
                    'flex',
                    right
                      ? '@3xl:col-start-2 @3xl:justify-start'
                      : '@3xl:justify-end @3xl:text-right',
                  )}
                >
                  <EntryBody entry={entry} />
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
