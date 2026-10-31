import type { PuzzleSuccessProps } from '@/schemas';
import type { PuzzleBeat } from './choreography';
import { CORNERS, type Corner } from './geometry';

const BEND_SIGN: Record<Corner, number> = {
  topLeft: 1,
  topRight: -1,
  bottomLeft: -1,
  bottomRight: 1,
};

const cablePath = (from: [number, number], to: [number, number], bend: number): string => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const nx = -dy;
  const ny = dx;
  const c1x = from[0] + dx / 3 + nx * bend;
  const c1y = from[1] + dy / 3 + ny * bend;
  const c2x = from[0] + (dx * 2) / 3 - nx * bend;
  const c2y = from[1] + (dy * 2) / 3 - ny * bend;
  return `M ${from[0].toFixed(2)} ${from[1].toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${to[0].toFixed(2)} ${to[1].toFixed(2)}`;
};

export const NeonDefs = ({ props, prefix }: { props: PuzzleSuccessProps; prefix: string }) => (
  <filter id={`${prefix}-neon-glow`} x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation={props.neon.glowSize} />
  </filter>
);

export const NeonCables = ({
  props,
  beat,
  prefix,
}: {
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => {
  const { neon } = props;
  if (!neon.show) {
    return null;
  }
  const boost = 1 + beat.neonBoost * neon.flashBoost;
  const paths = CORNERS.map((corner) => {
    const piece = props[corner];
    const pose = beat.poses[corner];
    return {
      corner,
      d: cablePath([piece.cableX, piece.cableY], [pose.x, pose.y], neon.bend * BEND_SIGN[corner]),
    };
  });
  return (
    <g fill="none" strokeLinecap="round">
      {neon.glowStrength > 0 ? (
        <g
          filter={`url(#${prefix}-neon-glow)`}
          opacity={Math.min(1, neon.glowStrength * (0.7 + 0.3 * beat.neonBoost)) * beat.breath}
        >
          {paths.map(({ corner, d }) => (
            <path key={corner} d={d} stroke={neon.glow} strokeWidth={neon.width * 6} />
          ))}
          {paths.map(({ corner, d }) => (
            <path
              key={`${corner}-inner`}
              d={d}
              stroke={neon.core}
              strokeWidth={neon.width * 2.2}
              opacity={0.6}
            />
          ))}
        </g>
      ) : null}
      {paths.map(({ corner, d }) => (
        <path
          key={corner}
          d={d}
          stroke={neon.core}
          strokeWidth={neon.width * (1 + beat.neonBoost * 0.4)}
        />
      ))}
      {beat.neonBoost > 0 ? (
        <g filter={`url(#${prefix}-neon-glow)`} opacity={beat.neonBoost * 0.7}>
          {paths.map(({ corner, d }) => (
            <path
              key={corner}
              d={d}
              stroke={props.pulse.coreColor}
              strokeWidth={neon.width * 1.6 * boost}
            />
          ))}
        </g>
      ) : null}
      {beat.neonBoost > 0 ? (
        <g opacity={beat.neonBoost}>
          {paths.map(({ corner, d }) => (
            <path key={corner} d={d} stroke="#ffffff" strokeWidth={neon.width * 0.8} />
          ))}
        </g>
      ) : null}
    </g>
  );
};
