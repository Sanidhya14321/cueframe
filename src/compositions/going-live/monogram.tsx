import { AbsoluteFill } from 'remotion';
import { progress } from './beat';

const ARCH_RADIUS = 118;
const GLYPH_HEIGHT = 360;

const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const easeInOut = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export const Monogram = ({
  frame,
  start,
  square,
  drawn,
  stroke,
  scale,
  centerY,
  color,
}: {
  frame: number;
  start: number;
  square: number;
  drawn: number;
  stroke: number;
  scale: number;
  centerY: number;
  color: string;
}) => {
  if (frame < start) {
    return null;
  }
  const half = stroke / 2;
  const archY = half + ARCH_RADIUS;
  const width = stroke + ARCH_RADIUS * 2;
  const right = half + ARCH_RADIUS * 2;
  const stemLength = GLYPH_HEIGHT - archY;
  const total = stemLength * 2 + Math.PI * ARCH_RADIUS;
  const path = `M ${half} ${GLYPH_HEIGHT} L ${half} ${archY} A ${ARCH_RADIUS} ${ARCH_RADIUS} 0 0 1 ${right} ${archY} L ${right} ${GLYPH_HEIGHT}`;
  const settleShiftX = width / 2 - half;
  const settleShiftY = GLYPH_HEIGHT / 2 - (GLYPH_HEIGHT - half);
  const draw = 1 - (1 - progress(frame, square, drawn)) ** 2;
  const settle = easeInOut(progress(frame, square, drawn));
  const shiftX = settleShiftX * (1 - settle);
  const shiftY = settleShiftY * (1 - settle);
  const grow = progress(frame, start, start + (square - start) * 0.45);
  const thicken = easeOut(progress(frame, start + (square - start) * 0.3, square));
  const lineWidth = stroke * easeOut(grow);
  const lineHeight = 2 + (stroke - 2) * thicken;
  const preDraw = frame < square;
  const length = stroke + (total - stroke) * draw;
  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <g
          transform={`translate(${540 + shiftX * scale} ${centerY + shiftY * scale}) scale(${scale}) translate(${-width / 2} ${-GLYPH_HEIGHT / 2})`}
        >
          {preDraw ? (
            <rect
              x={half - lineWidth / 2}
              y={GLYPH_HEIGHT - half - lineHeight / 2}
              width={lineWidth}
              height={lineHeight}
              fill={color}
              opacity={0.35 + 0.65 * grow}
            />
          ) : (
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${length.toFixed(2)} ${(total + 10).toFixed(2)}`}
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
