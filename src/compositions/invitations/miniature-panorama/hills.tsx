import { memo } from 'react';
import { darken, lighten, mix } from './palette';
import { fx, seeded } from './shapes';

const FROM = -1800;

const TO = 3400;

const range = (seed: number, base: number, height: number, step: number) => {
  const random = seeded(seed);
  const points: string[] = [`M${FROM} ${base + 60}`];
  const ridges: string[] = [];
  for (let x = FROM; x <= TO; x += step * (0.6 + random() * 0.8)) {
    const peak = base - height * (0.45 + random() * 0.55);
    const half = step * (0.35 + random() * 0.2);
    points.push(`L${fx(x - half)} ${fx(base - height * 0.15 * random())}`);
    points.push(`Q${fx(x - half * 0.25)} ${fx(peak + 8)} ${fx(x)} ${fx(peak)}`);
    points.push(
      `Q${fx(x + half * 0.3)} ${fx(peak + 10)} ${fx(x + half)} ${fx(base - height * 0.2 * random())}`,
    );
    ridges.push(
      `M${fx(x)} ${fx(peak + 2)}Q${fx(x + half * 0.2)} ${fx(peak + (base - peak) * 0.5)} ${fx(x + half * 0.5)} ${fx(base - 6)}`,
    );
  }
  points.push(`L${TO} ${base + 60}Z`);
  return { body: points.join(''), ridges: ridges.join('') };
};

const treeline = (seed: number, base: number) => {
  const random = seeded(seed);
  const shapes: string[] = [];
  for (let x = FROM; x <= TO; x += 14 + random() * 22) {
    const height = 26 + random() * 46;
    const width = 9 + random() * 8;
    shapes.push(
      `M${fx(x - width)} ${base}Q${fx(x - width * 0.4)} ${fx(base - height * 0.7)} ${fx(x)} ${fx(base - height)}Q${fx(x + width * 0.4)} ${fx(base - height * 0.7)} ${fx(x + width)} ${base}Z`,
    );
  }
  return shapes.join('');
};

export const FarHills = memo(
  ({ id, far, near, base }: { id: string; far: string; near: string; base: number }) => {
    const back = range(7, base, 190, 230);
    const front = range(29, base + 18, 120, 170);
    return (
      <g>
        <defs>
          <linearGradient
            id={`${id}-far`}
            x1={0}
            y1={base - 200}
            x2={0}
            y2={base}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor={darken(far, 0.08)} />
            <stop offset={1} stopColor={lighten(far, 0.3)} />
          </linearGradient>
          <linearGradient
            id={`${id}-near`}
            x1={0}
            y1={base - 120}
            x2={0}
            y2={base + 20}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor={darken(near, 0.1)} />
            <stop offset={1} stopColor={lighten(near, 0.28)} />
          </linearGradient>
        </defs>
        <path d={back.body} fill={`url(#${id}-far)`} />
        <path
          d={back.ridges}
          fill="none"
          stroke={lighten(far, 0.35)}
          strokeWidth={3}
          opacity={0.6}
        />
        <path d={front.body} fill={`url(#${id}-near)`} />
        <path
          d={front.ridges}
          fill="none"
          stroke={darken(near, 0.18)}
          strokeWidth={2.5}
          opacity={0.5}
        />
      </g>
    );
  },
);

export const MistTrees = memo(({ id, mist, base }: { id: string; mist: string; base: number }) => (
  <g>
    <defs>
      <linearGradient
        id={`${id}-mist`}
        x1={0}
        y1={base - 70}
        x2={0}
        y2={base}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor={darken(mist, 0.12)} />
        <stop offset={1} stopColor={lighten(mist, 0.35)} />
      </linearGradient>
    </defs>
    <path d={treeline(43, base)} fill={`url(#${id}-mist)`} />
    <path d={treeline(61, base + 14)} fill={mix(mist, '#ffffff', 0.25)} opacity={0.85} />
    <rect x={FROM} y={base + 6} width={TO - FROM} height={120} fill={lighten(mist, 0.3)} />
  </g>
));
