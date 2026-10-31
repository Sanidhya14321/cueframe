import type { ArchSaveTheDateProps } from '@/schemas';
import { fixed, seeded } from './camera';

type Garden = ArchSaveTheDateProps['garden'];

export interface PlantIds {
  blade: string;
  dome: string;
  crown: string;
}

export const PlantDefs = ({ ids, garden }: { ids: PlantIds; garden: Garden }) => (
  <>
    <linearGradient id={ids.blade} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={garden.leafDark} />
      <stop offset="0.45" stopColor={garden.leaf} />
      <stop offset="0.55" stopColor={garden.leafLight} />
      <stop offset="1" stopColor={garden.leaf} />
    </linearGradient>
    <linearGradient id={ids.crown} x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor={garden.leafLight} />
      <stop offset="1" stopColor={garden.leaf} />
    </linearGradient>
    <linearGradient id={ids.dome} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={garden.leaf} />
      <stop offset="1" stopColor={garden.leafDark} />
    </linearGradient>
  </>
);

const bladePath = (length: number, width: number): string =>
  `M 0 0 C ${fixed(-width)} ${fixed(-length * 0.25)} ${fixed(-width * 0.9)} ${fixed(-length * 0.75)} 0 ${fixed(-length)} C ${fixed(width * 0.9)} ${fixed(-length * 0.75)} ${fixed(width)} ${fixed(-length * 0.25)} 0 0 Z`;

const Blade = ({
  x,
  y,
  angle,
  length,
  width,
  ids,
  garden,
  slits = 0,
}: {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  ids: PlantIds;
  garden: Garden;
  slits?: number;
}) => (
  <g transform={`translate(${fixed(x)} ${fixed(y)}) rotate(${fixed(angle)})`}>
    <path d={bladePath(length, width)} fill={`url(#${ids.blade})`} />
    <path
      d={`M 0 0 Q ${fixed(width * 0.12)} ${fixed(-length * 0.5)} 0 ${fixed(-length * 0.96)}`}
      fill="none"
      stroke={garden.leafLight}
      strokeWidth={fixed(Math.max(1.2, width * 0.07))}
    />
    {Array.from({ length: slits }, (_, index) => {
      const along = -length * (0.2 + (index / Math.max(1, slits)) * 0.65);
      const side = index % 2 === 0 ? 1 : -1;
      return (
        <path
          key={index}
          d={`M 0 ${fixed(along)} l ${fixed(side * width * 0.8)} ${fixed(-length * 0.06)}`}
          stroke={garden.leafDark}
          strokeOpacity={0.6}
          strokeWidth={1.5}
        />
      );
    })}
  </g>
);

export const Banana = ({
  x,
  base,
  height,
  flip,
  ids,
  garden,
}: {
  x: number;
  base: number;
  height: number;
  flip: number;
  ids: PlantIds;
  garden: Garden;
}) => {
  const top = base - height * 0.42;
  const leaves = [-62, -38, -14, 8, 30, 54];
  return (
    <g>
      <path
        d={`M ${fixed(x - height * 0.035)} ${fixed(base)} L ${fixed(x - height * 0.016)} ${fixed(top)} L ${fixed(x + height * 0.016)} ${fixed(top)} L ${fixed(x + height * 0.035)} ${fixed(base)} Z`}
        fill={`url(#${ids.blade})`}
      />
      {leaves.map((angle, index) => (
        <Blade
          key={angle}
          x={x}
          y={top + index * 4}
          angle={angle * flip}
          length={height * (0.5 + seeded(index, x) * 0.16)}
          width={height * 0.085}
          ids={ids}
          garden={garden}
          slits={4}
        />
      ))}
    </g>
  );
};

const leafletPath = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  bulge: number,
): string => {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const length = Math.hypot(toX - fromX, toY - fromY) || 1;
  const normalX = (-(toY - fromY) / length) * bulge;
  const normalY = ((toX - fromX) / length) * bulge;
  return `M ${fixed(fromX)} ${fixed(fromY)} Q ${fixed(midX + normalX)} ${fixed(midY + normalY)} ${fixed(toX)} ${fixed(toY)} Q ${fixed(midX - normalX)} ${fixed(midY - normalY)} ${fixed(fromX)} ${fixed(fromY)} Z`;
};

