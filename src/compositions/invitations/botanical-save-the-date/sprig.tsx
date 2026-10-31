import { Flecks, LeafDefs } from './leaf';
import {
  fixed,
  mix,
  type Point,
  quadAngle,
  quadPath,
  quadPoint,
  seeded,
  shade,
  tint,
} from './paint';
import { BranchLeaves, type FloralInks, growBranch } from './spray';

const TWIGS = [
  { t: 0.34, angle: -38, length: 210 },
  { t: 0.5, angle: -52, length: 250 },
  { t: 0.66, angle: -30, length: 170 },
  { t: 0.78, angle: -62, length: 150 },
];

export const WillowSprig = ({ id, inks }: { id: string; inks: FloralInks }) => {
  const greens = { id, base: mix(inks.greens.base, inks.ghost, 0.32) };
  const origin: Point = [0, 0];
  const main = growBranch(
    origin,
    { angle: -96, length: 900, curve: 0.07, leaf: 190, count: 17, girth: 0.6, spread: 26 },
    23,
  );
  const side = growBranch(
    [8, -260],
    { angle: -128, length: 330, curve: -0.12, leaf: 130, count: 6, girth: 0.6, spread: 30 },
    41,
  );
  const tip: Point = [-110, -890];
  const control: Point = [60, -460];
  const random = seeded(5);
  const twigs = TWIGS.map((twig) => {
    const base = quadPoint(origin, control, tip, twig.t);
    const radians = (twig.angle * Math.PI) / 180;
    const end: Point = [
      base[0] + Math.cos(radians) * twig.length,
      base[1] + Math.sin(radians) * twig.length,
    ];
    const bend: Point = [(base[0] + end[0]) / 2 + 26, (base[1] + end[1]) / 2 + 12];
    const buds = Array.from({ length: 4 }, (_, index) => {
      const t = 0.45 + index * 0.17;
      const at = quadPoint(base, bend, end, Math.min(1, t));
      return {
        at,
        angle: quadAngle(base, bend, end, Math.min(1, t)) + (index % 2 === 0 ? 30 : -30),
        size: 7 + random() * 6,
      };
    });
    return { d: quadPath(base, bend, end), end, buds };
  });
  const stem = shade(greens.base, 0.35);
  return (
    <g>
      <defs>
        <LeafDefs greens={greens} />
      </defs>
      {twigs.map((twig) => (
        <g key={twig.d}>
          <path
            d={twig.d}
            fill="none"
            stroke={tint(inks.gold, 0.1)}
            strokeOpacity={0.6}
            strokeWidth={1.4}
          />
          {twig.buds.map((bud) => {
            const radians = (bud.angle * Math.PI) / 180;
            return (
              <g key={`${fixed(bud.at[0])}:${fixed(bud.at[1])}`}>
                <path
                  d={`M${fixed(bud.at[0])} ${fixed(bud.at[1])} l${fixed(Math.cos(radians) * 18)} ${fixed(Math.sin(radians) * 18)}`}
                  stroke={tint(inks.gold, 0.1)}
                  strokeOpacity={0.55}
                  strokeWidth={1.1}
                />
                <circle
                  cx={fixed(bud.at[0] + Math.cos(radians) * 22)}
                  cy={fixed(bud.at[1] + Math.sin(radians) * 22)}
                  r={fixed(bud.size)}
                  fill={inks.petal}
                  fillOpacity={0.85}
                  stroke={shade(inks.petal, 0.2)}
                  strokeOpacity={0.4}
                />
              </g>
            );
          })}
          <circle
            cx={fixed(twig.end[0])}
            cy={fixed(twig.end[1])}
            r={9}
            fill={inks.gold}
            fillOpacity={0.8}
          />
        </g>
      ))}
      <BranchLeaves branch={side} greens={greens} stemColor={stem} />
      <BranchLeaves branch={main} greens={greens} stemColor={stem} />
      {inks.goldLines ? (
        <>
          <Flecks center={[120, -520]} spread={[60, 160]} count={34} color={inks.gold} seed={3} />
          <Flecks center={[70, -120]} spread={[40, 50]} count={14} color={inks.gold} seed={4} />
        </>
      ) : null}
    </g>
  );
};
