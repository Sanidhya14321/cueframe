import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type WordBuildProps, wordBuildDefaults, wordBuildMeta, wordBuildSchema } from '@/schemas';
import { displayType, KineticLayer } from '../../promo/kinetic';
import { tween } from '../../promo/timing';
import { BigWordLayer } from '../../promo/word-build-big';
import {
  bigWindows,
  centeringShift,
  presence,
  sentenceWordStyle,
} from '../../promo/word-build-motion';
import { highlightSet, linesOf, normalize } from '../../promo/words';
import type { SceneModule } from '../../scene-module';

const FALL_FRAMES = 14;
const linear = (t: number): number => t;

export const WordBuild = (props: WordBuildProps) => {
  const { entry, size, weight, delay, wordFrames, placement, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames, width } = useVideoConfig();
  const lines = linesOf(props.text);
  const words = lines.flat();
  const accented = highlightSet(props.highlight);
  const bigCount = props.bigWords > 0 ? Math.min(props.bigWords, words.length) : words.length;
  const bigList = words.slice(0, bigCount);
  const windows = bigWindows(entry, bigCount, delay, wordFrames);
  const bigEnd = windows.at(-1)?.end ?? delay;
  const exitPad = props.bigExit === 'fall' ? FALL_FRAMES : props.bigExit === 'squeeze' ? 2 : 0;
  const sentenceStart = bigEnd + exitPad + props.lineDelay;
  const order = (index: number) => (props.buildFrom === 'left' ? index : words.length - 1 - index);
  const appearOf = (index: number) => sentenceStart + order(index) * props.buildFrames;
  const lastAppear = sentenceStart + (words.length - 1) * props.buildFrames;
  const exitStart = durationInFrames - motion.exitFrames - words.length * props.exitStagger - 4;
  const isWalking = (index: number) => {
    if (!props.walkHighlight) {
      return false;
    }
    const appear = appearOf(index);
    const until =
      appear === lastAppear ? appear + props.buildFrames + 4 : appear + props.buildFrames;
    return frame >= appear && frame < until;
  };
  const isLit = (word: string, index: number) =>
    isWalking(index) || (!props.walkHighlight && accented.has(normalize(word)));
  const colorOf = (word: string, index: number) => (isLit(word, index) ? look.accent : look.ink);

  const bigLayer = (
    <BigWordLayer
      props={{ ...props, look: { ...look, ink: props.bigColor } }}
      frame={frame}
      width={width}
      windows={windows}
      words={bigList}
      exitPad={exitPad}
      accentFor={(word) => (isLit(word, -1) ? look.accent : props.bigColor)}
    />
  );

  let wordIndex = 0;
  const sentence = lines.map((line, lineIndex) => {
    const first = wordIndex;
    wordIndex += line.length;
    const hiddenChars = line.reduce(
      (sum, word, offset) =>
        sum + (1 - presence(frame, appearOf(first + offset))) * (word.length + 1),
      0,
    );
    return (
      <div
        key={`${lineIndex}:${line.join(' ')}`}
        style={{
          ...displayType(size, weight),
          lineHeight: props.lineHeight,
          transform: centeringShift(hiddenChars, props.buildFrom),
        }}
      >
        {line.map((word, offset) => {
          const index = first + offset;
          const appear = appearOf(index);
          if (frame < appear) {
            return null;
          }
          const leave = props.exitByWord
            ? tween(
                frame,
                [exitStart + index * props.exitStagger, exitStart + index * props.exitStagger + 6],
                [0, 1],
                linear,
              )
            : 0;
          const style = sentenceWordStyle(
            props.sentenceEntry,
            frame,
            appear,
            order(index),
            size,
            width,
          );
          return (
            <span
              key={`${offset}:${word}`}
              style={{
                display: 'inline-block',
                color: colorOf(word, index),
                ...style,
                opacity: (style.opacity as number) * (1 - leave),
              }}
            >
              {props.sentenceEntry === 'type'
                ? Array.from(word).map((char, at) => {
                    const shown = presence(frame, appear + at * 0.7, 2);
                    return (
                      <span
                        key={`${at}:${char}`}
                        style={{
                          opacity: shown,
                          filter: shown < 1 ? `blur(${((1 - shown) * 6).toFixed(2)}px)` : undefined,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })
                : word}
              {offset < line.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    );
  });
  return (
    <KineticLayer look={look} motion={motion} placement={placement} stage={bigLayer}>
      {sentence}
    </KineticLayer>
  );
};

export const wordBuildScene: SceneModule = {
  id: 'word-build',
  component: WordBuild,
  render: (key) => (
    <Composition
      key={key}
      id="word-build"
      component={WordBuild}
      schema={wordBuildSchema}
      defaultProps={wordBuildDefaults}
      durationInFrames={wordBuildMeta.durationInFrames}
      fps={wordBuildMeta.fps}
      width={wordBuildMeta.width}
      height={wordBuildMeta.height}
    />
  ),
};
