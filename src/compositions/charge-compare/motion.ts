import { Easing, interpolate } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';

type LogoKey = ChargeCompareProps['logo']['appear'];
type Stop = ChargeCompareProps['battery']['stops'][number];

export type LogoPose = { x: number; y: number; size: number };

const POSE_FIELDS = ['x', 'y', 'size'] as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const ramp = (frame: number, start: number, frames: number): number =>
  frames <= 0 ? (frame >= start ? 1 : 0) : clamp01((frame - start) / frames);

const orderedKeys = (logo: ChargeCompareProps['logo']): LogoKey[] => {
  const keys = [logo.appear, logo.rise, logo.swing, logo.land];
  const ordered: LogoKey[] = [];
  for (const key of keys) {
    const previous = ordered.at(-1);
    const frame = previous === undefined ? key.frame : Math.max(key.frame, previous.frame + 1);
    ordered.push({ ...key, frame });
  }
  return ordered;
};

const slope = (keys: LogoKey[], index: number, field: (typeof POSE_FIELDS)[number]): number => {
  const current = keys[index];
  const before = keys[index - 1];
  const after = keys[index + 1];
  if (current === undefined || after === undefined) {
    return 0;
  }
  if (before === undefined) {
    return (after[field] - current[field]) / (after.frame - current.frame);
  }
  return (after[field] - before[field]) / (after.frame - before.frame);
};

export const logoPose = (frame: number, logo: ChargeCompareProps['logo']): LogoPose => {
  const keys = orderedKeys(logo);
  const first = keys[0] as LogoKey;
  const last = keys.at(-1) as LogoKey;
  if (frame <= first.frame) {
    return { x: first.x, y: first.y, size: first.size };
  }
  if (frame >= last.frame) {
    return { x: last.x, y: last.y, size: last.size };
  }
  const index = keys.findIndex((key, position) => {
    const next = keys[position + 1];
    return next !== undefined && frame >= key.frame && frame <= next.frame;
  });
  const from = keys[index] as LogoKey;
  const to = keys[index + 1] as LogoKey;
  const span = to.frame - from.frame;
  const s = (frame - from.frame) / span;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;
  const value = (field: (typeof POSE_FIELDS)[number]) =>
    h00 * from[field] +
    h10 * span * slope(keys, index, field) +
    h01 * to[field] +
    h11 * span * slope(keys, index + 1, field);
  return { x: value('x'), y: value('y'), size: value('size') };
};

const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const mix = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  const parts = a.map((channel, index) =>
    Math.round(channel + ((b[index] ?? 0) - channel) * amount),
  );
  return `rgb(${parts.join(', ')})`;
};

export const chargeColor = (progress: number, stops: Stop[]): string => {
  const sorted = [...stops].sort((left, right) => left.at - right.at);
  const first = sorted[0] as Stop;
  const last = sorted.at(-1) as Stop;
  if (progress <= first.at) {
    return mix(first.color, first.color, 0);
  }
  for (let index = 0; index < sorted.length - 1; index++) {
    const from = sorted[index] as Stop;
    const to = sorted[index + 1] as Stop;
    if (progress <= to.at) {
      const span = to.at - from.at;
      return mix(from.color, to.color, span <= 0 ? 1 : (progress - from.at) / span);
    }
  }
  return mix(last.color, last.color, 0);
};

export const chargeProgress = (frame: number, timing: ChargeCompareProps['timing']): number =>
  interpolate(
    frame,
    [timing.chargeStart, Math.max(timing.chargeStart + 1, timing.chargeEnd)],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

export const wipeReach = (frame: number, timing: ChargeCompareProps['timing']): number =>
  interpolate(frame, [timing.wipeStart, timing.wipeStart + timing.wipeFrames], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
