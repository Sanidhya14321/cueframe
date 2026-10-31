import { type CSSProperties, useId } from 'react';
import type { DoodleInk, HandFont } from '@/schemas';
import { handFonts } from './fonts';
import { boilTime, inkPath, inkPhase } from './ink-arrow';
import { hash, type Point, resample, signedHash } from './ink-geometry';
import { InkFilter, InkStroke } from './ink-stroke';
import { settle, smooth, tween } from './timing';

interface WritingPace {
  start: number;
  charFrames: number;
  charStagger: number;
  wordPause: number;
}

interface PlannedWord {
  word: string;
  starts: number[];
  end: number;
}

const normalize = (word: string): string => word.replace(/[.,!?;:]/g, '').toLowerCase();

const planWriting = (text: string, pace: WritingPace): PlannedWord[][] => {
  let cursor = pace.start;
  return text.split('\n').map((line) =>
    line
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => {
        const starts = [...word].map((_, index) => cursor + index * pace.charStagger);
        cursor += word.length * pace.charStagger + pace.wordPause;
        return { word, starts, end: (starts.at(-1) ?? cursor) + pace.charFrames };
      }),
  );
};

const UNDERLINE: Point[] = resample(
  [
    { x: 6, y: 26 },
    { x: 120, y: 20 },
    { x: 260, y: 18 },
    { x: 394, y: 12 },
  ],
  60,
);

const TICKS: Point[][] = [
  [
    { x: 44, y: 22 },
    { x: 12, y: 6 },
  ],
  [
    { x: 46, y: 46 },
    { x: 6, y: 46 },
  ],
  [
    { x: 44, y: 70 },
    { x: 12, y: 86 },
  ],
].map((line) => resample(line, 16));

export interface HandwritingProps extends WritingPace {
  text: string;
  highlight: string;
  font: HandFont;
  size: number;
  lineHeight: number;
  color: string;
  accent: string;
  align: 'left' | 'center' | 'right';
  frame: number;
  jitter: number;
  ink: DoodleInk;
  underline: boolean;
  burst: boolean;
  eraseStart: number;
  eraseFrames: number;
  seed: number;
}

const charStyle = (
  props: HandwritingProps,
  index: number,
  start: number,
): { main: CSSProperties; lead: CSSProperties } => {
  const { frame, charFrames, jitter, ink, seed, eraseStart, eraseFrames } = props;
  const written = tween(frame, [start, start + charFrames], [0, 1], settle);
  const inked = tween(frame, [start, start + charFrames], [0, 1], smooth);
  const eraseAt = eraseStart + hash(seed + 77, index) * eraseFrames * 0.55;
  const erased = tween(frame, [eraseAt, eraseAt + Math.max(1, eraseFrames * 0.45)], [0, 1], smooth);
  const rotation = jitter * signedHash(seed, index) * 4;
  const lift = jitter * signedHash(seed + 9, index) * 0.035;
  return {
    main: {
      display: 'inline-block',
      opacity: inked * (1 - erased),
      transform: `translateY(${(lift + (1 - written) * 0.06 + erased * 0.05).toFixed(4)}em) rotate(${rotation.toFixed(3)}deg) scale(${(1.1 - written * 0.1 - erased * 0.08).toFixed(4)})`,
      filter:
        written >= 1 && erased <= 0
          ? undefined
          : `blur(${((1 - written) * 2.5 + erased * 4).toFixed(3)}px)`,
    },
    lead: {
      position: 'absolute',
      left: 0,
      top: 0,
      color: props.accent,
      opacity: ink.lead * Math.sin(Math.PI * inked) * (1 - erased),
      transform: `translate(${-ink.leadOffset * 0.7}px, ${ink.leadOffset * 0.45}px) rotate(${rotation.toFixed(3)}deg)`,
    },
  };
};

const Mark = ({
  points,
  props,
  width,
  start,
  time,
  seed,
}: {
  points: readonly Point[];
  props: HandwritingProps;
  width: number;
  start: number;
  time: number;
  seed: number;
}) => {
  const { draw, erase } = inkPhase(props.frame, {
    drawStart: start,
    drawFrames: 12,
    eraseStart: props.eraseStart + props.eraseFrames * 0.2,
    eraseFrames: props.eraseFrames * 0.7,
  });
  return (
    <InkStroke
      points={inkPath(points, { ...props.ink, roughness: props.ink.roughness * 0.4 }, seed, time)}
      width={width}
      color={props.accent}
      leadColor={props.color}
      draw={draw}
      erase={erase}
      leadOpacity={0}
      leadOffset={0}
      flecks={0}
      seed={seed}
    />
  );
};

export const Handwriting = (props: HandwritingProps) => {
  const { text, highlight, font, size, lineHeight, color, accent, align, ink, seed } = props;
  const filterId = useId().replace(/:/g, '');
  const time = boilTime(props.frame, ink);
  const accented = new Set(highlight.split(' ').map(normalize).filter(Boolean));
  let charIndex = 0;
  return (
    <div
      style={{
        fontFamily: handFonts[font],
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        filter: `url(#${filterId})`,
      }}
    >
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <InkFilter
            id={filterId}
            seed={seed}
            roughness={size * 0.02 * ink.roughness}
            dryness={ink.roughness * 0.35}
          />
        </defs>
      </svg>
      {planWriting(text, props).map((line, lineIndex) => (
        <div key={`${lineIndex.toString()}:${line.map((item) => item.word).join(' ')}`}>
          {line.map((item, wordIndex) => {
            const isAccent = accented.has(normalize(item.word));
            return (
              <span key={`${wordIndex.toString()}:${item.word}`}>
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    color: isAccent ? accent : undefined,
                    margin: isAccent && props.burst ? '0 0.6em' : undefined,
                  }}
                >
                  {[...item.word].map((char, index) => {
                    const style = charStyle(props, charIndex++, item.starts[index] ?? 0);
                    return (
                      <span
                        key={`${index.toString()}:${char}`}
                        style={{ position: 'relative', display: 'inline-block' }}
                      >
                        <span style={style.lead}>{char}</span>
                        <span style={style.main}>{char}</span>
                      </span>
                    );
                  })}
                  {isAccent && props.underline ? (
                    <svg
                      viewBox="0 0 400 40"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        left: '-4%',
                        width: '108%',
                        bottom: '-0.14em',
                        height: '0.3em',
                        overflow: 'visible',
                      }}
                      aria-hidden="true"
                    >
                      <Mark
                        points={UNDERLINE}
                        props={props}
                        width={ink.width * 1.6}
                        start={item.end + 2}
                        time={time}
                        seed={seed + 500}
                      />
                    </svg>
                  ) : null}
                  {isAccent && props.burst
                    ? (['left', 'right'] as const).map((side) => (
                        <svg
                          key={side}
                          viewBox="0 0 50 90"
                          style={{
                            position: 'absolute',
                            [side]: '-0.62em',
                            top: '0.08em',
                            width: '0.5em',
                            height: '0.9em',
                            overflow: 'visible',
                            transform: side === 'right' ? 'scaleX(-1)' : undefined,
                          }}
                          aria-hidden="true"
                        >
                          {TICKS.map((tick, tickIndex) => (
                            <Mark
                              key={`${side}-${tickIndex.toString()}`}
                              points={tick}
                              props={props}
                              width={ink.width * 0.75}
                              start={item.end + 8 + tickIndex * 2}
                              time={time}
                              seed={seed + 600 + tickIndex + (side === 'right' ? 10 : 0)}
                            />
                          ))}
                        </svg>
                      ))
                    : null}
                </span>
                {wordIndex < line.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
