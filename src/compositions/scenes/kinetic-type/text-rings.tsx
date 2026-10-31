import { useId } from 'react';
import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type PromoLook,
  type TextRingsProps,
  textRingsDefaults,
  textRingsMeta,
  textRingsSchema,
} from '@/schemas';
import { kineticFont } from '../../promo/fonts';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';
import { CenterMark } from '../../text-rings/center-mark';
import { ringField, ringPath } from '../../text-rings/ring-layout';

const lightLook = (look: PromoLook, light: TextRingsProps['light']): PromoLook => ({
  ...look,
  background: light.page,
  backgroundEdge: light.page,
  ink: light.ink,
  accent: light.ink,
});

const TextRings = (props: TextRingsProps) => {
  const { words, rings, mark, motion } = props;
  const look = props.inverted ? lightLook(props.look, props.light) : props.look;
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const pathId = `text-ring-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const field = ringField(props, frame, Math.hypot(width / 2, height / 2));
  const separator = words.separator.trim();
  return (
    <PromoLayer look={look} motion={motion}>
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <defs>
          {field.map((ring) => (
            <path key={ring.index} id={`${pathId}-${ring.index}`} d={ringPath(ring.radius)} />
          ))}
        </defs>
        {field.map((ring) => (
          <g
            key={ring.index}
            transform={`rotate(${ring.angle.toFixed(4)})`}
            opacity={ring.opacity}
            fill={look.ink}
            fontFamily={kineticFont}
            fontWeight={ring.weight}
            fontSize={ring.size.toFixed(3)}
          >
            {ring.words.map((word) => (
              <text key={word.slot} textAnchor="middle" dominantBaseline="central">
                <textPath
                  href={`#${pathId}-${ring.index}`}
                  startOffset={word.offset.toFixed(3)}
                  textLength={word.length.toFixed(3)}
                  lengthAdjust="spacing"
                >
                  {words.text.trim()}
                </textPath>
              </text>
            ))}
            {ring.separators.map(({ slot, offset }) => (
              <text key={`s${slot}`} textAnchor="middle" dominantBaseline="central">
                <textPath href={`#${pathId}-${ring.index}`} startOffset={offset.toFixed(3)}>
                  {separator}
                </textPath>
              </text>
            ))}
          </g>
        ))}
        <CenterMark mark={mark} frame={frame} shrinkAt={rings.firstAt} color={look.accent} />
      </svg>
    </PromoLayer>
  );
};

export const textRingsScene: SceneModule = {
  id: 'text-rings',
  component: TextRings,
  render: (key) => (
    <Composition
      key={key}
      id="text-rings"
      component={TextRings}
      schema={textRingsSchema}
      defaultProps={textRingsDefaults}
      durationInFrames={textRingsMeta.durationInFrames}
      fps={textRingsMeta.fps}
      width={textRingsMeta.width}
      height={textRingsMeta.height}
    />
  ),
};
