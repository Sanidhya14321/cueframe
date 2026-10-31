import type { PuzzleSuccessProps } from '@/schemas';
import type { PuzzleBeat } from './choreography';

export const PulseDefs = ({ props, prefix }: { props: PuzzleSuccessProps; prefix: string }) => (
  <>
    <radialGradient id={`${prefix}-core`}>
      <stop offset="0" stopColor={props.pulse.coreColor} stopOpacity="1" />
      <stop offset="0.74" stopColor={props.pulse.coreColor} stopOpacity="0.96" />
      <stop offset="0.88" stopColor={props.block.glow} stopOpacity="0.35" />
      <stop offset="1" stopColor={props.block.glow} stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${prefix}-bloom`}>
      <stop offset="0" stopColor={props.pulse.coreColor} stopOpacity="0.32" />
      <stop offset="0.4" stopColor={props.pulse.coreColor} stopOpacity="0.14" />
      <stop offset="1" stopColor={props.pulse.coreColor} stopOpacity="0" />
    </radialGradient>
    <filter id={`${prefix}-ring-blur`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={props.pulse.ringWidth * 0.22} />
    </filter>
  </>
);

export const Pulse = ({
  props,
  beat,
  prefix,
}: {
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => {
  const { pulse, block } = props;
  const ringVisible = beat.ring > 0 && beat.ring < 1 && pulse.ringStrength > 0;
  const fade = 1 - beat.ring ** 2;
  const rings = Array.from({ length: Math.round(pulse.ringCount) }, (_, index) => index);
  return (
    <g>
      {ringVisible ? (
        <g filter={`url(#${prefix}-ring-blur)`} opacity={pulse.ringStrength * fade}>
          {rings.map((index) => (
            <circle
              key={index}
              cx={block.centerX}
              cy={block.centerY}
              r={
                pulse.ringRadius +
                index * pulse.ringGap +
                pulse.ringGrowth * (1 - (1 - beat.ring) ** 2)
              }
              fill="none"
              stroke={pulse.ringColor}
              strokeWidth={pulse.ringWidth}
              opacity={1 - index * 0.28}
            />
          ))}
        </g>
      ) : null}
      {beat.core > 0 ? (
        <circle
          cx={block.centerX}
          cy={block.centerY}
          r={pulse.coreRadius * 2.6}
          fill={`url(#${prefix}-bloom)`}
          opacity={beat.core}
        />
      ) : null}
      {beat.core > 0 ? (
        <circle
          cx={block.centerX}
          cy={block.centerY}
          r={pulse.coreRadius * (1 + 0.2 * beat.coreGrowth)}
          fill={`url(#${prefix}-core)`}
          opacity={beat.core}
        />
      ) : null}
    </g>
  );
};
