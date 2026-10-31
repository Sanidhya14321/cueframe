import { AbsoluteFill } from 'remotion';
import type { HangingWordsProps } from '@/schemas';
import { fontFamily } from './fonts';
import { Streak } from './streak';
import { TextLine } from './text-line';
import { CAP_CENTER } from './word-flash';

const SCROLL_DISTANCE = 1500;

const SCROLL_CLEAR = 2600;

const ECHOES = 3;

const echoOffsets = (speed: number) =>
  speed <= 0
    ? [{ offset: 0, opacity: 1 }]
    : Array.from({ length: ECHOES }, (_, index) => ({
        offset: speed * index * 0.16,
        opacity: index === 0 ? 1 : 0.7,
      }));

const sequenceSlots = (sideLines: number) =>
  Array.from({ length: sideLines * 2 }, (_, order) => ({
    order,
    offset: order % 2 === 0 ? order / 2 + 1 : -(order + 1) / 2,
  }));

const SplitWord = ({
  word,
  index,
  show,
  accent,
  ring,
}: {
  word: string;
  index: number;
  show: 'all' | 'rest' | 'letter';
  accent: string;
  ring: { width: number; color: string } | undefined;
}) => (
  <>
    {Array.from(word).map((letter, at) => {
      const isAccent = at === index;
      const visible = show === 'all' || (show === 'rest' ? !isAccent : isAccent);
      return (
        <span
          key={`${at}:${letter}`}
          style={{
            visibility: visible ? 'visible' : 'hidden',
            color: isAccent ? accent : undefined,
            WebkitTextStroke:
              isAccent && ring !== undefined && ring.width > 0
                ? `${ring.width}px ${ring.color}`
                : undefined,
          }}
        >
          {letter}
        </span>
      );
    })}
  </>
);

export const RepeatStack = ({ props, frame }: { props: HangingWordsProps; frame: number }) => {
  const { stack, outro, flash, palette, look } = props;
  if (frame < stack.start) {
    return null;
  }
  const centerY = flash.baseline - stack.size * CAP_CENTER;
  const elapsed = frame - stack.scrollStart;
  const speed = elapsed > 0 ? SCROLL_DISTANCE / Math.max(1, stack.scrollFrames) : 0;
  const rise = Math.max(0, elapsed) * speed;
  const scrolling = elapsed > 0;
  const total = Math.max(1, stack.sideLines * 2);
  const slotFrame = (order: number) =>
    stack.start + 1 + Math.floor((order * stack.fillFrames) / total);
  const inked = frame >= outro.inkAt;
  const ring = { width: stack.ringStroke, color: palette.night };
  const font = fontFamily(flash.font);
  return (
    <AbsoluteFill>
      {rise < SCROLL_CLEAR
        ? echoOffsets(speed).map((echo) => (
            <Streak
              key={echo.offset}
              y={speed * 0.08}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: echo.opacity,
                transform: `translateY(${(echo.offset - rise).toFixed(1)}px)`,
              }}
            >
              {sequenceSlots(stack.sideLines)
                .filter((slot) => frame >= slotFrame(slot.order))
                .map((slot) => (
                  <TextLine
                    key={slot.order}
                    centerY={centerY + slot.offset * stack.pitch}
                    size={stack.size}
                    font={font}
                    weight={flash.weight}
                    color={palette.light}
                  >
                    {stack.word}
                  </TextLine>
                ))}
              <TextLine
                centerY={centerY}
                size={stack.size}
                font={font}
                weight={flash.weight}
                color={palette.light}
              >
                <SplitWord
                  word={stack.word}
                  index={stack.highlightIndex}
                  show="all"
                  accent={scrolling ? palette.night : palette.highlight}
                  ring={ring}
                />
              </TextLine>
            </Streak>
          ))
        : null}
      {scrolling && frame < outro.expandStart ? (
        <TextLine
          centerY={centerY}
          size={stack.size}
          font={font}
          weight={flash.weight}
          color={palette.light}
        >
          <SplitWord
            word={stack.word}
            index={stack.highlightIndex}
            show="letter"
            accent={inked ? look.ink : palette.highlight}
            ring={inked ? undefined : ring}
          />
        </TextLine>
      ) : null}
    </AbsoluteFill>
  );
};
