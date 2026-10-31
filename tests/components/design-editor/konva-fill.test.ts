import { describe, expect, it } from 'bun:test';
import { fillToCss, konvaFill } from '@/components/design-editor/konva-fill';
import { linear, radial } from '@/design';

describe('fills', () => {
  it('maps solid, linear and radial fills to Konva props', () => {
    expect(konvaFill('#fff', 10, 10)).toEqual({ fill: '#fff', fillPriority: 'color' });
    const lin = konvaFill(linear(90, '#000', '#fff'), 100, 50);
    expect(lin.fillPriority).toBe('linear-gradient');
    expect(lin.fillLinearGradientStartPoint?.x).toBeCloseTo(0);
    expect(lin.fillLinearGradientColorStops).toEqual([0, '#000', 1, '#fff']);
    const rad = konvaFill(radial('#000', '#fff'), 100, 100, { x: -50, y: -50 });
    expect(rad.fillRadialGradientStartPoint).toEqual({ x: 0, y: 0 });
    expect(rad.fillRadialGradientEndRadius).toBeCloseTo(Math.hypot(100, 100) / 2);
  });

  it('converts fills to CSS', () => {
    expect(fillToCss('#abc')).toBe('#abc');
    expect(fillToCss(linear(45, '#000', '#fff'))).toBe(
      'linear-gradient(45deg, #000 0%, #fff 100%)',
    );
    expect(fillToCss(radial('#000', '#fff'))).toBe('radial-gradient(circle, #000 0%, #fff 100%)');
  });
});
