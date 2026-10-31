import {
  createDesignId,
  type DesignElement,
  type Fill,
  scaleElement,
  type TextElement,
} from '@/design';
import type { PosterPhotoName } from '../photos';
import { circle, flatten, icon, type Nodes, photo, rect, shadow, star, text } from './elements';

export const group = (...nodes: Nodes[]): DesignElement[] => {
  const groupId = createDesignId('group');
  return flatten(nodes).map((element) => ({ ...element, groupId }));
};

export const offset = (dx: number, dy: number, nodes: readonly Nodes[]): DesignElement[] =>
  flatten(nodes).map((element) => ({ ...element, x: element.x + dx, y: element.y + dy }));

export const estimateTextWidth = (label: string, fontSize: number, letterSpacing = 0): number =>
  label.length * (fontSize * 0.56 + letterSpacing);

export const rotateNodes = (
  degrees: number,
  pivotX: number,
  pivotY: number,
  nodes: readonly Nodes[],
): DesignElement[] => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return flatten(nodes).map((element) => {
    const dx = element.x - pivotX;
    const dy = element.y - pivotY;
    return {
      ...element,
      x: pivotX + dx * cos - dy * sin,
      y: pivotY + dx * sin + dy * cos,
      rotation: element.rotation + degrees,
    };
  });
};

export const place = (
  x: number,
  y: number,
  scale: number,
  nodes: readonly Nodes[],
): DesignElement[] => flatten(nodes).map((element) => scaleElement(element, scale, x, y));

interface PillStyle {
  fill?: Fill;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  padX?: number;
  padY?: number;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  uppercase?: boolean;
  letterSpacing?: number;
}

export const pill = (label: string, x: number, y: number, style: PillStyle = {}) => {
  const fontSize = style.fontSize ?? 28;
  const padX = style.padX ?? fontSize * 1.1;
  const padY = style.padY ?? fontSize * 0.6;
  const width =
    style.width ?? estimateTextWidth(label, fontSize, style.letterSpacing ?? 0) + padX * 2;
  const height = fontSize * 1.2 + padY * 2;
  return group(
    rect(x, y, width, height, style.fill ?? '#111111', {
      name: `${label} pill`,
      cornerRadius: height / 2,
      stroke: style.stroke ?? '#111111',
      strokeWidth: style.strokeWidth ?? 0,
    }),
    text(label, x, y + padY, width, {
      fontSize,
      fontFamily: style.fontFamily ?? 'Inter',
      fontWeight: style.fontWeight ?? 600,
      fill: style.color ?? '#ffffff',
      align: 'center',
      lineHeight: 1.2,
      uppercase: style.uppercase ?? false,
      letterSpacing: style.letterSpacing ?? 0,
    }),
  );
};

interface CardStyle {
  fill?: Fill;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  shadowBlur?: number;
}

export const card = (x: number, y: number, width: number, height: number, style: CardStyle = {}) =>
  rect(x, y, width, height, style.fill ?? '#ffffff', {
    name: 'Card',
    cornerRadius: style.radius ?? 28,
    stroke: style.stroke ?? '#e5e7eb',
    strokeWidth: style.strokeWidth ?? 0,
    ...(style.shadowBlur === 0 ? {} : shadow(style.shadowBlur ?? 36, 14, 'rgba(15,23,42,0.14)')),
  });

export const avatar = (
  name: PosterPhotoName,
  cx: number,
  cy: number,
  radius: number,
  ring?: string,
) =>
  group(
    ring === undefined ? [] : circle(cx, cy, radius + radius * 0.08, ring),
    photo(name, cx - radius, cy - radius, radius * 2, radius * 2, { cornerRadius: radius }),
  );

export const rating = (
  x: number,
  y: number,
  size: number,
  count = 5,
  color = '#f59e0b',
  gap = 0.25,
) =>
  group(
    Array.from({ length: count }, (_, index) =>
      star(5, x + index * size * (1 + gap), y, size, color, { innerRatio: 0.48 }),
    ),
  );

export const bars = (
  x: number,
  y: number,
  width: number,
  height: number,
  values: readonly number[],
  fill: Fill,
  gapRatio = 0.35,
) => {
  const max = Math.max(...values, 1);
  const slot = width / values.length;
  const barWidth = slot * (1 - gapRatio);
  return group(
    values.map((value, index) => {
      const barHeight = (value / max) * height;
      return rect(
        x + index * slot + (slot - barWidth) / 2,
        y + height - barHeight,
        barWidth,
        barHeight,
        fill,
        {
          name: 'Bar',
          cornerRadius: Math.min(12, barWidth / 3),
        },
      );
    }),
  );
};

