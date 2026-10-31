import { loadFont } from '@remotion/google-fonts/Outfit';
import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';

const WEIGHTS = ['400', '500', '600', '700', '800', '900'] as const;

const outfit = loadFont('normal', { weights: [...WEIGHTS], subsets: ['latin'] });

export const calloutFont = outfit.fontFamily;

const fontOf = (weight: number, size: number) => `${weight} ${size}px "${calloutFont}"`;

export const useCalloutFont = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Loading Outfit'));
  useEffect(() => {
    let live = true;
    outfit
      .waitUntilDone()
      .then(() =>
        Promise.all(WEIGHTS.map((weight) => document.fonts.load(fontOf(Number(weight), 100)))),
      )
      .then(() => {
        if (live) {
          setReady(true);
        }
        continueRender(handle);
      })
      .catch((error: unknown) => cancelRender(error));
    return () => {
      live = false;
    };
  }, [handle]);
  return ready;
};

export interface GlyphSpec {
  text: string;
  size: number;
  weight: number;
  tracking: number;
}

interface Glyph {
  char: string;
  x: number;
  advance: number;
  ascent: number;
}

export interface GlyphLayout extends GlyphSpec {
  glyphs: Glyph[];
  width: number;
  capHeight: number;
  xHeight: number;
}

let sharedContext: CanvasRenderingContext2D | null = null;

const measureContext = (): CanvasRenderingContext2D => {
  sharedContext ??= document.createElement('canvas').getContext('2d');
  if (sharedContext === null) {
    throw new Error('2d canvas unavailable');
  }
  return sharedContext;
};

export const layoutGlyphs = (spec: GlyphSpec): GlyphLayout => {
  const context = measureContext();
  context.font = fontOf(spec.weight, spec.size);
  const measure = (text: string) => context.measureText(text).width;
  const chars = Array.from(spec.text);
  const trackPx = spec.tracking * spec.size;
  const glyphs = chars.map((char, index) => {
    const advance = measure(char);
    return {
      char,
      advance,
      x: measure(chars.slice(0, index + 1).join('')) - advance + index * trackPx,
      ascent: context.measureText(char).actualBoundingBoxAscent,
    };
  });
  return {
    ...spec,
    glyphs,
    width: measure(spec.text) + Math.max(0, chars.length - 1) * trackPx,
    capHeight: context.measureText('H').actualBoundingBoxAscent,
    xHeight: context.measureText('x').actualBoundingBoxAscent,
  };
};

export const GlyphRow = ({
  layout,
  left,
  baseline,
  fill,
  stroke,
  strokeWidth = 0,
  hidden,
  opacity,
}: {
  layout: GlyphLayout;
  left: number;
  baseline: number;
  fill: (index: number) => string;
  stroke?: (index: number) => string;
  strokeWidth?: number;
  hidden?: (index: number) => boolean;
  opacity?: (index: number) => number;
}) => (
  <g>
    {layout.glyphs.map((glyph, index) =>
      glyph.char === ' ' || hidden?.(index) === true ? null : (
        <text
          key={`${index}:${glyph.char}`}
          x={left + glyph.x}
          y={baseline}
          fill={fill(index)}
          stroke={stroke?.(index) ?? 'none'}
          strokeWidth={strokeWidth}
          opacity={opacity?.(index) ?? 1}
          style={{
            fontFamily: calloutFont,
            fontSize: layout.size,
            fontWeight: layout.weight,
            fontKerning: 'none',
            whiteSpace: 'pre',
          }}
        >
          {glyph.char}
        </text>
      ),
    )}
  </g>
);

export const centeredLeft = (layout: GlyphLayout, center = 540): number =>
  center - layout.width / 2;
