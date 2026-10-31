import type { MailinfraDewStepsProps } from '@/schemas';
import { EASED_STOPS, mix, seeded } from './paint';
import { FRAME_HEIGHT, FRAME_WIDTH } from './timeline';

const TILE = 4400;

const halfRamp = (from: string, to: string, start: number, end: number) =>
  EASED_STOPS.map((amount) => ({
    offset: start + (end - start) * amount,
    color: mix(from, to, amount),
  }));

export const BokehBackdrop = ({
  frame,
  cameraX,
  zoom,
  speed,
  props,
  id,
}: {
  frame: number;
  cameraX: number;
  zoom: number;
  speed: number;
  props: MailinfraDewStepsProps;
  id: string;
}) => {
  const { look, bokeh } = props;
  const ramp = [
    ...halfRamp(look.backgroundEdge, look.background, 0, 0.55),
    ...halfRamp(look.background, look.backgroundEdge, 0.55, 1).slice(1),
  ];
  const random = seeded(29);
  const scale = 0.84 + 0.16 * zoom;
  const lights = Array.from({ length: bokeh.count }, (_, index) => {
    const depth = 0.55 + random() * 0.9;
    const baseX = random() * TILE;
    const baseY = 80 + random() * (FRAME_HEIGHT - 160);
    const radius = (34 + random() * 96) * bokeh.size * depth;
    const shifted =
      (((baseX - (cameraX * bokeh.parallax + frame * 1.2) * depth) % TILE) + TILE) % TILE;
    const x = FRAME_WIDTH / 2 + (shifted - TILE / 2) * scale;
    const y = FRAME_HEIGHT / 2 + (baseY - FRAME_HEIGHT / 2) * scale;
    const breathe = 0.82 + 0.18 * Math.sin(frame / 60 + index * 1.9);
    return {
      key: index,
      x,
      y,
      radius: radius * scale,
      tone: index % 3 === 1 ? ('blue' as const) : ('violet' as const),
      alpha: bokeh.strength * (0.35 + random() * 0.65) * breathe,
    };
  });
  const smear = Math.min(40, Math.abs(speed) * bokeh.parallax * 0.5);
  return (
    <svg
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          {ramp.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="0.5" cy="0.5" r="0.5">
          {EASED_STOPS.map((stop) => (
            <stop
              key={stop}
              offset={stop}
              stopColor={mix(bokeh.violet, '#ffffff', 0.15)}
              stopOpacity={(1 - stop) * 0.3 * look.spotlight}
            />
          ))}
        </radialGradient>
        {(['blue', 'violet'] as const).map((tone) => (
          <radialGradient key={tone} id={`${id}-${tone}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={bokeh[tone]} stopOpacity={0.55} />
            <stop offset="0.7" stopColor={bokeh[tone]} stopOpacity={0.7} />
            <stop offset="0.9" stopColor={bokeh[tone]} stopOpacity={0.95} />
            <stop offset="1" stopColor={bokeh[tone]} stopOpacity={0} />
          </radialGradient>
        ))}
        <filter id={`${id}-blur`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={`${bokeh.softness + smear} ${bokeh.softness}`} />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={look.liveGrain ? Math.floor(frame) % 97 : 7}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={FRAME_WIDTH} height={FRAME_HEIGHT} fill={`url(#${id}-sky)`} />
      <ellipse
        cx={FRAME_WIDTH / 2}
        cy={FRAME_HEIGHT * 0.52}
        rx={FRAME_WIDTH * 0.55}
        ry={FRAME_HEIGHT * 0.6}
        fill={`url(#${id}-center)`}
      />
      <g filter={bokeh.softness + smear > 0.2 ? `url(#${id}-blur)` : undefined}>
        {lights.map((light) => (
          <circle
            key={light.key}
            cx={light.x}
            cy={light.y}
            r={light.radius}
            fill={`url(#${id}-${light.tone})`}
            fillOpacity={light.alpha}
          />
        ))}
      </g>
      {look.grain > 0 ? (
        <rect
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          filter={`url(#${id}-grain)`}
          opacity={look.grain * 0.6}
        />
      ) : null}
    </svg>
  );
};
