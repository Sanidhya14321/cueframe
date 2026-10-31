import type { DominoWordsProps } from '@/schemas';
import { tint } from './neon';

export const RollingOrb = ({
  orb,
  x,
  spin,
  floorY,
  floorThickness,
  zoom,
  pool,
}: {
  orb: DominoWordsProps['orb'];
  x: number;
  spin: number;
  floorY: number;
  floorThickness: number;
  zoom: number;
  pool: boolean;
}) => {
  const radius = orb.radius;
  const glow = orb.glow;
  const band = radius * 0.34;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - radius,
        top: floorY - floorThickness / 2 - radius * 2,
        width: radius * 2,
        height: radius * 2,
        transformOrigin: `${radius}px ${radius * 2 + floorThickness / 2}px`,
        transform: `scale(${zoom.toFixed(5)})`,
      }}
    >
      {pool ? (
        <div
          style={{
            position: 'absolute',
            left: -radius * 1.4,
            width: radius * 4.8,
            top: radius * 1.3,
            height: radius * 1.4 + floorThickness,
            background: `radial-gradient(closest-side, ${tint(orb.color, 0.34 * glow)} 0%, ${tint(orb.color, 0.12 * glow)} 50%, transparent 100%)`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: -radius,
          top: -radius,
          width: radius * 4,
          height: radius * 4,
          background: `radial-gradient(closest-side, ${tint(orb.color, 0.2 * glow)} 40%, ${tint(orb.color, 0.06 * glow)} 70%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          background: `radial-gradient(circle at 50% 50%, ${orb.color} 0%, color-mix(in srgb, ${orb.color} 70%, ${orb.shade}) 62%, ${orb.shade} 100%)`,
          boxShadow: `0 0 ${(10 * glow).toFixed(1)}px ${tint(orb.color, 0.8)}, 0 0 ${(30 * glow).toFixed(1)}px ${tint(orb.color, 0.45)}`,
        }}
      >
        {orb.stripes ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `rotate(${((spin * 180) / Math.PI).toFixed(3)}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -2,
                right: -2,
                top: radius - band / 2,
                height: band,
                background: tint(orb.stripeColor, 0.92),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: radius * 0.32,
                top: radius * 0.32,
                width: radius * 0.26,
                height: radius * 0.26,
                borderRadius: '50%',
                background: tint(orb.stripeColor, 0.92),
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.12) 22%, rgba(255, 255, 255, 0) 42%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 0.42) 100%)',
          }}
        />
      </div>
    </div>
  );
};
