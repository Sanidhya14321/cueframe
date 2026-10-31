import { type Art, gid } from './art';
import {
  between,
  circlePath,
  dark,
  f,
  Linear,
  leafPath,
  light,
  memo,
  mix,
  random,
  sway,
  WIDTH,
} from './paint';

export const MarigoldStrand = ({
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
  const shape = memo(`strand|${length}|${seed}`, () => {
    const rand = random(seed);
    let orange = '';
    let yellow = '';
    let leaves = '';
    for (let y = 0; y < length; y += 15) {
      const bead = circlePath(between(rand, -1.5, 1.5), y, 8.5);
      if (Math.floor(y / 15) % 5 === 4) {
        leaves += leafPath(0, y, 22, 6, Math.PI / 2 + (rand() > 0.5 ? 0.9 : -0.9));
      }
      if (Math.floor(y / 15) % 3 === 0) {
        yellow += bead;
      } else {
        orange += bead;
      }
    }
    return { orange, yellow, leaves, tassel: circlePath(0, length + 6, 5) };
  });
  const angle = sway(art.frame, 120, phase, 1.6 * art.sway);
  const { marigold } = art.bloom;
  return (
    <g transform={`translate(${f(x)} -12) rotate(${angle.toFixed(3)})`}>
      <path d={shape.leaves} fill={art.leaf.mid} />
      <path d={shape.orange} fill={mix(marigold, '#e05a10', 0.4)} />
      <path d={shape.yellow} fill={light(mix(marigold, '#ffe14a', 0.5), 0.1)} />
      <path d={shape.tassel} fill={art.decor.carpet} />
    </g>
  );
};

const garland = (x1: number, x2: number, y: number, sag: number): string => {
  let path = '';
  const steps = Math.round((x2 - x1) / 13);
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    path += circlePath(x1 + (x2 - x1) * t, y + Math.sin(Math.PI * t) * sag, 7.5);
  }
  return path;
};

const postWrap = (x: number, top: number, bottom: number): string => {
  let path = '';
  for (let y = top; y < bottom; y += 13) {
    path += circlePath(x + Math.sin(y / 9) * 4, y, 7);
  }
  return path;
};

