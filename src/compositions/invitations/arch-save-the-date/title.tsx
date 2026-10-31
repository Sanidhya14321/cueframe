import type { CSSProperties } from 'react';
import type { ArchSaveTheDateProps } from '@/schemas';
import { settle, smooth, tween } from '../../promo/timing';
import { inviteScriptFonts } from '../fonts';
import { FRAME_WIDTH } from './camera';

type Copy = ArchSaveTheDateProps['copy'];
type Type = ArchSaveTheDateProps['type'];
type Timing = ArchSaveTheDateProps['timing'];

const FLOURISH_WIDTH = 900;

const SWIRLS = [
  'M -128 -96 C -190 -128 -278 -112 -300 -50 C -318 0 -268 34 -236 14 C -212 -2 -226 -32 -250 -26',
  'M -112 120 C -188 160 -320 142 -356 76 C -380 30 -352 -6 -322 4 C -300 12 -306 40 -326 38',
  'M -96 -150 C -70 -190 -20 -196 4 -170 C 22 -150 6 -126 -12 -134',
  'M -232 80 C -250 60 -276 64 -284 84',
];

const DOTS: [number, number][] = [
  [-250, -26],
  [-326, 38],
  [-12, -134],
  [-372, -60],
];

const drawn = (progress: number): CSSProperties => {
  const share = Math.min(1, progress / 0.97);
  return share >= 1 ? {} : { strokeDasharray: `${share.toFixed(4)} 2` };
};

const Flourish = ({ type, progress }: { type: Type; progress: number }) => {
  const scale = (type.titleSize / 168) * 0.84;
  const height = Math.round(type.titleSize * 2.6);
  return (
    <svg
      aria-hidden="true"
      width={FLOURISH_WIDTH}
      height={height}
      viewBox={`${-FLOURISH_WIDTH / 2} ${-height / 2} ${FLOURISH_WIDTH} ${height}`}
      style={{
        position: 'absolute',
        left: Math.round((FRAME_WIDTH - FLOURISH_WIDTH) / 2),
        top: Math.round(type.titleY - height / 2),
        opacity: progress <= 0 ? 0 : Math.min(1, progress * 4),
      }}
    >
      {[0, 180].map((angle) => (
        <g key={angle} transform={`rotate(${angle}) scale(${scale.toFixed(4)})`}>
          {SWIRLS.map((d) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              fill="none"
              stroke={type.flourishColor}
              strokeWidth={2.2}
              strokeLinecap="butt"
              style={drawn(progress)}
            />
          ))}
          {DOTS.map(([x, y]) => (
            <circle
              key={`${x}:${y}`}
              cx={x}
              cy={y}
              r={4.5}
              fill={type.flourishColor}
              opacity={tween(progress, [0.75, 1], [0, 1], smooth)}
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

export const TitleLockup = ({
  copy,
  type,
  timing,
  time,
}: {
  copy: Copy;
  type: Type;
  timing: Timing;
  time: number;
}) => {
  const end = timing.titleAt + timing.titleFrames;
  const focus = tween(time, [timing.titleAt, end], [0, 1], settle);
  const opacity = tween(
    time,
    [timing.titleAt, timing.titleAt + timing.titleFrames * 0.6],
    [0, 1],
    smooth,
  );
  const draw = tween(time, [timing.titleAt + timing.titleFrames * 0.25, end + 20], [0, 1], smooth);
  const blur = Math.round(type.titleSize * 0.08);
  const family = inviteScriptFonts[type.scriptFont];
  const words = [
    { text: copy.titleFirst, size: type.titleSize, dy: -0.54, dx: -0.08 },
    { text: copy.titleJoin, size: type.joinSize, dy: -0.1, dx: 0.13 },
    { text: copy.titleLast, size: type.titleSize, dy: 0.5, dx: 0.07 },
  ];
  return (
    <>
      {type.flourish ? <Flourish type={type} progress={draw} /> : null}
      {[
        { key: 'soft', alpha: opacity * (1 - focus), filter: `blur(${blur}px)` },
        { key: 'sharp', alpha: opacity * focus, filter: undefined },
      ].map((layer) => (
        <div
          key={layer.key}
          style={{ position: 'absolute', inset: 0, opacity: layer.alpha, filter: layer.filter }}
        >
          {words.map((word) =>
            word.text.trim().length === 0 ? null : (
              <div
                key={word.dy}
                style={{
                  position: 'absolute',
                  left: Math.round(word.dx * type.titleSize),
                  width: FRAME_WIDTH,
                  top: Math.round(type.titleY + word.dy * type.titleSize - word.size * 0.65),
                  height: Math.round(word.size * 1.3),
                  lineHeight: `${Math.round(word.size * 1.3)}px`,
                  textAlign: 'center',
                  fontFamily: family,
                  fontSize: word.size,
                  color: type.titleColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {word.text}
              </div>
            ),
          )}
        </div>
      ))}
    </>
  );
};
