import { useMemo } from 'react';
import { random } from 'remotion';
import type { SpiderWebServicesProps, WebService } from '@/schemas';
import { glide, tween } from '../promo/timing';
import { cocoonSpecks, cocoonStrands, sideWebStrands } from './cocoon';
import { ServiceTitle } from './service-title';
import { Spider } from './spider';

export type BeatLayer = 'back' | 'front';

type BeatProps = {
  layer: BeatLayer;
  service: WebService;
  props: SpiderWebServicesProps;
  x: number;
  y: number;
  frame: number;
  enter: number;
  leave: number;
  arrival: number;
  departure: number;
};

const SPIDER_SCALE = 1.35;

const spiderPose = ({ service, frame, arrival, leave }: BeatProps) => {
  const start = arrival;
  const end = Math.max(start + 1, leave + 4);
  const progress = tween(frame, [start, end], [0, 1], glide);
  const dx = service.spiderEndX - service.spiderStartX;
  const dy = service.spiderEndY - service.spiderStartY;
  const travel = Math.hypot(dx, dy);
  const heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90 + service.spiderTurn;
  return {
    x: service.spiderStartX + dx * progress,
    y: service.spiderStartY + dy * progress,
    heading: travel > 1 ? heading : service.spiderTurn,
    gait: (progress * travel) / 7,
  };
};

const Bokeh = ({ color, seed }: { color: string; seed: number }) => (
  <>
    {Array.from({ length: 9 }, (_, index) => {
      const key = `bokeh-${seed}-${index}`;
      const size = 60 + random(`${key}-s`) * 70;
      const left = index % 2 === 0;
      const x = (left ? -1 : 1) * (240 + random(`${key}-x`) * 260);
      const y = (random(`${key}-y`) - 0.5) * 1500;
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            opacity: 0.16 + random(`${key}-o`) * 0.14,
            filter: 'blur(7px)',
          }}
        />
      );
    })}
  </>
);

export const ServiceBeat = (beat: BeatProps) => {
  const { layer, service, props, x, y, enter, departure } = beat;
  const { cocoon, title } = props;
  const strands = useMemo(
    () => cocoonStrands(service.seed, cocoon.strands, cocoon.width, cocoon.height),
    [service.seed, cocoon.strands, cocoon.width, cocoon.height],
  );
  const side = useMemo(
    () => (service.sideWeb ? sideWebStrands(service.seed, 1080 - x + 40) : []),
    [service.sideWeb, service.seed, x],
  );
  const specks = useMemo(
    () => cocoonSpecks(service.seed, cocoon.width, cocoon.height),
    [service.seed, cocoon.width, cocoon.height],
  );
  if (Math.abs(y - 960) > 2700) {
    return null;
  }
  const extent = Math.max(cocoon.width, 1200);
  const swing = service.swing * (1 - enter) - service.swing * 0.6 * departure;
  const shown = strands.filter((strand) => strand.front === (layer === 'front'));
  const pose = spiderPose(beat);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }}>
      {layer === 'back' && service.bokeh ? (
        <Bokeh color={props.backdrop.bokeh} seed={service.seed} />
      ) : null}
      <svg
        width={extent * 2}
        height={cocoon.height + 400}
        viewBox={`${-extent} ${-cocoon.height / 2 - 200} ${extent * 2} ${cocoon.height + 400}`}
        style={{ position: 'absolute', left: -extent, top: -cocoon.height / 2 - 200 }}
        aria-hidden="true"
      >
        <g fill="none" stroke={cocoon.color} strokeLinecap="round">
          {layer === 'back'
            ? side.map((strand) => (
                <path
                  key={strand.d}
                  d={strand.d}
                  strokeWidth={strand.width}
                  strokeOpacity={strand.opacity * cocoon.opacity}
                />
              ))
            : null}
          {shown.map((strand) => (
            <path
              key={strand.d}
              d={strand.d}
              strokeWidth={strand.width}
              strokeOpacity={strand.opacity * cocoon.opacity * (layer === 'front' ? 0.75 : 1)}
            />
          ))}
        </g>
        {layer === 'back'
          ? specks.map((speck) => (
              <circle
                key={`${speck.x}-${speck.y}`}
                cx={speck.x}
                cy={speck.y}
                r={speck.r}
                fill={cocoon.color}
                opacity={speck.opacity * cocoon.opacity}
              />
            ))
          : null}
        {layer === 'front' && props.spider.show ? (
          <Spider
            x={pose.x}
            y={pose.y}
            heading={pose.heading}
            gait={pose.gait}
            scale={SPIDER_SCALE * props.spider.size}
            body={service.spiderBody}
            marks={service.spiderMarks}
          />
        ) : null}
      </svg>
      {layer === 'back' ? (
        <ServiceTitle
          lines={service.lines}
          title={title}
          tilt={service.tilt + swing}
          turn={service.turn}
          lean={service.lean}
          glint={tween(beat.frame, [beat.arrival + 4, beat.arrival + 54], [0, 1], glide)}
        />
      ) : null}
    </div>
  );
};