export const Shrub = ({
  x,
  base,
  width,
  height,
  garden,
  ids,
}: {
  x: number;
  base: number;
  width: number;
  height: number;
  garden: Garden;
  ids: PlantIds;
}) => {
  const clusters = 16;
  const leaf = width * 0.1;
  return (
    <g>
      <path
        d={`M ${fixed(x - width / 2)} ${fixed(base)} C ${fixed(x - width / 2)} ${fixed(base - height * 1.25)} ${fixed(x + width / 2)} ${fixed(base - height * 1.25)} ${fixed(x + width / 2)} ${fixed(base)} Z`}
        fill={`url(#${ids.dome})`}
      />
      {Array.from({ length: clusters }, (_cluster, index) => {
        const angle = Math.PI * (0.08 + 0.84 * seeded(index, x + 1));
        const reach = 0.35 + 0.6 * seeded(index, x + 2);
        const cx = x - Math.cos(angle) * width * 0.42 * reach;
        const cy = base - Math.sin(angle) * height * 0.86 * reach - height * 0.08;
        const lit = cy < base - height * 0.55;
        return (
          <g key={index}>
            {[0, 72, 144, 216, 288].map((turn) => {
              const radians = ((turn + index * 17) * Math.PI) / 180;
              return (
                <path
                  key={turn}
                  d={leafletPath(
                    cx,
                    cy,
                    cx + Math.cos(radians) * leaf,
                    cy + Math.sin(radians) * leaf,
                    leaf * 0.32,
                  )}
                  fill={lit ? garden.leafLight : garden.leaf}
                  stroke={garden.leafDark}
                  strokeWidth={1}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

export const FloweringStalk = ({
  x,
  base,
  height,
  garden,
  seed,
  flower,
}: {
  x: number;
  base: number;
  height: number;
  garden: Garden;
  seed: number;
  flower: string;
}) => (
  <g>
    {Array.from({ length: 8 }, (_stem, stem) => {
      const lean = (seeded(stem, seed) - 0.5) * height * 0.6;
      const tall = height * (0.55 + seeded(stem, seed + 1) * 0.45);
      const tipX = x + lean;
      const tipY = base - tall;
      const along = (share: number): [number, number] => [
        x + lean * share * share,
        base - tall * share,
      ];
      return (
        <g key={stem}>
          <path
            d={`M ${fixed(x)} ${fixed(base)} Q ${fixed(x + lean * 0.2)} ${fixed(base - tall * 0.6)} ${fixed(tipX)} ${fixed(tipY)}`}
            fill="none"
            stroke={garden.leafDark}
            strokeWidth={2.2}
          />
          {[0.3, 0.45, 0.6].map((share, index) => {
            const [lx, ly] = along(share);
            const side = index % 2 === 0 ? -1 : 1;
            return (
              <path
                key={share}
                d={leafletPath(lx, ly, lx + side * 34, ly - 16, 7)}
                fill={index === 1 ? garden.leafLight : garden.leaf}
              />
            );
          })}
          {Array.from({ length: 9 }, (_bud, bloom) => {
            const [bx, by] = along(0.62 + (bloom / 8) * 0.38);
            const dx = (seeded(bloom, seed + stem) - 0.5) * 26;
            return (
              <g key={bloom}>
                <circle cx={fixed(bx + dx)} cy={fixed(by)} r={5} fill={flower} />
                <circle
                  cx={fixed(bx + dx)}
                  cy={fixed(by)}
                  r={1.8}
                  fill={garden.rose}
                  opacity={0.65}
                />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

export const Frond = ({
  x,
  base,
  height,
  flip,
  garden,
}: {
  x: number;
  base: number;
  height: number;
  flip: number;
  garden: Garden;
}) => {
  const tipX = x + flip * height * 0.55;
  const tipY = base - height;
  const bendX = x + flip * height * 0.05;
  const bendY = base - height * 0.85;
  const leaflets = 16;
  return (
    <g>
      <path
        d={`M ${fixed(x)} ${fixed(base)} Q ${fixed(bendX)} ${fixed(bendY)} ${fixed(tipX)} ${fixed(tipY)}`}
        fill="none"
        stroke={garden.leafDark}
        strokeWidth={3}
      />
      {Array.from({ length: leaflets }, (_leaflet, index) => {
        const t = 0.22 + (index / leaflets) * 0.76;
        const px = (1 - t) ** 2 * x + 2 * (1 - t) * t * bendX + t * t * tipX;
        const py = (1 - t) ** 2 * base + 2 * (1 - t) * t * bendY + t * t * tipY;
        const reach = height * 0.22 * (1 - t * 0.55);
        return (
          <g key={index}>
            <path
              d={leafletPath(px, py, px - reach, py + reach * 0.75, reach * 0.12)}
              fill={garden.leaf}
            />
            <path
              d={leafletPath(px, py, px + reach, py + reach * 0.75, reach * 0.12)}
              fill={garden.leafLight}
            />
          </g>
        );
      })}
    </g>
  );
};

export const RoseBush = ({
  x,
  base,
  height,
  garden,
  seed,
}: {
  x: number;
  base: number;
  height: number;
  garden: Garden;
  seed: number;
}) => (
  <g>
    {Array.from({ length: 4 }, (_, stem) => {
      const lean = (stem - 1.5) * height * 0.16 + (seeded(stem, seed) - 0.5) * height * 0.1;
      const tall = height * (0.7 + seeded(stem, seed + 4) * 0.3);
      const tipX = x + lean;
      const tipY = base - tall;
      return (
        <g key={stem}>
          <path
            d={`M ${fixed(x)} ${fixed(base)} Q ${fixed(x + lean * 0.3)} ${fixed(base - tall * 0.5)} ${fixed(tipX)} ${fixed(tipY)}`}
            fill="none"
            stroke={garden.leafDark}
            strokeWidth={3}
          />
          {[0.3, 0.5, 0.7].map((along) => {
            const lx = x + lean * along * along;
            const ly = base - tall * along;
            const side = along === 0.5 ? 1 : -1;
            return (
              <ellipse
                key={along}
                cx={fixed(lx + side * 13)}
                cy={fixed(ly)}
                rx={14}
                ry={6}
                fill={along === 0.5 ? garden.leaf : garden.leafDark}
                transform={`rotate(${side * -28} ${fixed(lx + side * 13)} ${fixed(ly)})`}
              />
            );
          })}
          <circle cx={fixed(tipX)} cy={fixed(tipY)} r={15} fill={garden.rose} />
          <circle
            cx={fixed(tipX - 3)}
            cy={fixed(tipY - 3)}
            r={9}
            fill={garden.blossom}
            opacity={0.75}
          />
          <path
            d={`M ${fixed(tipX - 7)} ${fixed(tipY + 2)} q 7 -10 13 -1 q -6 7 -11 1`}
            fill="none"
            stroke={garden.rose}
            strokeWidth={2}
          />
          <path
            d={`M ${fixed(tipX - 10)} ${fixed(tipY + 12)} q 10 6 20 0`}
            fill="none"
            stroke={garden.leafDark}
            strokeWidth={2.5}
          />
        </g>
      );
    })}
  </g>
);
