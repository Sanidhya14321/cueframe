import {
  Blossom,
  Flecks,
  GhostLeaf,
  type Greens,
  LeafDefs,
  type LeafSpec,
  LineLeaf,
  WatercolorLeaf,
} from './leaf';
import { fixed, type Point, quadAngle, quadPath, quadPoint, seeded, shade } from './paint';

export interface FloralInks {
  greens: Greens;
  ghost: string;
  gold: string;
  petal: string;
  heart: string;
  goldLines: boolean;
}

export interface BranchSpec {
  angle: number;
  length: number;
  curve: number;
  leaf: number;
  count: number;
  girth?: number;
  spread?: number;
  jitter?: number;
}

export interface Branch {
  origin: Point;
  stem: string;
  leaves: LeafSpec[];
}

export const growBranch = (origin: Point, spec: BranchSpec, seed: number): Branch => {
  const random = seeded(seed);
  const radians = (spec.angle * Math.PI) / 180;
  const direction: Point = [Math.cos(radians), Math.sin(radians)];
  const tip: Point = [
    origin[0] + direction[0] * spec.length,
    origin[1] + direction[1] * spec.length,
  ];
  const control: Point = [
    origin[0] + direction[0] * spec.length * 0.5 - direction[1] * spec.curve * spec.length,
    origin[1] + direction[1] * spec.length * 0.5 + direction[0] * spec.curve * spec.length,
  ];
  const leaves: LeafSpec[] = Array.from({ length: spec.count }, (_, index) => {
    const t = 0.16 + (index / Math.max(1, spec.count - 1)) * 0.8;
    const side = index % 2 === 0 ? 1 : -1;
    const jitter = spec.jitter ?? 0.28;
    const length = spec.leaf * (1.05 - 0.45 * t) * (1 - jitter / 2 + random() * jitter);
    return {
      at: quadPoint(origin, control, tip, t),
      angle: quadAngle(origin, control, tip, t) + side * ((spec.spread ?? 38) + random() * 22),
      length,
      width: length * (0.44 + random() * 0.12) * (spec.girth ?? 1),
      tone: Math.floor(random() * 3),
      lean: (random() - 0.5) * 0.3,
    };
  });
  const tipLength = spec.leaf * 0.62;
  leaves.push({
    at: tip,
    angle: quadAngle(origin, control, tip, 1),
    length: tipLength,
    width: tipLength * 0.46 * (spec.girth ?? 1),
    tone: 1,
    lean: 0.1,
  });
  return { origin, stem: quadPath(origin, control, tip), leaves };
};

const Stem = ({ d, color, weight }: { d: string; color: string; weight: number }) => (
  <>
    <path d={d} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={weight * 2.4} />
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeOpacity={0.7}
      strokeWidth={weight}
      strokeLinecap="round"
    />
  </>
);

const CORNER = {
  front: [
    { angle: -24, length: 600, curve: -0.12, leaf: 205, count: 8, girth: 1.3, jitter: 0.6 },
    { angle: 162, length: 500, curve: 0.1, leaf: 190, count: 6, girth: 1.3, jitter: 0.6 },
    { angle: -64, length: 300, curve: 0.14, leaf: 175, count: 4, girth: 1.35, jitter: 0.5 },
  ],
  back: [
    { angle: 172, length: 330, curve: 0.08, leaf: 170, count: 5, girth: 1.15 },
    { angle: -34, length: 360, curve: -0.08, leaf: 170, count: 5, girth: 1.15 },
  ],
  lines: [
    { angle: -118, length: 260, curve: 0.1, leaf: 150, count: 3 },
    { angle: 40, length: 220, curve: -0.1, leaf: 130, count: 2 },
  ],
  blossoms: [
    { at: [-130, -70] as Point, radius: 78, rotation: 40 },
    { at: [0, 0] as Point, radius: 112, rotation: 12 },
  ],
};

export const CornerSpray = ({
  id,
  inks,
  seed,
  blossoms = true,
}: {
  id: string;
  inks: FloralInks;
  seed: number;
  blossoms?: boolean;
}) => {
  const origin: Point = [0, 0];
  const front = CORNER.front.map((spec, index) => growBranch(origin, spec, seed + index * 11));
  const back = CORNER.back.map((spec, index) => growBranch(origin, spec, seed + 40 + index * 7));
  const lines = CORNER.lines.map((spec, index) => growBranch(origin, spec, seed + 80 + index));
  const stemColor = shade(inks.greens.base, 0.4);
  const [first, second, third] = front;
  return (
    <g>
      <defs>
        <LeafDefs greens={inks.greens} />
      </defs>
      {back.map((branch) => (
        <g key={branch.stem}>
          <path d={branch.stem} fill="none" stroke={inks.ghost} strokeOpacity={0.3} />
          {branch.leaves.map((leaf) => (
            <GhostLeaf key={`${leaf.at[0]}:${leaf.at[1]}`} leaf={leaf} color={inks.ghost} />
          ))}
        </g>
      ))}
      {inks.goldLines
        ? lines.map((branch) => (
            <g key={branch.stem}>
              <path
                d={branch.stem}
                fill="none"
                stroke={inks.gold}
                strokeOpacity={0.5}
                strokeWidth={1.2}
              />
              {branch.leaves.map((leaf) => (
                <LineLeaf
                  key={`${leaf.at[0]}:${leaf.at[1]}`}
                  leaf={leaf}
                  color={inks.gold}
                  weight={1.3}
                />
              ))}
            </g>
          ))
        : null}
      {inks.goldLines ? (
        <Flecks center={[150, -150]} spread={[90, 120]} count={46} color={inks.gold} seed={seed} />
      ) : null}
      {third === undefined ? null : (
        <BranchLeaves branch={third} greens={inks.greens} stemColor={stemColor} />
      )}
      {second === undefined ? null : (
        <BranchLeaves branch={second} greens={inks.greens} stemColor={stemColor} />
      )}
      {blossoms
        ? CORNER.blossoms.map((item, index) => (
            <Blossom
              key={item.radius}
              id={`${id}-blossom-${index}`}
              at={item.at}
              radius={item.radius}
              rotation={item.rotation + seed}
              petal={inks.petal}
              heart={inks.heart}
            />
          ))
        : null}
      {first === undefined ? null : (
        <BranchLeaves branch={first} greens={inks.greens} stemColor={stemColor} />
      )}
    </g>
  );
};

export const BranchLeaves = ({
  branch,
  greens,
  stemColor,
  grow = () => 1,
  swing = 0,
}: {
  branch: Branch;
  greens: Greens;
  stemColor: string;
  grow?: (index: number) => number;
  swing?: number;
}) => (
  <g transform={`rotate(${fixed(swing)} ${fixed(branch.origin[0])} ${fixed(branch.origin[1])})`}>
    <g opacity={Math.min(1, grow(0) * 1.4)}>
      <Stem d={branch.stem} color={stemColor} weight={2.2} />
    </g>
    {branch.leaves.map((leaf, index) => (
      <WatercolorLeaf
        key={`${fixed(leaf.at[0])}:${fixed(leaf.at[1])}`}
        leaf={leaf}
        greens={greens}
        grow={grow(index)}
      />
    ))}
  </g>
);
