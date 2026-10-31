import { type SVGProps, useId } from 'react';
import { useVideoConfig } from 'remotion';
import type { ScrollerWallProps } from '@/schemas';
import { fontSpec, wallFont } from './fonts';
import { maskIdFrom, maskShade } from './mask-shade';
import { measureText } from './measure';
import { impact, landingFrames, type SquarePose, squarePose } from './square-path';

const FILL_FRAMES = 1.5;

const SquareBlock = ({
  pose,
  previous,
  square,
}: {
  pose: SquarePose;
  previous: SquarePose;
  square: ScrollerWallProps['square'];
}) => {
  const size = square.size;
  const smear = Math.min(size * 0.9, Math.abs(pose.y - previous.y) * square.blur);
  const squared = Math.abs(pose.angle - Math.round(pose.angle / 90) * 90) < 1;
  const soft = squared && smear > 2 ? smear : 0;
  const height = size + soft;
  const background =
    soft > 0
      ? `linear-gradient(to bottom, transparent 0px, ${square.color} ${soft}px, ${square.color} ${height - soft}px, transparent ${height}px)`
      : square.color;
  return (
    <div
      style={{
        position: 'absolute',
        left: pose.x - size / 2,
        top: pose.y - height / 2,
        width: size,
        height,
        background,
        borderRadius: size * square.radius,
        transform: soft > 0 ? undefined : `rotate(${pose.angle.toFixed(3)}deg)`,
      }}
    />
  );
};

export const HeyIntro = ({ frame, props }: { frame: number; props: ScrollerWallProps }) => {
  const { width, height } = useVideoConfig();
  const { look, intro, square } = props;
  const box = measureText(intro.word, fontSpec(look, intro.size));
  const left = width / 2 + intro.offsetX - box.width / 2;
  const glyphs = box.glyphs.filter((glyph) => glyph.char.trim() !== '');
  const targets = glyphs.map((glyph) => ({
    x: left + glyph.left + glyph.width / 2,
    top: intro.baselineY - glyph.ascent,
  }));
  const lands = landingFrames(square, glyphs.length);
  const beforeCut = frame < intro.cutAt;
  const pose = squarePose(frame, square, targets);
  const previous = squarePose(frame - 1, square, targets);
  const maskId = maskIdFrom('scroller-wall-hey', useId());
  const letters = glyphs.map((glyph, index) => {
    const land = lands[index] ?? 0;
    const dip = beforeCut ? impact(frame, land) * square.dip : 0;
    return {
      glyph,
      filled: beforeCut ? Math.min(1, Math.max(0, (frame - land + 1) / FILL_FRAMES)) : 1,
      squash: glyph.ascent > 0 ? Math.max(0.2, 1 - dip / glyph.ascent) : 1,
    };
  });
  const letter = (
    { glyph, squash }: (typeof letters)[number],
    index: number,
    style: SVGProps<SVGTextElement>,
  ) => (
    <text
      key={`${index.toString()}-${glyph.char}`}
      x={left + glyph.left}
      y={intro.baselineY}
      transform={`translate(0 ${intro.baselineY}) scale(1 ${squash.toFixed(4)}) translate(0 ${-intro.baselineY})`}
      fontFamily={wallFont}
      fontWeight={look.weight}
      fontSize={intro.size}
      {...style}
    >
      {glyph.char}
    </text>
  );
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            {letters.map((item, index) =>
              letter(item, index, {
                fill: '#000000',
                stroke: maskShade(1 - item.filled),
                strokeWidth: intro.outlineWidth * 2,
                strokeLinejoin: 'round',
                paintOrder: 'stroke',
              }),
            )}
          </mask>
        </defs>
        <rect width={width} height={height} fill={intro.outline} mask={`url(#${maskId})`} />
        {letters.map((item, index) =>
          letter(item, index, { fill: look.ink, fillOpacity: item.filled }),
        )}
      </svg>
      {beforeCut ? <SquareBlock pose={pose} previous={previous} square={square} /> : null}
    </>
  );
};
