import { type Art, gid } from './art';
import {
  between,
  circlePath,
  dark,
  ellipsePath,
  f,
  Linear,
  leafPath,
  light,
  memo,
  mix,
  random,
  sway,
} from './paint';

export const Sofa = ({ art, x, y }: { art: Art; x: number; y: number }) => {
  const { sofa } = art.decor;
  const tufts = memo('sofa-tufts', () => {
    let path = '';
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 7; col++) {
        path += circlePath(-150 + col * 50 + row * 25, -128 + row * 34, 3.2);
      }
    }
    return path;
  });
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <defs>
        <Linear
          id={gid(art, 'sofa')}
          stops={[
            [0, light(sofa, 0.18)],
            [0.6, sofa],
            [1, dark(sofa, 0.35)],
          ]}
        />
      </defs>
      <ellipse cx={0} cy={4} rx={240} ry={16} fill="#000000" opacity={0.22} />
      {[-180, -150, 150, 180].map((leg) => (
        <path
          key={leg}
          d={`M${leg - 5} -20L${leg + 5} -20L${leg + 2} 4L${leg - 2} 4Z`}
          fill={dark(art.decor.wood, 0.2)}
        />
      ))}
      <path
        d="M-190 -90C-196 -150 -150 -170 -60 -174C-20 -188 20 -188 60 -174C150 -170 196 -150 190 -90Z"
        fill={`url(#${gid(art, 'sofa')})`}
      />
      <path d={tufts} fill={dark(sofa, 0.4)} />
      <rect x={-200} y={-92} width={400} height={44} rx={16} fill={light(sofa, 0.08)} />
      <rect x={-196} y={-52} width={392} height={34} rx={10} fill={dark(sofa, 0.22)} />
      <path
        d="M-120 -92L-120 -50M0 -92L0 -50M120 -92L120 -50"
        stroke={dark(sofa, 0.3)}
        strokeWidth={2}
      />
      {[-1, 1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path
            d="M-238 -20L-238 -110C-238 -138 -196 -142 -188 -116L-188 -20Z"
            fill={`url(#${gid(art, 'sofa')})`}
          />
          <ellipse cx={-213} cy={-118} rx={27} ry={20} fill={light(sofa, 0.12)} />
          <ellipse cx={-213} cy={-118} rx={12} ry={9} fill={dark(sofa, 0.2)} />
        </g>
      ))}
      {[
        { x: -140, tone: art.decor.gift, tilt: -14 },
        { x: -52, tone: art.decor.giftAlt, tilt: 6 },
        { x: 52, tone: mix(art.decor.gift, '#5a1030', 0.4), tilt: -6 },
        { x: 140, tone: light(art.decor.giftAlt, 0.1), tilt: 14 },
      ].map((cushion) => (
        <g key={cushion.x} transform={`translate(${cushion.x} -118) rotate(${cushion.tilt})`}>
          <rect x={-34} y={-30} width={68} height={60} rx={16} fill={cushion.tone} />
          <rect
            x={-26}
            y={-24}
            width={30}
            height={22}
            rx={10}
            fill={light(cushion.tone, 0.25)}
            opacity={0.6}
          />
          <circle cx={0} cy={0} r={4} fill={dark(cushion.tone, 0.3)} />
        </g>
      ))}
    </g>
  );
};

type Box = { x: number; y: number; w: number; h: number; tone: number; stripes: boolean };

const STACK: readonly Box[] = [
  { x: -170, y: 0, w: 120, h: 70, tone: 0, stripes: true },
  { x: -50, y: 0, w: 110, h: 84, tone: 1, stripes: false },
  { x: 60, y: 0, w: 120, h: 66, tone: 2, stripes: true },
  { x: -140, y: -70, w: 100, h: 60, tone: 1, stripes: false },
  { x: -40, y: -84, w: 90, h: 70, tone: 2, stripes: true },
  { x: 50, y: -66, w: 110, h: 64, tone: 0, stripes: false },
  { x: -90, y: -132, w: 84, h: 52, tone: 0, stripes: true },
  { x: 10, y: -154, w: 76, h: 58, tone: 1, stripes: true },
  { x: 86, y: -130, w: 64, h: 48, tone: 2, stripes: false },
] as const;

