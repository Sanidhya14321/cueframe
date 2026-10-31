const RAMP = 3;

export const launchDistance = (elapsed: number, frames: number, distance: number): number => {
  if (elapsed <= 0) {
    return 0;
  }
  const ramp = Math.min(RAMP, frames / 2);
  const top = distance / (frames - ramp / 2);
  if (elapsed < ramp) {
    return (top * elapsed * elapsed) / (2 * ramp);
  }
  return Math.min(distance, top * (elapsed - ramp / 2));
};

export const launchSpeed = (elapsed: number, frames: number, distance: number): number =>
  elapsed <= 0 || elapsed >= frames
    ? 0
    : launchDistance(elapsed, frames, distance) - launchDistance(elapsed - 1, frames, distance);

export const landDistance = (elapsed: number, frames: number, distance: number): number =>
  elapsed >= frames ? distance : distance - launchDistance(frames - elapsed, frames, distance);

const easeBetween = (from: number, to: number, amount: number): number =>
  from + ((to - from) * (1 - Math.cos(Math.PI * amount))) / 2;

export const dampedSwing = (
  elapsed: number,
  amplitude: number,
  period: number,
  damping: number,
  swings: number,
): number => {
  if (elapsed <= 0 || amplitude === 0 || swings <= 0) {
    return 0;
  }
  const half = Math.max(2, Math.round(period / 2));
  const quarter = Math.max(1, Math.round(half / 2));
  const peak = (swing: number) => (swing % 2 === 0 ? 1 : -1) * amplitude * damping ** swing;
  if (elapsed <= quarter) {
    return peak(0) * Math.sin((Math.PI / 2) * (elapsed / quarter));
  }
  const since = elapsed - quarter;
  const index = Math.floor(since / half);
  const amount = (since - index * half) / half;
  if (index >= swings - 1) {
    return index === swings - 1 ? easeBetween(peak(index), 0, amount) : 0;
  }
  return easeBetween(peak(index), peak(index + 1), amount);
};

export const progress = (frame: number, start: number, frames: number): number =>
  frames <= 0 ? (frame >= start ? 1 : 0) : Math.min(1, Math.max(0, (frame - start) / frames));
