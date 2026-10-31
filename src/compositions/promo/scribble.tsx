import type { ScribbleShape } from '@/schemas';

export const SCRIBBLE_PATHS: Record<ScribbleShape, string> = {
  swash: 'M20 140 C 160 40, 260 180, 400 100 S 640 20, 760 110 S 900 170, 980 60',
  loop: 'M30 120 C 180 120, 260 40, 340 80 C 420 120, 360 190, 300 150 C 240 110, 380 40, 520 90 C 660 140, 760 70, 970 100',
  underline: 'M40 150 C 300 128, 620 162, 960 134',
  circle:
    'M520 32 C 770 30, 962 70, 962 112 C 962 160, 720 190, 480 186 C 220 182, 40 150, 40 106 C 40 62, 262 26, 560 42',
};

export const Scribble = ({
  shape,
  head,
  tail,
  width,
  strokeWidth,
  color,
}: {
  shape: ScribbleShape;
  head: number;
  tail: number;
  width: number;
  strokeWidth: number;
  color: string;
}) => {
  const visible = Math.max(0, head - tail);
  return (
    <svg
      width={width}
      height={width * 0.2}
      viewBox="0 0 1000 200"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <path
        d={SCRIBBLE_PATHS[shape]}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={(strokeWidth * 1000) / width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${visible} 2`}
        strokeDashoffset={-tail}
        opacity={visible > 0.001 ? 1 : 0}
      />
    </svg>
  );
};
