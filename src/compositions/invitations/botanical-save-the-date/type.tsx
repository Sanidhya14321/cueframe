import type { CSSProperties } from 'react';
import { smooth, tween } from '../../promo/timing';
import { withAlpha } from './paint';

export interface Cue {
  start: number;
  end: number;
  typeFrames: number;
  eraseFrames: number;
}

export interface Voice {
  serif: string;
  display: string;
  script: string;
  ink: string;
  muted: string;
  accent: string;
  tracking: number;
}

const SOFT_CHARS = 2.4;
const BLOCK_CHARS = 2.2;
const FADE_FRAMES = 9;

const ramp = (value: number): number => Math.min(1, Math.max(0, value));

interface Sweep {
  at: number;
  soft: number;
}

const sweep = (
  frame: number,
  from: number,
  frames: number,
  count: number,
  minimum: number,
  extra: number,
): Sweep => {
  const span = Math.max(1, frames);
  const soft = Math.max(minimum, (count / span) * FADE_FRAMES);
  return {
    at: tween(frame, [from, from + span], [-1, count + extra + soft], (t) => t),
    soft,
  };
};

export const onStage = (frame: number, cue: Cue): boolean =>
  frame >= cue.start - 1 && frame <= cue.end + cue.eraseFrames + 2;

type Reveal = 'type' | 'block';

export const glyphStates = (
  frame: number,
  count: number,
  cue: Cue,
  reveal: Reveal,
): { glyph: number; cover: number }[] => {
  if (reveal === 'type') {
    const front = sweep(frame, cue.start, cue.typeFrames, count, SOFT_CHARS, 1);
    const erase = sweep(frame, cue.end, cue.eraseFrames, count, SOFT_CHARS, 1);
    return Array.from({ length: count }, (_, index) => ({
      glyph: ramp((front.at - index) / front.soft) * (1 - ramp((erase.at - index) / erase.soft)),
      cover: 0,
    }));
  }
  const front = sweep(frame, cue.start, cue.typeFrames, count, 1, BLOCK_CHARS);
  const cover = sweep(frame, cue.end, cue.eraseFrames * 0.6, count, 1, 1);
  const clear = sweep(frame, cue.end + cue.eraseFrames * 0.4, cue.eraseFrames * 0.6, count, 1, 1);
  return Array.from({ length: count }, (_, index) => {
    const reached = ramp((front.at - index) / front.soft);
    const passed = ramp((front.at - BLOCK_CHARS - index) / front.soft);
    const covered = ramp((cover.at - index) / cover.soft);
    const cleared = ramp((clear.at - index) / clear.soft);
    return {
      glyph: passed * (1 - covered),
      cover: reached * (1 - passed) + covered * (1 - cleared),
    };
  });
};

export const TypedLine = ({
  text,
  frame,
  cue,
  color,
  reveal = 'type',
  style,
}: {
  text: string;
  frame: number;
  cue: Cue;
  color: string;
  reveal?: Reveal;
  style: CSSProperties;
}) => {
  const characters = Array.from(text);
  const states = glyphStates(frame, characters.length, cue, reveal);
  return (
    <div
      style={{
        whiteSpace: 'pre',
        fontVariantLigatures: 'none',
        fontFeatureSettings: '"liga" 0, "clig" 0, "calt" 0',
        ...style,
      }}
    >
      {characters.map((character, index) => {
        const state = states[index] ?? { glyph: 0, cover: 0 };
        return (
          <span
            key={`${index}:${character}`}
            style={{
              color: withAlpha(color, state.glyph),
              backgroundColor: state.cover > 0.002 ? withAlpha(color, state.cover) : undefined,
            }}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
};

export const fadeCue = (frame: number, cue: Cue, delay = 0): number =>
  tween(frame, [cue.start + delay, cue.start + delay + 16], [0, 1], smooth) *
  tween(frame, [cue.end, cue.end + 14], [1, 0], smooth);

export const lineCue = (cue: Cue, index: number, stagger: number): Cue => ({
  ...cue,
  start: cue.start + index * stagger,
});

export const capsStyle = (
  voice: Voice,
  size: number,
  weight = 400,
  tracking = voice.tracking,
): CSSProperties => ({
  fontFamily: voice.serif,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: `${tracking}em`,
  lineHeight: 1.25,
  fontVariantNumeric: 'lining-nums',
});

export const scriptStyle = (voice: Voice, size: number): CSSProperties => ({
  fontFamily: voice.script,
  fontSize: size,
  lineHeight: 1.12,
  padding: '0 0.25em',
});

export const splitLines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
