import { AbsoluteFill, random } from 'remotion';
import { easedGradient } from './backdrop';
import { withAlpha } from './glow';

export interface FilmSettings {
  color: string;
  dust: number;
  hairs: number;
  scratches: number;
  vignette: number;
  gateFrames: number;
  seed: number;
}

const DUST_SLOTS = 36;
const HAIR_SLOTS = 24;
const SCRATCH_SLOTS = 3;

const hairPath = (key: string, x: number, y: number): string => {
  const length = 26 + random(`${key}-len`) * 54;
  const angle = random(`${key}-angle`) * Math.PI * 2;
  const bend = (random(`${key}-bend`) - 0.5) * length * 1.4;
  const dx = Math.cos(angle) * length;
  const dy = Math.sin(angle) * length;
  const nx = -Math.sin(angle) * bend;
  const ny = Math.cos(angle) * bend;
  return `M${x.toFixed(1)} ${y.toFixed(1)} c ${(dx * 0.3 + nx).toFixed(1)} ${(dy * 0.3 + ny).toFixed(1)}, ${(dx * 0.7 - nx).toFixed(1)} ${(dy * 0.7 - ny).toFixed(1)}, ${dx.toFixed(1)} ${dy.toFixed(1)}`;
};

const lifeEnvelope = (
  frame: number,
  hold: number,
  offset: number,
): { cycle: number; fade: number } => {
  const shifted = frame + offset * hold;
  const cycle = Math.floor(shifted / hold);
  const phase = (shifted - cycle * hold) / hold;
  return { cycle, fade: Math.sin(phase * Math.PI) ** 2 };
};

export const filmMarks = (
  { dust, hairs, scratches, gateFrames, seed }: FilmSettings,
  frame: number,
  width: number,
  height: number,
) => {
  const gate = Math.max(1, gateFrames);
  const specks = Array.from({ length: DUST_SLOTS }, (_, index) => {
    const { cycle, fade } = lifeEnvelope(frame, gate * 3, index / DUST_SLOTS);
    const key = `film-${seed}-dust-${cycle}-${index}`;
    return {
      index,
      show: random(`${key}-on`) < dust * 0.5,
      x: random(`${key}-x`) * width,
      y: random(`${key}-y`) * height,
      r: 0.8 + random(`${key}-r`) ** 3 * 2.6,
      alpha: (0.45 + random(`${key}-a`) * 0.45) * fade,
    };
  }).filter((speck) => speck.show);
  const strands = Array.from({ length: HAIR_SLOTS }, (_, index) => {
    const { cycle, fade } = lifeEnvelope(frame, gate * (8 + index * 2), index / HAIR_SLOTS);
    const key = `film-${seed}-hair-${cycle}-${index}`;
    return {
      index,
      show: random(`${key}-on`) < hairs * 0.6,
      d: hairPath(key, random(`${key}-x`) * width, random(`${key}-y`) * height),
      alpha: (0.5 + random(`${key}-a`) * 0.4) * fade,
    };
  }).filter((strand) => strand.show);
  const lines = Array.from({ length: SCRATCH_SLOTS }, (_, index) => {
    const { cycle, fade } = lifeEnvelope(frame, gate * (14 + index * 4), index / SCRATCH_SLOTS);
    const key = `film-${seed}-scratch-${cycle}-${index}`;
    return {
      index,
      show: random(`${key}-on`) < scratches * 0.5,
      x: random(`${key}-x`) * width + Math.sin(frame * 0.9 + index) * 0.8,
      alpha: (0.08 + random(`${key}-a`) * 0.12) * fade,
    };
  }).filter((line) => line.show);
  return { specks, strands, lines };
};

export const FilmLayer = ({
  frame,
  width,
  height,
  ...settings
}: FilmSettings & { frame: number; width: number; height: number }) => {
  const { color, vignette } = settings;
  const { specks, strands, lines } = filmMarks(settings, frame, width, height);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        {lines.map((line) => (
          <line
            key={`scratch-${line.index}`}
            x1={line.x}
            x2={line.x}
            y1={0}
            y2={height}
            stroke={withAlpha(color, line.alpha)}
            strokeWidth={1}
          />
        ))}
        {strands.map((strand) => (
          <path
            key={`hair-${strand.index}`}
            d={strand.d}
            fill="none"
            stroke={withAlpha(color, strand.alpha)}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        ))}
        {specks.map((speck) => (
          <circle
            key={`dust-${speck.index}`}
            cx={speck.x}
            cy={speck.y}
            r={speck.r}
            fill={withAlpha(color, speck.alpha)}
          />
        ))}
      </svg>
      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            opacity: vignette,
            background: `radial-gradient(120% 120% at 50% 50%, ${easedGradient('rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.85)')})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
