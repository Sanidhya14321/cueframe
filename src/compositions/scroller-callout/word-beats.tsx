import type { ScrollerCalloutProps } from '@/schemas';
import { centeredLeft, type GlyphLayout, GlyphRow } from './glyphs';

type Props = ScrollerCalloutProps;

const solid = (color: string) => () => color;

export const ScrollBeat = ({
  scroll,
  layout,
  ink,
  center,
  frame,
}: {
  scroll: Props['scroll'];
  layout: GlyphLayout;
  ink: string;
  center: number;
  frame: number;
}) => {
  if (frame < scroll.start || frame >= scroll.endAt) {
    return null;
  }
  const count = Math.max(1, Math.round(scroll.count));
  const left = centeredLeft(layout, center);
  return (
    <g>
      {Array.from({ length: count }, (_, line) => {
        const shown = frame >= scroll.start + line * scroll.addFrames;
        const cleared = line < count - 1 && frame >= scroll.clearAt + line * scroll.clearFrames;
        return shown && !cleared ? (
          <GlyphRow
            key={`line-${line + 1}`}
            layout={layout}
            left={left}
            baseline={scroll.baseline - line * scroll.pitch}
            fill={solid(ink)}
          />
        ) : null;
      })}
    </g>
  );
};

const stackBaselines = (stack: Props['stack'], layouts: GlyphLayout[]): number[] => {
  const baselines: number[] = [];
  stack.lines.forEach((line, index) => {
    const previous = baselines[index - 1];
    const layout = layouts[index];
    baselines.push(
      previous === undefined || layout === undefined
        ? stack.baseline
        : previous + line.gap + layout.capHeight,
    );
  });
  return baselines;
};

export const StackBeat = ({
  stack,
  layouts,
  palette,
  center,
  frame,
}: {
  stack: Props['stack'];
  layouts: GlyphLayout[];
  palette: Props['palette'];
  center: number;
  frame: number;
}) => {
  if (frame >= stack.endAt) {
    return null;
  }
  const baselines = stackBaselines(stack, layouts);
  return (
    <g>
      {stack.lines.map((line, index) => {
        const layout = layouts[index];
        const leaveAt = line.leaveAt > 0 ? line.leaveAt : stack.endAt;
        if (layout === undefined || frame < line.at || frame >= leaveAt) {
          return null;
        }
        const dimmed = line.dimAt > 0 && frame >= line.dimAt;
        const tone = line.accent ? palette.accent : palette.ink;
        return (
          <GlyphRow
            key={`${index}:${line.text}`}
            layout={layout}
            left={centeredLeft(layout, center)}
            baseline={baselines[index] ?? stack.baseline}
            fill={solid(dimmed ? palette.muted : tone)}
          />
        );
      })}
    </g>
  );
};

export const PERIOD = '.';

export const periodCenter = (layout: GlyphLayout, left: number): number | undefined => {
  const last = layout.glyphs.at(-1);
  return last?.char === PERIOD ? left + last.x + last.advance / 2 : undefined;
};

export const punchWords = (punch: Props['punch']): string[] =>
  punch.words.split(/\s+/).filter((word) => word !== '');

export const PunchBeat = ({
  punch,
  layouts,
  palette,
  center,
  dotSize,
  until,
  frame,
}: {
  punch: Props['punch'];
  layouts: GlyphLayout[];
  palette: Props['palette'];
  center: number;
  dotSize: number;
  until: number;
  frame: number;
}) => {
  if (frame < punch.start || frame >= until) {
    return null;
  }
  const index = Math.min(layouts.length - 1, Math.floor((frame - punch.start) / punch.wordFrames));
  const layout = layouts[index];
  if (layout === undefined) {
    return null;
  }
  const left = centeredLeft(layout, center);
  const primed = index === 0 && frame < punch.start + punch.primeFrames;
  const color = primed ? palette.muted : palette.ink;
  const dotX = periodCenter(layout, left);
  return (
    <g>
      <GlyphRow
        layout={layout}
        left={left}
        baseline={punch.baseline}
        fill={solid(color)}
        hidden={(glyph) => dotX !== undefined && glyph === layout.glyphs.length - 1}
      />
      {dotX === undefined ? null : (
        <circle
          cx={dotX}
          cy={punch.baseline - dotSize / 2}
          r={dotSize / 2}
          fill={primed ? palette.muted : palette.accent}
        />
      )}
    </g>
  );
};
