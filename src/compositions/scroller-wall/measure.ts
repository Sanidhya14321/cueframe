export type GlyphBox = {
  char: string;
  left: number;
  width: number;
  ascent: number;
};

export type TextBox = {
  width: number;
  glyphs: GlyphBox[];
};

type FontSpec = {
  family: string;
  weight: number;
  size: number;
  tracking: number;
};

const cache = new Map<string, TextBox>();
let context: CanvasRenderingContext2D | null | undefined;

const getContext = (): CanvasRenderingContext2D | null => {
  if (context === undefined) {
    context =
      typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  return context;
};

const fallbackBox = (text: string, spec: FontSpec): TextBox => {
  const advance = spec.size * (0.62 + spec.tracking);
  return {
    width: advance * text.length,
    glyphs: [...text].map((char, index) => ({
      char,
      left: advance * index,
      width: spec.size * 0.62,
      ascent: spec.size * 0.7,
    })),
  };
};

export const measureText = (text: string, spec: FontSpec): TextBox => {
  const font = `${spec.weight} ${spec.size}px ${spec.family}`;
  const key = `${font}|${spec.tracking}|${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const ctx = getContext();
  if (ctx === null) {
    return fallbackBox(text, spec);
  }
  ctx.font = font;
  const spacing = spec.tracking * spec.size;
  let cursor = 0;
  const glyphs = [...text].map((char) => {
    const metrics = ctx.measureText(char);
    const glyph = {
      char,
      left: cursor,
      width: metrics.width,
      ascent: metrics.actualBoundingBoxAscent,
    };
    cursor += metrics.width + spacing;
    return glyph;
  });
  const box = { width: cursor, glyphs };
  if (document.fonts.check(font)) {
    cache.set(key, box);
  }
  return box;
};
