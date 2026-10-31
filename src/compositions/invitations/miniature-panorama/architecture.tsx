import { memo } from 'react';
import type { Ids } from './defs';
import { darken, lighten, type Paint } from './palette';
import { circle, fx, scallop } from './shapes';

export const Railing = memo(
  ({
    from,
    to,
    y,
    height,
    every,
    railing,
    ids,
  }: {
    from: number;
    to: number;
    y: number;
    height: number;
    every: number;
    railing: Paint['railing'];
    ids: Ids;
  }) => {
    const bottom = y + 8 + height;
    const posts = Array.from(
      { length: Math.floor((to - from) / every) + 1 },
      (_, index) => from + index * every,
    );
    return (
      <g>
        <rect x={from} y={y + 8} width={to - from} height={height} fill={ids.url('lattice')} />
        <rect x={from} y={y + 8} width={to - from} height={3} fill={railing.shade} />
        <rect x={from} y={y - 6} width={to - from} height={14} fill={railing.marble} />
        <rect
          x={from}
          y={y - 6}
          width={to - from}
          height={3}
          fill={lighten(railing.marble, 0.45)}
        />
        <rect x={from} y={y + 5} width={to - from} height={3} fill={darken(railing.shade, 0.08)} />
        <rect x={from} y={bottom} width={to - from} height={12} fill={railing.marble} />
        <rect x={from} y={bottom + 9} width={to - from} height={5} fill={railing.shade} />
        {posts.map((x) => (
          <g key={x}>
            <rect x={x - 7} y={y - 14} width={14} height={bottom - y + 26} fill={railing.marble} />
            <rect x={x - 7} y={y - 14} width={14} height={bottom - y + 26} fill={ids.url('side')} />
            <rect
              x={x - 10}
              y={y - 18}
              width={20}
              height={6}
              fill={railing.marble}
              stroke={railing.shade}
              strokeWidth={1}
            />
            <path
              d={`${circle(x, y - 27, 6)}M${x - 2} ${y - 32}L${x} ${y - 42}L${x + 2} ${y - 32}Z`}
              fill={railing.marble}
              stroke={railing.shade}
              strokeWidth={1}
            />
          </g>
        ))}
      </g>
    );
  },
);

const tassels = (from: number, to: number, y: number) => {
  const count = Math.round((to - from) / 9);
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = from + ((to - from) * index) / count;
    return `M${fx(x - 1.6)} ${fx(y)}L${fx(x)} ${fx(y + 9)}L${fx(x + 1.6)} ${fx(y)}Z`;
  }).join('');
};

