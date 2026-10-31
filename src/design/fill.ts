import { z } from 'zod';

export const gradientStopSchema = z.object({
  offset: z.number().min(0).max(1),
  color: z.string(),
});

export const linearGradientSchema = z.object({
  type: z.literal('linear'),
  angle: z.number(),
  stops: z.array(gradientStopSchema).min(2),
});

export const radialGradientSchema = z.object({
  type: z.literal('radial'),
  stops: z.array(gradientStopSchema).min(2),
});

export const gradientSchema = z.discriminatedUnion('type', [
  linearGradientSchema,
  radialGradientSchema,
]);

export const fillSchema = z.union([z.string(), gradientSchema]);

export type GradientStop = z.infer<typeof gradientStopSchema>;
export type LinearGradient = z.infer<typeof linearGradientSchema>;
export type RadialGradient = z.infer<typeof radialGradientSchema>;
export type Gradient = z.infer<typeof gradientSchema>;
export type Fill = z.infer<typeof fillSchema>;

export const linear = (angle: number, ...colors: string[]): LinearGradient => ({
  type: 'linear',
  angle,
  stops: colors.map((color, index) => ({
    offset: colors.length === 1 ? 0 : index / (colors.length - 1),
    color,
  })),
});

export const radial = (...colors: string[]): RadialGradient => ({
  type: 'radial',
  stops: colors.map((color, index) => ({
    offset: colors.length === 1 ? 0 : index / (colors.length - 1),
    color,
  })),
});

export const firstFillColor = (fill: Fill): string =>
  typeof fill === 'string' ? fill : (fill.stops[0]?.color ?? '#000000');

export interface GradientLine {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const linearGradientLine = (angle: number, width: number, height: number): GradientLine => {
  const radians = (angle * Math.PI) / 180;
  const dx = Math.sin(radians);
  const dy = -Math.cos(radians);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  const cx = width / 2;
  const cy = height / 2;
  return {
    start: { x: cx - dx * half, y: cy - dy * half },
    end: { x: cx + dx * half, y: cy + dy * half },
  };
};

export const flattenStops = (stops: readonly GradientStop[]): (number | string)[] =>
  [...stops].sort((a, b) => a.offset - b.offset).flatMap((stop) => [stop.offset, stop.color]);
