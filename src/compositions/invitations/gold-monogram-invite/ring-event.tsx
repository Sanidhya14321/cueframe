import { useMemo } from 'react';
import type { GoldMonogramInviteProps } from '@/schemas';
import { settle, tween } from '../../promo/timing';
import { EventText } from './event-text';
import { Couple } from './figure';
import { MAN, RING_MAN, RING_WOMAN, WOMAN } from './figure-poses';
import { Embossed, GoldGradients, paint, useGoldIds, useSvgId, withAlpha } from './gold';
import { vine } from './ornament';
import { OrnamentArt } from './ornament-art';
import { Ring } from './ring';
import { Dust } from './sparks';
import { BlurFilter } from './text-fx';
import { fadeOut, progress, RING } from './timeline';

const SWAY_BEAT = 70;

export const RingAct = ({
  frame,
  event,
  eventText,
  gold,
  text,
  sketch,
  background,
  gem,
  serif,
  script,
}: Pick<
  GoldMonogramInviteProps,
  'eventText' | 'gold' | 'text' | 'sketch' | 'background' | 'gem'
> & {
  frame: number;
  event: GoldMonogramInviteProps['events'][number];
  serif: string;
  script: string;
}) => {
  const ids = useGoldIds('ring-gold');
  const blurId = useSvgId('ring-blur');
  const layers = useMemo(() => vine(400), []);
  const out = fadeOut(frame, [RING.wipe[0] - 4, RING.wipe[0] + 30]);
  if (frame < RING.vine[0] - 2 || out <= 0) {
    return null;
  }
  const vineDraw = progress(frame, RING.vine);
  const ring = tween(frame, RING.ring, [0, 1], settle);
  const couple = progress(frame, RING.couple);
  const beat = ((frame - RING.couple[0]) / SWAY_BEAT) * sketch.danceSpeed;
  const look = {
    second: null,
    fillOpacity: 0.9,
    width: sketch.lineWidth * 1.6,
    draw: couple,
  };
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      role="presentation"
      style={{ position: 'absolute' }}
    >
      <g opacity={out}>
        <defs>
          <GoldGradients ids={ids} gold={gold} sheen={[-300, -100, 300, 200]} />
          <BlurFilter id={blurId} radius={6} />
        </defs>
        <Dust frame={frame} count={44} color={gold.light} seed="ring-dust" />
        <g
          transform={`translate(1330 846) scale(${(0.94 + 0.06 * ring + (frame - RING.ring[0]) * 0.0004).toFixed(4)})`}
          opacity={ring}
        >
          <Ring
            frame={frame}
            gold={gold}
            ids={ids}
            sparkle={tween(frame, [RING.ring[0] + 20, RING.ring[1] + 20], [0, 1], settle)}
            gem={gem}
          />
        </g>
        <g transform="translate(220 46) scale(1.3)">
          <Embossed depth={1.4} gold={gold} fill={paint(ids.sheen)}>
            {(color) => <OrnamentArt layers={layers} color={color} draw={vineDraw} />}
          </Embossed>
        </g>
        <g transform="translate(360 1036) scale(0.5)">
          <Couple
            beat={Math.max(0, beat)}
            man={RING_MAN}
            woman={RING_WOMAN}
            builds={{ man: MAN, woman: WOMAN }}
            manLook={{ ...look, ink: gold.mid, fill: withAlpha(gold.deep, 1), fillOpacity: 0.55 }}
            womanLook={{ ...look, ink: sketch.chalk, fill: background.night }}
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
          x={800}
          y={176}
          frame={frame}
          start={RING.text}
          out={[RING.wipe[1] + 100, RING.wipe[1] + 101]}
          blurId={blurId}
        />
      </g>
    </svg>
  );
};
