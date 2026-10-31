import { AbsoluteFill } from 'remotion';
import type { WordBuildProps } from '@/schemas';
import { withAlpha } from './glow';
import { displayType } from './kinetic';
import { tween } from './timing';
import {
  type BigWindow,
  bigWordTransform,
  fallingLetter,
  presence,
  wipeState,
} from './word-build-motion';

const SQUEEZE_FRAMES = 6;
const linear = (t: number): number => t;

const BigWord = ({
  word,
  color,
  props,
  frame,
  progress,
  size,
  falling,
}: {
  word: string;
  color: string;
  props: WordBuildProps;
  frame: number;
  progress: number;
  size: number;
  falling: number | null;
}) => {
  return (
    <div style={{ position: 'relative', whiteSpace: 'pre' }}>
      {props.entry === 'echo'
        ? Array.from({ length: props.echoes }, (_, echo) => echo + 1).map((echo) => (
            <div
              key={echo}
              style={{
                ...displayType(size, props.bigWeight),
                position: 'absolute',
                inset: 0,
                color: 'transparent',
                WebkitTextStroke: `${Math.max(1, size / 220)}px ${withAlpha(props.look.ink, 0.55 / echo)}`,
                transform: `translateX(${(echo * size * 0.16 * (1 - progress)).toFixed(2)}px)`,
              }}
            >
              {word}
            </div>
          ))
        : null}
      <div style={{ ...displayType(size, props.bigWeight), position: 'relative', color }}>
        {falling === null
          ? word
          : Array.from(word).map((letter, index, all) => (
              <span
                key={`${index}:${letter}`}
                style={{
                  display: 'inline-block',
                  ...fallingLetter(frame, falling, index, all.length),
                }}
              >
                {letter}
              </span>
            ))}
      </div>
    </div>
  );
};

const exitFade = (props: WordBuildProps, frame: number, window: BigWindow, isLast: boolean) => {
  if (isLast && props.bigExit === 'squeeze') {
    return tween(frame, [window.end, window.end + SQUEEZE_FRAMES], [0, 1], linear);
  }
  if (isLast && props.bigExit === 'fall') {
    return 0;
  }
  if (!isLast && (props.entry === 'slide' || props.entry === 'shrink')) {
    return frame >= window.end ? 1 : 0;
  }
  return tween(frame, [window.end - 3, window.end], [0, 1], linear);
};

const ScrollLayer = ({
  props,
  frame,
  window,
  words,
}: {
  props: WordBuildProps;
  frame: number;
  window: BigWindow | undefined;
  words: string[];
}) => {
  if (window === undefined || frame < window.start || frame > window.end) {
    return null;
  }
  const progress = (frame - window.start) / (window.end - window.start);
  return (
    <AbsoluteFill style={{ justifyContent: 'center' }}>
      <div style={bigWordTransform(props, progress)}>
        <BigWord
          word={words.join(' ')}
          color={props.look.ink}
          props={props}
          progress={progress}
          frame={frame - window.start}
          size={props.bigSize}
          falling={null}
        />
      </div>
    </AbsoluteFill>
  );
};

const StepWord = ({
  props,
  frame,
  width,
  windows,
  words,
  index,
  exitPad,
  accentFor,
}: {
  props: WordBuildProps;
  frame: number;
  width: number;
  windows: BigWindow[];
  words: string[];
  index: number;
  exitPad: number;
  accentFor: (word: string) => string;
}) => {
  const { entry, bigSize, size, look } = props;
  const word = words[index] ?? '';
  const window = windows[index];
  const isLast = index === words.length - 1;
  const tail = isLast ? exitPad + (props.bigExit === 'squeeze' ? SQUEEZE_FRAMES : 0) : 0;
  if (window === undefined || frame < window.start || frame > window.end + tail) {
    return null;
  }
  const progress = Math.min(1, (frame - window.start) / (window.end - window.start));
  const stepSize =
    entry === 'step' ? bigSize * props.sizeRamp ** (words.length - 1 - index) : bigSize;
  const fadeIn = entry === 'slide' || entry === 'shrink' ? 1 : presence(frame, window.start, 2);
  const squeeze =
    isLast && props.bigExit === 'squeeze'
      ? tween(frame, [window.end - 2, window.end + SQUEEZE_FRAMES], [1, size / stepSize], linear)
      : 1;
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn * (1 - exitFade(props, frame, window, isLast)),
        ...(entry === 'slide' ? wipeState(frame, windows, index, width) : {}),
      }}
    >
      <div
        style={{
          ...bigWordTransform(props, progress),
          filter: squeeze < 1 ? `blur(${((1 - squeeze) * 8).toFixed(2)}px)` : undefined,
        }}
      >
        <div
          style={{
            transform: `scale(${squeeze.toFixed(4)}, ${(squeeze ** 0.5).toFixed(4)})`,
          }}
        >
          <BigWord
            word={word}
            color={entry === 'slide' || entry === 'step' ? look.ink : accentFor(word)}
            props={props}
            frame={frame - window.start}
            progress={progress}
            size={stepSize}
            falling={isLast && props.bigExit === 'fall' ? window.end - window.start - 4 : null}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BigWordLayer = ({
  props,
  frame,
  width,
  windows,
  words,
  exitPad,
  accentFor,
}: {
  props: WordBuildProps;
  frame: number;
  width: number;
  windows: BigWindow[];
  words: string[];
  exitPad: number;
  accentFor: (word: string) => string;
}) => {
  if (props.entry === 'scroll') {
    return <ScrollLayer props={props} frame={frame} window={windows[0]} words={words} />;
  }
  return (
    <>
      {words.map((word, index) => (
        <StepWord
          key={`${index}:${word}`}
          props={props}
          frame={frame}
          width={width}
          windows={windows}
          words={words}
          index={index}
          exitPad={exitPad}
          accentFor={accentFor}
        />
      ))}
    </>
  );
};
