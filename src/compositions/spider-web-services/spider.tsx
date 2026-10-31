import { useId } from 'react';

const LEG_ANGLES = [32, 68, 112, 150];

const LEG_LENGTHS = [
  [34, 42],
  [30, 36],
  [28, 32],
  [34, 44],
];

const legPath = (side: number, index: number, gait: number): string => {
  const base = LEG_ANGLES[index] ?? 90;
  const [upper = 30, lower = 36] = LEG_LENGTHS[index] ?? [];
  const phase = gait + (index % 2 === 0 ? 0 : Math.PI) + (side > 0 ? Math.PI : 0);
  const swing = Math.sin(phase) * 9;
  const angle = ((base + swing) * Math.PI) / 180;
  const hipX = side * 7;
  const hipY = -8 + index * 4.5;
  const kneeX = hipX + side * Math.sin(angle) * upper;
  const kneeY = hipY - Math.cos(angle) * upper - 8;
  const footAngle = angle + (side > 0 ? 0.35 : -0.35) * (index < 2 ? -1 : 1) * side;
  const footX = kneeX + side * Math.sin(footAngle) * lower * 0.95;
  const footY = kneeY - Math.cos(footAngle) * lower + 6;
  return `M ${hipX} ${hipY} Q ${(hipX + kneeX) / 2} ${(hipY + kneeY) / 2 - 6} ${kneeX} ${kneeY} L ${footX} ${footY}`;
};

export const Spider = ({
  x,
  y,
  heading,
  gait,
  scale,
  body,
  marks,
}: {
  x: number;
  y: number;
  heading: number;
  gait: number;
  scale: number;
  body: string;
  marks: string;
}) => {
  const id = useId().replaceAll(':', '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`}>
      <defs>
        <radialGradient id={`${id}-abdomen`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor={body} />
          <stop offset="1" stopColor={marks} />
        </radialGradient>
        <radialGradient id={`${id}-head`} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.3" stopColor={body} />
          <stop offset="1" stopColor={marks} />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#05010f" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        {[-1, 1].map((side) =>
          LEG_ANGLES.map((_, index) => (
            <g key={`${side}-${LEG_ANGLES[index]}`}>
              <path
                d={legPath(side, index, gait)}
                fill="none"
                stroke={marks}
                strokeWidth={5.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={legPath(side, index, gait)}
                fill="none"
                stroke={body}
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 4"
              />
            </g>
          )),
        )}
        <ellipse cx={0} cy={-14} rx={4} ry={5} fill={marks} />
        <ellipse cx={0} cy={-2} rx={11} ry={12} fill={`url(#${id}-head)`} />
        <ellipse cx={0} cy={24} rx={15} ry={19} fill={`url(#${id}-abdomen)`} />
        <path
          d="M 0 12 L 0 36 M -6 19 L 0 23 L 6 19 M -6 28 L 0 32 L 6 28"
          stroke={marks}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.45}
          fill="none"
        />
        <circle cx={-3} cy={-9} r={1.6} fill="#ffffff" opacity={0.8} />
        <circle cx={3} cy={-9} r={1.6} fill="#ffffff" opacity={0.8} />
      </g>
    </g>
  );
};
