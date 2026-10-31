import type { ReactElement } from 'react';
import { random } from 'remotion';
import type { PageDesign, PrintedPage } from '@/schemas';

type DesignProps = {
  page: PrintedPage;
  width: number;
  height: number;
  seed: string;
};

const RAYS = 28;
const CONFETTI = 30;
const SPARKLES = 5;

const sparkle = (x: number, y: number, size: number): string => {
  const waist = size * 0.22;
  return `M${x} ${y - size} Q${x + waist} ${y - waist} ${x + size} ${y} Q${x + waist} ${y + waist} ${x} ${y + size} Q${x - waist} ${y + waist} ${x - size} ${y} Q${x - waist} ${y - waist} ${x} ${y - size} Z`;
};

const wedge = (inner: number, outer: number, from: number, to: number): string => {
  const point = (radius: number, angle: number) =>
    `${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`;
  return `M${point(inner, from)} L${point(outer, from)} L${point(outer, to)} L${point(inner, to)} Z`;
};

const Frame = ({ page, width, height }: DesignProps) => {
  const margin = width * 0.065;
  const gap = width * 0.018;
  const diamond = width * 0.016 * page.designScale;
  const corners = [
    [-width / 2 + margin, margin],
    [width / 2 - margin, margin],
    [-width / 2 + margin, height - margin],
    [width / 2 - margin, height - margin],
  ] as const;
  return (
    <g>
      <rect
        x={-width / 2 + margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        fill="none"
        stroke={page.accent}
        strokeWidth={3}
      />
      <rect
        x={-width / 2 + margin + gap}
        y={margin + gap}
        width={width - (margin + gap) * 2}
        height={height - (margin + gap) * 2}
        fill="none"
        stroke={page.accent}
        strokeWidth={1.2}
      />
      {corners.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x - diamond}
          y={y - diamond}
          width={diamond * 2}
          height={diamond * 2}
          transform={`rotate(45 ${x} ${y})`}
          fill={page.secondary}
        />
      ))}
      {[margin + gap * 3.2, height - margin - gap * 3.2].map((y) => (
        <g key={y}>
          <line
            x1={-width * 0.12}
            y1={y}
            x2={width * 0.12}
            y2={y}
            stroke={page.accent}
            strokeWidth={1.2}
          />
          <rect
            x={-diamond * 0.7}
            y={y - diamond * 0.7}
            width={diamond * 1.4}
            height={diamond * 1.4}
            transform={`rotate(45 0 ${y})`}
            fill={page.secondary}
          />
        </g>
      ))}
    </g>
  );
};

const Burst = ({ page, width, height, seed }: DesignProps) => {
  const centerY = height * page.textY;
  const inner = width * 0.2 * page.designScale;
  const outer = width * 1.1 * page.designScale;
  const step = (Math.PI * 2) / RAYS;
  return (
    <g>
      <g transform={`translate(0 ${centerY})`}>
        {Array.from({ length: RAYS / 2 }, (_ray, index) => (
          <path
            key={index}
            d={wedge(inner, outer, index * 2 * step, (index * 2 + 1) * step)}
            fill={page.accent}
          />
        ))}
      </g>
      {Array.from({ length: SPARKLES }, (_spark, index) => {
        const angle = random(`${seed}-spark-angle-${index}`) * Math.PI * 2;
        const radius = inner * (1.25 + random(`${seed}-spark-radius-${index}`) * 1.1);
        const size = width * (0.022 + random(`${seed}-spark-size-${index}`) * 0.02);
        return (
          <path
            key={index}
            d={sparkle(Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, size)}
            fill={page.secondary}
          />
        );
      })}
    </g>
  );
};

const Circle = ({ page, width, height }: DesignProps) => {
  const centerY = height * page.textY;
  const radius = width * 0.3 * page.designScale;
  const ring = radius * 1.2;
  const orbit = -Math.PI / 5;
  return (
    <g>
      <circle cx={0} cy={centerY} r={radius} fill={page.accent} />
      <circle
        cx={0}
        cy={centerY}
        r={ring}
        fill="none"
        stroke={page.secondary}
        strokeWidth={2}
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <circle
        cx={Math.cos(orbit) * ring}
        cy={centerY + Math.sin(orbit) * ring}
        r={radius * 0.07}
        fill={page.secondary}
      />
    </g>
  );
};

