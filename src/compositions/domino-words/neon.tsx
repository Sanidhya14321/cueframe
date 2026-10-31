import type { DominoWordsProps } from '@/schemas';

export const tint = (color: string, amount: number): string =>
  `color-mix(in srgb, ${color} ${(Math.min(1, Math.max(0, amount)) * 100).toFixed(1)}%, transparent)`;

export const NeonFloor = ({
  floor,
  width,
  tintColor,
  tintFrom,
  tintTo,
  tintAmount,
}: {
  floor: DominoWordsProps['floor'];
  width: number;
  tintColor: string;
  tintFrom: number;
  tintTo: number;
  tintAmount: number;
}) => {
  const spread = floor.glowSpread;
  const glow = floor.glow;
  const span = Math.max(1, tintTo - tintFrom);
  const feather = Math.min(160, span * 0.35);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floor.y - spread * 1.2,
          height: spread * 2.4,
          background: `linear-gradient(to bottom, transparent 0%, ${tint(floor.color, 0.1 * glow)} 30%, ${tint(floor.color, 0.3 * glow)} 47%, ${tint(floor.color, 0.42 * glow)} 50%, ${tint(floor.color, 0.3 * glow)} 53%, ${tint(floor.color, 0.1 * glow)} 70%, transparent 100%)`,
          maskImage: `linear-gradient(to right, transparent ${floor.inset * 0.2}px, black ${floor.inset + spread * 0.4}px, black ${width - floor.inset - spread * 0.4}px, transparent ${width - floor.inset * 0.2}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: floor.inset,
          right: floor.inset,
          top: floor.y - floor.thickness / 2,
          height: floor.thickness,
          borderRadius: floor.thickness,
          background: `linear-gradient(to right, transparent, ${floor.color} 20px, ${floor.color} calc(100% - 20px), transparent)`,
          boxShadow: `0 0 ${(6 * glow).toFixed(1)}px ${floor.color}, 0 0 ${(18 * glow).toFixed(1)}px ${tint(floor.color, 0.8)}`,
        }}
      />
      {tintAmount > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: tintFrom - feather,
            width: span + feather * 2,
            top: floor.y - spread * 0.9,
            height: spread * 1.8,
            opacity: tintAmount,
            background: `radial-gradient(closest-side, ${tint(tintColor, 0.55)} 0%, ${tint(tintColor, 0.28)} 35%, ${tint(tintColor, 0.08)} 70%, transparent 100%)`,
          }}
        />
      ) : null}
    </>
  );
};
