import { z } from 'zod';
import { createShapeElement, createTextElement, identityTransform } from '@/project';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const beatStyleSchema = z.object({
  background: color.default('#0b0d17'),
  surface: color.default('#1c2035'),
  ink: color.default('#f5f3ff'),
  accent: color.default('#a78bfa'),
  font: z.string().min(1).max(100).default('Inter'),
});
export type BeatStyle = z.infer<typeof beatStyleSchema>;

export const styleColor = (style: BeatStyle, path: string): string => {
  if (/background/.test(path)) {
    return style.background;
  }
  if (/surface/.test(path)) {
    return style.surface;
  }
  return /ink|text|foreground/.test(path) ? style.ink : style.accent;
};

type Section = {
  text: string;
  subtitle?: string | undefined;
  energy: number;
  from: number;
  duration: number;
  width: number;
  height: number;
};

export const sectionElements = (style: BeatStyle, section: Section) => {
  const { text, subtitle, energy, from, duration, width, height } = section;
  const timing = { from, durationInFrames: duration };
  const fontSize = Math.round(width / 16);
  const entrance = {
    kind: energy >= 4 ? ('scale' as const) : ('slide' as const),
    easing: 'easeOut' as const,
    durationInFrames: Math.min(8, duration),
  };
  const fontFamily = `${style.font}, sans-serif`;
  return {
    backdrop: createShapeElement('rect', {
      ...timing,
      color: style.background,
      width,
      height,
      radius: 0,
      animation: { kind: 'none', easing: 'linear', durationInFrames: 0 },
    }),
    headline: createTextElement({
      ...timing,
      content: text,
      fontSize,
      color: style.ink,
      fontFamily,
      animation: entrance,
      transform: { ...identityTransform(), y: subtitle ? -Math.round(fontSize * 0.4) : 0 },
    }),
    detail: subtitle
      ? createTextElement({
          ...timing,
          content: subtitle,
          fontSize: Math.round(fontSize * 0.36),
          color: style.accent,
          fontFamily,
          animation: { ...entrance, kind: 'fade' },
          transform: { ...identityTransform(), y: Math.round(fontSize * 0.6) },
        })
      : null,
  };
};