const confettiPiece = (kind: number, size: number, color: string) => {
  if (kind === 0) {
    return <circle r={size * 0.55} fill={color} />;
  }
  if (kind === 1) {
    return (
      <path
        d={`M0 ${-size * 0.65} L${size * 0.6} ${size * 0.45} L${-size * 0.6} ${size * 0.45} Z`}
        fill={color}
      />
    );
  }
  if (kind === 2) {
    return (
      <path
        d={`M${-size} 0 q${size / 2} ${-size * 0.7} ${size} 0 t${size} 0`}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.28}
        strokeLinecap="round"
      />
    );
  }
  return <rect x={-size * 0.5} y={-size * 0.18} width={size} height={size * 0.36} fill={color} />;
};

const Confetti = ({ page, width, height, seed }: DesignProps) => {
  const centerY = height * page.textY;
  return (
    <g>
      {Array.from({ length: CONFETTI }, (_piece, index) => {
        const x = (random(`${seed}-confetti-x-${index}`) - 0.5) * width * 0.9;
        const rawY = height * (0.05 + random(`${seed}-confetti-y-${index}`) * 0.9);
        const clear = height * 0.11;
        const crowding = Math.abs(rawY - centerY) < clear && Math.abs(x) < width * 0.36;
        const y = crowding ? rawY + Math.sign(rawY - centerY || 1) * clear * 1.6 : rawY;
        const size = width * (0.02 + random(`${seed}-confetti-size-${index}`) * 0.026);
        const turn = random(`${seed}-confetti-turn-${index}`) * 360;
        const kind = Math.floor(random(`${seed}-confetti-kind-${index}`) * 4);
        return (
          <g
            key={index}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${turn.toFixed(1)}) scale(${page.designScale})`}
          >
            {confettiPiece(kind, size, index % 2 === 0 ? page.accent : page.secondary)}
          </g>
        );
      })}
    </g>
  );
};

const HalftoneCorner = ({
  cornerX,
  cornerY,
  spacing,
  reach,
  color,
}: {
  cornerX: number;
  cornerY: number;
  spacing: number;
  reach: number;
  color: string;
}) => {
  const count = Math.ceil(reach / spacing);
  const dots: { x: number; y: number; r: number }[] = [];
  for (let row = 0; row <= count; row++) {
    for (let column = 0; column <= count; column++) {
      const dx = column * spacing;
      const dy = row * spacing;
      const fade = 1 - Math.hypot(dx, dy) / reach;
      if (fade > 0.04) {
        dots.push({
          x: cornerX + Math.sign(-cornerX) * dx,
          y: cornerY + (cornerY === 0 ? dy : -dy),
          r: spacing * 0.48 * fade,
        });
      }
    }
  }
  return (
    <g fill={color}>
      {dots.map((dot) => (
        <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} />
      ))}
    </g>
  );
};

const Halftone = ({ page, width, height }: DesignProps) => {
  const spacing = width * 0.034;
  const reach = width * 0.62 * page.designScale;
  return (
    <g>
      <HalftoneCorner
        cornerX={width / 2}
        cornerY={0}
        spacing={spacing}
        reach={reach}
        color={page.accent}
      />
      <HalftoneCorner
        cornerX={-width / 2}
        cornerY={height}
        spacing={spacing}
        reach={reach}
        color={page.secondary}
      />
    </g>
  );
};

const DESIGNS: Record<Exclude<PageDesign, 'none'>, (props: DesignProps) => ReactElement> = {
  frame: Frame,
  burst: Burst,
  circle: Circle,
  confetti: Confetti,
  halftone: Halftone,
};

export const PageDesignArt = (props: DesignProps) => {
  if (props.page.design === 'none') {
    return null;
  }
  const Design = DESIGNS[props.page.design];
  return <Design {...props} />;
};
