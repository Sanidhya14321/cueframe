export const fx = (value: number): string => value.toFixed(2);

export const leaf = (
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
): string => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (along: number, side: number) =>
    `${fx(x + cos * along - sin * side)} ${fx(y + sin * along + cos * side)}`;
  return `M${at(0, 0)}Q${at(length * 0.45, width)} ${at(length, 0)}Q${at(length * 0.45, -width)} ${at(0, 0)}Z`;
};

export const circle = (x: number, y: number, r: number): string =>
  `M${fx(x - r)} ${fx(y)}a${fx(r)} ${fx(r)} 0 1 0 ${fx(r * 2)} 0a${fx(r)} ${fx(r)} 0 1 0 ${fx(-r * 2)} 0Z`;

export const rosette = (x: number, y: number, r: number, petals = 6, turn = 0): string =>
  Array.from({ length: petals }, (_, index) =>
    leaf(x, y, turn + (index / petals) * Math.PI * 2, r, r * 0.42),
  ).join('');

export const seeded = (seed: number) => {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

export const scallop = (x0: number, x1: number, y: number, size: number, depth: number): string => {
  const count = Math.max(1, Math.round((x1 - x0) / size));
  const step = (x1 - x0) / count;
  const arcs = Array.from(
    { length: count },
    (_, index) =>
      `Q${fx(x0 + step * (index + 0.5))} ${fx(y + depth)} ${fx(x0 + step * (index + 1))} ${fx(y)}`,
  ).join('');
  return `M${fx(x0)} ${fx(y)}${arcs}`;
};
