import { useId } from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { ThreadLook, ThreadTitle } from '@/schemas';
import { nearness, type ThreadSchedule } from './schedule';

const GAP = 300;

const DOTS_PER_STOP = 11;

const BLOB_STOPS: [number, number][] = [
  [0, 1],
  [0.25, 0.9],
  [0.45, 0.68],
  [0.62, 0.42],
  [0.76, 0.2],
  [0.88, 0.07],
  [1, 0],
];

const DOT_STOPS: [number, number][] = [
  [0, 1],
  [0.5, 0.92],
  [0.68, 0.6],
  [0.82, 0.24],
  [0.93, 0.06],
  [1, 0],
];

const SoftDisc = ({
  id,
  color,
  stops,
}: {
  id: string;
  color: string;
  stops: [number, number][];
}) => (
  <radialGradient id={id}>
    {stops.map(([offset, opacity]) => (
      <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
    ))}
  </radialGradient>
);

export const Bokeh = ({
  look,
  titles,
  schedule,
  camera,
  parallax,
  width,
  height,
  frame,
  blur,
}: {
  look: ThreadLook;
  titles: ThreadTitle[];
  schedule: ThreadSchedule;
  camera: number;
  parallax: number;
  width: number;
  height: number;
  frame: number;
  blur: number;
}) => {
  const id = useId().replace(/:/g, '');
  if (look.bokeh <= 0) {
    return null;
  }
  const view = camera * parallax;
  const length = schedule.endTop * parallax + height + GAP * 2;
  const count = Math.ceil(length / GAP);
  const blobs = Array.from({ length: count }, (_, index) => {
    const seed = (key: string) => random(`thread-bokeh-${index}-${key}`);
    const size = 300 + seed('size') * 320;
    const y = index * GAP - GAP + seed('y') * GAP * 0.8 - view;
    const x = -120 + seed('x') * (width + 240);
    const pace = 60 + seed('drift') * 40;
    return {
      key: index,
      x: x + Math.sin(frame / pace + index) * 60,
      y: y + Math.cos(frame / (pace * 1.3) + index * 2) * 70,
      size,
      tone: seed('tone') > 0.5 ? 'violet' : 'blue',
      alpha: Math.min(1, (0.22 + seed('alpha') * 0.26) * look.bokeh),
    };
  }).filter((blob) => blob.y > -blob.size * 1.5 && blob.y < height + blob.size * 0.5);
  const dots = titles.flatMap((item, stop) => {
    if (!item.goldDots) {
      return [];
    }
    const stopCamera = (stop + 1) * schedule.spacing;
    const presence = nearness(camera, stopCamera, schedule.spacing);
    if (presence <= 0) {
      return [];
    }
    return Array.from({ length: DOTS_PER_STOP }, (_, index) => {
      const seed = (key: string) => random(`thread-dot-${stop}-${index}-${key}`);
      const size = 26 + seed('size') * 46;
      const rise = frame * (0.2 + seed('rise') * 0.3);
      return {
        key: `${stop}-${index}`,
        x: seed('x') * width,
        y: seed('y') * height - (camera - stopCamera) * parallax * 1.6 - rise,
        size,
        alpha:
          presence * (0.3 + 0.35 * seed('alpha')) * (0.75 + 0.25 * Math.sin(frame / 14 + index)),
      };
    });
  });
  const fill = (key: string) => `url(#${id}-${key})`;
  return (
    <AbsoluteFill style={{ filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <defs>
          <SoftDisc id={`${id}-violet`} color={look.bokehViolet} stops={BLOB_STOPS} />
          <SoftDisc id={`${id}-blue`} color={look.bokehBlue} stops={BLOB_STOPS} />
          <SoftDisc id={`${id}-gold`} color={look.bokehGold} stops={DOT_STOPS} />
        </defs>
        {blobs.map((blob) => (
          <circle
            key={blob.key}
            cx={blob.x}
            cy={blob.y}
            r={blob.size * 0.68}
            fill={fill(blob.tone)}
            opacity={blob.alpha}
          />
        ))}
        {dots.map((dot) => (
          <circle
            key={dot.key}
            cx={dot.x}
            cy={dot.y}
            r={dot.size * 0.6}
            fill={fill('gold')}
            opacity={Math.min(1, dot.alpha * look.bokeh)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
