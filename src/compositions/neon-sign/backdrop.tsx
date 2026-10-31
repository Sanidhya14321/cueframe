import { AbsoluteFill } from 'remotion';
import type { NeonSignFlickerProps } from '@/schemas';

const EASED_STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

export const NeonBackdrop = ({ look }: { look: NeonSignFlickerProps['look'] }) => {
  const stops = EASED_STOPS.map((stop, index) => {
    const mix = look.ambientStrength * (1 - stop);
    const at = (index / (EASED_STOPS.length - 1)) * 100;
    return `color-mix(in oklab, ${look.ambient} ${(mix * 100).toFixed(1)}%, ${look.background}) ${at.toFixed(1)}%`;
  }).join(', ');
  return (
    <AbsoluteFill
      style={{
        backgroundColor: look.background,
        backgroundImage: `radial-gradient(${look.ambientWidth / 2}px ${look.ambientHeight / 2}px at ${look.ambientX}px ${look.ambientY}px, ${stops})`,
      }}
    />
  );
};
