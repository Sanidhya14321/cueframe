import { type Fill, flattenStops, linearGradientLine } from '@/design';

export interface KonvaFillProps {
  fill?: string;
  fillPriority?: string;
  fillLinearGradientStartPoint?: { x: number; y: number };
  fillLinearGradientEndPoint?: { x: number; y: number };
  fillLinearGradientColorStops?: (number | string)[];
  fillRadialGradientStartPoint?: { x: number; y: number };
  fillRadialGradientEndPoint?: { x: number; y: number };
  fillRadialGradientStartRadius?: number;
  fillRadialGradientEndRadius?: number;
  fillRadialGradientColorStops?: (number | string)[];
}

export const konvaFill = (
  fill: Fill,
  width: number,
  height: number,
  origin = { x: 0, y: 0 },
): KonvaFillProps => {
  if (typeof fill === 'string') {
    return { fill, fillPriority: 'color' };
  }
  if (fill.type === 'linear') {
    const line = linearGradientLine(fill.angle, width, height);
    return {
      fillPriority: 'linear-gradient',
      fillLinearGradientStartPoint: { x: line.start.x + origin.x, y: line.start.y + origin.y },
      fillLinearGradientEndPoint: { x: line.end.x + origin.x, y: line.end.y + origin.y },
      fillLinearGradientColorStops: flattenStops(fill.stops),
    };
  }
  const center = { x: width / 2 + origin.x, y: height / 2 + origin.y };
  return {
    fillPriority: 'radial-gradient',
    fillRadialGradientStartPoint: center,
    fillRadialGradientEndPoint: center,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: Math.hypot(width, height) / 2,
    fillRadialGradientColorStops: flattenStops(fill.stops),
  };
};

export const fillToCss = (fill: Fill): string => {
  if (typeof fill === 'string') {
    return fill;
  }
  const stops = [...fill.stops]
    .sort((a, b) => a.offset - b.offset)
    .map((stop) => `${stop.color} ${Math.round(stop.offset * 100)}%`)
    .join(', ');
  return fill.type === 'linear'
    ? `linear-gradient(${fill.angle}deg, ${stops})`
    : `radial-gradient(circle, ${stops})`;
};
