import type { MagnifierCaptionProps } from '@/schemas';
import type { Bubble, Point } from './field';

type BubbleShape = MagnifierCaptionProps['field']['shape'];

export interface BubbleStyle {
  shape: BubbleShape;
  ring: string;
  word: string;
  lineWidth: number;
  wordSize: number;
  wordWeight: number;
  font: string;
}

export interface BubbleGlow {
  amount: number;
  color: string;
  text: string;
  halo: number;
  weight: number;
}

const WIDTH = 1080;
const HEIGHT = 1920;

const visible = (bubble: Bubble, offset: Point, scale: number, center: Point): boolean => {
  const x = center.x + (bubble.x + offset.x - center.x) * scale;
  const y = center.y + (bubble.y + offset.y - center.y) * scale;
  const r = bubble.r * scale + 40;
  return x + r > 0 && x - r < WIDTH && y + r > 0 && y - r < HEIGHT;
};

const hexagonPoints = (bubble: Bubble): string =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner;
    return `${bubble.x + bubble.r * Math.cos(angle)},${bubble.y + bubble.r * Math.sin(angle)}`;
  }).join(' ');

const Outline = ({ bubble, style }: { bubble: Bubble; style: BubbleStyle }) =>
  style.shape === 'hexagon' ? (
    <polygon
      points={hexagonPoints(bubble)}
      fill="none"
      stroke={style.ring}
      strokeWidth={style.lineWidth}
      strokeLinejoin="round"
    />
  ) : (
    <circle
      cx={bubble.x}
      cy={bubble.y}
      r={bubble.r}
      fill="none"
      stroke={style.ring}
      strokeWidth={style.lineWidth}
    />
  );

const GlowSpot = ({ bubble, glow, id }: { bubble: Bubble; glow: BubbleGlow; id: string }) => (
  <>
    <defs>
      <radialGradient id={`${id}-spot`}>
        <stop offset="0" stopColor={glow.color} stopOpacity={0.85 * glow.amount} />
        <stop offset="0.26" stopColor={glow.color} stopOpacity={0.5 * glow.amount} />
        <stop offset="0.56" stopColor={glow.color} stopOpacity={0.14 * glow.amount} />
        <stop offset="0.86" stopColor={glow.color} stopOpacity={0} />
        <stop offset="1" stopColor={glow.color} stopOpacity={0} />
      </radialGradient>
      <filter id={`${id}-halo`} x="-50%" y="-100%" width="200%" height="300%">
        <feGaussianBlur stdDeviation={glow.halo} />
      </filter>
    </defs>
    <circle cx={bubble.x} cy={bubble.y} r={bubble.r * 0.92} fill={`url(#${id}-spot)`} />
  </>
);

const Label = ({
  bubble,
  style,
  glow,
  id,
}: {
  bubble: Bubble;
  style: BubbleStyle;
  glow: BubbleGlow | null;
  id: string;
}) => {
  const amount = glow?.amount ?? 0;
  const shared = {
    x: bubble.x,
    y: bubble.y,
    textAnchor: 'middle' as const,
    dominantBaseline: 'central' as const,
    fontSize: style.wordSize,
    fontFamily: style.font,
  };
  return (
    <>
      {amount < 1 ? (
        <text {...shared} fill={style.word} fontWeight={style.wordWeight} opacity={1 - amount}>
          {bubble.word}
        </text>
      ) : null}
      {glow && amount > 0 ? (
        <>
          <text
            {...shared}
            fill={glow.text}
            fontWeight={glow.weight}
            opacity={amount}
            filter={`url(#${id}-halo)`}
          >
            {bubble.word}
          </text>
          <text {...shared} fill={glow.text} fontWeight={glow.weight} opacity={amount}>
            {bubble.word}
          </text>
        </>
      ) : null}
    </>
  );
};

export const BubbleLayer = ({
  bubbles,
  offset,
  style,
  scale = 1,
  center = { x: WIDTH / 2, y: HEIGHT / 2 },
  glowOf,
  idPrefix,
}: {
  bubbles: Bubble[];
  offset: Point;
  style: BubbleStyle;
  scale?: number;
  center?: Point;
  glowOf?: (bubble: Bubble) => BubbleGlow | null;
  idPrefix: string;
}) => {
  const transform = `translate(${center.x} ${center.y}) scale(${scale}) translate(${offset.x - center.x} ${offset.y - center.y})`;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
    >
      <g transform={transform}>
        {bubbles.map((bubble, index) => {
          if (!visible(bubble, offset, scale, center)) {
            return null;
          }
          const glow = glowOf ? glowOf(bubble) : null;
          const id = `${idPrefix}-${index}`;
          return (
            <g key={id}>
              {glow && glow.amount > 0 ? <GlowSpot bubble={bubble} glow={glow} id={id} /> : null}
              <Outline bubble={bubble} style={style} />
              {bubble.word ? <Label bubble={bubble} style={style} glow={glow} id={id} /> : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
