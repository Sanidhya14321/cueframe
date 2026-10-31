type Point = readonly [number, number];

export type Quad = readonly [Point, Point, Point, Point];

export type Homography = (u: number, v: number) => [number, number];

export const squareToQuad = ([p0, p1, p2, p3]: Quad): Homography => {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = determinant === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = determinant === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / determinant;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  return (u, v) => {
    const w = g * u + h * v + 1;
    return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w];
  };
};
