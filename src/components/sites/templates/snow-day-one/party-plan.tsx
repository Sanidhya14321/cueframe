import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { DISPLAY, LABEL } from './fonts';
import { SnowDrift, Sparkle } from './ornaments';
import { PartyIcon } from './party-icon';
import { SectionTitle } from './section-title';

export const PartyPlan = ({ content }: { content: SnowDayOneContent }) => {
  const { schedule, photos, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section id="sd-plan" className="relative scroll-mt-16 bg-(--sd-frost)">
      <SnowDrift fill="var(--sd-bg)" className="h-12 rotate-180 @3xl:h-16" />
      <div className="mx-auto max-w-4xl px-5 pt-6 pb-16">
        <Reveal className="flex flex-col items-center">
          <div className="relative">
            <SitePhoto
              src={photos.party}
              alt=""
              className="size-28 rotate-6 rounded-full ring-4 ring-white shadow-lg @md:size-32"
              emptyClassName="bg-(--sd-secondary)"
            />
            <Sparkle className="-right-4 absolute top-0 size-6 text-(--sd-highlight)" />
          </div>
          <SectionTitle kicker="the snow day plan" title="Party timeline" className="mt-5" />
          {when === null ? null : (
            <span className={cn(LABEL, 'mt-3 text-(--sd-muted) text-xs')}>
              {when.weekday}, {when.month} {when.day}
            </span>
          )}
        </Reveal>
        <ol className="relative mt-12">
          <span className="absolute top-4 bottom-4 left-7 border-white border-l-4 border-dashed @3xl:left-1/2 @3xl:-translate-x-1/2" />
          {schedule.map((moment, index) => {
            const left = index % 2 === 0;
            return (
              <li
                key={index}
                className="relative grid grid-cols-[auto_1fr] items-center gap-4 py-3 @3xl:grid-cols-[1fr_auto_1fr] @3xl:gap-8"
              >
                <span className="relative z-10 flex size-14 items-center justify-center rounded-full bg-white text-(--sd-primary) shadow-md ring-4 ring-(--sd-highlight) @3xl:col-start-2 @3xl:row-start-1">
                  <PartyIcon icon={moment.icon} className="size-7" />
                </span>
                <Reveal
                  delay={80}
                  className={cn(
                    'rounded-3xl bg-white px-5 py-4 shadow-[0_16px_30px_-24px_rgba(30,40,110,0.7)] @3xl:row-start-1',
                    left ? '@3xl:col-start-1 @3xl:text-right' : '@3xl:col-start-3',
                  )}
                >
                  <span
                    className={cn(
                      LABEL,
                      'inline-block rounded-full bg-(--sd-highlight) px-3 py-1 text-(--sd-text) text-[10px]',
                    )}
                  >
                    {moment.time}
                  </span>
                  <h3
                    className={cn(
                      DISPLAY,
                      'mt-2 font-semibold text-(--sd-primary) text-2xl leading-tight',
                    )}
                  >
                    {moment.title}
                  </h3>
                  {moment.note === '' ? null : (
                    <p className="mt-1 text-(--sd-muted) text-sm leading-relaxed">{moment.note}</p>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
      <SnowDrift fill="var(--sd-bg)" className="h-12 @3xl:h-16" />
    </section>
  );
};
