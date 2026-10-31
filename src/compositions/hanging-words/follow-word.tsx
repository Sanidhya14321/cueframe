import { AbsoluteFill } from 'remotion';
import type { HangingWordsProps } from '@/schemas';
import { fontFamily } from './fonts';
import { progress } from './physics';
import { Streak } from './streak';
import { TextLine } from './text-line';
import { letterCenter } from './text-metrics';
import { CAP_CENTER } from './word-flash';

const easeOut = (value: number): number => 1 - (1 - value) ** 3;

export const FollowWord = ({ props, frame }: { props: HangingWordsProps; frame: number }) => {
  const { stack, outro, flash, look } = props;
  if (frame < outro.expandStart) {
    return null;
  }
  const font = fontFamily(flash.font);
  const raw = progress(frame, outro.expandStart, outro.expandFrames);
  const amount = easeOut(raw);
  const previous = easeOut(progress(frame - 1, outro.expandStart, outro.expandFrames));
  const from = letterCenter(stack.word, stack.highlightIndex, font, flash.weight, stack.size);
  const pivot = letterCenter(outro.word, outro.pivotIndex, font, flash.weight, outro.size);
  const scale = stack.size / outro.size + (1 - stack.size / outro.size) * amount;
  const shift = (1 - amount) * (from - pivot);
  const startY = flash.baseline - stack.size * CAP_CENTER;
  const endY = flash.baseline - outro.size * CAP_CENTER;
  const centerY = startY + (endY - startY) * amount;
  const letters = Array.from(outro.word);
  return (
    <AbsoluteFill>
      <Streak x={(amount - previous) * 22} style={{ position: 'absolute', inset: 0 }}>
        <TextLine
          centerY={centerY}
          size={outro.size}
          font={font}
          weight={flash.weight}
          color={look.ink}
          style={{
            transform: `translateX(${shift.toFixed(2)}px) scale(${scale.toFixed(4)})`,
            transformOrigin: `calc(50% + ${pivot.toFixed(2)}px) 50%`,
          }}
        >
          {letters.map((letter, index) => {
            const isPivot = index === outro.pivotIndex;
            const own = letterCenter(outro.word, index, font, flash.weight, outro.size);
            const pull = (1 - amount) * (pivot - own);
            return (
              <span
                key={`${index}:${letter}`}
                style={{
                  display: 'inline-block',
                  transform: isPivot ? undefined : `translateX(${pull.toFixed(2)}px)`,
                  opacity: isPivot ? 1 : Math.min(1, raw * 2.5),
                }}
              >
                {letter}
              </span>
            );
          })}
        </TextLine>
      </Streak>
    </AbsoluteFill>
  );
};
