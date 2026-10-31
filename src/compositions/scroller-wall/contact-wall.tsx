import { type SVGProps, useId } from 'react';
import { Easing, useVideoConfig } from 'remotion';
import type { ScrollerWallProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { contactAnchors } from './dot-bridge';
import { wallFont } from './fonts';
import { maskIdFrom, maskShade } from './mask-shade';
import { Canvas } from './word-beats';

type BeatProps = { frame: number; props: ScrollerWallProps };

const spread = Easing.in(Easing.poly(1.5));

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const ringCount = (wall: ScrollerWallProps['wall']): number => Math.ceil(Math.round(wall.rows) / 2);

const wallRows = (wall: ScrollerWallProps['wall'], frame: number) => {
  const rings = ringCount(wall);
  const progress = spread(clamp01((frame - wall.at) / wall.spreadFrames)) * rings;
  return Array.from({ length: rings }, (_, index) => {
    const local = clamp01(progress - index);
    return {
      offset: wall.pitch * (index + smooth(local)),
      opacity: clamp01(local * 1.6),
    };
  }).filter((row) => row.opacity > 0);
};

export const ContactWall = ({ frame, props }: BeatProps) => {
  const { width, height } = useVideoConfig();
  const maskId = maskIdFrom('scroller-wall-outline', useId());
  const { look, contact, wall } = props;
  const { layout } = contactAnchors(props, width);
  const xs = layout.xs.map((x) => x.toFixed(2)).join(' ');
  const solid = 1 - tween(frame, [wall.washAt, wall.washAt + wall.washFrames], [0, 1], smooth);
  const rows = wallRows(wall, frame).flatMap((row) => [
    { y: contact.baselineY - row.offset, strength: row.opacity },
    { y: contact.baselineY + row.offset, strength: row.opacity },
  ]);
  const text = (y: number, key: string, style: SVGProps<SVGTextElement>) => (
    <text
      key={key}
      x={xs}
      y={y}
      fontFamily={wallFont}
      fontWeight={contact.weight}
      fontSize={contact.size}
      {...style}
    >
      {contact.text}
    </text>
  );
  return (
    <Canvas>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          {[...rows, { y: contact.baselineY, strength: 1 - solid }].map((row, index) =>
            text(row.y, `mask-${index.toString()}`, {
              fill: '#000000',
              stroke: maskShade(row.strength),
              strokeWidth: wall.outlineWidth * 2,
              strokeLinejoin: 'round',
              paintOrder: 'stroke',
            }),
          )}
        </mask>
      </defs>
      <rect width={width} height={height} fill={wall.outline} mask={`url(#${maskId})`} />
      {text(contact.baselineY, 'solid', { fill: look.ink, fillOpacity: solid })}
    </Canvas>
  );
};
