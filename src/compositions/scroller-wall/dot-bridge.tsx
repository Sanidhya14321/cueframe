import { Easing, useVideoConfig } from 'remotion';
import type { ScrollerWallProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { fontSpec, wallFont } from './fonts';
import { type GlyphBox, measureText } from './measure';
import { Canvas } from './word-beats';

type BeatProps = { frame: number; props: ScrollerWallProps };

export type LineLayout = {
  left: number;
  glyphs: GlyphBox[];
  xs: number[];
};

const centeredLine = (
  text: string,
  spec: ReturnType<typeof fontSpec>,
  width: number,
): LineLayout => {
  const box = measureText(text, spec);
  const left = width / 2 - (box.width - spec.tracking * spec.size) / 2;
  return { left, glyphs: box.glyphs, xs: box.glyphs.map((glyph) => left + glyph.left) };
};

const glyphCenter = (layout: LineLayout, index: number): number => {
  const glyph = layout.glyphs[index];
  return glyph === undefined ? layout.left : layout.left + glyph.left + glyph.width / 2;
};

export const contactAnchors = (props: ScrollerWallProps, width: number) => {
  const spec = fontSpec(props.look, props.contact.size, props.contact.weight);
  const layout = centeredLine(props.contact.text, spec, width);
  const chars = layout.glyphs.map((glyph) => glyph.char);
  const first = chars.indexOf('o');
  const last = chars.lastIndexOf('o');
  const xHeight = measureText('x', spec).glyphs[0]?.ascent ?? props.contact.size * 0.5;
  return {
    layout,
    left: glyphCenter(layout, first < 0 ? 0 : first),
    right: glyphCenter(layout, last < 0 ? chars.length - 1 : last),
    y: props.contact.baselineY - xHeight / 2,
  };
};

const glide = Easing.out(Easing.quad);

type Point = { x: number; y: number };

const MovingDot = ({
  from,
  to,
  size,
  ink,
}: {
  from: Point;
  to: Point;
  size: number;
  ink: string;
}) => {
  const tail = { x: to.x + (from.x - to.x) * 0.6, y: to.y + (from.y - to.y) * 0.6 };
  return (
    <g>
      <line
        x1={tail.x}
        y1={tail.y}
        x2={to.x}
        y2={to.y}
        stroke={ink}
        strokeWidth={size * 0.7}
        strokeLinecap="round"
        strokeOpacity={0.35}
      />
      <circle cx={to.x} cy={to.y} r={size / 2} fill={ink} />
    </g>
  );
};

const fadeOut = (frame: number, start: number, frames: number): number =>
  1 - tween(frame, [start, start + frames], [0, 1], smooth);

export const DotBridge = ({ frame, props }: BeatProps) => {
  const { width } = useVideoConfig();
  const { look, words, dots, contact } = props;
  const items = [...words.items].sort((a, b) => a.at - b.at);
  const currentIndex = items.findLastIndex((item) => item.at <= frame);
  const current = items[currentIndex];
  if (current === undefined) {
    return null;
  }
  const isLast = currentIndex === items.length - 1;
  const spec = fontSpec(look, words.size, words.weight);
  const layout = centeredLine(current.text, spec, width);
  const periodIndex = layout.glyphs.at(-1)?.char === '.' ? layout.glyphs.length - 1 : -1;
  const fadeable = layout.glyphs
    .map((_, index) => index)
    .filter((index) => index > 0 && index !== periodIndex);
  const slideEnd = dots.splitAt + dots.slideFrames;
  const opacityOf = (index: number): number => {
    if (!isLast || index === periodIndex) {
      return index === periodIndex ? 0 : 1;
    }
    if (index === 0) {
      return fadeOut(frame, dots.splitAt + 1, dots.slideFrames);
    }
    const fromRight = fadeable.length - 1 - fadeable.indexOf(index);
    return fadeOut(frame, words.exitAt + fromRight * words.letterStep, words.letterFade);
  };
  const lastGlyph = layout.glyphs.at(-1);
  const anchorX =
    periodIndex >= 0
      ? glyphCenter(layout, periodIndex)
      : layout.left + (lastGlyph ? lastGlyph.left + lastGlyph.width : 0) + dots.size;
  const anchorY = words.baselineY - dots.size / 2;
  const target = contactAnchors(props, width);
  const dotsAt = (at: number) => {
    const slide = isLast ? tween(at, [dots.splitAt, slideEnd], [0, 1], glide) : 0;
    const rise = isLast ? tween(at, [slideEnd, slideEnd + dots.riseFrames], [0, 1], smooth) : 0;
    const y = anchorY + (target.y - anchorY) * rise;
    const drift = isLast
      ? tween(at, [dots.splitAt, slideEnd + dots.riseFrames], [0, 1], smooth)
      : 0;
    return {
      right: { x: anchorX + (target.right - anchorX) * drift, y },
      left: { x: anchorX + (target.left - anchorX) * slide, y },
    };
  };
  const now = dotsAt(frame);
  const before = dotsAt(frame - 1);
  const dotOpacity = fadeOut(frame, dots.fadeAt, dots.fadeFrames);
  const showWord = frame < contact.at;
  const showDots = periodIndex >= 0 || (isLast && frame >= dots.splitAt);
  return (
    <Canvas>
      {showWord ? (
        <text
          fontFamily={wallFont}
          fontWeight={words.weight}
          fontSize={words.size}
          y={words.baselineY}
          fill={look.ink}
        >
          {layout.glyphs.map((glyph, index) => (
            <tspan
              key={`${index.toString()}-${glyph.char}`}
              x={layout.xs[index]}
              fillOpacity={opacityOf(index)}
            >
              {glyph.char}
            </tspan>
          ))}
        </text>
      ) : null}
      {showDots && dotOpacity > 0 ? (
        <g opacity={dotOpacity}>
          <MovingDot from={before.right} to={now.right} size={dots.size} ink={look.ink} />
          {isLast && frame >= dots.splitAt ? (
            <MovingDot
              from={frame - 1 >= dots.splitAt ? before.left : now.left}
              to={now.left}
              size={dots.size}
              ink={look.ink}
            />
          ) : null}
        </g>
      ) : null}
    </Canvas>
  );
};
