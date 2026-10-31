import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

const GHOST_GAP = 14;

const MAX_GHOSTS = 7;

export const Smear = ({
  velocity,
  shutter,
  children,
}: {
  velocity: number;
  shutter: number;
  children: ReactNode;
}) => {
  const spread = Math.abs(velocity) * shutter;
  if (spread < 2) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const ghosts = Math.min(MAX_GHOSTS, Math.max(2, Math.ceil(spread / GHOST_GAP) + 1));
  const step = spread / (ghosts - 1);
  const direction = Math.sign(velocity);
  return (
    <AbsoluteFill
      style={{
        filter: `blur(${(Math.min(30, step * 0.8 + spread * 0.03) * Math.min(1, spread / 60)).toFixed(2)}px)`,
      }}
    >
      {Array.from({ length: ghosts }, (_, index) => (
        <AbsoluteFill
          key={index}
          style={{
            transform: `translateY(${(direction * (index * step - spread / 2)).toFixed(2)}px)`,
            opacity: 1 / (index + 1),
          }}
        >
          {children}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
