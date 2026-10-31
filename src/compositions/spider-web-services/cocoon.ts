import { random } from 'remotion';

export type Strand = { d: string; width: number; opacity: number; front: boolean };

export type Speck = { x: number; y: number; r: number; opacity: number };

const WAIST = 0.52;

const halfWidth = (t: number, width: number): number => {
  const side = t < WAIST ? t / WAIST : (1 - t) / (1 - WAIST);
  return (width / 2) * Math.max(0, side) ** 1.7;
};

const point = (t: number, side: number, depth: number, width: number, height: number) => ({
  x: side * halfWidth(t, width) * depth,
  y: (t - WAIST) * height,
});

const curve = (a: { x: number; y: number }, b: { x: number; y: number }, sag: number): string => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + sag;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export const cocoonStrands = (
  seed: number,
  count: number,
  width: number,
  height: number,
): Strand[] => {
  const strands: Strand[] = [];
  const pick = (key: string) => random(`cocoon-${seed}-${key}`);
  for (const side of [-1, 1]) {
    for (let rim = 0; rim < 6; rim++) {
      const depth = 0.82 + pick(`rim-${side}-${rim}`) * 0.2;
      const steps = 14;
      const points = Array.from({ length: steps + 1 }, (_, step) =>
        point(step / steps, side, depth, width, height),
      );
      const d = points
        .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');
      strands.push({ d, width: 1.1, opacity: 0.55, front: rim % 3 === 0 });
    }
  }
  for (let index = 0; index < count; index++) {
    const key = `s-${index}`;
    const kind = pick(`${key}-kind`);
    const t1 = 0.06 + pick(`${key}-t1`) * 0.88;
    const t2 = Math.min(0.97, Math.max(0.03, t1 + (pick(`${key}-t2`) - 0.5) * 0.36));
    const side1 = pick(`${key}-side1`) < 0.5 ? -1 : 1;
    const side2 = kind < 0.45 ? -side1 : side1;
    const a =
      kind > 0.8
        ? { x: 0, y: (t1 - WAIST) * height }
        : point(t1, side1, 0.55 + pick(`${key}-d1`) * 0.45, width, height);
    const b = point(t2, side2, 0.5 + pick(`${key}-d2`) * 0.5, width, height);
    const sag = (pick(`${key}-sag`) - 0.35) * 110;
    strands.push({
      d: curve(a, b, sag),
      width: 0.6 + pick(`${key}-w`) * 0.9,
      opacity: 0.18 + pick(`${key}-o`) * 0.45,
      front: pick(`${key}-front`) < 0.3,
    });
  }
  return strands;
};

export const sideWebStrands = (seed: number, reach: number): Strand[] => {
  const strands: Strand[] = [];
  const pick = (key: string) => random(`side-${seed}-${key}`);
  const hub = { x: reach, y: -20 };
  const spokes = 22;
  const ends = Array.from({ length: spokes }, (_, index) => {
    const angle = Math.PI * 0.55 + (index / (spokes - 1)) * Math.PI * 0.9;
    const length = 180 + pick(`len-${index}`) * 220;
    return { x: hub.x + Math.cos(angle) * length, y: hub.y + Math.sin(angle) * length * 0.9 };
  });
  for (const [index, end] of ends.entries()) {
    strands.push({ d: curve(hub, end, 10), width: 1, opacity: 0.5, front: false });
    for (let ring = 1; ring < 7; ring++) {
      const next = ends[index + 1];
      if (next === undefined) {
        continue;
      }
      const f = ring / 7 + (pick(`ring-${index}-${ring}`) - 0.5) * 0.05;
      const p = { x: hub.x + (end.x - hub.x) * f, y: hub.y + (end.y - hub.y) * f };
      const q = { x: hub.x + (next.x - hub.x) * f, y: hub.y + (next.y - hub.y) * f };
      strands.push({ d: curve(p, q, 6 * f), width: 0.8, opacity: 0.4, front: false });
    }
  }
  for (let index = 0; index < 30; index++) {
    const a = { x: pick(`fx-${index}`) * reach * 0.6, y: (pick(`fy-${index}`) - 0.5) * 300 };
    const b = ends[Math.floor(pick(`fe-${index}`) * spokes)] ?? hub;
    strands.push({ d: curve(a, b, 20), width: 0.8, opacity: 0.35, front: false });
  }
  return strands;
};

export const cocoonSpecks = (seed: number, width: number, height: number): Speck[] =>
  Array.from({ length: 26 }, (_, index) => {
    const key = `speck-${seed}-${index}`;
    const t = 0.15 + random(`${key}-t`) * 0.7;
    const side = random(`${key}-side`) < 0.5 ? -1 : 1;
    const spot = point(t, side, 0.3 + random(`${key}-d`) * 0.9, width, height);
    return {
      x: spot.x,
      y: spot.y,
      r: 1 + random(`${key}-r`) * 1.8,
      opacity: 0.3 + random(`${key}-o`) * 0.5,
    };
  });
