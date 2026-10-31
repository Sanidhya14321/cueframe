import type { MailinfraSpiderDropProps } from '@/schemas';
import { mix, shade, tint } from './paint';

type Point = [number, number];

type Leg = { hip: Point; knee: Point; foot: Point; grip?: { knee: Point; foot: Point } };

const LEGS: Leg[] = [
  { hip: [11, 27], knee: [34, 50], foot: [44, 82], grip: { knee: [42, 46], foot: [62, 72] } },
  { hip: [17, 20], knee: [62, 26], foot: [86, 62] },
  { hip: [19, 12], knee: [66, -4], foot: [96, 18] },
  { hip: [15, 4], knee: [54, -38], foot: [80, -72] },
];

export const SPIDER_ANCHOR = 74;

const legPath = (leg: Leg, side: number, cycle: number, index: number, hold: number): string => {
  const phase = (index % 2 === 0 ? 1 : -1) * side;
  const lift = cycle * phase;
  const knee: Point = leg.grip
    ? [
        leg.knee[0] + (leg.grip.knee[0] - leg.knee[0]) * hold,
        leg.knee[1] + (leg.grip.knee[1] - leg.knee[1]) * hold,
      ]
    : leg.knee;
  const foot: Point = leg.grip
    ? [
        leg.foot[0] + (leg.grip.foot[0] - leg.foot[0]) * hold,
        leg.foot[1] + (leg.grip.foot[1] - leg.foot[1]) * hold,
      ]
    : leg.foot;
  const kx = knee[0] + lift * 4;
  const ky = knee[1] - lift * 12;
  const fx = foot[0] + lift * 6;
  const fy = foot[1] - lift * 18;
  return `M ${leg.hip[0] * side} ${leg.hip[1]} L ${kx * side} ${ky} L ${fx * side} ${fy}`;
};

export const SpiderBody = ({
  props,
  x,
  y,
  cycle,
  hold,
  gradientId,
}: {
  props: MailinfraSpiderDropProps;
  x: number;
  y: number;
  cycle: number;
  hold: number;
  gradientId: string;
}) => {
  const { spider } = props;
  const leg = mix(spider.body, spider.sheen, 0.45);
  return (
    <g transform={`translate(${x} ${y}) scale(${spider.size})`}>
      {[-1, 1].map((side) =>
        LEGS.map((item, index) => (
          <path
            key={`${side}:${item.hip.join(',')}`}
            d={legPath(item, side, cycle, index, hold)}
            fill="none"
            stroke={leg}
            strokeWidth={4.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )),
      )}
      <ellipse
        cx={0}
        cy={-34}
        rx={30}
        ry={40}
        fill={`url(#${gradientId})`}
        stroke={spider.sheen}
        strokeOpacity={0.55}
        strokeWidth={2}
      />
      <path
        d="M -14 -50 L 0 -40 L 14 -50 M -12 -34 L 0 -24 L 12 -34 M -9 -18 L 0 -10 L 9 -18"
        fill="none"
        stroke={spider.sheen}
        strokeOpacity={0.45}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <ellipse cx={-11} cy={-52} rx={9} ry={13} fill={tint(spider.sheen, 0.35)} opacity={0.32} />
      <ellipse cx={0} cy={18} rx={21} ry={19} fill={mix(spider.body, spider.sheen, 0.12)} />
      <path d="M -6 36 L -9 46 M 6 36 L 9 46" stroke={leg} strokeWidth={4} strokeLinecap="round" />
      <circle cx={-7} cy={29} r={3.6} fill={spider.eyes} />
      <circle cx={7} cy={29} r={3.6} fill={spider.eyes} />
      <circle cx={-14} cy={24} r={2.2} fill={spider.eyes} opacity={0.8} />
      <circle cx={14} cy={24} r={2.2} fill={spider.eyes} opacity={0.8} />
      <circle cx={-6} cy={28} r={1.1} fill={shade(spider.eyes, 0.85)} />
      <circle cx={8} cy={28} r={1.1} fill={shade(spider.eyes, 0.85)} />
    </g>
  );
};

export const SpiderGradient = ({ id, props }: { id: string; props: MailinfraSpiderDropProps }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0.8" y2="1">
    <stop offset="0" stopColor={mix(props.spider.body, props.spider.sheen, 0.55)} />
    <stop offset="0.45" stopColor={mix(props.spider.body, props.spider.sheen, 0.18)} />
    <stop offset="1" stopColor={props.spider.body} />
  </linearGradient>
);

const ENVELOPE_WIDTH = 210;

export const Envelope = ({
  props,
  x,
  top,
}: {
  props: MailinfraSpiderDropProps;
  x: number;
  top: number;
}) => {
  const { envelope, spider } = props;
  const half = ENVELOPE_WIDTH / 2;
  const flap = mix(envelope.paper, envelope.fold, 0.32);
  return (
    <g transform={`translate(${x} ${top}) scale(${spider.size})`}>
      <rect
        x={-half}
        y={4}
        width={ENVELOPE_WIDTH}
        height={140}
        rx={10}
        fill="#000000"
        opacity={0.22}
      />
      <rect x={-half} y={0} width={ENVELOPE_WIDTH} height={140} rx={10} fill={envelope.paper} />
      <path
        d={`M ${-half + 4} 136 L 0 80 L ${half - 4} 136`}
        fill="none"
        stroke={envelope.fold}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d={`M ${-half + 2} 4 Q ${-half} 0 ${-half + 8} 0 L ${half - 8} 0 Q ${half} 0 ${half - 2} 4 L 6 84 Q 0 89 -6 84 Z`}
        fill={flap}
        stroke={envelope.fold}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx={0} cy={80} r={17} fill={envelope.seal} />
      <circle
        cx={0}
        cy={80}
        r={11}
        fill="none"
        stroke={tint(envelope.seal, 0.35)}
        strokeWidth={2}
      />
    </g>
  );
};
