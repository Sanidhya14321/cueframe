import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { land, settle, smooth, turn, tween } from '../promo/timing';

type Timing = MailinfraDeliverabilityChargeProps['timing'];

export interface Beats {
  chargeStart: number;
  fullAt: number;
  unplugAt: number;
  drain: boolean;
  drainEnd: number;
  shiftEnd: number;
}

export const beatsOf = (timing: Timing, shiftFrames: number): Beats => {
  const chargeStart = timing.chargeStart;
  const fullAt = Math.max(timing.fullAt, chargeStart + 12);
  const unplugAt = Math.max(timing.unplugAt, fullAt + 8);
  return {
    chargeStart,
    fullAt,
    unplugAt,
    drain: timing.drain,
    drainEnd: unplugAt + timing.drainFrames,
    shiftEnd: chargeStart + shiftFrames,
  };
};

const drained = (frame: number, beats: Beats): number =>
  beats.drain ? tween(frame, [beats.unplugAt, beats.drainEnd], [0, 1], smooth) : 0;

export const chargeAt = (frame: number, beats: Beats): number =>
  frame < beats.unplugAt
    ? tween(frame, [beats.chargeStart, beats.fullAt], [0, 1], turn)
    : 1 - drained(frame, beats);

export const glowAt = (frame: number, beats: Beats): number =>
  frame < beats.unplugAt
    ? tween(frame, [beats.chargeStart, beats.shiftEnd], [0, 1], smooth)
    : 1 - drained(frame, beats);

export const badgeExitAt = (beats: Beats, hold: number): number | undefined =>
  beats.drain ? Math.max(beats.unplugAt, beats.fullAt + 36 + hold) : undefined;

export const burstAt = (frame: number, beats: Beats, pulseFrames: number): number =>
  tween(frame, [beats.fullAt - 8, beats.fullAt + 6], [0, 1]) *
  (1 - tween(frame, [beats.fullAt + 6, beats.fullAt + 6 + pulseFrames], [0, 1]));

export const pulseAt = (frame: number, beats: Beats, pulseFrames: number, delay = 0): number =>
  tween(frame, [beats.fullAt + delay, beats.fullAt + delay + pulseFrames], [0, 1], settle);

const SEAT_SPEED = 4;

const gravity = (share: number): number => share * share;

export interface PlugTiming {
  start: number;
  landed: number;
  release: number;
  gone: number;
}

export const plugTiming = (timing: Timing, beats: Beats, order: number): PlugTiming => {
  const start = timing.plugIn + order * timing.stagger;
  const release = beats.unplugAt + order * Math.round(timing.stagger * 0.5);
  return {
    start,
    landed: start + timing.plugFrames,
    release,
    gone: release + timing.unplugFrames,
  };
};

export const plugTravel = (frame: number, plug: PlugTiming, length: number): number =>
  land(frame, [plug.start, plug.landed], [0, length], SEAT_SPEED);

export interface PlugExit {
  back: number;
  fall: number;
  turn: number;
}

export const plugExit = (frame: number, plug: PlugTiming): PlugExit => {
  const range: [number, number] = [plug.release, plug.gone];
  return {
    back: tween(frame, range, [0, 1], smooth),
    fall: tween(frame, range, [0, 1], gravity),
    turn: tween(frame, range, [0, 1], smooth),
  };
};

export const sparkLife = (frame: number, plug: PlugTiming): number =>
  tween(frame, [plug.landed, plug.landed + 10], [0, 1]) *
  (1 - tween(frame, [plug.release - 10, plug.release], [0, 1]));

export const clickAt = (frame: number, plug: PlugTiming): number =>
  tween(frame, [plug.landed - 2, plug.landed + 2], [0, 1]) *
  (1 - tween(frame, [plug.landed + 2, plug.landed + 26], [0, 1], settle));
