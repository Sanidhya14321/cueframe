import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ScrollerCalloutProps } from '@/schemas';
import { type CubeStop, cornerRadius, cubePose, fillTime } from './cube-path';
import { type GlyphLayout, GlyphRow } from './glyphs';

type Palette = ScrollerCalloutProps['palette'];
type Intro = ScrollerCalloutProps['intro'];

const Cube = ({
  intro,
  stops,
  rest,
  color,
  frame,
}: {
  intro: Intro;
  stops: CubeStop[];
  rest: number;
  color: string;
  frame: number;
}) => {
  const samples = Math.max(1, Math.round(intro.motionBlur));
  const shutter = intro.shutterAngle / 360;
  const half = intro.cubeSize / 2;
  const corner = cornerRadius(intro);
  const poses = Array.from({ length: samples }, (_, index) => {
    const time = frame + shutter * ((index + 0.5) / samples - 0.5);
    return { time, ...cubePose(intro, stops, rest, time) };
  });
  if (poses.every((pose) => !pose.visible)) {
    return null;
  }
  return (
    <g style={{ isolation: 'isolate' }}>
      {poses.map((pose) =>
        pose.visible ? (
          <rect
            key={pose.time.toFixed(4)}
            x={-half}
            y={-half}
            width={intro.cubeSize}
            height={intro.cubeSize}
            rx={corner}
            fill={color}
            opacity={1 / samples}
            style={{ mixBlendMode: 'plus-lighter' }}
            transform={`translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.angle.toFixed(3)})`}
          />
        ) : null,
      )}
    </g>
  );
};

export const CubeIntro = ({
  intro,
  palette,
  layout,
  stops,
  left,
  speed,
}: {
  intro: Intro;
  palette: Palette;
  layout: GlyphLayout;
  stops: CubeStop[];
  left: number;
  speed: number;
}) => {
  const frame = useCurrentFrame() * speed;
  const { width, height } = useVideoConfig();
  const letterStop: (CubeStop | undefined)[] = [];
  let next = 0;
  for (const glyph of layout.glyphs) {
    letterStop.push(glyph.char.trim() === '' ? undefined : stops[next++]);
  }
  const filled = (index: number) => {
    const stop = letterStop[index];
    return stop !== undefined && frame >= fillTime(intro, stop);
  };
  const rest = intro.baseline - layout.capHeight;
  return (
    <AbsoluteFill>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <GlyphRow
          layout={layout}
          left={left}
          baseline={intro.baseline}
          fill={(index) => (filled(index) ? palette.ink : 'none')}
          stroke={(index) => (filled(index) ? 'none' : palette.outline)}
          strokeWidth={intro.outlineWidth}
        />
        <Cube intro={intro} stops={stops} rest={rest} color={palette.accent} frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};
