import { TAU } from '../../promo/timing';
import { type Art, fill } from './art';
import { between, circlePath, f, light, memo, mix, random, sway, WIDTH } from './paint';

const STAR_GROUPS = 4;

export const Stars = ({ art, count, bottom }: { art: Art; count: number; bottom: number }) => {
  const shape = memo(`stars|${count}|${bottom}`, () => {
    const rand = random(81);
    const dots = Array.from({ length: STAR_GROUPS }, () => '');
    const sparks = Array.from({ length: STAR_GROUPS }, () => '');
    for (let index = 0; index < count; index++) {
      const x = rand() * WIDTH;
      const y = rand() ** 1.3 * bottom;
      const group = index % STAR_GROUPS;
      const behindText = x > 160 && x < 920 && y > 240 && y < 1180;
      if (index % 11 === 0 && !behindText) {
        const r = between(rand, 7, 13);
        sparks[group] +=
          `M${f(x)} ${f(y - r)}Q${f(x + 1.5)} ${f(y - 1.5)} ${f(x + r)} ${f(y)}Q${f(x + 1.5)} ${f(y + 1.5)} ${f(x)} ${f(y + r)}Q${f(x - 1.5)} ${f(y + 1.5)} ${f(x - r)} ${f(y)}Q${f(x - 1.5)} ${f(y - 1.5)} ${f(x)} ${f(y - r)}Z`;
      } else {
        dots[group] += circlePath(x, y, between(rand, 0.8, 2.2));
      }
    }
    return { dots, sparks };
  });
  return (
    <g>
      {shape.dots.map((dots, group) => {
        const glow = 0.65 + 0.35 * Math.sin((art.frame / 46) * TAU + group * 1.7) * art.twinkle;
        return (
          <g key={group} opacity={glow}>
            <path d={dots} fill={light(art.decor.crystal, 0.3)} />
            <path d={shape.sparks[group] ?? ''} fill="#ffffff" />
          </g>
        );
      })}
    </g>
  );
};

export const StringLights = ({
  art,
  from,
  to,
  sag,
  spacing = 34,
  phase = 0,
}: {
  art: Art;
  from: readonly [number, number];
  to: readonly [number, number];
  sag: number;
  spacing?: number;
  phase?: number;
}) => {
  const shape = memo(`lights|${from.join()}|${to.join()}|${sag}|${spacing}`, () => {
    const [x1, y1] = from;
    const [x2, y2] = to;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + sag * 2;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(2, Math.round(length / spacing));
    const bulbs: [number, number][] = [];
    for (let step = 1; step < steps; step++) {
      const t = step / steps;
      const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * midX + t * t * x2;
      const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * midY + t * t * y2;
      bulbs.push([x, y + 5]);
    }
    return { wire: `M${x1} ${y1}Q${f(midX)} ${f(midY)} ${x2} ${y2}`, bulbs };
  });
  return (
    <g>
      <path d={shape.wire} stroke={mix(art.sky, '#000000', 0.5)} strokeWidth={1.6} fill="none" />
      {shape.bulbs.map(([x, y], index) => {
        const glow =
          0.7 + 0.3 * Math.sin((art.frame / 38) * TAU + index * 2.1 + phase) * art.twinkle;
        return (
          <g key={index} opacity={glow}>
            <circle cx={x} cy={y} r={15} fill={fill(art, 'glow')} />
            <circle cx={x} cy={y} r={3.6} fill={light(art.decor.glow, 0.6)} />
          </g>
        );
      })}
    </g>
  );
};

const RING = 14;

