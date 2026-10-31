import { type ReactNode, useId } from 'react';
import type { BurningPaperRevealProps } from '@/schemas';
import { type BurnCues, edgeXAt, paperToScreen } from './burn-cues';
import { svgId } from './color';

export const HeatShimmer = ({
  props,
  cues,
  children,
}: {
  props: BurningPaperRevealProps;
  cues: BurnCues;
  children: ReactNode;
}) => {
  const id = svgId(useId());
  const { flame, paper } = props;
  const amount = flame.shimmer * cues.strength;
  if (amount <= 0.01) {
    return null;
  }
  const root = paperToScreen(props, cues, edgeXAt(cues.edge, 0, paper.width) + 20, 0);
  const rise = flame.height * cues.zoom;
  const cx = root.x + 20 * cues.zoom;
  const cy = root.y - rise * 0.95;
  const rx = (flame.width * 4 + 120) * cues.zoom;
  const ry = rise * 1.15;
  const scroll = cues.frame * 6 * flame.speed;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-fade`} cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-fade)`} />
        </mask>
        <filter
          id={`${id}-heat`}
          filterUnits="userSpaceOnUse"
          x={cx - rx - 40}
          y={cy - ry - 40 + scroll}
          width={rx * 2 + 80}
          height={ry * 2 + 80}
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.034" numOctaves={2} seed={5} />
          <feDisplacementMap
            in="SourceGraphic"
            scale={30 * amount * cues.zoom}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <g transform={`translate(0 ${(-scroll).toFixed(2)})`}>
          <g filter={`url(#${id}-heat)`}>
            <g transform={`translate(0 ${scroll.toFixed(2)})`}>{children}</g>
          </g>
        </g>
      </g>
    </g>
  );
};
