import { useMemo } from 'react';
import type { MailinfraSpiderDropProps } from '@/schemas';
import { seeded } from './paint';

const BAND = 2720;

const useBokehDots = (props: MailinfraSpiderDropProps) => {
  const { count, seed, size } = props.bokeh;
  return useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => ({
      x: -80 + random() * 1240,
      y: random() * BAND,
      radius: size * (0.3 + random() * 0.5),
      depth: 0.55 + random() * 0.9,
      alpha: 0.45 + random() * 0.55,
      phase: random() * Math.PI * 2,
      violet: index % 2 === 0,
    }));
  }, [count, seed, size]);
};

export const BokehBackdrop = ({
  props,
  t,
  camera,
  skyId,
  blurId,
}: {
  props: MailinfraSpiderDropProps;
  t: number;
  camera: number;
  skyId: string;
  blurId: string;
}) => {
  const { bokeh } = props;
  const dots = useBokehDots(props);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={`url(#${skyId})`} />
      {bokeh.count > 0 && bokeh.opacity > 0 ? (
        <g filter={bokeh.blur > 0 ? `url(#${blurId})` : undefined}>
          {dots.map((dot) => {
            const travel = camera * bokeh.parallax * dot.depth + t * bokeh.drift * 0.6 * dot.depth;
            const y = ((((dot.y - travel) % BAND) + BAND) % BAND) - 400;
            const x = dot.x + Math.sin(t / 90 + dot.phase) * 24 * bokeh.drift;
            return (
              <circle
                key={`${dot.x.toFixed(3)}:${dot.y.toFixed(3)}`}
                cx={x}
                cy={y}
                r={dot.radius}
                fill={dot.violet ? bokeh.violet : bokeh.blue}
                opacity={bokeh.opacity * dot.alpha}
              />
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

export const SkyGradient = ({ id, props }: { id: string; props: MailinfraSpiderDropProps }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={props.look.background} />
    <stop offset="1" stopColor={props.look.backgroundEdge} />
  </linearGradient>
);
