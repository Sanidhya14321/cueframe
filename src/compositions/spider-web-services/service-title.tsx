import { useId } from 'react';
import type { SpiderWebServicesProps } from '@/schemas';
import { titleFont } from './fonts';

const ADVANCE: Record<string, number> = {
  A: 0.8,
  B: 0.75,
  C: 0.74,
  D: 0.8,
  E: 0.67,
  F: 0.63,
  G: 0.79,
  H: 0.82,
  I: 0.33,
  J: 0.58,
  K: 0.76,
  L: 0.61,
  M: 0.95,
  N: 0.82,
  O: 0.84,
  P: 0.72,
  Q: 0.84,
  R: 0.74,
  S: 0.67,
  T: 0.66,
  U: 0.8,
  V: 0.78,
  W: 1.12,
  X: 0.76,
  Y: 0.72,
  Z: 0.68,
  ' ': 0.28,
  '/': 0.46,
};

const ems = (line: string): number =>
  [...line.toUpperCase()].reduce((total, char) => total + (ADVANCE[char] ?? 0.66), 0);

const LINE_GAP = 0.04;

const GLINT_BAND = 150;

export type TitleLine = { text: string; size: number; baseline: number; length: number };

const layoutTitle = (lines: string, width: number): TitleLine[] => {
  let cursor = 0;
  let cap = width * 0.42;
  return lines
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const span = Math.max(1, ems(line));
      const size = Math.min(width / span, cap);
      cap = Math.min(cap, size * 1.04);
      cursor += size * 0.74;
      const layout = {
        text: line.trim().toUpperCase(),
        size,
        baseline: cursor,
        length: Math.min(width, size * span),
      };
      cursor += size * LINE_GAP + size * 0.12;
      return layout;
    });
};

export const ServiceTitle = ({
  lines,
  title,
  tilt,
  turn,
  lean,
  glint,
}: {
  lines: string;
  title: SpiderWebServicesProps['title'];
  tilt: number;
  turn: number;
  lean: number;
  glint: number;
}) => {
  const id = useId().replaceAll(':', '');
  const layout = layoutTitle(lines, title.width);
  const last = layout.at(-1);
  const height = (last?.baseline ?? 0) + (last?.size ?? 0) * 0.08 + title.depth + 12;
  const pad = title.depth + 12;
  const layers = Array.from({ length: title.depth }, (_, index) => title.depth - index);
  const sweepStart = -pad - GLINT_BAND * 2;
  const sweepEnd = title.width + pad + height / 2 + GLINT_BAND * 2;
  const sweep = sweepStart + glint * (sweepEnd - sweepStart);
  const shining = glint > 0 && glint < 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: -title.width / 2 - pad,
        top: -height / 2,
        width: title.width + pad * 2,
        height,
        transform: `perspective(1600px) rotateX(${lean}deg) rotateY(${turn}deg) rotateZ(${tilt}deg)`,
      }}
    >
      <svg
        width={title.width + pad * 2}
        height={height}
        viewBox={`${-pad} 0 ${title.width + pad * 2} ${height}`}
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${id}-face`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={title.face} />
            <stop offset="1" stopColor={title.faceShade} />
          </linearGradient>
          <linearGradient
            id={`${id}-glint`}
            gradientUnits="userSpaceOnUse"
            x1={sweep - GLINT_BAND}
            y1={-GLINT_BAND * 0.5}
            x2={sweep + GLINT_BAND}
            y2={GLINT_BAND * 0.5}
          >
            <stop offset="0" stopColor={title.glint} stopOpacity={0} />
            <stop offset="0.5" stopColor={title.glint} stopOpacity={0.85} />
            <stop offset="1" stopColor={title.glint} stopOpacity={0} />
          </linearGradient>
        </defs>
        {layout.map((line) => (
          <g key={line.text} fontFamily={titleFont} fontWeight={800} fontSize={line.size}>
            {layers.map((layer) => (
              <text
                key={layer}
                x={(title.width - line.length) / 2 + layer * 0.35}
                y={line.baseline + layer}
                textLength={line.length}
                lengthAdjust="spacing"
                style={{
                  fill: `color-mix(in oklab, ${title.side}, ${title.sideShade} ${Math.round((layer / Math.max(1, title.depth)) * 100)}%)`,
                }}
              >
                {line.text}
              </text>
            ))}
            <text
              x={(title.width - line.length) / 2}
              y={line.baseline}
              textLength={line.length}
              lengthAdjust="spacing"
              fill={`url(#${id}-face)`}
              stroke={title.face}
              strokeOpacity={0.5}
              strokeWidth={1}
            >
              {line.text}
            </text>
            {shining ? (
              <text
                x={(title.width - line.length) / 2}
                y={line.baseline}
                textLength={line.length}
                lengthAdjust="spacing"
                fill={`url(#${id}-glint)`}
              >
                {line.text}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
};
