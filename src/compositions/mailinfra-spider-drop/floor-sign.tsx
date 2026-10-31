import type { MailinfraSpiderDropProps, SpiderDropFloor } from '@/schemas';
import { displayFont } from '../promo/fonts';
import { mix, seeded, shade, tint } from './paint';

export const Cobweb = ({
  x,
  y,
  radius,
  from,
  to,
  color,
  opacity,
}: {
  x: number;
  y: number;
  radius: number;
  from: number;
  to: number;
  color: string;
  opacity: number;
}) => {
  if (opacity <= 0) {
    return null;
  }
  const spokes = 6;
  const angles = Array.from(
    { length: spokes },
    (_, index) => from + ((to - from) * index) / (spokes - 1),
  );
  const point = (angle: number, distance: number) =>
    `${(x + Math.cos(angle) * distance).toFixed(1)} ${(y + Math.sin(angle) * distance).toFixed(1)}`;
  const rings = [0.3, 0.52, 0.74, 0.95].map((share) => {
    const distance = radius * share;
    const segments = angles.slice(1).map((angle, index) => {
      const previous = angles[index] ?? angle;
      const middle = (previous + angle) / 2;
      return `Q ${point(middle, distance * 0.82)} ${point(angle, distance)}`;
    });
    return `M ${point(angles[0] ?? from, distance)} ${segments.join(' ')}`;
  });
  return (
    <g opacity={opacity} fill="none" stroke={color} strokeLinecap="round">
      {angles.map((angle) => (
        <path
          key={`s${angle.toFixed(3)}`}
          d={`M ${x} ${y} L ${point(angle, radius)}`}
          strokeWidth={1.6}
        />
      ))}
      {rings.map((d) => (
        <path key={d} d={d} strokeWidth={1.2} />
      ))}
    </g>
  );
};

const signCenterX = (props: MailinfraSpiderDropProps, index: number): number => {
  const first = props.signs.firstSide === 'right' ? 1 : -1;
  const side = index % 2 === 0 ? first : -first;
  return 540 + side * (props.signs.width / 2 - props.signs.overlap);
};

const fitSize = (label: string, size: number, width: number): number =>
  Math.min(size, (width - 70) / Math.max(1, label.length * 0.56));

const SilkCross = ({
  cx,
  y,
  half,
  rise,
  color,
}: {
  cx: number;
  y: number;
  half: number;
  rise: number;
  color: string;
}) => {
  const strands = [
    [cx - half, y - rise, cx + half, y + rise],
    [cx - half, y + rise, cx + half, y - rise],
  ] as const;
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      {strands.map(([x1, y1, x2, y2]) => (
        <g key={`${x1.toFixed(1)}:${y1.toFixed(1)}`}>
          <path d={`M ${x1} ${y1} Q ${cx} ${y + 10} ${x2} ${y2}`} strokeWidth={7} />
          <path
            d={`M ${x1} ${y1 + 9} Q ${cx} ${y + 20} ${x2} ${y2 + 9}`}
            strokeWidth={2.5}
            strokeOpacity={0.55}
          />
          <circle cx={x1} cy={y1} r={6} fill={color} stroke="none" />
          <circle cx={x2} cy={y2} r={6} fill={color} stroke="none" />
        </g>
      ))}
    </g>
  );
};

export const FloorBeam = ({ props, y }: { props: MailinfraSpiderDropProps; y: number }) => {
  const { signs, silk } = props;
  if (!signs.beam) {
    return null;
  }
  return (
    <g>
      <rect x={-20} y={y - 12} width={1120} height={30} fill={signs.beamColor} />
      <rect x={-20} y={y - 12} width={1120} height={4} fill={tint(signs.beamColor, 0.18)} />
      <rect x={-20} y={y + 18} width={1120} height={10} fill={shade(signs.beamColor, 0.45)} />
      <Cobweb
        x={0}
        y={y + 28}
        radius={220}
        from={0}
        to={Math.PI / 2}
        color={silk.color}
        opacity={signs.cobwebs}
      />
      <Cobweb
        x={1080}
        y={y + 28}
        radius={190}
        from={Math.PI / 2}
        to={Math.PI}
        color={silk.color}
        opacity={signs.cobwebs}
      />
    </g>
  );
};

