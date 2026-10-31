import type { NeonSignFlickerProps } from '@/schemas';

type Pendant = NeonSignFlickerProps['pendant'];

const CORD_WIDTH = 3;

const fade = (color: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${(amount * 100).toFixed(1)}%, transparent)`;

const swayAngle = (frame: number, pendant: Pendant): number =>
  pendant.sway * Math.sin((2 * Math.PI * frame) / Math.max(1, pendant.swayPeriod));

const LightCone = ({ pendant, glow }: { pendant: Pendant; glow: number }) => {
  const spread = pendant.coneSpread;
  const mouth = pendant.shadeWidth * 0.42;
  const shape = `polygon(${spread - mouth}px 0px, ${spread + mouth}px 0px, 100% 100%, 0% 100%)`;
  const stops = [
    [0, 0.55],
    [0.18, 0.75],
    [0.4, 0.6],
    [0.65, 0.3],
    [0.85, 0.08],
    [1, 0],
  ]
    .map(([stop = 0, alpha = 0]) => `${fade(pendant.light, alpha)} ${(stop * 100).toFixed(0)}%`)
    .join(', ');
  return (
    <div
      style={{
        position: 'absolute',
        left: -spread,
        top: pendant.cordLength + pendant.shadeHeight - 4,
        width: spread * 2,
        height: pendant.coneLength,
        filter: `blur(${(spread * 0.22).toFixed(1)}px)`,
        mixBlendMode: 'screen',
        opacity: Math.min(1, glow),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: shape,
          background: `linear-gradient(180deg, ${stops})`,
        }}
      />
    </div>
  );
};

const Shade = ({ pendant, glow }: { pendant: Pendant; glow: number }) => {
  const width = pendant.shadeWidth;
  const height = pendant.shadeHeight;
  const half = width / 2;
  const cap = width * 0.1;
  const rim = height * 0.14;
  const body = [
    `M ${half - cap} 0`,
    `L ${half + cap} 0`,
    `C ${half + cap * 1.4} ${height * 0.45} ${width} ${height * 0.55} ${width} ${height}`,
    `L 0 ${height}`,
    `C 0 ${height * 0.55} ${half - cap * 1.4} ${height * 0.45} ${half - cap} 0`,
    'Z',
  ].join(' ');
  return (
    <svg
      role="img"
      aria-label="Pendant lamp"
      width={width}
      height={height + rim}
      style={{
        position: 'absolute',
        left: -half,
        top: pendant.cordLength,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="neon-pendant-shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={pendant.shade} />
          <stop offset="0.38" stopColor={pendant.shadeRim} />
          <stop offset="0.62" stopColor={pendant.shade} />
          <stop offset="1" stopColor={pendant.shade} />
        </linearGradient>
      </defs>
      <ellipse
        cx={half}
        cy={height}
        rx={half * 0.9}
        ry={rim}
        fill={pendant.light}
        opacity={0.12 + 0.88 * Math.min(1, glow)}
      />
      <path d={body} fill="url(#neon-pendant-shade)" />
      <rect x={half - cap * 0.7} y={-6} width={cap * 1.4} height={8} rx={2} fill={pendant.shade} />
    </svg>
  );
};

export const PendantLamp = ({
  pendant,
  level,
  frame,
}: {
  pendant: Pendant;
  level: number;
  frame: number;
}) => {
  const glow = level * pendant.brightness;
  const bulbSize = pendant.shadeWidth * 1.3;
  return (
    <div
      style={{
        position: 'absolute',
        left: pendant.x,
        top: 0,
        width: 0,
        height: 0,
        transformOrigin: '0 0',
        transform: `rotate(${swayAngle(frame, pendant).toFixed(4)}deg)`,
      }}
    >
      <LightCone pendant={pendant} glow={glow} />
      <div
        style={{
          position: 'absolute',
          left: -CORD_WIDTH / 2,
          top: -20,
          width: CORD_WIDTH,
          height: pendant.cordLength + 20,
          background: pendant.cord,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -bulbSize / 2,
          top: pendant.cordLength + pendant.shadeHeight - bulbSize * 0.3,
          width: bulbSize,
          height: bulbSize * 0.6,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${fade(pendant.light, 0.9)}, transparent)`,
          filter: 'blur(10px)',
          opacity: 0.7 * Math.min(1, glow),
        }}
      />
      <Shade pendant={pendant} glow={glow} />
    </div>
  );
};
