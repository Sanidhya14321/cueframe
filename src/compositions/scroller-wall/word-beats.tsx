import type { ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import type { ScrollerLine, ScrollerWallProps } from '@/schemas';
import { fontSpec, wallFont } from './fonts';
import { measureText } from './measure';

type BeatProps = { frame: number; props: ScrollerWallProps };

const capHeight = (text: string, spec: ReturnType<typeof fontSpec>): number =>
  Math.max(0, ...measureText(text, spec).glyphs.map((glyph) => glyph.ascent));

export const Canvas = ({ children }: { children: ReactNode }) => {
  const { width, height } = useVideoConfig();
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
};

const scrollerVisible = (scroller: ScrollerWallProps['scroller'], frame: number) => {
  const count = Math.max(1, Math.round(scroller.count));
  const added = Math.min(count, Math.floor((frame - scroller.at) / scroller.addEvery) + 1);
  const removed =
    frame < scroller.removeAt
      ? 0
      : Math.min(count - 1, Math.floor((frame - scroller.removeAt) / scroller.removeEvery) + 1);
  return Array.from({ length: count }, (_, index) => index).filter(
    (index) => index < added && index >= removed,
  );
};

export const ScrollerStack = ({ frame, props }: BeatProps) => {
  const { width } = useVideoConfig();
  const { look, scroller } = props;
  const spec = fontSpec(look, scroller.size);
  const baseline = scroller.baseY + capHeight(scroller.word, spec) / 2;
  return (
    <Canvas>
      {scrollerVisible(scroller, frame).map((index) => (
        <text
          key={index}
          x={width / 2}
          y={baseline - index * scroller.pitch}
          textAnchor="middle"
          fontFamily={wallFont}
          fontWeight={look.weight}
          fontSize={scroller.size}
          letterSpacing={`${look.tracking}em`}
          fill={look.ink}
        >
          {scroller.word}
        </text>
      ))}
    </Canvas>
  );
};

const headlineBaselines = (
  lines: ScrollerLine[],
  look: ScrollerWallProps['look'],
  top: number,
  gap: number,
): number[] => {
  let cursor = top - gap;
  return lines.map((line) => {
    cursor += gap + capHeight(line.text, fontSpec(look, line.size));
    return cursor;
  });
};

export const HeadlineStack = ({ frame, props }: BeatProps) => {
  const { width } = useVideoConfig();
  const { look, headline } = props;
  const baselines = headlineBaselines(headline.lines, look, headline.top, headline.gap);
  return (
    <Canvas>
      {headline.lines.map((line, index) =>
        frame >= line.at && frame < line.hideAt ? (
          <text
            key={`${index.toString()}-${line.text}`}
            x={width / 2}
            y={(baselines[index] ?? 0) + line.nudge}
            textAnchor="middle"
            fontFamily={wallFont}
            fontWeight={look.weight}
            fontSize={line.size}
            letterSpacing={`${look.tracking}em`}
            fill={line.ink === 'highlight' ? look.highlight : look.ink}
          >
            {line.text}
          </text>
        ) : null,
      )}
    </Canvas>
  );
};

export const headlineSpan = (headline: ScrollerWallProps['headline']): [number, number] => [
  Math.min(...headline.lines.map((line) => line.at)),
  Math.max(...headline.lines.map((line) => line.hideAt)),
];
