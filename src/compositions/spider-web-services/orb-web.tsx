import { random } from 'remotion';

const SPOKES = 12;

const RINGS = 9;

const HEX_EDGE = Math.PI / 3;

const spokeAngle = (index: number) => (index / SPOKES) * Math.PI * 2 + Math.PI / 2;

const hexReach = (angle: number): number => {
  const local = (((angle - Math.PI / 2) % HEX_EDGE) + HEX_EDGE) % HEX_EDGE;
  return Math.cos(HEX_EDGE / 2) / Math.cos(local - HEX_EDGE / 2);
};

const ringPoint = (ring: number, radius: number, index: number) => {
  const r = (radius * (ring + 1)) / (RINGS + 1);
  const wobble = 1 + (random(`orb-${ring}-${index % SPOKES}`) - 0.5) * 0.04;
  const angle = spokeAngle(index);
  const reach = r * wobble * hexReach(angle);
  return { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach };
};

const ringPath = (ring: number, radius: number): string =>
  Array.from({ length: SPOKES + 1 }, (_, index) => ringPoint(ring, radius, index))
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

const DEW = Array.from({ length: 14 }, (_, index) => ({
  ring: 2 + Math.floor(random(`dew-ring-${index}`) * (RINGS - 2)),
  spoke: Math.floor(random(`dew-spoke-${index}`) * SPOKES),
  size: 4.5 + random(`dew-size-${index}`) * 3.5,
  phase: random(`dew-phase-${index}`) * Math.PI * 2,
}));

const ringDraw = (progress: number, ring: number) =>
  Math.min(1, Math.max(0, (progress - 0.3 - ring * 0.05) / 0.2));

export const OrbWeb = ({
  x,
  y,
  width,
  tilt,
  color,
  dewColor,
  progress,
  frame,
}: {
  x: number;
  y: number;
  width: number;
  tilt: number;
  color: string;
  dewColor: string;
  progress: number;
  frame: number;
}) => {
  const radius = width / 2;
  const spokeDraw = Math.min(1, progress / 0.45);
  const size = width + 40;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `perspective(1400px) rotateX(${tilt + Math.sin(frame / 34) * 3}deg) rotateZ(${Math.sin(frame / 27) * 1.4}deg)`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <g fill="none" stroke={color} strokeLinecap="butt" strokeLinejoin="round">
          {spokeDraw > 0.01
            ? Array.from({ length: SPOKES }, (_, index) => {
                const angle = spokeAngle(index);
                const length = radius * (1.02 + random(`orb-spoke-${index}`) * 0.08);
                return (
                  <path
                    key={angle}
                    d={`M 0 0 L ${(Math.cos(angle) * length).toFixed(1)} ${(Math.sin(angle) * length).toFixed(1)}`}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - spokeDraw}
                    strokeWidth={3}
                    strokeOpacity={0.9}
                  />
                );
              })
            : null}
          {Array.from({ length: RINGS }, (_, ring) => {
            const local = ringDraw(progress, ring);
            if (local < 0.02) {
              return null;
            }
            return (
              <path
                key={ring}
                d={ringPath(ring, radius)}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - local}
                strokeWidth={2.2}
                strokeOpacity={0.85}
              />
            );
          })}
        </g>
        {DEW.map((drop) => {
          const appear = Math.min(1, Math.max(0, (ringDraw(progress, drop.ring) - 0.9) * 10));
          if (appear <= 0) {
            return null;
          }
          const point = ringPoint(drop.ring, radius, drop.spoke);
          const twinkle = 0.75 + Math.sin(frame / 9 + drop.phase) * 0.25;
          return (
            <circle
              key={`${drop.ring}-${drop.spoke}-${drop.phase}`}
              cx={point.x}
              cy={point.y}
              r={drop.size}
              fill={dewColor}
              opacity={appear * twinkle}
            />
          );
        })}
      </svg>
    </div>
  );
};
