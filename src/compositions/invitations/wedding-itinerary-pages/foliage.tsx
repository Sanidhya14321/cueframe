import { type Art, type BushTone, bushColors, fill } from './art';
import { type BushKind, type BushTexture, bushTexture } from './bush-texture';
import {
  between,
  dark,
  f,
  HEIGHT,
  leafPath,
  light,
  memo,
  mix,
  moundPath,
  random,
  sway,
  WIDTH,
} from './paint';

type BushShape = BushTexture & { mass: string };

const bushShape = (
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
  kind: BushKind,
): BushShape =>
  memo(`bush|${x}|${y}|${w}|${h}|${seed}|${kind}`, () => {
    const rand = random(seed);
    const bumps = Math.max(3, Math.round(w / Math.max(40, h * 0.42)));
    const mass = moundPath(x, y, w, h, rand, bumps);
    return { mass, ...bushTexture(kind, { x, y, w, h, rand }) };
  });

const KIND_OF_TONE: Record<BushTone, BushKind> = {
  deep: 'rosette',
  dark: 'rosette',
  mid: 'leafy',
  olive: 'scales',
  light: 'cone',
};

export const Bush = ({
  art,
  x,
  y,
  w,
  h,
  tone,
  seed,
  bloom,
  kind,
}: {
  art: Art;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BushTone;
  seed: number;
  bloom?: string | undefined;
  kind?: BushKind | undefined;
}) => {
  const shape = bushShape(x, y, w, h, seed, kind ?? KIND_OF_TONE[tone]);
  const [shadow, base, top] = bushColors(art, tone);
  const middle = mix(base, top, 0.35);
  return (
    <g>
      <path d={shape.mass} fill={fill(art, `bush-${tone}`)} />
      {shape.darkBase ? <path d={shape.mass} fill={shadow} opacity={0.55} /> : null}
      {shape.shade ? <path d={shape.shade} fill={shadow} opacity={0.75} /> : null}
      {shape.stroked ? (
        <>
          <path
            d={shape.middle}
            fill="none"
            stroke={middle}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <path d={shape.lit} fill="none" stroke={top} strokeWidth={2.6} strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d={shape.middle} fill={middle} opacity={0.9} />
          <path d={shape.lit} fill={top} opacity={0.9} />
        </>
      )}
      {shape.lines ? (
        <path d={shape.lines} stroke={shadow} strokeWidth={1.4} fill="none" opacity={0.7} />
      ) : null}
      {shape.spots ? (
        <path d={shape.spots} fill={bloom ?? shadow} opacity={bloom ? 1 : 0.6} />
      ) : null}
    </g>
  );
};

export const Mist = ({
  art,
  x,
  y,
  w,
  h,
  seed,
  opacity = 0.75,
}: {
  art: Art;
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  opacity?: number;
}) => {
  const shape = bushShape(x, y, w, h, seed + 500, 'rosette');
  return (
    <g opacity={opacity}>
      <path d={shape.mass} fill={fill(art, 'mist')} />
      <path d={shape.mass} fill={dark(art.leaf.mist, 0.15)} opacity={0.35} />
      <path d={shape.middle} fill={light(art.leaf.mist, 0.08)} opacity={0.8} />
      <path d={shape.lit} fill={light(art.leaf.mist, 0.28)} opacity={0.8} />
    </g>
  );
};

export const Tree = ({
  art,
  x,
  y,
  trunk,
  w,
  h,
  tone,
  seed,
  bloom,
}: {
  art: Art;
  x: number;
  y: number;
  trunk: number;
  w: number;
  h: number;
  tone: BushTone;
  seed: number;
  bloom?: string | undefined;
}) => (
  <g>
    <path
      d={`M${f(x - 9)} ${f(y)}Q${f(x - 4)} ${f(y - trunk * 0.5)} ${f(x - 6)} ${f(y - trunk - 20)}L${f(x + 6)} ${f(y - trunk - 20)}Q${f(x + 5)} ${f(y - trunk * 0.5)} ${f(x + 10)} ${f(y)}Z`}
      fill={fill(art, 'trunk')}
    />
    <Bush art={art} x={x} y={y - trunk} w={w} h={h} tone={tone} seed={seed} bloom={bloom} />
  </g>
);

type PalmShape = { trunk: string; rings: string; fronds: string[] };

const palmShape = (x: number, y: number, height: number, lean: number, seed: number): PalmShape =>
  memo(`palm|${x}|${y}|${height}|${lean}|${seed}`, () => {
    const rand = random(seed);
    const topX = x + lean;
    const topY = y - height;
    const trunk = `M${f(x - 11)} ${f(y)}Q${f(x + lean * 0.2 - 8)} ${f(y - height * 0.55)} ${f(topX - 5)} ${f(topY)}L${f(topX + 5)} ${f(topY)}Q${f(x + lean * 0.2 + 10)} ${f(y - height * 0.55)} ${f(x + 12)} ${f(y)}Z`;
    let rings = '';
    for (let t = 0.06; t < 0.97; t += 0.055) {
      const cx = x + lean * t * t + (lean * 0.2 - lean * t * t) * 0.3 * (1 - t);
      const cy = y - height * t;
      const half = 11 - 6 * t;
      rings += `M${f(cx - half)} ${f(cy)}q${f(half)} ${f(4)} ${f(half * 2)} 0`;
    }
    const fronds: string[] = [];
    const count = 11;
    for (let index = 0; index < count; index++) {
      const angle = -Math.PI + (index / (count - 1)) * Math.PI + between(rand, -0.12, 0.12);
      const length = height * between(rand, 0.42, 0.6);
      const droop = length * (0.55 - Math.abs(Math.sin(angle)) * 0.25);
      let frond = '';
      for (let t = 0.1; t <= 1; t += 0.05) {
        const px = topX + Math.cos(angle) * length * t;
        const py = topY + Math.sin(angle) * length * t * 0.75 + droop * t * t;
        const tangent = Math.atan2(
          Math.sin(angle) * length * 0.75 + droop * 2 * t,
          Math.cos(angle) * length,
        );
        const leafLength = length * 0.3 * (1 - t * 0.55);
        frond += leafPath(px, py, leafLength, 4.2, tangent + 1.05);
        frond += leafPath(px, py, leafLength, 4.2, tangent - 1.05 + 0.25);
      }
      fronds.push(frond);
    }
    return { trunk, rings, fronds };
  });

