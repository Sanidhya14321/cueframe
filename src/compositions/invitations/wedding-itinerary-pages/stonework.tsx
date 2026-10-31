import { type Art, fill } from './art';
import { Rose } from './flowers';
import { dark, f, leafPath, light, memo, random } from './paint';

const COLUMNS = [-104, -36, 36, 104] as const;

const archBay = (left: number, right: number, spring: number, top: number): string => {
  const width = right - left;
  const mid = (left + right) / 2;
  return `M${f(left)} ${f(top)}L${f(right)} ${f(top)}L${f(right)} ${f(spring)}Q${f(right)} ${f(spring - 18)} ${f(right - width * 0.16)} ${f(spring - 20)}Q${f(right - width * 0.2)} ${f(spring - 34)} ${f(right - width * 0.34)} ${f(spring - 34)}Q${f(mid + 4)} ${f(spring - 36)} ${f(mid)} ${f(spring - 48)}Q${f(mid - 4)} ${f(spring - 36)} ${f(left + width * 0.34)} ${f(spring - 34)}Q${f(left + width * 0.2)} ${f(spring - 34)} ${f(left + width * 0.16)} ${f(spring - 20)}Q${f(left)} ${f(spring - 18)} ${f(left)} ${f(spring)}Z`;
};

const DOMES = {
  bulb: 'M-92 -262C-118 -318 -62 -382 0 -396C62 -382 118 -318 92 -262Z',
  round: 'M-100 -262C-104 -350 -50 -398 0 -404C50 -398 104 -350 100 -262Z',
} as const;

const Cupola = ({ art, x, y, material }: { art: Art; x: number; y: number; material: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-16} y={-34} width={4} height={34} fill={fill(art, material)} />
    <rect x={12} y={-34} width={4} height={34} fill={fill(art, material)} />
    <path d="M-22 -34L22 -34L18 -40L-18 -40Z" fill={dark(art.stone.shade, 0.1)} />
    <path d="M-17 -40C-20 -58 -8 -68 0 -72C8 -68 20 -58 17 -40Z" fill={fill(art, material)} />
    <path d="M0 -72L0 -84" stroke={art.stone.shade} strokeWidth={2} />
    <circle cx={0} cy={-84} r={2.6} fill={art.stone.shade} />
  </g>
);

