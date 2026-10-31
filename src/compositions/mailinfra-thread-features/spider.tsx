import { useId } from 'react';
import type { ThreadWeb } from '@/schemas';

const LEG_ANGLES = [-62, -24, 18, 54];

const BOX = 90;

const legPath = (side: number, index: number, phase: number, tuck: number): string => {
  const swing = Math.sin(phase + index * (Math.PI / 2) + (side > 0 ? Math.PI : 0)) * 11;
  const angle = (((LEG_ANGLES[index] ?? 0) + swing) * Math.PI) / 180;
  const hipX = side * 8;
  const hipY = -10 + index * 3.2;
  const femur = 26 * (1 - tuck * 0.25);
  const kneeX = hipX + side * Math.cos(angle) * femur;
  const kneeY = hipY + Math.sin(angle) * femur - 12 * (1 - tuck);
  const tibia = 30 * (1 - tuck * 0.35);
  const footAngle = angle + (index < 2 ? -0.35 : 0.45) * (1 + tuck);
  const footX = kneeX + side * Math.cos(footAngle) * tibia;
  const footY = kneeY + Math.sin(footAngle) * tibia + 10;
  return `M${hipX.toFixed(2)} ${hipY.toFixed(2)}L${kneeX.toFixed(2)} ${kneeY.toFixed(2)}L${footX.toFixed(2)} ${footY.toFixed(2)}`;
};

export const Spider = ({
  x,
  y,
  heading,
  phase,
  tuck = 0,
  web,
}: {
  x: number;
  y: number;
  heading: number;
  phase: number;
  tuck?: number;
  web: ThreadWeb;
}) => {
  const id = useId().replace(/:/g, '');
  const size = BOX * 2 * web.spiderSize;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`${-BOX} ${-BOX} ${BOX * 2} ${BOX * 2}`}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        transform: `rotate(${heading.toFixed(3)}deg)`,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={web.spiderSheen} />
          <stop offset="0.55" stopColor={web.spiderBody} />
          <stop offset="1" stopColor={web.spiderBody} />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={web.spiderSheen}
        strokeWidth={3.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {[-1, 1].flatMap((side) =>
          LEG_ANGLES.map((_, index) => (
            <path key={`${side}-${index}`} d={legPath(side, index, phase, tuck)} />
          )),
        )}
      </g>
      <ellipse
        cx={0}
        cy={18}
        rx={17}
        ry={22}
        fill={`url(#${id}-body)`}
        stroke={web.silk}
        strokeOpacity={0.45}
        strokeWidth={1.5}
      />
      <ellipse
        cx={0}
        cy={-10}
        rx={12}
        ry={11}
        fill={`url(#${id}-body)`}
        stroke={web.silk}
        strokeOpacity={0.45}
        strokeWidth={1.5}
      />
      <path d="M-6 9 L6 9 L0 19 Z M0 21 L6 31 L-6 31 Z" fill={web.spiderMark} />
      <circle cx={-4} cy={-17} r={2.2} fill={web.spiderMark} />
      <circle cx={4} cy={-17} r={2.2} fill={web.spiderMark} />
      <path
        d="M-4 -21 L-6 -27 M4 -21 L6 -27"
        stroke={web.spiderBody}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
};
