import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type OutlineMarqueeProps,
  outlineMarqueeDefaults,
  outlineMarqueeMeta,
  outlineMarqueeSchema,
} from '@/schemas';
import { displayType, KineticLayer } from '../../promo/kinetic';
import { land, settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const OutlineMarquee = ({
  text,
  label,
  rows,
  size,
  rowSpacing,
  weight,
  tracking,
  stroke,
  outlineOpacity,
  outlineColor,
  speed,
  reverse,
  repeats,
  repeatGap,
  labelSize,
  labelTracking,
  labelWeight,
  delay,
  rowStagger,
  labelDelay,
  placement,
  look,
  motion,
}: OutlineMarqueeProps) => {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame * motion.speed;
  const pitch = size * rowSpacing;
  const filterId = `outline-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const travel = Math.round(rawFrame * speed);
  const band = (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={filterId} x="-2%" y="-10%" width="104%" height="120%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={stroke} result="grown" />
          <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
          <feFlood floodColor={outlineColor} floodOpacity={outlineOpacity} />
          <feComposite in2="ring" operator="in" />
        </filter>
      </svg>
      {Array.from({ length: rows }, (_, row) => {
        const direction = (row % 2 === 0) === reverse ? 1 : -1;
        const start = delay + row * rowStagger;
        return (
          <div
            key={row}
            style={{
              ...displayType(size, weight, tracking),
              height: pitch,
              lineHeight: `${pitch}px`,
              color: outlineColor,
              wordSpacing: '0.2em',
              opacity: tween(frame, [start, start + 18], [0, 1], settle),
              transform: `translateX(${direction * travel + (direction > 0 ? -size * 2 : 0)}px)`,
            }}
          >
            {[...new Array(repeats).keys()].map((copy) => (
              <span
                key={copy}
                style={{
                  filter: `url(#${filterId})`,
                  display: 'inline-block',
                  paddingRight: `${repeatGap}em`,
                }}
              >
                {text}
              </span>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
  const labelStart = delay + labelDelay;
  const rise = land(frame, [labelStart, labelStart + 22], [labelSize * 0.45, 0]);
  return (
    <KineticLayer look={look} motion={motion} placement={placement} stage={band}>
      <div
        style={{
          ...displayType(labelSize, labelWeight, labelTracking),
          color: look.ink,
          opacity: tween(frame, [labelStart, labelStart + 14], [0, 1], settle),
          transform: `translateY(${rise.toFixed(2)}px)`,
          textShadow: `0 0 ${labelSize * 0.6}px ${look.background}`,
        }}
      >
        {label}
      </div>
    </KineticLayer>
  );
};

export const outlineMarqueeScene: SceneModule = {
  id: 'outline-marquee',
  component: OutlineMarquee,
  render: (key) => (
    <Composition
      key={key}
      id="outline-marquee"
      component={OutlineMarquee}
      schema={outlineMarqueeSchema}
      defaultProps={outlineMarqueeDefaults}
      durationInFrames={outlineMarqueeMeta.durationInFrames}
      fps={outlineMarqueeMeta.fps}
      width={outlineMarqueeMeta.width}
      height={outlineMarqueeMeta.height}
    />
  ),
};
