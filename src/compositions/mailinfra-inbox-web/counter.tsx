import type { MailinfraInboxWebProps } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { glowShadow } from '../promo/glow';
import { FadeIn, Headline } from '../promo/typography';
import { counterValue } from './inboxes';
import type { Phases } from './timeline';

export const CounterOverlay = ({
  frame,
  phases,
  props,
}: {
  frame: number;
  phases: Phases;
  props: MailinfraInboxWebProps;
}) => {
  const speed = props.motion.speed;
  const start = phases.envelopesAt / speed;
  const end = (phases.zoom[0] - 4) / speed;
  const size = props.counterSize;
  const value = counterValue(frame, phases, props).toLocaleString('en-US');
  const digits = Math.max(
    props.counterFrom.toLocaleString('en-US').length,
    props.counterTarget.toLocaleString('en-US').length,
  );
  return (
    <>
      {props.headline.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: props.headlineTop,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 60px',
          }}
        >
          <Headline
            text={props.headline}
            highlight={props.highlight}
            size={props.headlineSize}
            color={props.look.ink}
            accent={props.look.accent}
            align="center"
            start={start}
            end={end}
          />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: props.counterBottom,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FadeIn start={start + 6 / speed} end={end}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: size * 0.45,
              padding: `${size * 0.42}px ${size * 0.9}px`,
              borderRadius: size * 2,
              background: props.pillColor,
              border: `2px solid ${props.inboxes.nodeColor}`,
              boxShadow: glowShadow(props.inboxes.nodeColor, props.inboxes.glow * 0.6, size * 2.4),
            }}
          >
            <div
              style={{
                width: size * 0.36,
                height: size * 0.36,
                borderRadius: size,
                background: props.inboxes.nodeColor,
                boxShadow: glowShadow(props.inboxes.nodeColor, props.inboxes.glow, size),
              }}
            />
            <span
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: size * 1.15,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                color: props.look.ink,
                minWidth: `${digits * 0.66}em`,
                textAlign: 'right',
              }}
            >
              {value}
            </span>
            {props.counterSuffix.length > 0 ? (
              <span
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 500,
                  fontSize: size,
                  color: props.look.muted,
                }}
              >
                {props.counterSuffix}
              </span>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </>
  );
};