export const FloorSign = ({
  props,
  floor,
  index,
  y,
  angle,
  faceId,
}: {
  props: MailinfraSpiderDropProps;
  floor: SpiderDropFloor;
  index: number;
  y: number;
  angle: number;
  faceId: string;
}) => {
  const { signs, silk } = props;
  const cx = signCenterX(props, index);
  const side = cx > 540 ? 1 : -1;
  const width = signs.width;
  const height = signs.height;
  const left = cx - width / 2;
  const top = y - height / 2;
  const pivotY = top - signs.hang;
  const edge = shade(floor.color, 0.5);
  const random = seeded(index * 31 + 5);
  const specks = Array.from({ length: Math.round(signs.dust * 46) }, () => ({
    x: left + 16 + random() * (width - 32),
    y: top + 12 + random() * (height - 24),
    r: 1 + random() * 2.4,
    o: 0.12 + random() * 0.2,
  }));
  const size = fitSize(floor.label, signs.textSize, width);
  const layers = Array.from(
    { length: Math.ceil(signs.depth / 2) },
    (_, layer) => signs.depth - layer * 2,
  );
  const strandX = width * 0.32;
  return (
    <g transform={`rotate(${(angle * side).toFixed(3)} ${cx} ${pivotY})`}>
      <path
        d={`M ${cx - strandX} ${pivotY} L ${cx - strandX} ${top + 8} M ${cx + strandX} ${pivotY} L ${cx + strandX} ${top + 8}`}
        stroke={silk.color}
        strokeOpacity={0.7}
        strokeWidth={2.4}
      />
      <rect
        x={left + 10}
        y={top + signs.depth + 18}
        width={width}
        height={height}
        rx={22}
        fill="#000000"
        opacity={0.28}
      />
      {layers.map((offset) => (
        <rect
          key={offset}
          x={left + offset * 0.3}
          y={top + offset}
          width={width}
          height={height}
          rx={20}
          fill={edge}
        />
      ))}
      <rect x={left} y={top} width={width} height={height} rx={20} fill={`url(#${faceId})`} />
      <rect
        x={left + 8}
        y={top + 8}
        width={width - 16}
        height={height - 16}
        rx={14}
        fill="none"
        stroke={tint(floor.color, 0.3)}
        strokeOpacity={0.55}
        strokeWidth={2}
      />
      {specks.map((speck) => (
        <circle
          key={`${speck.x.toFixed(2)}:${speck.y.toFixed(2)}`}
          cx={speck.x}
          cy={speck.y}
          r={speck.r}
          fill={silk.color}
          opacity={speck.o}
        />
      ))}
      <g
        opacity={floor.crossed ? signs.crossedDim : 1}
        fontFamily={displayFont}
        fontWeight={700}
        fontSize={size}
        letterSpacing={`${-0.02 * size}px`}
        textAnchor="middle"
      >
        <text x={cx + 1.5} y={y + size * 0.36 + 4} fill={mix(edge, '#000000', 0.3)}>
          {floor.label}
        </text>
        <text x={cx} y={y + size * 0.36} fill={signs.text}>
          {floor.label}
        </text>
      </g>
      <Cobweb
        x={side > 0 ? left + width : left}
        y={top}
        radius={Math.min(width, height) * 0.5}
        from={side > 0 ? Math.PI / 2 : 0}
        to={Math.PI}
        color={silk.color}
        opacity={signs.cobwebs * 0.8}
      />
      {floor.crossed ? (
        <SilkCross
          cx={cx}
          y={y}
          half={Math.min(width / 2 - 18, (floor.label.length * 0.56 * size) / 2 + 34)}
          rise={size * 0.44}
          color={signs.strike}
        />
      ) : null}
    </g>
  );
};

export const SignFaceGradient = ({ id, color }: { id: string; color: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={tint(color, 0.14)} />
    <stop offset="1" stopColor={shade(color, 0.16)} />
  </linearGradient>
);
