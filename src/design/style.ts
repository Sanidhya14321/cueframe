import { type DesignElement, designElementSchema } from './element';

const STYLE_KEYS: readonly string[] = [
  'fill',
  'stroke',
  'strokeWidth',
  'dashed',
  'opacity',
  'shadow',
  'cornerRadius',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'italic',
  'underline',
  'strikethrough',
  'uppercase',
  'align',
  'lineHeight',
  'letterSpacing',
  'background',
  'color',
  'filters',
];

export const applyStyle = (target: DesignElement, source: DesignElement): DesignElement => {
  const picked = Object.fromEntries(
    Object.entries(source).filter(([key]) => STYLE_KEYS.includes(key) && key in target),
  );
  const parsed = designElementSchema.safeParse({ ...target, ...picked });
  return parsed.success ? parsed.data : target;
};

export const FONT_SIZE_STEPS = [
  8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 112, 128, 144, 160, 200,
  240, 300, 400,
] as const;

export const stepFontSize = (size: number, direction: 1 | -1): number =>
  direction === 1
    ? (FONT_SIZE_STEPS.find((step) => step > size + 0.01) ?? Math.round(size * 1.2))
    : ([...FONT_SIZE_STEPS].reverse().find((step) => step < size - 0.01) ?? Math.max(4, size - 1));
