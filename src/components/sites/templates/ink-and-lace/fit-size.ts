export const fitSize = (length: number, max: number, budget: number): number =>
  Math.min(max, Math.floor(budget / Math.max(length, 1)));
