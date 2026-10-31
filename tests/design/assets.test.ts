import { describe, expect, it } from 'bun:test';
import {
  containBox,
  coverCrop,
  cssFilterString,
  cssFontFamily,
  DESIGN_ICON_NAMES,
  fitInside,
  fontStyleString,
  hasFilters,
  IMAGE_FILTER_PRESETS,
  iconDataUrl,
  iconSvg,
  isDesignIcon,
  isKnownFont,
  NO_FILTERS,
  textDecorationString,
} from '@/design';

describe('image fitting', () => {
  it('crops the centre for cover', () => {
    expect(coverCrop(200, 100, 100, 100)).toEqual({ x: 50, y: 0, width: 100, height: 100 });
  });

  it('letterboxes for contain', () => {
    expect(containBox(200, 100, 100, 100)).toEqual({ x: 0, y: 25, width: 100, height: 50 });
  });

  it('only shrinks when fitting inside', () => {
    expect(fitInside(400, 200, 100, 100)).toEqual({ width: 100, height: 50 });
    expect(fitInside(40, 20, 100, 100)).toEqual({ width: 40, height: 20 });
  });
});

describe('filters', () => {
  it('builds a css filter string from non-default values only', () => {
    expect(cssFilterString(NO_FILTERS)).toBe('');
    expect(hasFilters(NO_FILTERS)).toBe(false);
    expect(cssFilterString(IMAGE_FILTER_PRESETS.noir)).toBe(
      'brightness(0.85) contrast(1.6) grayscale(1)',
    );
    expect(
      cssFilterString({ ...NO_FILTERS, hue: 30, blur: 4, sepia: 0.5, invert: 1, saturation: 2 }),
    ).toBe('saturate(2) hue-rotate(30deg) sepia(0.5) invert(1) blur(4px)');
    expect(hasFilters(IMAGE_FILTER_PRESETS.vivid)).toBe(true);
  });
});

describe('icons and fonts', () => {
  it('renders lucide icons as escaped svg', () => {
    expect(DESIGN_ICON_NAMES).toContain('arrow-right');
    expect(isDesignIcon('rocket')).toBe(true);
    expect(isDesignIcon('nope')).toBe(false);
    const svg = iconSvg('check', 'a"b', 2);
    expect(svg).toContain('&quot;');
    expect(svg).toContain('<path');
    expect(iconSvg('missing', '#000', 2)).toBe(iconSvg('star', '#000', 2));
    expect(iconDataUrl('check', '#000', 2).startsWith('data:image/svg+xml')).toBe(true);
  });

  it('describes font styles', () => {
    expect(isKnownFont('Poppins')).toBe(true);
    expect(isKnownFont('Comic Sans')).toBe(false);
    expect(fontStyleString(700, true)).toBe('italic 700');
    expect(fontStyleString(400, false)).toBe('400');
    expect(textDecorationString(true, true)).toBe('underline line-through');
    expect(textDecorationString(false, false)).toBe('');
    expect(cssFontFamily('Press Start 2P')).toBe('Press Start TwoP');
    expect(cssFontFamily('VT323')).toBe('VTThreeTwoThree');
    expect(cssFontFamily('Inter')).toBe('Inter');
  });
});