export const Palm = ({
  art,
  x,
  y,
  height,
  lean,
  seed,
  phase = 0,
}: {
  art: Art;
  x: number;
  y: number;
  height: number;
  lean: number;
  seed: number;
  phase?: number;
}) => {
  const shape = palmShape(x, y, height, lean, seed);
  const angle = sway(art.frame, 150, phase, 1.6 * art.sway);
  const { leaf } = art;
  return (
    <g>
      <path d={shape.trunk} fill={fill(art, 'trunk')} />
      <path d={shape.rings} fill="none" stroke={dark(leaf.trunk, 0.35)} strokeWidth={1.6} />
      <g transform={`rotate(${angle.toFixed(3)} ${f(x + lean)} ${f(y - height)})`}>
        {shape.fronds.map((frond, index) => (
          <path
            key={index}
            d={frond}
            fill={index % 2 === 0 ? leaf.dark : mix(leaf.mid, leaf.dark, 0.3)}
          />
        ))}
      </g>
    </g>
  );
};

export const Agave = ({
  art,
  x,
  y,
  size,
  seed,
  pale = 0.4,
}: {
  art: Art;
  x: number;
  y: number;
  size: number;
  seed: number;
  pale?: number;
}) => {
  const shape = memo(`agave|${x}|${y}|${size}|${seed}`, () => {
    const rand = random(seed);
    let back = '';
    let front = '';
    for (let index = 0; index < 26; index++) {
      const angle = -Math.PI / 2 + between(rand, -1.3, 1.3);
      const length = size * between(rand, 0.55, 1);
      const leaf = leafPath(x + between(rand, -8, 8), y, length, 5 + size * 0.02, angle);
      if (index % 2 === 0) {
        back += leaf;
      } else {
        front += leaf;
      }
    }
    return { back, front };
  });
  const tone = mix(art.leaf.light, art.leaf.mist, pale);
  return (
    <g>
      <path d={shape.back} fill={dark(tone, 0.25)} />
      <path d={shape.front} fill={tone} />
    </g>
  );
};

export const BigLeaf = ({
  art,
  x,
  y,
  angle,
  length,
  width,
  tone,
  phase = 0,
}: {
  art: Art;
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  tone: string;
  phase?: number;
}) => {
  const rotation = angle + sway(art.frame, 120, phase, 3 * art.sway);
  const shape = memo(`bigleaf|${length}|${width}`, () => {
    let veins = '';
    for (let t = 0.14; t < 0.94; t += 0.08) {
      const half = width * Math.sin(Math.PI * t) * 0.86;
      veins += `M${f(length * t)} 0L${f(length * t + half * 0.5)} ${f(-half)}M${f(length * t)} 0L${f(length * t + half * 0.5)} ${f(half)}`;
    }
    return {
      blade: `M0 0C${f(length * 0.2)} ${f(-width * 1.1)} ${f(length * 0.75)} ${f(-width * 0.95)} ${f(length)} 0C${f(length * 0.75)} ${f(width * 0.95)} ${f(length * 0.2)} ${f(width * 1.1)} 0 0Z`,
      veins,
    };
  });
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${rotation.toFixed(3)})`}>
      <path d={shape.blade} fill={tone} />
      <path
        d={`M0 0C${f(length * 0.3)} ${f(-width * 0.5)} ${f(length * 0.75)} ${f(-width * 0.45)} ${f(length)} 0C${f(length * 0.7)} ${f(-width * 0.1)} ${f(length * 0.3)} ${f(-width * 0.08)} 0 0Z`}
        fill={light(tone, 0.18)}
        opacity={0.7}
      />
      <path d={shape.veins} stroke={dark(tone, 0.25)} strokeWidth={1.2} fill="none" />
      <path
        d={`M0 0L${f(length * 0.97)} 0`}
        stroke={light(tone, 0.35)}
        strokeWidth={2.4}
        fill="none"
      />
    </g>
  );
};

export const Lawn = ({ art, top, seed }: { art: Art; top: number; seed: number }) => {
  const grass = memo(`lawn|${top}|${seed}`, () => {
    const rand = random(seed);
    let dim = '';
    let lit = '';
    for (let index = 0; index < 900; index++) {
      const depth = rand() ** 0.8;
      const px = rand() * WIDTH;
      const py = top + 6 + depth * (HEIGHT - top);
      const blade = 3 + depth * 9;
      const stroke = `M${f(px)} ${f(py)}l${f(between(rand, -2, 2))} ${f(-blade)}`;
      if (rand() > 0.5) {
        lit += stroke;
      } else {
        dim += stroke;
      }
    }
    return { dim, lit };
  });
  return (
    <g>
      <rect x={0} y={top} width={WIDTH} height={HEIGHT - top + 200} fill={fill(art, 'lawn')} />
      <path d={grass.dim} stroke={dark(art.leaf.lawn, 0.2)} strokeWidth={1.4} fill="none" />
      <path d={grass.lit} stroke={light(art.leaf.lawn, 0.22)} strokeWidth={1.2} fill="none" />
    </g>
  );
};
