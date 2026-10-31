import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL } from './fonts';
import type { IssueSection } from './issue-sections';
import { SectionHead } from './section-head';

export const Party = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => (
  <section id={section.id} className="scroll-mt-14 px-5 py-16 @3xl:px-10 @3xl:py-24">
    <div className="mx-auto max-w-6xl">
      <SectionHead section={section} />
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 @3xl:mt-14 @3xl:grid-cols-3 @3xl:gap-x-12">
        {content.party.map((person, index) => (
          <li key={index}>
            <Reveal
              delay={(index % 3) * 80}
              className="flex flex-col gap-2 border-current border-t pt-4"
            >
              <span className={cn(LABEL, 'text-(--il-accent) text-[9px]')}>{person.role}</span>
              <span className={cn(DISPLAY, 'text-2xl leading-tight @3xl:text-4xl')}>
                {person.name}
              </span>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