export const Chhatri = ({
  art,
  x,
  y,
  scale,
  dome = 'bulb',
  marble = false,
}: {
  art: Art;
  x: number;
  y: number;
  scale: number;
  dome?: keyof typeof DOMES;
  marble?: boolean;
}) => {
  const material = marble ? 'marble' : 'cream';
  const shade = marble ? light(art.stone.shade, 0.35) : art.stone.shade;
  const ribs = memo('chhatri-ribs', () =>
    [-3, -2, -1, 0, 1, 2, 3].map((k) => `M${k * 26} -262Q${k * 33} -336 ${k * 4} -392`).join(''),
  );
  const petals = memo('chhatri-petals', () =>
    Array.from({ length: 13 }, (_, index) =>
      leafPath(-84 + index * 14, -262, 16, 5, -Math.PI / 2),
    ).join(''),
  );
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${scale})`}>
      <rect x={-136} y={-26} width={272} height={26} fill={fill(art, 'creamV')} />
      <rect x={-140} y={-30} width={280} height={7} fill={light(shade, 0.25)} />
      {COLUMNS.map((column) => (
        <g key={column}>
          <rect x={column - 7} y={-206} width={14} height={180} fill={fill(art, material)} />
          <rect x={column - 11} y={-212} width={22} height={9} fill={shade} />
          <rect x={column - 10} y={-36} width={20} height={8} fill={shade} />
        </g>
      ))}
      {COLUMNS.slice(0, -1).map((column, index) => (
        <path
          key={column}
          d={archBay(column + 7, (COLUMNS[index + 1] ?? 0) - 7, -150, -212)}
          fill={fill(art, material)}
        />
      ))}
      <rect x={-128} y={-226} width={256} height={16} fill={fill(art, 'creamV')} />
      <path
        d="M-156 -220Q-146 -240 -122 -244L122 -244Q146 -240 156 -220L146 -224Q0 -232 -146 -224Z"
        fill={fill(art, material)}
      />
      <path d="M-146 -224Q0 -232 146 -224L140 -219Q0 -226 -140 -219Z" fill={dark(shade, 0.2)} />
      <rect x={-96} y={-264} width={192} height={22} fill={fill(art, material)} />
      {[-72, -48, -24, 0, 24, 48, 72].map((dot) => (
        <rect
          key={dot}
          x={dot - 5}
          y={-258}
          width={10}
          height={12}
          rx={5}
          fill={shade}
          opacity={0.7}
        />
      ))}
      <path d={DOMES[dome]} fill={fill(art, material)} />
      <path d={ribs} stroke={shade} strokeWidth={2} fill="none" opacity={0.55} />
      <path d={petals} fill={shade} opacity={0.8} />
      <path d="M0 -394L0 -446" stroke={shade} strokeWidth={4} />
      <circle cx={0} cy={-404} r={10} fill={fill(art, material)} />
      <circle cx={0} cy={-422} r={6} fill={shade} />
      <circle cx={0} cy={-448} r={3.5} fill={shade} />
      <Cupola art={art} x={-132} y={-244} material={material} />
      <Cupola art={art} x={132} y={-244} material={material} />
    </g>
  );
};

export const Balustrade = ({
  art,
  y,
  from = 0,
  to = 1080,
  height = 52,
  marble = false,
}: {
  art: Art;
  y: number;
  from?: number;
  to?: number;
  height?: number;
  marble?: boolean;
}) => {
  const balusters = memo(`balusters|${from}|${to}|${height}`, () => {
    let path = '';
    for (let x = from + 8; x < to; x += 15) {
      const top = -height + 10;
      path += `M${f(x - 3)} ${top}Q${f(x - 7)} ${f(top + height * 0.45)} ${f(x - 3)} ${f(-12)}L${f(x + 3)} -12Q${f(x + 7)} ${f(top + height * 0.45)} ${f(x + 3)} ${top}Z`;
    }
    return path;
  });
  const posts: number[] = [];
  for (let x = from + 40; x < to; x += 190) {
    posts.push(x);
  }
  const material = marble ? 'marble' : 'creamV';
  const shade = marble ? light(art.stone.shade, 0.3) : art.stone.shade;
  return (
    <g transform={`translate(0 ${f(y)})`}>
      <path d={balusters} fill={fill(art, material)} />
      <rect x={from} y={-height} width={to - from} height={10} fill={fill(art, material)} />
      <rect x={from} y={-height + 10} width={to - from} height={3} fill={shade} opacity={0.6} />
      <rect x={from} y={-12} width={to - from} height={12} fill={fill(art, material)} />
      <rect x={from} y={-2} width={to - from} height={4} fill={dark(shade, 0.25)} opacity={0.6} />
      {posts.map((post) => (
        <g key={post}>
          <rect
            x={post - 11}
            y={-height - 6}
            width={22}
            height={height + 6}
            fill={fill(art, material)}
          />
          <rect x={post - 14} y={-height - 12} width={28} height={8} fill={shade} />
        </g>
      ))}
    </g>
  );
};

export const Urn = ({
  art,
  x,
  y,
  size,
  seed,
  flower,
}: {
  art: Art;
  x: number;
  y: number;
  size: number;
  seed: number;
  flower: string;
}) => {
  const blooms = memo(`urn|${seed}`, () => {
    const rand = random(seed);
    return Array.from({ length: 7 }, (_, index) => ({
      x: (index - 3) * 13 + (rand() - 0.5) * 8,
      y: -128 - Math.cos(((index - 3) / 3.5) * 1.4) * 22 + (rand() - 0.5) * 10,
      r: 10 + rand() * 5,
    }));
  });
  const leaves = memo('urn-leaves', () =>
    Array.from({ length: 12 }, (_, index) =>
      leafPath(0, -110, 34 + (index % 3) * 8, 7, -Math.PI / 2 + (index - 5.5) * 0.24),
    ).join(''),
  );
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${size})`}>
      <ellipse cx={0} cy={2} rx={34} ry={7} fill="#000000" opacity={0.18} />
      <rect x={-22} y={-26} width={44} height={26} fill={fill(art, 'creamV')} />
      <rect x={-26} y={-30} width={52} height={7} fill={art.stone.shade} />
      <path d="M-9 -30L-6 -56L6 -56L9 -30Z" fill={fill(art, 'cream')} />
      <path d="M-40 -100Q-44 -60 -12 -54L12 -54Q44 -60 40 -100Z" fill={fill(art, 'cream')} />
      <rect x={-44} y={-106} width={88} height={8} rx={3} fill={art.stone.shade} />
      <path d={leaves} fill={art.leaf.dark} />
      {blooms.map((bloom, index) => (
        <Rose key={index} x={bloom.x} y={bloom.y} r={bloom.r} color={flower} />
      ))}
    </g>
  );
};
