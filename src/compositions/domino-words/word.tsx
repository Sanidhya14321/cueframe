import type { Domino } from './chain';
import { dominoFont } from './font';
import { CAP_TOP } from './glyphs';

export const DominoText = ({
  domino,
  angle,
  x,
  baseY,
  zoom,
  color,
  fill,
  outline,
  weight,
  condense,
  glowColor,
  glow,
}: {
  domino: Domino;
  angle: number;
  x: number;
  baseY: number;
  zoom: number;
  color: string;
  fill: number;
  outline: number;
  weight: number;
  condense: number;
  glowColor: string;
  glow: number;
}) => {
  const { thickness, length, size } = domino;
  const shadow =
    glow > 0
      ? [0.03, 0.1, 0.26]
          .map((spread) => `0 0 ${(spread * size * glow).toFixed(2)}px ${glowColor}`)
          .join(', ')
      : 'none';
  return (
    <div style={{ position: 'absolute', left: x, top: baseY, width: 0, height: 0 }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: thickness,
          height: length,
          transformOrigin: '100% 100%',
          transform: `scale(${zoom.toFixed(5)}) rotate(${((angle * 180) / Math.PI).toFixed(4)}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: length,
            height: thickness,
            transformOrigin: '0 0',
            transform: `translate(0px, ${length.toFixed(3)}px) rotate(-90deg)`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: -CAP_TOP * size,
              fontFamily: dominoFont,
              fontWeight: weight,
              fontSize: size,
              lineHeight: `${size}px`,
              whiteSpace: 'pre',
              color:
                fill >= 1
                  ? color
                  : `color-mix(in srgb, ${color} ${(fill * 100).toFixed(1)}%, transparent)`,
              WebkitTextStroke: outline > 0 ? `${outline}px ${color}` : undefined,
              textShadow: shadow,
              transformOrigin: '0 50%',
              transform: `scaleX(${condense})`,
            }}
          >
            {domino.text}
          </span>
        </div>
      </div>
    </div>
  );
};
