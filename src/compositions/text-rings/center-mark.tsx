import { Easing } from 'remotion';
import type { TextRingsProps } from '@/schemas';
import { kineticFont } from '../promo/fonts';
import { pixelTween, settle, smooth, TAU, tween } from '../promo/timing';

const OVERSHOOT = 0.55;
const SAMPLES_PER_LOOP = 56;
const WORD_FRAMES = 26;
const drawEase = Easing.bezier(0.45, 0, 0.3, 1);

const scribblePath = (loops: number, radius: number): string => {
  const turns = loops + 1;
  const samples = Math.round(SAMPLES_PER_LOOP * turns);
  const sweep = TAU + OVERSHOOT;
  const points = Array.from({ length: samples + 1 }, (_, step) => {
    const t = (step / samples) * sweep;
    const ring = 0.58 * (1 + 0.06 * Math.sin(1.3 * t + 0.4));
    const loop = 0.42 * (1 + 0.12 * Math.sin(2.1 * t + 1.1));
    const x = ring * Math.cos(t) + loop * Math.cos(turns * t + 0.9);
    const y = ring * Math.sin(t) + loop * Math.sin(turns * t + 0.9);
    return [x, y] as const;
  });
  const extent = Math.max(...points.map(([x, y]) => Math.hypot(x, y)));
  return points
    .map(
      ([x, y], step) =>
        `${step === 0 ? 'M' : 'L'} ${((x / extent) * radius).toFixed(2)} ${((y / extent) * radius).toFixed(2)}`,
    )
    .join(' ');
};

const strokeRamp = (draw: number) => Math.max(0.15, Math.min(1, draw * 4));

export const CenterMark = ({
  mark,
  frame,
  shrinkAt,
  color,
}: {
  mark: TextRingsProps['mark'];
  frame: number;
  shrinkAt: number;
  color: string;
}) => {
  const radius = mark.size / 2;
  const circumference = TAU * radius;
  const ring = tween(frame, [mark.drawAt, mark.drawAt + mark.drawFrames], [0, 1], drawEase);
  const ringLength = Math.min(1, ring * 1.03);
  const scribbleStart = mark.drawAt + mark.scribbleDelay;
  const scribble = tween(
    frame,
    [scribbleStart, scribbleStart + mark.drawFrames * 1.2],
    [0, 1],
    drawEase,
  );
  const scale = tween(frame, [shrinkAt, shrinkAt + mark.shrinkFrames], [1, mark.shrinkTo], smooth);
  if (mark.style === 'none') {
    return null;
  }
  const word = mark.word.trim();
  const wordRange: [number, number] = [scribbleStart, scribbleStart + WORD_FRAMES];
  return (
    <g>
      <g transform={`scale(${scale.toFixed(5)})`}>
        {ring > 0 ? (
          <circle
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={mark.stroke * strokeRamp(ring)}
            strokeLinecap="butt"
            strokeDasharray={
              ringLength >= 1 ? undefined : `${circumference * ringLength} ${circumference * 2}`
            }
            opacity={Math.min(1, ring * 4)}
            transform="rotate(-90)"
          />
        ) : null}
        {mark.style === 'scribble' && scribble > 0 ? (
          <path
            d={scribblePath(mark.loops, radius * mark.scribbleSize)}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={mark.scribbleStroke * strokeRamp(scribble)}
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeDasharray={`${scribble} 2`}
            opacity={Math.min(1, scribble * 4)}
          />
        ) : null}
      </g>
      {mark.style === 'word' && word.length > 0 && frame > scribbleStart ? (
        <text
          y={pixelTween(frame, wordRange, [mark.wordSize * 0.45, 0], settle)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontFamily={kineticFont}
          fontWeight={mark.wordWeight}
          fontSize={mark.wordSize}
          opacity={tween(frame, wordRange, [0, 1], smooth)}
        >
          {word}
        </text>
      ) : null}
    </g>
  );
};
