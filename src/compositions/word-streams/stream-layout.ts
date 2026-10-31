import type { WordStreamsProps } from '@/schemas';
import type { WordInk } from './measure-word';
import { type CycleProfile, cycleProfile, swellShape, TAU } from './stream-geometry';

const STREAM_CLEARANCE = 16;
const PAIR_SAMPLES = 128;
const MIN_SCALE = 0.05;
const MIN_BEND = 0.35;
const MIN_PITCH = 0.05;

export type StreamLayout = {
  ink: WordInk;
  base: number;
  peak: number;
  centers: number[];
  phases: number[];
  offsets: number[];
  waveNumber: number;
  pitch: CycleProfile;
  reach: number;
};

const centered = (index: number, count: number): number => index - (count - 1) / 2;

const widestPair = (props: WordStreamsProps, sizeAt: (phase: number) => number): number => {
  if (props.flow.alternate || props.streams.count < 2) {
    return 2 * Math.max(props.word.size, props.swell.peak);
  }
  let widest = 0;
  for (let sample = 0; sample < PAIR_SAMPLES; sample++) {
    const phase = sample / PAIR_SAMPLES;
    widest = Math.max(widest, sizeAt(phase) + sizeAt(phase + props.swell.offset));
  }
  return widest;
};

export const streamLayout = (
  props: WordStreamsProps,
  ink: WordInk,
  width: number,
): StreamLayout => {
  const { word, streams, wave, swell } = props;
  const waveNumber = TAU / wave.length;
  const tilt = Math.atan(wave.amplitude * waveNumber);
  const reach = (ink.width / 2) * Math.cos(tilt) + (ink.height / 2) * Math.sin(tilt);
  const shapeAt = (phase: number) => swellShape(phase, swell.sharpness);
  const sizeAt = (phase: number) => word.size + (swell.peak - word.size) * shapeAt(phase);
  const largest = Math.max(word.size, swell.peak);
  const gaps = streams.count - 1;
  const approach = 2 * wave.amplitude * Math.abs(Math.sin((streams.phaseStep * Math.PI) / 360));
  const room =
    width - 2 * streams.margin - 2 * wave.amplitude - gaps * (approach + STREAM_CLEARANCE);
  const fit = room / (reach * (2 * largest + gaps * widestPair(props, sizeAt)));
  const scale = Math.min(1, Math.max(MIN_SCALE, fit));
  const extent = wave.amplitude + scale * largest * reach;
  const left = streams.margin + extent;
  const right = width - streams.margin - extent;
  const centers = Array.from({ length: streams.count }, (_, index) =>
    gaps === 0 ? width / 2 : left + ((right - left) * index) / gaps,
  );
  const base = word.size * scale;
  const peak = swell.peak * scale;
  const curvature = wave.amplitude * waveNumber ** 2;
  const lineHeight = Math.max(MIN_PITCH, ink.height + word.spacing);
  const pitchOf = (size: number) =>
    (size * lineHeight) / Math.max(MIN_BEND, 1 - (curvature * size * ink.width) / 2);
  return {
    ink,
    base,
    peak,
    centers,
    phases: centers.map(
      (_, index) => (centered(index, streams.count) * streams.phaseStep * Math.PI) / 180,
    ),
    offsets: centers.map((_, index) => centered(index, streams.count) * swell.offset),
    waveNumber,
    pitch: cycleProfile((phase) => pitchOf(base + (peak - base) * shapeAt(phase))),
    reach,
  };
};