export const Canopy = memo(
  ({
    x,
    y,
    width,
    poles,
    ids,
    canopies,
    trees,
    plume,
  }: {
    x: number;
    y: number;
    width: number;
    poles: number;
    ids: Ids;
    canopies: Paint['canopies'];
    trees: Paint['trees'];
    plume: boolean;
  }) => {
    const half = width / 2;
    const band = width * 0.13;
    const rise = width * 0.42;
    const apex = width * 0.14;
    const roofBase = y - band;
    const front = `M${-half * 0.62} ${roofBase}L${-apex} ${roofBase - rise}L${apex} ${roofBase - rise}L${half * 0.62} ${roofBase}Z`;
    const left = `M${-half} ${roofBase}L${-apex} ${roofBase - rise}L${-half * 0.62} ${roofBase}Z`;
    const right = `M${half} ${roofBase}L${apex} ${roofBase - rise}L${half * 0.62} ${roofBase}Z`;
    const gold = canopies.motif;
    const top = roofBase - rise;
    return (
      <g transform={`translate(${x} 0)`}>
        {[-half + 6, half - 6].map((poleX) => (
          <g key={poleX}>
            <rect x={poleX - 2.5} y={y} width={5} height={poles} fill={canopies.poles} />
            <rect
              x={poleX - 1}
              y={y}
              width={1.6}
              height={poles}
              fill={lighten(canopies.poles, 0.5)}
            />
            <rect
              x={poleX - 6}
              y={y + poles - 8}
              width={12}
              height={8}
              fill={darken(canopies.poles, 0.2)}
            />
          </g>
        ))}
        <rect x={-2} y={y} width={4} height={poles} fill={darken(canopies.poles, 0.25)} />
        <path d={left} fill={ids.url('motif')} />
        <path d={left} fill={darken(canopies.roof, 0.35)} opacity={0.45} />
        <path d={right} fill={ids.url('motif')} />
        <path d={right} fill={darken(canopies.roof, 0.35)} opacity={0.3} />
        <path d={front} fill={ids.url('motif')} />
        <path
          d={`${front}${left}${right}`}
          fill="none"
          stroke={gold}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d={`M${-half} ${roofBase}L${half} ${roofBase}L${half * 0.96} ${y}L${-half * 0.96} ${y}Z`}
          fill={gold}
        />
        <path
          d={`M${-half} ${roofBase + 4}L${half} ${roofBase + 4}`}
          stroke={lighten(gold, 0.45)}
          strokeWidth={2}
        />
        <path
          d={`M${-half * 0.96} ${y - 5}L${half * 0.96} ${y - 5}`}
          stroke={canopies.fringe}
          strokeWidth={3}
          strokeDasharray="6 4"
        />
        <path
          d={`${scallop(-half * 0.96, half * 0.96, y, 14, 12)}L${half * 0.96} ${y}Z`}
          fill={canopies.fringe}
        />
        <path d={tassels(-half * 0.96, half * 0.96, y + 4)} fill={darken(canopies.fringe, 0.15)} />
        <rect
          x={-apex - 6}
          y={top - 12}
          width={apex * 2 + 12}
          height={12}
          fill={gold}
          stroke={darken(gold, 0.3)}
          strokeWidth={1}
        />
        <path
          d={`M${-apex} ${top - 12}Q${-apex} ${top - 40} 0 ${top - 44}Q${apex} ${top - 40} ${apex} ${top - 12}Z`}
          fill={canopies.fringe}
          stroke={gold}
          strokeWidth={2}
        />
        <path
          d={`${circle(0, top - 50, 7)}M-2 ${top - 54}L0 ${top - 70}L2 ${top - 54}Z`}
          fill={gold}
          stroke={darken(gold, 0.3)}
          strokeWidth={1}
        />
        {plume
          ? [-62, -38, -16, 8, 30].map((angle) => (
              <use
                key={angle}
                href={ids.href('spray')}
                transform={`translate(${fx(apex * 0.6)} ${fx(top - 40)}) rotate(${angle + 30}) scale(1.25)`}
              />
            ))
          : null}
        {plume ? <path d={circle(apex * 0.6, top - 40, 5)} fill={trees.blossom} /> : null}
      </g>
    );
  },
);

const archOpening = (half: number, spring: number, apex: number): string => {
  const cusps = 5;
  const points = Array.from({ length: cusps + 1 }, (_, index) => {
    const angle = Math.PI - (index / cusps) * Math.PI;
    return { x: Math.cos(angle) * half, y: spring - Math.sin(angle) * (spring - apex) };
  });
  const lobes = points
    .slice(1)
    .map((point, index) => {
      const previous = points[index] ?? point;
      const midX = (previous.x + point.x) / 2;
      const midY = (previous.y + point.y) / 2;
      return `Q${fx(midX * 0.86)} ${fx(midY - 10)} ${fx(point.x)} ${fx(point.y)}`;
    })
    .join('');
  return `M${-half} 0L${-half} ${spring}${lobes}L${half} 0Z`;
};

