import { AbsoluteFill, random } from 'remotion';
import type { SpiderWebServicesProps } from '@/schemas';
import { easedGradient } from '../promo/backdrop';

const GLOW_PARALLAX = 0.32;

const GRID_PARALLAX = 0.5;

type Glow = {
  x: number;
  y: number;
  width: number;
  height: number;
  strength: number;
  phase: number;
};

const glowsFor = (index: number, distance: number): Glow[] =>
  [0, 1, 2, 3].map((slot) => {
    const key = `web-glow-${index}-${slot}`;
    const left = slot % 2 === 0;
    return {
      x: left ? -40 + random(`${key}-x`) * 160 : 940 + random(`${key}-x`) * 180,
      y: (index * distance + random(`${key}-y`) * distance) * GLOW_PARALLAX,
      width: 360 + random(`${key}-w`) * 260,
      height: 520 + random(`${key}-h`) * 520,
      strength: 0.6 + random(`${key}-s`) * 0.4,
      phase: random(`${key}-p`) * Math.PI * 2,
    };
  });

export const WebBackdrop = ({
  backdrop,
  camera,
  blur,
  beats,
  distance,
  floorY,
  frame,
}: {
  backdrop: SpiderWebServicesProps['backdrop'];
  camera: number;
  blur: number;
  beats: number;
  distance: number;
  floorY: number;
  frame: number;
}) => {
  const shift = camera * GLOW_PARALLAX;
  const glows = Array.from({ length: beats + 2 }, (_, index) => glowsFor(index, distance)).flat();
  const introGlow = Math.max(0, 1 - camera / 1400);
  const gridOffset = -((camera * GRID_PARALLAX) % backdrop.gridSpacing);
  const softBlur = blur * 0.35;
  return (
    <AbsoluteFill style={{ background: backdrop.base, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          opacity: introGlow,
          background: `radial-gradient(75% 30% at 50% 0%, ${easedGradient(backdrop.top, 'transparent')})`,
        }}
      />
      <AbsoluteFill style={{ filter: softBlur > 0.05 ? `blur(${softBlur}px)` : undefined }}>
        {glows.map((glow) => {
          const top = glow.y - shift + Math.cos(frame / 52 + glow.phase) * 26;
          if (top > 2400 || top + glow.height < -600) {
            return null;
          }
          return (
            <div
              key={`${glow.x}-${glow.y}`}
              style={{
                position: 'absolute',
                left: glow.x - glow.width / 2 + Math.sin(frame / 38 + glow.phase) * 34,
                top,
                width: glow.width,
                height: glow.height,
                opacity: glow.strength * backdrop.glowStrength,
                background: `radial-gradient(50% 50% at 50% 50%, ${easedGradient(backdrop.glow, 'transparent')})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: backdrop.gridOpacity,
          backgroundImage: `radial-gradient(circle at center, ${backdrop.grid} 1.6px, transparent 2.4px)`,
          backgroundSize: `${backdrop.gridSpacing}px ${backdrop.gridSpacing}px`,
          backgroundPosition: `${backdrop.gridSpacing / 2}px ${gridOffset}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floorY - 30,
          height: 2400,
          background: `linear-gradient(to bottom, transparent 0px, ${backdrop.floor} 30px, ${backdrop.floor} 900px, ${backdrop.floorEdge} 1900px)`,
        }}
      />
    </AbsoluteFill>
  );
};