interface ListStyle {
  color?: string;
  iconColor?: string;
  icon?: 'circle-check' | 'check' | 'arrow-right' | 'x' | 'circle-x' | 'star' | 'sparkles';
  fontSize?: number;
  gap?: number;
  fontFamily?: string;
  fontWeight?: number;
}

export const checklist = (
  items: readonly string[],
  x: number,
  y: number,
  width: number,
  style: ListStyle = {},
) => {
  const fontSize = style.fontSize ?? 34;
  const gap = style.gap ?? fontSize * 1.9;
  return group(
    items.map((item, index) => [
      icon(
        style.icon ?? 'circle-check',
        x,
        y + index * gap,
        fontSize * 1.15,
        style.iconColor ?? '#16a34a',
        {
          strokeWidth: 2.25,
        },
      ),
      text(item, x + fontSize * 1.6, y + index * gap + fontSize * 0.05, width - fontSize * 1.6, {
        fontSize,
        fontWeight: style.fontWeight ?? 500,
        fontFamily: style.fontFamily ?? 'Inter',
        fill: style.color ?? '#111111',
        lineHeight: 1.2,
      }),
    ]),
  );
};

export const numbered = (
  items: readonly string[],
  x: number,
  y: number,
  width: number,
  style: ListStyle & { numberColor?: string } = {},
) => {
  const fontSize = style.fontSize ?? 34;
  const gap = style.gap ?? fontSize * 2;
  return group(
    items.map((item, index) => [
      text(String(index + 1).padStart(2, '0'), x, y + index * gap, fontSize * 2, {
        fontSize: fontSize * 1.1,
        fontWeight: 800,
        fontFamily: style.fontFamily ?? 'Inter',
        fill: style.numberColor ?? '#f97316',
      }),
      text(item, x + fontSize * 2.2, y + index * gap + fontSize * 0.08, width - fontSize * 2.2, {
        fontSize,
        fontWeight: style.fontWeight ?? 600,
        fontFamily: style.fontFamily ?? 'Inter',
        fill: style.color ?? '#111111',
        lineHeight: 1.2,
      }),
    ]),
  );
};

interface StatStyle {
  valueColor?: string;
  labelColor?: string;
  valueSize?: number;
  labelSize?: number;
  fontFamily?: string;
  align?: TextElement['align'];
}

export const stat = (
  value: string,
  label: string,
  x: number,
  y: number,
  width: number,
  style: StatStyle = {},
) => {
  const valueSize = style.valueSize ?? 96;
  return group(
    text(value, x, y, width, {
      fontSize: valueSize,
      fontWeight: 800,
      fontFamily: style.fontFamily ?? 'Inter',
      fill: style.valueColor ?? '#111111',
      align: style.align ?? 'left',
      lineHeight: 1,
    }),
    text(label, x, y + valueSize * 1.12, width, {
      fontSize: style.labelSize ?? 28,
      fontWeight: 500,
      fill: style.labelColor ?? '#6b7280',
      align: style.align ?? 'left',
      lineHeight: 1.3,
    }),
  );
};

export const dots = (
  x: number,
  y: number,
  columns: number,
  rows: number,
  spacing: number,
  color: string,
  radius = 4,
) =>
  group(
    Array.from({ length: columns * rows }, (_, index) =>
      circle(
        x + (index % columns) * spacing,
        y + Math.floor(index / columns) * spacing,
        radius,
        color,
      ),
    ),
  );

export const socialPostChrome = (
  x: number,
  y: number,
  width: number,
  handle: string,
  style: { color?: string; accent?: string } = {},
) =>
  group(
    circle(x + 22, y + 22, 22, style.accent ?? '#7c3aed'),
    text(handle, x + 58, y + 8, width - 120, {
      fontSize: 24,
      fontWeight: 600,
      fill: style.color ?? '#111111',
    }),
    icon('heart', x, y + 60, 34, style.color ?? '#111111'),
    icon('message-circle', x + 52, y + 60, 34, style.color ?? '#111111'),
    icon('send', x + 104, y + 60, 34, style.color ?? '#111111'),
    icon('bookmark', x + width - 34, y + 60, 34, style.color ?? '#111111'),
  );
