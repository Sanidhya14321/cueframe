import type { MailinfraDewStepsProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { BodyCopy, FadeIn, Headline } from '../promo/typography';
import { EnvelopeMark } from './glyphs';
import { type DewPlan, FRAME_HEIGHT, FRAME_WIDTH } from './timeline';

export const IntroTitle = ({
  props,
  plan,
  speed,
}: {
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  speed: number;
}) => {
  const { intro, type, look, silk } = props;
  const leave = plan.stops[0]?.leave ?? plan.pullStart;
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        top: silk.height + 150,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Headline
        text={intro.title}
        highlight={intro.highlight}
        size={type.titleSize}
        color={look.ink}
        accent={look.accent}
        align="center"
        start={10 / speed}
        end={leave / speed - 15}
      />
    </div>
  );
};

export const StepCopy = ({
  props,
  plan,
  speed,
}: {
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  speed: number;
}) => {
  const { steps, drop, silk, layout, type, look } = props;
  const centerY = silk.height + silk.sag + drop.neck + drop.size;
  return (
    <>
      {plan.stops.map((stop) => {
        const step = steps[stop.index];
        if (step === undefined) {
          return null;
        }
        const right = stop.side === 'right';
        const left = right
          ? stop.screenX + drop.size + layout.textGap
          : stop.screenX - drop.size - layout.textGap - layout.textWidth;
        const align = right ? 'left' : 'right';
        const start = (stop.arrive - 4) / speed;
        const end = stop.nextLeave / speed - 15;
        return (
          <div
            key={`${stop.index}-${step.title}`}
            style={{
              position: 'absolute',
              left,
              width: layout.textWidth,
              top: centerY - 300,
              height: 600,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: right ? 'flex-start' : 'flex-end',
              gap: 18,
            }}
          >
            <Headline
              text={step.title}
              size={type.stepTitleSize}
              color={look.ink}
              accent={look.accent}
              align={align}
              start={start}
              end={end}
            />
            <FadeIn start={start} end={end} delay={6} distance={22}>
              <BodyCopy
                text={step.description}
                color={look.muted}
                size={type.descriptionSize}
                width={layout.textWidth}
                align={align}
              />
            </FadeIn>
          </div>
        );
      })}
    </>
  );
};

export const EndLockup = ({
  props,
  plan,
  speed,
  id,
}: {
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  speed: number;
  id: string;
}) => {
  const { endCard, type, look } = props;
  const top = Math.max(
    120,
    Math.min(
      FRAME_HEIGHT - 360,
      FRAME_HEIGHT / 2 + (plan.dropBottom - plan.wide.y) * plan.wide.zoom + 30,
    ),
  );
  const start = plan.lockStart / speed;
  const markSize = Math.round(type.brandSize * 0.92);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: FRAME_WIDTH,
        top,
        bottom: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.round(type.brandSize * 0.22),
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: Math.round(type.brandSize * 0.26) }}
      >
        {endCard.showMark ? (
          <FadeIn start={start} distance={26}>
            <EnvelopeMark
              size={markSize}
              from={endCard.markFrom}
              to={endCard.markTo}
              glyph={endCard.markGlyph}
              id={id}
            />
          </FadeIn>
        ) : null}
        <Headline
          text={endCard.brand}
          size={type.brandSize}
          color={look.ink}
          accent={look.accent}
          start={start + 4 / speed}
        />
      </div>
      {endCard.tagline.trim().length > 0 ? (
        <Headline
          text={endCard.tagline}
          highlight={endCard.highlight}
          size={type.taglineSize}
          weight={500}
          tracking={-0.02}
          color={look.muted}
          accent={look.accent}
          align="center"
          start={start + 10 / speed}
        />
      ) : null}
      {endCard.showUrl && endCard.url.trim().length > 0 ? (
        <FadeIn start={start + 16 / speed} distance={18}>
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 500,
              fontSize: type.urlSize,
              letterSpacing: '0.02em',
              color: look.ink,
              padding: `${Math.round(type.urlSize * 0.5)}px ${Math.round(type.urlSize * 1.1)}px`,
              borderRadius: 999,
              border: `1.5px solid ${look.ink}61`,
              background: `${look.ink}12`,
              marginTop: Math.round(type.urlSize * 0.3),
            }}
          >
            {endCard.url}
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
};
