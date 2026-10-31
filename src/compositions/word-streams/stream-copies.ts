import type { WordStreamsProps } from '@/schemas';
import { pixelTween, settle } from '../promo/timing';
import { cycleIntegral, pathLength, pointAt, streamPath, swellShape } from './stream-geometry';
import type { StreamLayout } from './stream-layout';

const EDGE_ALLOWANCE = 40;

export type StreamCopy = {
  key: number;
  x: number;
  y: number;
  angle: number;
  size: number;
  swell: number;
};

export type StreamInput = {
  props: WordStreamsProps;
  layout: StreamLayout;
  index: number;
  rawFrame: number;
  frame: number;
  height: number;
};

const flowSign = ({ flow }: WordStreamsProps, index: number): number => {
  const sign = flow.direction === 'up' ? -1 : 1;
  return flow.alternate && index % 2 === 1 ? -sign : sign;
};

export const streamCopies = ({
  props,
  layout,
  index,
  rawFrame,
  frame,
  height,
}: StreamInput): StreamCopy[] => {
  const { wave, swell, flow } = props;
  const { ink, base, peak, pitch } = layout;
  const largest = Math.max(base, peak);
  const margin = (largest * Math.hypot(ink.width, ink.height)) / 2 + EDGE_ALLOWANCE;
  const path = streamPath(
    {
      centerX: layout.centers[index] ?? 0,
      amplitude: wave.amplitude,
      waveNumber: layout.waveNumber,
      phase: (layout.phases[index] ?? 0) - layout.waveNumber * wave.sway * frame,
    },
    -margin,
    height + margin,
  );
  const length = pathLength(path);
  const sign = flowSign(props, index);
  const offset = layout.offsets[index] ?? 0;
  const lead = (-sign * swell.drift * frame) / pitch.total;
  const phaseOf = (copy: number) => (copy + lead) / swell.length + offset;
  const origin = cycleIntegral(pitch, offset);
  const rise =
    flow.riseFrames > 0
      ? pixelTween(
          rawFrame,
          [0, flow.riseFrames + index * flow.riseStagger],
          [flow.riseDistance, 0],
          settle,
        )
      : 0;
  const shift = sign * (flow.speed * rawFrame + swell.drift * frame - rise);
  const arcOf = (copy: number) =>
    swell.length * (cycleIntegral(pitch, phaseOf(copy)) - origin) + shift;
  let current = Math.floor(-shift / pitch.total - lead) - 2 * Math.ceil(swell.length) - 2;
  while (arcOf(current) < 0) {
    current++;
  }
  const copies: StreamCopy[] = [];
  for (let arc = arcOf(current); arc <= length; arc = arcOf(++current)) {
    const share = swellShape(phaseOf(current), swell.sharpness);
    copies.push({
      key: current,
      ...pointAt(path, arc),
      size: base + (peak - base) * share,
      swell: share,
    });
  }
  return copies;
};
