'use client';

import { Line, Rect } from 'react-konva';
import type { Box } from '@/design';

export const ACCENT = '#8b5cf6';

export interface Guides {
  vertical: number | null;
  horizontal: number | null;
}

export const NO_GUIDES: Guides = { vertical: null, horizontal: null };

interface WorkspaceOverlaysProps {
  grid: { width: number; height: number } | null;
  hoverBox: Box | null;
  guides: Guides;
  marquee: Box | null;
  zoom: number;
}

const GridLines = ({ width, height, zoom }: { width: number; height: number; zoom: number }) => {
  const spacing = Math.max(10, Math.round(Math.min(width, height) / 18));
  const columns = Math.floor(width / spacing);
  const rows = Math.floor(height / spacing);
  return (
    <>
      {Array.from({ length: columns }, (_, index) => (
        <Line
          key={`v${index}`}
          points={[(index + 1) * spacing, 0, (index + 1) * spacing, height]}
          stroke={index % 3 === 2 ? 'rgba(139,92,246,0.45)' : 'rgba(139,92,246,0.18)'}
          strokeWidth={1 / zoom}
          listening={false}
        />
      ))}
      {Array.from({ length: rows }, (_, index) => (
        <Line
          key={`h${index}`}
          points={[0, (index + 1) * spacing, width, (index + 1) * spacing]}
          stroke={index % 3 === 2 ? 'rgba(139,92,246,0.45)' : 'rgba(139,92,246,0.18)'}
          strokeWidth={1 / zoom}
          listening={false}
        />
      ))}
    </>
  );
};

export const WorkspaceOverlays = ({
  grid,
  hoverBox,
  guides,
  marquee,
  zoom,
}: WorkspaceOverlaysProps) => (
  <>
    {grid === null ? null : <GridLines width={grid.width} height={grid.height} zoom={zoom} />}
    {hoverBox === null ? null : (
      <Rect {...hoverBox} stroke={ACCENT} strokeWidth={1.5 / zoom} listening={false} />
    )}
    {guides.vertical === null ? null : (
      <Line
        points={[guides.vertical, -10000, guides.vertical, 10000]}
        stroke="#ec4899"
        strokeWidth={1 / zoom}
        dash={[4 / zoom, 4 / zoom]}
        listening={false}
      />
    )}
    {guides.horizontal === null ? null : (
      <Line
        points={[-10000, guides.horizontal, 10000, guides.horizontal]}
        stroke="#ec4899"
        strokeWidth={1 / zoom}
        dash={[4 / zoom, 4 / zoom]}
        listening={false}
      />
    )}
    {marquee === null ? null : (
      <Rect
        {...marquee}
        fill="rgba(139,92,246,0.08)"
        stroke={ACCENT}
        strokeWidth={1 / zoom}
        listening={false}
      />
    )}
  </>
);
