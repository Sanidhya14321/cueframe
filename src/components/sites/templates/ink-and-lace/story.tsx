import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { Rosette } from './lace';
import { Photo } from './photo';
import { SectionHead } from './section-head';

const DROP_CAP =
  'first-letter:float-left first-letter:mt-1.5 first-letter:mr-3 first-letter:font-[family-name:var(--font-il-display)] first-letter:text-(--il-accent) first-letter:text-[4.6rem] first-letter:leading-[0.78]';

export const Story = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => {
  const { story, photos, couple } = content;
  const paragraphs = story.text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '');
  return (
    <section id={section.id} className="scroll-mt-14 px-5 py-16 @3xl:px-10 @3xl:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead section={section} />
        <Reveal className="mt-10 grid gap-6 @3xl:mt-14 @3xl:grid-cols-12">
          <h3
            className={cn(
              DISPLAY,
              'text-5xl leading-[0.95] tracking-[-0.02em] [font-variation-settings:"opsz"_96] @3xl:col-span-8 @3xl:text-[5.5rem]',
            )}
          >
            {story.headline}
          </h3>
          <p
            className={cn(
              SANS,
              'text-(--il-muted) text-lg leading-relaxed @3xl:col-span-4 @3xl:self-end',
            )}
          >
            {story.deck}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-12 @3xl:mt-16 @3xl:grid-cols-12">
          <Reveal className="flex flex-col gap-5 @3xl:col-span-7 @3xl:block @3xl:columns-2 @3xl:gap-10">
            <span className={cn(LABEL, 'mb-4 block text-(--il-accent)')}>
              By {couple.firstName} &amp; {couple.secondName}
            </span>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  SANS,
                  'whitespace-pre-line text-[15px] leading-[1.75] @3xl:mb-5 @3xl:break-inside-avoid-column',
                  index === 0 && DROP_CAP,
                )}
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={150} className="relative @3xl:col-span-5">
            <figure>
              <Photo src={photos.storyOne} alt="" className="aspect-[3/4] w-[82%]" />
              <figcaption className={cn(LABEL, 'mt-3 text-(--il-muted) text-[9px]')}>
                Fig. 02
              </figcaption>
            </figure>
            <figure className="-mt-28 relative ml-auto w-[52%] border-(--il-paper) border-[6px] bg-(--il-paper)">
              <Photo src={photos.storyTwo} alt="" className="aspect-square w-full" />
              <figcaption className={cn(LABEL, 'mt-2 text-right text-(--il-muted) text-[9px]')}>
                Fig. 03
              </figcaption>
            </figure>
          </Reveal>
        </div>
        {story.pullQuote === '' ? null : (
          <Reveal className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-6 border-current/25 border-y py-12 text-center @3xl:mt-24">
            <Rosette className="size-12 text-(--il-accent)" />
            <blockquote
              className={cn(
                DISPLAY,
                'text-3xl italic leading-[1.2] @3xl:text-5xl @3xl:leading-[1.15]',
              )}
            >
              <span className="text-(--il-accent)">&ldquo;</span>
              {story.pullQuote}
              <span className="text-(--il-accent)">&rdquo;</span>
            </blockquote>
          </Reveal>
        )}
      </div>
    </section>
  );
};
