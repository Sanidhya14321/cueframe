import type { ThreadWeb } from '@/schemas';
import { mixHex, withAlpha } from './color';

const OVERSCAN = 260;

const GLINT = 180;

export const Thread = ({
  top,
  bottom,
  height,
  frame,
  tip,
  since,
  web,
}: {
  top: number;
  bottom: number;
  height: number;
  frame: number;
  tip: boolean;
  since: number;
  web: ThreadWeb;
}) => {
  const from = Math.max(-OVERSCAN, top);
  const to = Math.min(height + OVERSCAN, bottom);
  if (to <= from) {
    return null;
  }
  const shine = mixHex(web.silk, '#ffffff', 0.75);
  const width = web.threadWidth;
  const glow = width * 6;
  const cycle = height + GLINT * 2;
  const glints = tip
    ? [bottom - GLINT * 0.8]
    : [0, 0.5]
        .map((offset) => (frame - since) * 26 - cycle * offset)
        .filter((travel) => travel >= 0)
        .map((travel) => (travel % cycle) - GLINT);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: web.threadX - glow / 2,
          top: from,
          width: glow,
          height: to - from,
          background: `linear-gradient(90deg, ${withAlpha(web.silk, 0)} 0%, ${withAlpha(web.silk, 0.16)} 50%, ${withAlpha(web.silk, 0)} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: web.threadX - width / 2,
          top: from,
          width,
          height: to - from,
          background: `linear-gradient(90deg, ${withAlpha(web.silk, 0.55)} 0%, ${shine} 50%, ${withAlpha(web.silk, 0.55)} 100%)`,
        }}
      />
      {web.glint
        ? glints.map((glintY) => {
            const glintFrom = Math.max(from, glintY);
            const glintTo = Math.min(to, glintY + GLINT);
            return glintTo > glintFrom ? (
              <div
                key={glintY.toFixed(1)}
                style={{
                  position: 'absolute',
                  left: web.threadX - glow / 2,
                  top: glintY,
                  width: glow,
                  height: GLINT,
                  background: `linear-gradient(180deg, ${withAlpha(shine, 0)} 0%, ${withAlpha(shine, 0.9)} 70%, ${withAlpha(shine, 0)} 100%)`,
                  clipPath: `inset(${(glintFrom - glintY).toFixed(1)}px 0 ${(glintY + GLINT - glintTo).toFixed(1)}px 0)`,
                }}
              />
            ) : null;
          })
        : null}
    </>
  );
};