export const GiftStack = ({
  art,
  x,
  y,
  scale = 1,
  boxes = STACK,
}: {
  art: Art;
  x: number;
  y: number;
  scale?: number;
  boxes?: readonly Box[];
}) => {
  const tones = [art.decor.gift, art.decor.giftAlt, mix(art.leaf.light, '#e8f4ea', 0.6)];
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${scale})`}>
      {boxes.map((box, index) => {
        const tone = tones[box.tone] ?? art.decor.gift;
        const ribbon = tones[(box.tone + 1) % 3] ?? art.decor.giftAlt;
        const top = box.y - box.h;
        const stripes = box.stripes
          ? Array.from(
              { length: Math.floor(box.w / 14) },
              (_, stripe) => `M${box.x + 7 + stripe * 14} ${top + 6}l0 ${box.h - 6}`,
            ).join('')
          : '';
        return (
          <g key={index}>
            <rect x={box.x} y={top} width={box.w} height={box.h} fill={tone} />
            <rect
              x={box.x + box.w - 14}
              y={top}
              width={14}
              height={box.h}
              fill={dark(tone, 0.18)}
            />
            <rect x={box.x - 3} y={top} width={box.w + 6} height={9} fill={light(tone, 0.2)} />
            {stripes ? <path d={stripes} stroke={light(tone, 0.45)} strokeWidth={4} /> : null}
            <rect x={box.x + box.w / 2 - 5} y={top} width={10} height={box.h} fill={ribbon} />
            <path
              d={`M${box.x + box.w / 2} ${top}c-18 -16 -26 -2 -14 4c-12 2 -2 10 14 -4c16 14 26 6 14 4c12 -6 4 -20 -14 -4Z`}
              fill={ribbon}
            />
          </g>
        );
      })}
    </g>
  );
};

export const BirdCage = ({
  art,
  x,
  chain,
  size,
  phase,
}: {
  art: Art;
  x: number;
  chain: number;
  size: number;
  phase: number;
}) => {
  const angle = sway(art.frame, 110, phase, 2.4 * art.sway);
  const wire = mix(art.stone.shade, '#6b5530', 0.4);
  const bars = memo('cage-bars', () => {
    let path = '';
    for (let bar = -3; bar <= 3; bar++) {
      path += `M${bar * 9} 0Q${bar * 12} -50 0 -68`;
    }
    return path;
  });
  return (
    <g transform={`translate(${f(x)} -10) rotate(${angle.toFixed(3)})`}>
      <path d={`M0 0L0 ${chain}`} stroke={wire} strokeWidth={2} strokeDasharray="6 3" />
      <g transform={`translate(0 ${chain + 68 * size}) scale(${size})`}>
        <path
          d="M-36 0Q-38 -54 0 -68Q38 -54 36 0Z"
          fill={light(art.stone.cream, 0.4)}
          opacity={0.35}
        />
        <path d={bars} stroke={wire} strokeWidth={1.6} fill="none" />
        <path d="M-36 0Q-38 -54 0 -68Q38 -54 36 0" stroke={wire} strokeWidth={2.2} fill="none" />
        <rect x={-40} y={-4} width={80} height={9} rx={3} fill={wire} />
        <rect x={-30} y={-30} width={60} height={3} fill={wire} opacity={0.8} />
        <circle cx={0} cy={-71} r={4} fill="none" stroke={wire} strokeWidth={2} />
        <path d="M-6 -16q6 -10 14 -2l6 -2-4 6q-6 6-16-2Z" fill={art.bloom.marigold} />
      </g>
    </g>
  );
};

export const Cascade = ({
  art,
  x,
  length,
  seed,
  phase,
}: {
  art: Art;
  x: number;
  length: number;
  seed: number;
  phase: number;
}) => {
  const shape = memo(`cascade|${length}|${seed}`, () => {
    const rand = random(seed);
    let blooms = '';
    let lit = '';
    let leaves = '';
    for (let t = 0; t < 1; t += 0.035) {
      const spread = 20 * (1 - t * 0.75);
      const y = t * length;
      for (let dot = 0; dot < 4; dot++) {
        const bloom = ellipsePath(
          between(rand, -spread, spread),
          y + between(rand, -6, 6),
          5.2 * (1 - t * 0.4),
          4.2,
        );
        if (rand() > 0.45) {
          lit += bloom;
        } else {
          blooms += bloom;
        }
      }
    }
    for (let leaf = 0; leaf < 6; leaf++) {
      leaves += leafPath(
        between(rand, -10, 10),
        between(rand, -10, 20),
        between(rand, 26, 40),
        8,
        Math.PI / 2 + between(rand, -1.2, 1.2),
      );
    }
    return { blooms, lit, leaves };
  });
  const angle = sway(art.frame, 130, phase, 2 * art.sway);
  const yellow = mix(art.bloom.marigold, '#fff27a', 0.45);
  return (
    <g transform={`translate(${f(x)} 0) rotate(${angle.toFixed(3)})`}>
      <path d={shape.leaves} fill={art.leaf.mid} />
      <path d={shape.blooms} fill={dark(yellow, 0.12)} />
      <path d={shape.lit} fill={light(yellow, 0.3)} />
    </g>
  );
};
