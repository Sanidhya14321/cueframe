import type { Point } from './geometry';

const LEG_ANGLES = [-62, -22, 14, 48];

const legPath = (side: number, index: number, size: number, gait: number): string => {
  const swing = Math.sin(gait + (index % 2 === 0 ? 0 : Math.PI) + (side > 0 ? Math.PI : 0)) * 0.24;
  const base = ((LEG_ANGLES[index] ?? 0) * Math.PI) / 180 + swing;
  const hip = { x: side * size * 0.06, y: -size * 0.12 + index * size * 0.04 };
  const knee = {
    x: hip.x + side * Math.cos(base) * size * 0.22,
    y: hip.y + Math.sin(base) * size * 0.22,
  };
  const reach = base * 1.35 + (index < 2 ? -0.2 : 0.25);
  const foot = {
    x: knee.x + side * Math.cos(reach) * size * 0.26,
    y: knee.y + Math.sin(reach) * size * 0.26,
  };
  return `M ${hip.x.toFixed(2)} ${hip.y.toFixed(2)} L ${knee.x.toFixed(2)} ${knee.y.toFixed(2)} L ${foot.x.toFixed(2)} ${foot.y.toFixed(2)}`;
};

export const Spider = ({
  at,
  heading,
  gait,
  size,
  color,
  markColor,
  rimColor,
}: {
  at: Point;
  heading: number;
  gait: number;
  size: number;
  color: string;
  markColor: string;
  rimColor: string;
}) => {
  const rotation = (heading * 180) / Math.PI + 90;
  const legs = [-1, 1].flatMap((side) =>
    LEG_ANGLES.map((_, index) => ({
      key: `${side}-${index}`,
      d: legPath(side, index, size, gait),
    })),
  );
  return (
    <g
      transform={`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${rotation.toFixed(2)})`}
    >
      {legs.map((leg) => (
        <path
          key={`rim-${leg.key}`}
          d={leg.d}
          fill="none"
          stroke={rimColor}
          strokeWidth={size * 0.064}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
      ))}
      <g stroke={rimColor} strokeWidth={size * 0.03} strokeOpacity={0.85}>
        <ellipse cx={0} cy={size * 0.21} rx={size * 0.15} ry={size * 0.2} fill={color} />
        <ellipse cx={0} cy={-size * 0.07} rx={size * 0.1} ry={size * 0.115} fill={color} />
      </g>
      {legs.map((leg) => (
        <path
          key={leg.key}
          d={leg.d}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.034}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <ellipse cx={0} cy={size * 0.21} rx={size * 0.15} ry={size * 0.2} fill={color} />
      <ellipse cx={0} cy={-size * 0.07} rx={size * 0.1} ry={size * 0.115} fill={color} />
      <ellipse cx={0} cy={-size * 0.18} rx={size * 0.05} ry={size * 0.035} fill={color} />
      <ellipse
        cx={-size * 0.045}
        cy={size * 0.12}
        rx={size * 0.06}
        ry={size * 0.1}
        fill={rimColor}
        opacity={0.28}
      />
      <ellipse
        cx={-size * 0.035}
        cy={-size * 0.1}
        rx={size * 0.035}
        ry={size * 0.05}
        fill={rimColor}
        opacity={0.24}
      />
      <rect
        x={-size * 0.075}
        y={size * 0.15}
        width={size * 0.15}
        height={size * 0.1}
        rx={size * 0.012}
        fill="none"
        stroke={markColor}
        strokeWidth={size * 0.02}
      />
      <path
        d={`M ${-size * 0.075} ${size * 0.15} L 0 ${size * 0.205} L ${size * 0.075} ${size * 0.15}`}
        fill="none"
        stroke={markColor}
        strokeWidth={size * 0.02}
        strokeLinejoin="round"
      />
    </g>
  );
};

export const spiderTail = (at: Point, heading: number, size: number): Point => ({
  x: at.x - Math.cos(heading) * size * 0.4,
  y: at.y - Math.sin(heading) * size * 0.4,
});
