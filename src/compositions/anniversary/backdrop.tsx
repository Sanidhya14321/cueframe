import { AbsoluteFill } from 'remotion';
import type { AnniversaryBackdrop, AnniversaryBand, AnniversaryLook } from '@/schemas';
import { ProceduralTexture } from './texture';

const FLAT: Record<Exclude<AnniversaryBackdrop, 'texture' | 'band'>, keyof AnniversaryLook> = {
  ink: 'ink',
  paper: 'paper',
  night: 'night',
  dusk: 'dusk',
};

const SLICES = [
  { top: 0, bottom: 0.22, shift: -0.06 },
  { top: 0.22, bottom: 0.78, shift: 0 },
  { top: 0.78, bottom: 1, shift: 0.05 },
];

const FLASH = [1, 0.7, 0.45];

const BAND_OVERHANG = 0.15;

const FLASH_FLOOR = 0.06;

const FLASH_FADE = 6;

const flashLight = (local: number): number => {
  const step = FLASH[Math.floor(local)];
  if (step !== undefined) {
    return step;
  }
  const rest = Math.max(0, 1 - (local - FLASH.length) / FLASH_FADE);
  return FLASH_FLOOR + (0.45 - FLASH_FLOOR) * rest * rest;
};

export const BeatBackdrop = ({
  kind,
  look,
  band: bandStyle,
  local,
  index,
  width,
  height,
}: {
  kind: AnniversaryBackdrop;
  look: AnniversaryLook;
  band: AnniversaryBand;
  local: number;
  index: number;
  width: number;
  height: number;
}) => {
  if (kind !== 'texture' && kind !== 'band') {
    return <AbsoluteFill style={{ backgroundColor: String(look[FLAT[kind]]) }} />;
  }
  const light = flashLight(local);
  const sliced = local < 3;
  const texture = (shift: number, span = width) => (
    <ProceduralTexture
      id={`anniversary-texture-${index}-${Math.round(shift * 100)}`}
      look={look}
      width={span}
      height={height}
      variant={index}
      light={light}
      frame={local + shift * 40}
      seed={look.glitchSeed + index * 13}
    />
  );
  if (kind === 'band') {
    const band = look.bandHeight * height;
    const span = width * (1 + BAND_OVERHANG * 2);
    return (
      <AbsoluteFill style={{ backgroundColor: look.ink }}>
        <div
          style={{
            position: 'absolute',
            left: -width * BAND_OVERHANG,
            top: (height - band) / 2,
            width: span,
            height: band,
            overflow: 'hidden',
            transform: `rotate(${bandStyle.tilt}deg)`,
            borderTop: `${bandStyle.edge}px solid ${look.gradientFrom}`,
            borderBottom: `${bandStyle.edge}px solid ${look.gradientTo}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: -(height - band) / 2,
              width: span,
              height,
            }}
          >
            {texture(0, span)}
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (!sliced) {
    return texture(0);
  }
  return (
    <AbsoluteFill style={{ backgroundColor: look.ink }}>
      {SLICES.map((slice) => (
        <div
          key={slice.top}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: slice.top * height,
            height: (slice.bottom - slice.top) * height,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: slice.shift * width,
              top: -slice.top * height,
              width,
              height,
            }}
          >
            {texture(slice.shift)}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
