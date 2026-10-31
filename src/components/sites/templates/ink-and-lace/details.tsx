import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { SectionHead } from './section-head';
import { TextLink } from './text-link';

export const Details = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => (
  <section
    id={section.id}
    className="scroll-mt-14 bg-(--il-paper-deep) px-5 py-16 @3xl:px-10 @3xl:py-24"
  >
    <div className="mx-auto max-w-6xl">
      <SectionHead section={section} />
      <div className="mt-10 grid gap-x-16 gap-y-12 @3xl:mt-14 @3xl:grid-cols-2">
        {content.details.map((detail, index) => (
          <Reveal
            key={index}
            delay={(index % 2) * 120}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 @3xl:grid-cols-[3.5rem_1fr]"
          >
            <span className={cn(DISPLAY, 'text-(--il-accent) text-2xl italic leading-none')}>
              {String.fromCharCode(97 + index)}.
            </span>
            <div className="flex flex-col items-start gap-3">
              <h3 className={cn(DISPLAY, 'text-3xl leading-none')}>{detail.title}</h3>
              <p className={cn(SANS, 'whitespace-pre-line text-[15px] leading-[1.75]')}>
                {detail.text}
              </p>
              {detail.linkUrl === '' || detail.linkLabel === '' ? null : (
                <TextLink href={detail.linkUrl} className="mt-1">
                  {detail.linkLabel}
                </TextLink>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
