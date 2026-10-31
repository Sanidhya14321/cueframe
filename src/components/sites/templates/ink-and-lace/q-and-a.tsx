import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { SectionHead } from './section-head';

const Marker = ({ letter }: { letter: string }) => (
  <span className={cn(DISPLAY, 'w-7 shrink-0 text-(--il-accent) text-xl italic leading-[1.4]')}>
    {letter}
  </span>
);

export const QAndA = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => (
  <section id={section.id} className="scroll-mt-14 px-5 py-16 @3xl:px-10 @3xl:py-24">
    <div className="mx-auto max-w-6xl">
      <SectionHead section={section} />
      <div className="mt-10 grid gap-x-16 @3xl:mt-14 @3xl:grid-cols-2">
        {content.faqs.map((faq, index) => (
          <Reveal
            key={index}
            delay={(index % 2) * 120}
            className="flex flex-col gap-3 border-current/20 border-b py-7"
          >
            <div className="flex">
              <Marker letter="Q." />
              <h3 className={cn(DISPLAY, 'text-2xl leading-snug')}>{faq.question}</h3>
            </div>
            <div className="flex">
              <Marker letter="A." />
              <p
                className={cn(
                  SANS,
                  'whitespace-pre-line text-(--il-muted) text-[15px] leading-[1.75]',
                )}
              >
                {faq.answer}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
