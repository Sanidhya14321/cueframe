import { random } from 'remotion';
import type { ThreadWeb } from '@/schemas';
import { settle, smooth, tween } from '../promo/timing';

const SPOKES = 16;

const TURNS = 9;

const spokeAngle = (index: number): number =>
  (index / SPOKES) * Math.PI * 2 + (random(`thread-orb-angle-${index}`) - 0.5) * 0.16;

const spokeLength = (index: number): number => 0.86 + random(`thread-orb-length-${index}`) * 0.2;

const spiralPath = (radius: number): string => {
  const steps = TURNS * SPOKES;
  const inner = radius * 0.12;
  return Array.from({ length: steps + 1 }, (_, step) => {
    const spoke = step % SPOKES;
    const share = inner / radius + (1 - inner / radius) * 0.84 * (step / steps);
    const reach = radius * share * spokeLength(spoke);
    const angle = spokeAngle(spoke);
    const x = Math.cos(angle) * reach;
    const y = Math.sin(angle) * reach;
    return `${step === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join('');
};

export const OrbWeb = ({
  x,
  y,
  radius,
  frame,
  start,
  frames,
  web,
}: {
  x: number;
  y: number;
  radius: number;
  frame: number;
  start: number;
  frames: number;
  web: ThreadWeb;
}) => {
  const box = radius * 1.25;
  const spokeFrames = frames * 0.45;
  const spiral = tween(frame, [start + frames * 0.3, start + frames], [0, 1], smooth);
  return (
    <svg
      aria-hidden="true"
      width={box * 2}
      height={box * 2}
      viewBox={`${-box} ${-box} ${box * 2} ${box * 2}`}
      style={{ position: 'absolute', left: x - box, top: y - box }}
    >
      <g fill="none" stroke={web.silk} strokeLinecap="butt">
        {Array.from({ length: SPOKES }, (_, index) => {
          const delay = (index / SPOKES) * frames * 0.25;
          const grow = tween(frame, [start + delay, start + delay + spokeFrames], [0, 1], settle);
          const angle = spokeAngle(index);
          const reach = radius * spokeLength(index);
          return (
            <path
              key={angle.toFixed(4)}
              d={`M0 0L${(Math.cos(angle) * reach).toFixed(1)} ${(Math.sin(angle) * reach).toFixed(1)}`}
              strokeWidth={1.4}
              pathLength={1}
              strokeDasharray={`${grow.toFixed(4)} 2`}
              opacity={0.7 * Math.min(1, grow * 8)}
            />
          );
        })}
        <path
          d={spiralPath(radius)}
          strokeWidth={1.1}
          pathLength={1}
          strokeDasharray={`${spiral.toFixed(4)} 2`}
          opacity={0.55 * Math.min(1, spiral * 10)}
        />
      </g>
    </svg>
  );
};
