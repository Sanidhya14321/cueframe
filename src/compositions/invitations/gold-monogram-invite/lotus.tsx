import { useMemo } from 'react';
import type { GoldMonogramInviteProps } from '@/schemas';
import { settle, smooth, tween } from '../../promo/timing';
import { EventText } from './event-text';
import { Figure } from './figure';
import { SOLO, WOMAN } from './figure-poses';
import { poseAt } from './figure-rig';
import { Embossed, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { lotusMandala } from './ornament';
import { OrnamentArt } from './ornament-art';
import { Dust } from './sparks';
import { LightStreak } from './streak';
import { BlurFilter } from './text-fx';
import { fadeOut, LOTUS, progress } from './timeline';

const SOLO_BEAT = 64;

export const LotusAct = ({
  frame,
  event,
  eventText,
  gold,
  text,
  sketch,
  background,
  serif,
  script,
}: Pick<GoldMonogramInviteProps, 'eventText' | 'gold' | 'text' | 'sketch' | 'background'> & {
  frame: number;
  event: GoldMonogramInviteProps['events'][number];
  serif: string;
  script: string;
}) => {
  const ids = useGoldIds('lotus-gold');
  const blurId = useSvgId('lotus-blur');
  const shadowId = useSvgId('lotus-shadow');
  const layers = useMemo(lotusMandala, []);
  const head = tween(frame, LOTUS.streak, [0, 1.36], (t) => smooth(t) * 0.6 + t * 0.4);
  const out = fadeOut(frame, LOTUS.exit);
  if (frame < LOTUS.streak[0] || out <= 0) {
    return null;
  }
  const mandala = tween(frame, LOTUS.mandala, [0, 1], settle) * out;
  const draw = progress(frame, LOTUS.dancer);
  const beat = ((frame - LOTUS.dancer[0]) / SOLO_BEAT) * sketch.danceSpeed;
  const spin = (frame - LOTUS.mandala[0]) * 0.03;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      role="presentation"
      style={{ position: 'absolute' }}
    >
      <defs>
        <GoldGradients ids={ids} gold={gold} sheen={[-430, -430, 430, 430]} />
        <BlurFilter id={blurId} radius={6} />
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={50} />
        </filter>
      </defs>
      <g opacity={out}>
        <g
          transform={`translate(1312 540) rotate(${spin.toFixed(3)}) scale(${(0.92 + 0.08 * mandala).toFixed(4)})`}
          opacity={mandala * 0.82}
        >
          <Embossed depth={1.6} gold={gold} fill={paint(ids.sheen)}>
            {(color) => <OrnamentArt layers={layers} color={color} />}
          </Embossed>
        </g>
        <ellipse
          cx={1312}
          cy={548}
          rx={360}
          ry={150}
          fill={withAlpha(background.night, 0.8)}
          filter={`url(#${shadowId})`}
          opacity={mandala}
        />
        <Dust
          frame={frame}
          count={34}
          color={gold.light}
          width={900}
          height={1080}
          seed="lotus-dust"
        />
        <g transform="translate(330 948) scale(0.74)">
          <Figure
            pose={poseAt(SOLO, Math.max(0, beat))}
            build={WOMAN}
            look={{
              ink: sketch.chalk,
              second: null,
              fill: background.night,
              fillOpacity: 0.85,
              width: sketch.lineWidth * 1.2,
              draw,
            }}
          />
        </g>
        <EventText
          event={event}
          eventText={eventText}
          gold={gold}
          band={ids.band}
          cream={text.cream}
          serif={serif}
          script={script}
          x={1312}
          y={492}
          frame={frame}
          start={LOTUS.text}
          out={[LOTUS.exit[1] + 100, LOTUS.exit[1] + 101]}
          blurId={blurId}
        />
      </g>
      <LightStreak head={head} gold={gold} />
    </svg>
  );
};
