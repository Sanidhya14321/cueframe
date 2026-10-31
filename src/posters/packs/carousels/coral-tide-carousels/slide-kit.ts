import { path } from '../../../kit';

export const trail = (
  data: string,
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string,
  fill: string,
  strokeWidth: number,
  dashed = false,
) =>
  path(
    data,
    x,
    y,
    width,
    height,
    fill,
    { width, height },
    {
      stroke,
      strokeWidth,
      dashed,
      name: 'Line',
    },
  );
