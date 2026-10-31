import { AbsoluteFill } from 'remotion';
import type { HangingWordsProps } from '@/schemas';
import { fontFamily } from './fonts';
import { TextLine } from './text-line';

export const CAP_CENTER = 0.36;

const opacityAt = (frame: number, end: number, ghost: number, ghostFrames: number): number => {
  if (frame < end - 1) {
    return 1;
  }
  if (frame < end) {
    return ghost;
  }
  if (ghostFrames <= 0) {
    return 0;
  }
  return Math.max(0, ghost * 0.5 * (1 - (frame - end) / ghostFrames));
};

export const WordFlash = ({ props, frame }: { props: HangingWordsProps; frame: number }) => {
  const { words, flash, palette, look } = props;
  const current = words.reduce((found, word, index) => (frame >= word.start ? index : found), -1);
  return (
    <AbsoluteFill>
      {look.showBackdrop ? (
        <AbsoluteFill key={`night-${current}`} style={{ background: palette.night }} />
      ) : null}
      {words.map((word, index) => {
        const end = words[index + 1]?.start ?? flash.end;
        const isLast = index === words.length - 1;
        if (frame < word.start || frame >= end + flash.ghostFrames) {
          return null;
        }
        const opacity = opacityAt(frame, end, flash.ghost, isLast ? 0 : flash.ghostFrames);
        if (opacity <= 0) {
          return null;
        }
        return (
          <TextLine
            key={`${index}:${word.text}`}
            centerY={flash.baseline - word.size * CAP_CENTER}
            size={word.size}
            font={fontFamily(flash.font)}
            weight={flash.weight}
            color={palette.light}
            style={{ opacity }}
          >
            {word.text}
          </TextLine>
        );
      })}
    </AbsoluteFill>
  );
};
