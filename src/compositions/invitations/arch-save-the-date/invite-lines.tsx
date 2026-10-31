import type { CSSProperties } from 'react';
import type { ArchSaveTheDateProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';
import { FRAME_WIDTH } from './camera';

type Copy = ArchSaveTheDateProps['copy'];
type Type = ArchSaveTheDateProps['type'];
type Timing = ArchSaveTheDateProps['timing'];

interface Line {
  key: 'intro' | 'names' | 'date' | 'venue' | 'closing' | 'family';
  gap: number;
  style: CSSProperties;
}

const linesFor = (type: Type): Line[] => {
  const serif = inviteSerifFonts[type.serifFont];
  const serifLine = (size: number, color: string, tracking: number): CSSProperties => ({
    fontFamily: serif,
    fontSize: size,
    lineHeight: 1.25,
    letterSpacing: `${tracking}em`,
    color,
  });
  return [
    { key: 'intro', gap: 0, style: serifLine(type.introSize, type.detailColor, 0.06) },
    { key: 'names', gap: type.gap * 0.7, style: serifLine(type.namesSize, type.inkColor, 0.03) },
    { key: 'date', gap: type.gap * 0.5, style: serifLine(type.dateSize, type.inkColor, 0.02) },
    { key: 'venue', gap: type.gap * 0.4, style: serifLine(type.venueSize, type.detailColor, 0.07) },
    {
      key: 'closing',
      gap: type.gap * 2.4,
      style: serifLine(type.closingSize, type.inkColor, 0.14),
    },
    {
      key: 'family',
      gap: type.gap * 0.2,
      style: {
        fontFamily: inviteScriptFonts[type.scriptFont],
        fontSize: type.familySize,
        lineHeight: 1.2,
        color: type.titleColor,
      },
    },
  ];
};

export const InviteLines = ({
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
  const visible = linesFor(type).filter((line) => copy[line.key].trim().length > 0);
  return (
    <div
      style={{
        position: 'absolute',
        top: type.linesY,
        left: Math.round((FRAME_WIDTH - type.width) / 2),
        width: type.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {visible.map((line, index) => {
        const start = timing.linesAt + index * timing.lineStagger;
        return (
          <div
            key={line.key}
            style={{
              ...line.style,
              marginTop: index === 0 ? 0 : Math.round(line.gap),
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
            }}
          >
            {Array.from(copy[line.key]).map((char, position) => {
              const at = start + position * timing.charFrames;
              return (
                <span
                  key={`${position}:${char}`}
                  style={{ opacity: tween(time, [at, at + timing.charFade], [0, 1], smooth) }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