export const Mandap = ({ art }: { art: Art }) => {
  const { stone, decor, bloom } = art;
  const gold = mix(stone.cream, '#c9962e', 0.5);
  const orange = mix(bloom.marigold, '#e05a10', 0.35);
  const beads = memo('mandap-beads', () => ({
    front: garland(296, 784, 1372, 26) + garland(296, 540, 1372, 40) + garland(540, 784, 1372, 40),
    wraps: postWrap(300, 1380, 1690) + postWrap(780, 1380, 1690),
    back: postWrap(360, 1400, 1650) + postWrap(720, 1400, 1650),
  }));
  const drape = `${gid(art, 'drape')}`;
  return (
    <g>
      <defs>
        <Linear
          id={drape}
          x2={1}
          y2={0}
          stops={[
            [0, decor.drape, 0.95],
            [0.5, light(decor.drape, 0.2), 0.75],
            [1, decor.drape, 0.95],
          ]}
        />
      </defs>
      <rect x={354} y={1380} width={12} height={270} fill={dark(gold, 0.15)} />
      <rect x={714} y={1380} width={12} height={270} fill={dark(gold, 0.15)} />
      <path d={beads.back} fill={dark(orange, 0.1)} />
      <path
        d="M360 1388Q470 1500 540 1430Q610 1500 720 1388L720 1400Q610 1520 540 1450Q470 1520 360 1400Z"
        fill={`url(#${drape})`}
        opacity={0.8}
      />
      <path d="M360 1385L720 1385" stroke={gold} strokeWidth={10} />
      <path d="M220 1700L860 1700L830 1650L250 1650Z" fill={decor.carpet} />
      <path d="M250 1650L830 1650L830 1656L250 1656Z" fill={light(decor.carpet, 0.2)} />
      <rect x={220} y={1700} width={640} height={46} fill={mix(decor.carpet, '#b0106e', 0.55)} />
      <rect
        x={220}
        y={1700}
        width={640}
        height={8}
        fill={light(mix(decor.carpet, '#b0106e', 0.55), 0.2)}
      />
      <path d="M420 1746L660 1746L670 1768L410 1768Z" fill={dark(decor.carpet, 0.1)} />
      <path d="M404 1768L676 1768L686 1790L394 1790Z" fill={decor.carpet} />
      <rect x={292} y={1360} width={16} height={340} fill={gold} />
      <rect x={772} y={1360} width={16} height={340} fill={gold} />
      <path d={beads.wraps} fill={orange} />
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? 'translate(1080 0) scale(-1 1)' : undefined}>
          <path
            d="M300 1366C392 1392 420 1452 352 1524C372 1590 404 1650 420 1700L300 1700Z"
            fill={`url(#${drape})`}
            opacity={0.9}
          />
          <path
            d="M312 1380C370 1410 384 1460 346 1520C360 1600 380 1650 388 1698L366 1698C352 1640 338 1580 330 1520C356 1470 350 1420 312 1392Z"
            fill={light(decor.drape, 0.25)}
            opacity={0.55}
          />
          <circle cx={352} cy={1524} r={13} fill={orange} />
          <circle cx={344} cy={1516} r={7} fill={bloom.marigold} />
        </g>
      ))}
      <path
        d="M300 1368Q540 1478 780 1368L780 1388Q540 1500 300 1388Z"
        fill={`url(#${drape})`}
        opacity={0.75}
      />
      <rect x={280} y={1350} width={520} height={20} fill={gold} />
      <rect x={280} y={1346} width={520} height={6} fill={light(gold, 0.35)} />
      <path d={beads.front} fill={mix(bloom.marigold, '#ffd23a', 0.3)} />
      {[300, 780].map((x) => (
        <g key={x}>
          <circle cx={x} cy={1352} r={22} fill={orange} />
          <circle cx={x - 12} cy={1340} r={13} fill={bloom.marigold} />
          <circle cx={x + 12} cy={1344} r={12} fill={light(bloom.marigold, 0.2)} />
          <circle cx={x} cy={1690} r={18} fill={orange} />
        </g>
      ))}
    </g>
  );
};

export const Carpet = ({ art }: { art: Art }) => (
  <g>
    <path d="M400 1790L680 1790L790 1960L290 1960Z" fill={art.decor.carpet} />
    <path d="M400 1790L420 1790L330 1960L290 1960Z" fill={dark(art.decor.carpet, 0.2)} />
    <path d="M660 1790L680 1790L790 1960L750 1960Z" fill={dark(art.decor.carpet, 0.2)} />
  </g>
);

export const Lattice = ({ art, top, bottom }: { art: Art; top: number; bottom: number }) => {
  const shape = memo(`lattice|${top}|${bottom}`, () => {
    let lines = '';
    const height = bottom - top;
    for (let x = -height; x < WIDTH + height; x += 26) {
      lines += `M${x} ${bottom}L${x + height} ${top}M${x} ${top}L${x + height} ${bottom}`;
    }
    let posts = '';
    for (let x = 30; x < WIDTH; x += 170) {
      posts += `M${x - 7} ${bottom}L${x - 7} ${top - 18}L${x + 7} ${top - 18}L${x + 7} ${bottom}Z${circlePath(x, top - 24, 9)}`;
    }
    return { lines, posts };
  });
  const gold = mix(art.stone.cream, '#b8913a', 0.4);
  return (
    <g>
      <path d={shape.lines} stroke={gold} strokeWidth={3} fill="none" opacity={0.85} />
      <rect x={0} y={top - 6} width={WIDTH} height={8} fill={gold} />
      <path d={shape.posts} fill={dark(gold, 0.1)} />
    </g>
  );
};
