import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY, HAND, LABEL } from './fonts';
import { Pumpkin, type PumpkinTone } from './ornaments';
import { SectionTitle } from './pill';

const STOP_TONES: readonly PumpkinTone[] = ['primary', 'cream', 'sage', 'accent'];

export const Afternoon = ({ content }: { content: PumpkinPatchContent }) => {
  const { schedule, photos, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section id="pp-afternoon" className="scroll-mt-16 px-5 py-20">
      <Reveal>
        <SectionTitle kicker="a little plan for" title="The afternoon" />
        {when === null ? null : (
          <p className={cn(LABEL, 'mt-3 text-center text-(--pp-muted) text-[11px]')}>
            {when.weekday}, {when.month} {when.day}
          </p>
        )}
      </Reveal>
      <Reveal className="mx-auto mt-10 max-w-5xl">
        <div className="relative h-44 overflow-hidden rounded-[2rem] @3xl:h-64">
          <SitePhoto
            src={photos.brunch}
            alt="The afternoon"
            className="size-full"
            emptyClassName="bg-(--pp-oat)"
          />
          <div className="absolute inset-0 bg-linear-to-t from-(--pp-night)/50 to-transparent" />
          <span
            className={cn(
              HAND,
              'absolute bottom-4 left-6 font-bold text-(--pp-card) text-3xl drop-shadow',
            )}
          >
            brunch, games &amp; gifts
          </span>
        </div>
      </Reveal>
      <div className="relative mx-auto mt-12 max-w-5xl">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.95rem] w-0.5 rounded-full bg-(--pp-secondary)/50 @3xl:top-[1.95rem] @3xl:right-[8%] @3xl:bottom-auto @3xl:left-[8%] @3xl:h-0.5 @3xl:w-auto"
        />
        <ol className="relative grid gap-8 @3xl:auto-cols-fr @3xl:grid-flow-col @3xl:gap-6">
          {schedule.map((moment, index) => (
            <li key={index}>
              <Reveal
                delay={index * 120}
                className="relative flex items-start gap-5 @3xl:flex-col @3xl:items-center @3xl:text-center"
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-(--pp-bg)">
                  <Pumpkin
                    tone={STOP_TONES[index % STOP_TONES.length] ?? 'primary'}
                    leaf={index % 2 === 0}
                    className="w-14"
                  />
                </span>
                <div className="flex flex-col gap-1 pt-1">
                  <span className={cn(HAND, 'font-bold text-(--pp-primary) text-2xl leading-none')}>
                    {moment.time}
                  </span>
                  <span className={cn(DISPLAY, 'text-2xl leading-tight')}>{moment.title}</span>
                  <span className={cn(BODY, 'text-(--pp-muted) leading-relaxed')}>
                    {moment.note}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
