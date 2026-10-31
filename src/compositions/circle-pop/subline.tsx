import { AbsoluteFill } from 'remotion';
import type { CirclePopProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { pixelTween, settle, smooth, tween } from '../promo/timing';

export const Subline = ({
  frame,
  start,
  end,
  subline,
  size,
  color,
  anchorY,
  offsetX,
  offsetY,
  rotation,
}: {
  frame: number;
  start: number;
  end: number;
  subline: CirclePopProps['subline'];
  size: number;
  color: string;
  anchorY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}) => {
  if (subline.text === '' || frame <= start) {
    return null;
  }
  const opacity = tween(frame, [start, end], [0, 1], smooth);
  const lift = pixelTween(frame, [start, end], [subline.rise, 0], settle);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation.toFixed(3)}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.round(anchorY + subline.gap + lift),
          textAlign: 'center',
          whiteSpace: 'pre',
          fontFamily: bodyFont,
          fontSize: size,
          fontWeight: subline.weight,
          letterSpacing: `${subline.tracking}em`,
          lineHeight: 1.2,
          color,
          opacity,
        }}
      >
        {subline.text}
      </div>
    </AbsoluteFill>
  );
};
