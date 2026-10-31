import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY, LABEL } from './fonts';
import { RoseSprig } from './ornaments';

export const Schedule = ({ content }: { content: EmeraldRoseContent }) => {
  const { schedule, photos, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section id="er-schedule" className="scroll-mt-16 px-5 py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-14 @3xl:grid-cols-[0.8fr_1.2fr] @3xl:gap-20">
        <Reveal className="relative mx-auto w-[min(100%,18rem)] @3xl:w-full">
          <div className="rounded-[50%] outline outline-(--er-accent) outline-offset-8">
            <SitePhoto
              src={photos.schedule}
              alt=""
              className="aspect-[3/4] w-full rounded-[50%]"
              emptyClassName="bg-(--er-primary)/15"
            />
          </div>
          <RoseSprig className="-bottom-6 absolute right-0 w-20 @md:-right-6 rotate-12 text-(--er-secondary)" />
        </Reveal>
        <Reveal delay={150}>
          {when === null ? null : (
            <span className={cn(LABEL, 'text-(--er-secondary) text-[10px]')}>
              {when.weekday} &middot; {when.month} {when.day}
            </span>
          )}
          <h2 className={cn(DISPLAY, 'mt-3 text-5xl italic @3xl:text-6xl')}>The programme</h2>
          <ol className="mt-10 border-(--er-accent)/60 border-t">
            {schedule.map((moment, index) => (
              <li
                key={index}
                className="flex items-baseline gap-4 border-(--er-accent)/60 border-b py-4"
              >
                <span
                  className={cn(
                    DISPLAY,
                    'w-20 shrink-0 text-(--er-secondary) text-lg tabular-nums @md:w-24 @md:text-xl',
                  )}
                >
                  {moment.time}
                </span>
                <span className="mb-1.5 hidden h-px flex-1 border-(--er-accent) border-b border-dotted @md:block" />
                <span
                  className={cn(BODY, 'flex-1 text-xl @md:flex-none @md:text-right @md:text-2xl')}
                >
                  {moment.title}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
};