export const Chhatri = memo(
  ({
    x,
    y,
    width,
    ids,
    pavilions,
  }: {
    x: number;
    y: number;
    width: number;
    ids: Ids;
    pavilions: Paint['pavilions'];
  }) => {
    const half = width / 2;
    const height = width * 1.05;
    const eave = -height;
    const pillar = width * 0.085;
    const opening = half - pillar;
    const dome = width * 0.42;
    const domeBase = eave - 34;
    const domeTop = domeBase - dome * 1.25;
    const domePath = `M${-dome} ${domeBase}C${-dome * 1.05} ${domeBase - dome * 0.7} ${-dome * 0.35} ${domeTop + 14} 0 ${domeTop}C${dome * 0.35} ${domeTop + 14} ${dome * 1.05} ${domeBase - dome * 0.7} ${dome} ${domeBase}Z`;
    const ribs = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]
      .map(
        (t) =>
          `M${fx(t * dome)} ${domeBase}Q${fx(t * dome * 1.02)} ${fx(domeBase - dome * 0.8)} 0 ${fx(domeTop + 4)}`,
      )
      .join('');
    const stone = pavilions.stone;
    const shade = pavilions.shade;
    return (
      <g transform={`translate(${x} ${y})`}>
        <path
          d={`M${-half} ${eave + 26}L${half} ${eave + 26}L${half} 0L${-half} 0Z${archOpening(opening, eave + height * 0.42, eave + 40)}`}
          transform={`translate(0 0)`}
          fill={stone}
          fillRule="evenodd"
        />
        <path
          d={archOpening(opening, eave + height * 0.42, eave + 40)}
          fill="none"
          stroke={shade}
          strokeWidth={4}
        />
        {[-half + pillar / 2, half - pillar / 2].map((px) => (
          <g key={px}>
            <rect
              x={px - pillar / 2}
              y={eave + 26}
              width={pillar}
              height={-eave - 26}
              fill={ids.url('side')}
            />
            <rect x={px - pillar / 2 - 3} y={-14} width={pillar + 6} height={14} fill={shade} />
            <rect
              x={px - pillar / 2 - 2}
              y={eave + height * 0.42 - 8}
              width={pillar + 4}
              height={8}
              fill={shade}
            />
          </g>
        ))}
        <rect x={-half - 4} y={-8} width={width + 8} height={10} fill={darken(shade, 0.1)} />
        <rect
          x={-half - 14}
          y={eave + 14}
          width={width + 28}
          height={14}
          fill={stone}
          stroke={shade}
          strokeWidth={1.5}
        />
        <path
          d={scallop(-half - 14, half + 14, eave + 28, 12, 6)}
          fill="none"
          stroke={shade}
          strokeWidth={2}
        />
        <rect
          x={-dome - 8}
          y={domeBase}
          width={dome * 2 + 16}
          height={eave + 14 - domeBase}
          fill={stone}
          stroke={shade}
          strokeWidth={1.5}
        />
        <path
          d={Array.from({ length: 9 }, (_, index) =>
            circle(-dome + (index * dome) / 4, domeBase + (eave + 14 - domeBase) / 2, 3),
          ).join('')}
          fill={shade}
        />
        <path d={domePath} fill={stone} stroke={shade} strokeWidth={1.5} />
        <path d={domePath} fill={ids.url('volume')} />
        <path d={ribs} fill="none" stroke={shade} strokeWidth={1.6} opacity={0.85} />
        <path
          d={scallop(-dome, dome, domeBase, 13, -9)}
          fill="none"
          stroke={shade}
          strokeWidth={2}
        />
        <path
          d={`M-2 ${domeTop + 2}L-1 ${domeTop - 40}L1 ${domeTop - 40}L2 ${domeTop + 2}Z${circle(0, domeTop - 8, 5)}${circle(0, domeTop - 22, 3.5)}`}
          fill={darken(stone, 0.12)}
        />
        <path
          d={`M${-half} ${eave + 26}L${-half} 0`}
          stroke={lighten(stone, 0.35)}
          strokeWidth={3}
        />
      </g>
    );
  },
);