export const Chandelier = ({
  art,
  x,
  drop,
  scale,
  phase,
}: {
  art: Art;
  x: number;
  drop: number;
  scale: number;
  phase: number;
}) => {
  const angle = sway(art.frame, 160, phase, 0.9 * art.sway);
  const shape = memo('chandelier', () => {
    const points = Array.from({ length: RING + 1 }, (_, index) => -96 + (index * 192) / RING);
    let upper = '';
    let lower = '';
    let swags = '';
    let drops = '';
    for (const [index, px] of points.entries()) {
      upper += `M0 6Q${f(px * 0.35)} 34 ${f(px)} 72`;
      lower += `M${f(px)} 80Q${f(px * 0.75)} 150 0 214`;
      const next = points[index + 1];
      if (next !== undefined) {
        swags += `M${f(px)} 76Q${f((px + next) / 2)} ${index % 2 ? 100 : 112} ${f(next)} 76`;
        drops += circlePath((px + next) / 2, index % 2 ? 98 : 110, 3.4);
      }
      lower += `M${f(px * 0.62)} 128Q${f(px * 0.5)} 150 ${f(px * 0.62)} 168`;
    }
    return { upper, lower, swags, drops };
  });
  const crystal = art.decor.crystal;
  return (
    <g transform={`translate(${f(x)} -20) rotate(${angle.toFixed(3)})`}>
      <path
        d={`M0 0L0 ${drop}`}
        stroke={mix(crystal, '#8a8f99', 0.5)}
        strokeWidth={3}
        strokeDasharray="7 3"
      />
      <g transform={`translate(0 ${drop}) scale(${scale})`}>
        <circle cx={0} cy={110} r={170} fill={fill(art, 'glow')} opacity={0.35} />
        <ellipse cx={0} cy={4} rx={30} ry={9} fill={crystal} />
        <path
          d={shape.upper}
          stroke={crystal}
          strokeWidth={2.6}
          strokeDasharray="0.1 6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={shape.lower}
          stroke={crystal}
          strokeWidth={3}
          strokeDasharray="0.1 6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={shape.swags}
          stroke={light(crystal, 0.4)}
          strokeWidth={3}
          strokeDasharray="0.1 5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx={0} cy={76} rx={100} ry={12} fill="none" stroke={crystal} strokeWidth={4} />
        <path d={shape.drops} fill="#ffffff" />
        {[-80, -40, 0, 40, 80].map((bulb) => (
          <g key={bulb}>
            <rect x={bulb - 3} y={46} width={6} height={24} fill={crystal} />
            <circle cx={bulb} cy={42} r={16} fill={fill(art, 'glow')} />
            <circle cx={bulb} cy={42} r={4.5} fill="#ffffff" />
          </g>
        ))}
        <circle cx={0} cy={218} r={8} fill={crystal} />
        <circle cx={0} cy={218} r={18} fill={fill(art, 'spark')} />
      </g>
    </g>
  );
};

export const Fireworks = ({
  art,
  x,
  y,
  size,
  period,
  phase,
}: {
  art: Art;
  x: number;
  y: number;
  size: number;
  period: number;
  phase: number;
}) => {
  if (!art.fireworks) {
    return null;
  }
  const cycle = (((art.frame + phase) % period) + period) % period;
  const progress = cycle / (period * 0.7);
  if (progress >= 1) {
    return null;
  }
  const reach = size * (1 - (1 - progress) ** 3);
  const inner = reach * 0.45;
  const fade = Math.min(1, progress / 0.18) * (1 - progress) ** 1.5;
  const rays = Array.from({ length: 22 }, (_, index) => {
    const angle = (index / 22) * TAU;
    return `M${f(x + Math.cos(angle) * inner)} ${f(y + Math.sin(angle) * inner + progress * 18)}L${f(x + Math.cos(angle) * reach)} ${f(y + Math.sin(angle) * reach + progress * 30)}`;
  }).join('');
  return (
    <g opacity={fade}>
      <path
        d={rays}
        stroke={light(art.decor.glow, 0.5)}
        strokeWidth={2}
        strokeDasharray="0.1 7"
        strokeLinecap="round"
        fill="none"
      />
      <path d={rays} stroke={art.decor.crystal} strokeWidth={0.8} fill="none" opacity={0.5} />
      <circle
        cx={x}
        cy={y}
        r={size * 0.25 * Math.min(1, progress / 0.18) * (1 - progress)}
        fill={fill(art, 'spark')}
      />
    </g>
  );
};
