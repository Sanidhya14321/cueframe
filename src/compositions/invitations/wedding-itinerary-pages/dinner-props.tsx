import { type Art, fill, gid } from './art';
import { Rose } from './flowers';
import { Bush } from './foliage';
import { between, circlePath, dark, f, Linear, light, memo, random } from './paint';

export const FloweringTree = ({ art, x, y }: { art: Art; x: number; y: number }) => {
  const blooms = memo(`tree-blooms|${x}|${y}`, () => {
    const rand = random(141);
    let pink = '';
    let rose = '';
    for (let index = 0; index < 340; index++) {
      const across = between(rand, -0.48, 0.48);
      const reach = 250 * Math.sqrt(Math.max(0, 1 - (across * 2) ** 2));
      const px = x + across * 560;
      const py = y - 300 - rand() * reach * 0.9;
      const dot = circlePath(px, py, between(rand, 4, 8));
      if (rand() > 0.45) {
        pink += dot;
      } else {
        rose += dot;
      }
    }
    return { pink, rose };
  });
  return (
    <g>
      <path
        d={`M${x - 16} ${y}Q${x - 6} ${y - 160} ${x - 30} ${y - 300}L${x - 8} ${y - 304}Q${x + 6} ${y - 200} ${x + 10} ${y - 250}L${x + 28} ${y - 300}L${x + 40} ${y - 296}Q${x + 14} ${y - 180} ${x + 18} ${y}Z`}
        fill={fill(art, 'trunk')}
      />
      <Bush art={art} x={x} y={y - 290} w={560} h={250} tone="mid" seed={142} />
      <path d={blooms.rose} fill={art.bloom.rose} />
      <path d={blooms.pink} fill={light(art.bloom.blossom, 0.1)} />
    </g>
  );
};

export const Chair = ({ art, x, y, scale }: { art: Art; x: number; y: number; scale: number }) => {
  const wood = art.decor.wood;
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${scale})`}>
      <path d="M-30 0L-26 -150L-18 -150L-22 0ZM30 0L26 -150L18 -150L22 0Z" fill={wood} />
      <path d="M-26 -150L26 -150L26 -138L-26 -138Z" fill={light(wood, 0.15)} />
      <path d="M-22 -136L22 -64M22 -136L-22 -64" stroke={dark(wood, 0.1)} strokeWidth={6} />
      <rect x={-34} y={-66} width={68} height={12} rx={4} fill={light(art.stone.marble, 0.3)} />
      <path d="M-28 -54L-30 0M28 -54L30 0" stroke={dark(wood, 0.2)} strokeWidth={5} />
    </g>
  );
};

export const Table = ({ art, x, y }: { art: Art; x: number; y: number }) => {
  const { cloth } = art.decor;
  const folds = memo('table-folds', () => {
    let path = '';
    for (let index = 0; index < 12; index++) {
      const px = -190 + index * 34;
      path += `M${px} -88Q${px - 4 + (index - 6) * 2} -40 ${px - 8 + (index - 6) * 3} 0`;
    }
    return path;
  });
  const centre = memo('table-centre', () => {
    const rand = random(151);
    return Array.from({ length: 9 }, (_, index) => ({
      x: (index - 4) * 16 + between(rand, -4, 4),
      y: -120 - Math.cos(((index - 4) / 4) * 1.3) * 22,
      r: between(rand, 10, 14),
      tone: index % 3,
    }));
  });
  const tones = [art.bloom.rose, art.bloom.blossom, art.bloom.marigold];
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <defs>
        <Linear
          id={gid(art, 'cloth')}
          x2={1}
          y2={0}
          stops={[
            [0, dark(cloth, 0.15)],
            [0.4, light(cloth, 0.12)],
            [1, dark(cloth, 0.22)],
          ]}
        />
      </defs>
      <ellipse cx={0} cy={6} rx={240} ry={20} fill="#000000" opacity={0.25} />
      <path
        d="M-196 -92Q-214 -40 -226 0Q0 28 226 0Q214 -40 196 -92Z"
        fill={`url(#${gid(art, 'cloth')})`}
      />
      <path d={folds} stroke={dark(cloth, 0.2)} strokeWidth={3} fill="none" opacity={0.6} />
      <ellipse cx={0} cy={-92} rx={198} ry={30} fill={light(cloth, 0.2)} />
      <ellipse cx={0} cy={-104} rx={60} ry={12} fill={light(art.stone.cream, 0.2)} />
      {[-110, 110].map((candle) => (
        <g key={candle}>
          <rect x={candle - 4} y={-150} width={8} height={50} fill={light(art.stone.marble, 0.4)} />
          <circle cx={candle} cy={-156} r={20} fill={fill(art, 'glow')} />
          <circle cx={candle} cy={-156} r={4} fill="#ffffff" />
        </g>
      ))}
      {centre.map((bloom, index) => (
        <Rose
          key={index}
          x={bloom.x}
          y={bloom.y}
          r={bloom.r}
          color={tones[bloom.tone] ?? art.bloom.rose}
        />
      ))}
    </g>
  );
};
