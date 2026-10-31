import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { keyed } from './beat';
import { BeamTexture, WebsitePanel } from './website-panel';

const REFERENCE_START = 172;
const REFERENCE_END = 470;

type BandKey = readonly [number, number, number, number, number, number];

const UPPER_BAND: readonly BandKey[] = [
  [228, 580, 640, -0.3, 0.15, 0],
  [236, 580, 660, -0.3, 0.2, 0.55],
  [250, 575, 770, -0.3, 0.45, 0.9],
  [290, 541, 860, -0.2, 0.8, 1],
  [330, 487, 790, 0.05, 1.3, 1],
  [345, 450, 780, 0.35, 1.3, 1],
  [352, 433, 770, 0.55, 1.3, 0.8],
  [378, 420, 700, 0.95, 1.3, 0],
];

const LOWER_BAND: readonly BandKey[] = [
  [286, 1095, 1200, -0.3, 0.05, 0],
  [292, 1095, 1260, -0.3, 0.15, 0.4],
  [302, 1095, 1400, -0.3, 0.45, 1],
  [340, 1115, 1453, -0.2, 0.75, 1],
  [352, 1122, 1480, -0.1, 1.3, 1],
  [370, 1135, 1541, 0, 1.3, 1],
  [400, 1142, 1615, 0.3, 1.3, 1],
  [420, 1200, 1650, 0.5, 1.3, 1],
  [440, 1311, 1690, 0.65, 1.3, 0.9],
  [460, 1600, 1750, 0.9, 1.3, 0.6],
  [470, 1700, 1780, 1.1, 1.3, 0],
];

const CONE: readonly (readonly [number, number])[] = [
  [172, 0],
  [200, 520],
  [250, 1000],
  [300, 1150],
  [340, 1100],
  [352, 900],
];

const CONE_LEVEL: readonly (readonly [number, number])[] = [
  [172, 0],
  [186, 0.5],
  [230, 1],
  [336, 1],
  [352, 0],
];

type Band = { top: number; bottom: number; from: number; to: number; level: number };

const sampleBand = (frame: number, keys: readonly BandKey[]): Band => {
  const pick = (column: number) =>
    keyed(
      frame,
      keys.map((key) => [key[0], key[column] ?? 0] as const),
    );
  return { top: pick(1), bottom: pick(2), from: pick(3), to: pick(4), level: pick(5) };
};

const bandMask = (band: Band): CSSProperties => {
  const height = 1920;
  const top = (band.top / height) * 100;
  const bottom = (band.bottom / height) * 100;
  const body = top + (bottom - top) * 0.55;
  const vertical = `linear-gradient(180deg, transparent ${(top - 0.15).toFixed(3)}%, #000 ${top.toFixed(3)}%, #000 ${body.toFixed(3)}%, transparent ${bottom.toFixed(3)}%)`;
  const soft = 22;
  const from = band.from * 100;
  const to = band.to * 100;
  const horizontal = `linear-gradient(90deg, transparent ${from.toFixed(2)}%, #000 ${(from + soft).toFixed(2)}%, #000 ${(to - soft).toFixed(2)}%, transparent ${to.toFixed(2)}%)`;
  const image = `${vertical}, ${horizontal}`;
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
  };
};

export const LightWall = ({
  frame,
  start,
  end,
  wall,
  accent,
}: {
  frame: number;
  start: number;
  end: number;
  wall: GoingLiveTeaserProps['wall'];
  accent: string;
}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const local =
    REFERENCE_START + ((frame - start) * (REFERENCE_END - REFERENCE_START)) / (end - start);
  const radius = keyed(local, CONE) * wall.coneSize;
  const coneLevel = keyed(local, CONE_LEVEL);
  const upper = sampleBand(local, UPPER_BAND);
  const lower = sampleBand(local, LOWER_BAND);
  const spillY = lower.bottom + 240;
  const spillX = 540 + (lower.from + lower.to - 1.2) * 300;
  const coneMask = `radial-gradient(ellipse ${radius.toFixed(1)}px ${(radius * 0.78).toFixed(1)}px at 0px 0px, rgba(0,0,0,${coneLevel.toFixed(3)}) 0%, rgba(0,0,0,${(coneLevel * 0.55).toFixed(3)}) 50%, transparent 100%)`;
  const spillMask = `radial-gradient(ellipse 760px 420px at ${spillX.toFixed(1)}px ${spillY.toFixed(1)}px, rgba(0,0,0,${(lower.level * 0.75).toFixed(3)}) 0%, transparent 100%)`;
  const panelMask = `${coneMask}, ${spillMask}`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ maskImage: panelMask, WebkitMaskImage: panelMask }}>
        <WebsitePanel wall={wall} accent={accent} />
      </AbsoluteFill>
      {[upper, lower].map((band, index) =>
        band.level > 0.001 ? (
          <AbsoluteFill
            key={index === 0 ? 'upper' : 'lower'}
            style={{
              opacity: Math.min(1, band.level * wall.beamBrightness),
              transform: 'rotate(-3deg) scale(1.08)',
            }}
          >
            <AbsoluteFill style={bandMask(band)}>
              <BeamTexture wall={wall} />
            </AbsoluteFill>
          </AbsoluteFill>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
