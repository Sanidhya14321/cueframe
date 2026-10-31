import type { Art } from './art';
import { between, circlePath, dark, f, leafPath, light, memo, random, sway } from './paint';

export const Rose = ({ x, y, r, color }: { x: number; y: number; r: number; color: string }) => {
  const outer = light(color, 0.12);
  return (
    <g>
      <circle cx={x} cy={y + r * 0.08} r={r} fill={dark(color, 0.22)} />
      {[0, 1, 2, 3, 4].map((petal) => {
        const angle = (petal / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={petal}
            cx={x + Math.cos(angle) * r * 0.42}
            cy={y + Math.sin(angle) * r * 0.42}
            r={r * 0.56}
            fill={petal % 2 === 0 ? outer : color}
          />
        );
      })}
      <circle cx={x} cy={y - r * 0.05} r={r * 0.5} fill={dark(color, 0.08)} />
      <path
        d={`M${f(x - r * 0.32)} ${f(y)}A${f(r * 0.34)} ${f(r * 0.3)} 0 1 1 ${f(x + r * 0.2)} ${f(y + r * 0.22)}M${f(x - r * 0.12)} ${f(y - r * 0.02)}A${f(r * 0.16)} ${f(r * 0.14)} 0 1 1 ${f(x + r * 0.12)} ${f(y + r * 0.04)}`}
        stroke={dark(color, 0.38)}
        strokeWidth={Math.max(1, r * 0.09)}
        fill="none"
      />
      <path
        d={`M${f(x - r * 0.75)} ${f(y - r * 0.2)}A${f(r * 0.8)} ${f(r * 0.8)} 0 0 1 ${f(x - r * 0.1)} ${f(y - r * 0.82)}`}
        stroke={light(color, 0.45)}
        strokeWidth={Math.max(1, r * 0.1)}
        fill="none"
        opacity={0.8}
      />
    </g>
  );
};

export const Blossom = ({
  x,
  y,
  r,
  color,
  heart,
  turn = 0,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  heart: string;
  turn?: number;
}) => {
  const petals = memo(`blossom|${f(x)}|${f(y)}|${f(r)}|${f(turn)}`, () =>
    [0, 1, 2, 3, 4]
      .map((petal) => {
        const angle = (petal / 5) * Math.PI * 2 + turn;
        return circlePath(x + Math.cos(angle) * r * 0.5, y + Math.sin(angle) * r * 0.5, r * 0.5);
      })
      .join(''),
  );
  return (
    <g>
      <path d={petals} fill={color} />
      <circle cx={x} cy={y} r={r * 0.62} fill={light(color, 0.25)} opacity={0.7} />
      <circle cx={x} cy={y} r={r * 0.22} fill={heart} />
    </g>
  );
};

export const Vine = ({
  art,
  x,
  y,
  length,
  bend,
  seed,
  flower,
  phase = 0,
  size = 1,
}: {
  art: Art;
  x: number;
  y: number;
  length: number;
  bend: number;
  seed: number;
  flower?: string;
  phase?: number;
  size?: number;
}) => {
  const shape = memo(`vine|${length}|${bend}|${seed}|${size}`, () => {
    const rand = random(seed);
    let leaves = '';
    let lit = '';
    const blooms: [number, number][] = [];
    for (let t = 0.04; t <= 1; t += 0.045) {
      const px = bend * Math.sin(t * Math.PI * 0.9);
      const py = length * t;
      const side = Math.round(t / 0.045) % 2 === 0 ? 1 : -1;
      const leafSize = between(rand, 13, 22) * size * (1 - t * 0.35);
      const leaf = leafPath(px, py, leafSize, leafSize * 0.38, Math.PI / 2 - side * 1.05);
      if (rand() > 0.5) {
        lit += leaf;
      } else {
        leaves += leaf;
      }
      if (rand() > 0.82) {
        blooms.push([px + side * 8, py + 4]);
      }
    }
    return {
      stem: `M0 0Q${f(bend * 1.2)} ${f(length * 0.5)} ${f(bend * Math.sin(Math.PI * 0.9))} ${f(length)}`,
      leaves,
      lit,
      blooms,
    };
  });
  const angle = sway(art.frame, 140, phase, 2.2 * art.sway);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${angle.toFixed(3)})`}>
      <path d={shape.stem} stroke={art.leaf.trunk} strokeWidth={2.2 * size} fill="none" />
      <path d={shape.leaves} fill={art.leaf.dark} />
      <path d={shape.lit} fill={art.leaf.mid} />
      {flower
        ? shape.blooms.map(([bx, by], index) => (
            <Rose key={index} x={bx} y={by} r={7 * size} color={flower} />
          ))
        : null}
    </g>
  );
};
