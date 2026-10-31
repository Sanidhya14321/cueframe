import { AbsoluteFill } from 'remotion';
import type { AnniversaryLook } from '@/schemas';

const SCALE = 2;

const channel = (hex: string, index: number): number =>
  Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;

const table = (look: AnniversaryLook, light: number, index: number): string => {
  const low = channel(look.textureShade, index);
  const high = low + (channel(look.texture, index) - low) * light;
  return [0, 0.45, 1].map((t) => (low + (high - low) * t ** 1.6).toFixed(3)).join(' ');
};

export const ProceduralTexture = ({
  id,
  look,
  width,
  height,
  variant,
  light,
  frame,
  seed,
}: {
  id: string;
  look: AnniversaryLook;
  width: number;
  height: number;
  variant: number;
  light: number;
  frame: number;
  seed: number;
}) => {
  const w = Math.ceil(width / SCALE);
  const h = Math.ceil(height / SCALE);
  const side = Math.ceil(Math.hypot(w, h) * 1.15);
  const streaks = variant % 2 === 0;
  const frequency = streaks ? '0.006 0.028' : '0.05 0.04';
  const shift = (frame * look.textureDrift) / SCALE;
  const contrast = look.textureContrast;
  const offset = (0.5 - contrast * 0.5).toFixed(3);
  const row = `${contrast} 0 0 0 ${offset}`;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: look.textureShade }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: `scale(${SCALE})`,
        }}
      >
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves={streaks ? 4 : 5}
            seed={seed}
          />
          <feColorMatrix type="matrix" values={`${row} ${row} ${row} 0 0 0 0 1`} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={table(look, light, 0)} />
            <feFuncG type="table" tableValues={table(look, light, 1)} />
            <feFuncB type="table" tableValues={table(look, light, 2)} />
          </feComponentTransfer>
        </filter>
        <g
          transform={`translate(${w / 2 - shift * 0.6} ${h / 2 - shift}) rotate(${streaks ? -32 : 18})`}
        >
          <rect x={-side / 2} y={-side / 2} width={side} height={side} filter={`url(#${id})`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
