export const TAU = Math.PI * 2;

const PROFILE_SAMPLES = 512;

const ARC_STEP = 4;

export type CycleProfile = {
  cumulative: Float64Array;
  total: number;
};

export const swellShape = (phase: number, sharpness: number): number =>
  ((1 + Math.cos(TAU * phase)) / 2) ** sharpness;

export const cycleProfile = (valueAt: (phase: number) => number): CycleProfile => {
  const cumulative = new Float64Array(PROFILE_SAMPLES + 1);
  for (let index = 1; index <= PROFILE_SAMPLES; index++) {
    const from = valueAt((index - 1) / PROFILE_SAMPLES);
    const to = valueAt(index / PROFILE_SAMPLES);
    cumulative[index] = (cumulative[index - 1] ?? 0) + (from + to) / (2 * PROFILE_SAMPLES);
  }
  return { cumulative, total: cumulative[PROFILE_SAMPLES] ?? 0 };
};

export const cycleIntegral = (profile: CycleProfile, phase: number): number => {
  const whole = Math.floor(phase);
  const position = (phase - whole) * PROFILE_SAMPLES;
  const index = Math.floor(position);
  const low = profile.cumulative[index] ?? 0;
  const high = profile.cumulative[Math.min(index + 1, PROFILE_SAMPLES)] ?? low;
  return whole * profile.total + low + (high - low) * (position - index);
};

export type StreamWave = {
  centerX: number;
  amplitude: number;
  waveNumber: number;
  phase: number;
};

export type StreamPath = StreamWave & { top: number; arcs: Float64Array };

const slopeAt = (wave: StreamWave, y: number): number =>
  wave.amplitude * wave.waveNumber * Math.cos(wave.waveNumber * y + wave.phase);

export const streamPath = (wave: StreamWave, top: number, bottom: number): StreamPath => {
  const samples = Math.ceil((bottom - top) / ARC_STEP);
  const arcs = new Float64Array(samples + 1);
  for (let index = 1; index <= samples; index++) {
    const from = Math.hypot(1, slopeAt(wave, top + (index - 1) * ARC_STEP));
    const to = Math.hypot(1, slopeAt(wave, top + index * ARC_STEP));
    arcs[index] = (arcs[index - 1] ?? 0) + ((from + to) / 2) * ARC_STEP;
  }
  return { ...wave, top, arcs };
};

export const pathLength = (path: StreamPath): number => path.arcs.at(-1) ?? 0;

export const pointAt = (path: StreamPath, arc: number): { x: number; y: number; angle: number } => {
  let low = 0;
  let high = path.arcs.length - 1;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if ((path.arcs[middle] ?? 0) <= arc) {
      low = middle;
    } else {
      high = middle;
    }
  }
  const from = path.arcs[low] ?? 0;
  const to = path.arcs[high] ?? from;
  const share = to > from ? (arc - from) / (to - from) : 0;
  const y = path.top + (low + share) * ARC_STEP;
  const x = path.centerX + path.amplitude * Math.sin(path.waveNumber * y + path.phase);
  return { x, y, angle: -Math.atan(slopeAt(path, y)) };
};
