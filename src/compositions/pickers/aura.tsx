import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { PickerAura } from '@/schemas';
import { easedGradient } from '../promo/backdrop';

const transparent = (color: string): string => `color-mix(in oklab, ${color} 0%, transparent)`;

export const Aura = ({ aura }: { aura: PickerAura }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {aura.blobs.map((blob, index) => {
        const phase = index * 1.7;
        const x = blob.x + Math.sin(frame / 70 + phase) * 6 * aura.drift;
        const y = blob.y + Math.cos(frame / 90 + phase) * 5 * aura.drift;
        const solid = `color-mix(in oklab, ${blob.color} ${(blob.strength * 100).toFixed(1)}%, transparent)`;
        return (
          <AbsoluteFill
            key={index}
            style={{
              background: `radial-gradient(${blob.size}% ${(blob.size * 1.15).toFixed(1)}% at ${x.toFixed(3)}% ${y.toFixed(3)}%, ${easedGradient(solid, transparent(blob.color))})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
