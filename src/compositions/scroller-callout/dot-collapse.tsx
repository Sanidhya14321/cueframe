import type { ScrollerCalloutProps } from '@/schemas';
import { settle, smooth, tween } from '../promo/timing';
import { type GlyphLayout, GlyphRow } from './glyphs';
import { PERIOD, periodCenter } from './word-beats';

type Props = ScrollerCalloutProps;

const solid = (color: string) => () => color;

const glyphCenter = (layout: GlyphLayout, left: number, index: number): number => {
  const glyph = layout.glyphs[index];
  return glyph === undefined ? left : left + glyph.x + glyph.advance / 2;
};

const dotIndices = (layout: GlyphLayout): [number, number] => {
  const indices = layout.glyphs.flatMap((glyph, index) => (glyph.char === 'o' ? [index] : []));
  const visible = layout.glyphs.flatMap((glyph, index) =>
    glyph.char.trim() === '' ? [] : [index],
  );
  const pool = indices.length >= 2 ? indices : visible;
  return [pool[0] ?? 0, pool.at(-1) ?? 0];
};

const dotTargets = (layout: GlyphLayout, left: number): [number, number] => {
  const [first, last] = dotIndices(layout);
  return [glyphCenter(layout, left, first), glyphCenter(layout, left, last)];
};

const crossing = (target: number, from: number, to: number, start: number, end: number) => {
  if (target >= from) {
    return start;
  }
  if (target <= to) {
    return end;
  }
  let low = 0;
  let high = 1;
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (from + (to - from) * smooth(middle) > target) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return start + (end - start) * high;
};

export const DotCollapse = ({
  collapse,
  contact,
  word,
  wordLeft,
  wordBaseline,
  contactLayout,
  contactLeft,
  ink,
  accent,
  frame,
}: {
  collapse: Props['collapse'];
  contact: Props['contact'];
  word: GlyphLayout;
  wordLeft: number;
  wordBaseline: number;
  contactLayout: GlyphLayout;
  contactLeft: number;
  ink: string;
  accent: string;
  frame: number;
}) => {
  if (frame < collapse.at || frame >= contact.at + contact.dotHold) {
    return null;
  }
  const radius = collapse.dotSize / 2;
  const periodX = periodCenter(word, wordLeft) ?? wordLeft + word.width + radius;
  const sweepTo = wordLeft - collapse.dotSize;
  const sweepRange: [number, number] = [collapse.at, collapse.at + collapse.sweepFrames];
  const sweeperX = tween(frame, sweepRange, [periodX, sweepTo], smooth);
  const restX = tween(frame, sweepRange, [periodX, periodX - collapse.drift], smooth);
  const firstLetter = word.glyphs.findIndex((glyph) => glyph.char.trim() !== '');
  const fade = (index: number) => {
    const glyph = word.glyphs[index];
    const first = index === firstLetter;
    const passed =
      first || glyph === undefined
        ? sweepRange[1]
        : crossing(wordLeft + glyph.x + glyph.advance, periodX, sweepTo, ...sweepRange);
    const frames = first ? collapse.firstFade : collapse.letterFade;
    return 1 - tween(frame, [passed, passed + Math.max(0.01, frames)], [0, 1], (t) => t);
  };
  const [leftTarget, rightTarget] = dotTargets(contactLayout, contactLeft);
  const restY = wordBaseline - radius;
  const targetY = contact.baseline + contact.drop - contactLayout.xHeight / 2;
  const rise = tween(
    frame,
    [collapse.riseAt, collapse.riseAt + Math.max(0.01, collapse.riseFrames)],
    [0, 1],
    settle,
  );
  const y = restY + (targetY - restY) * rise;
  return (
    <g>
      <GlyphRow
        layout={word}
        left={wordLeft}
        baseline={wordBaseline}
        fill={solid(ink)}
        hidden={(index) => word.glyphs[index]?.char === PERIOD || fade(index) <= 0}
        opacity={fade}
      />
      <circle cx={sweeperX + (leftTarget - sweeperX) * rise} cy={y} r={radius} fill={accent} />
      <circle cx={restX + (rightTarget - restX) * rise} cy={y} r={radius} fill={accent} />
    </g>
  );
};

export const ContactLine = ({
  contact,
  layout,
  left,
  ink,
  accent,
  until,
  frame,
}: {
  contact: Props['contact'];
  layout: GlyphLayout;
  left: number;
  ink: string;
  accent: string;
  until: number;
  frame: number;
}) => {
  if (frame < contact.at || frame >= until) {
    return null;
  }
  const lower = frame < contact.hopAt + 1;
  const raised = frame >= contact.hopAt;
  const dots = dotIndices(layout);
  const fill = (index: number) => (dots.includes(index) ? accent : ink);
  return (
    <g>
      {lower ? (
        <GlyphRow
          layout={layout}
          left={left}
          baseline={contact.baseline + contact.drop}
          fill={fill}
        />
      ) : null}
      {raised ? (
        <GlyphRow layout={layout} left={left} baseline={contact.baseline} fill={fill} />
      ) : null}
    </g>
  );
};
