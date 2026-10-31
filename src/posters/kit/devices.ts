import type { Fill } from '@/design';
import type { PosterPhotoName } from '../photos';
import { group, offset, rotateNodes } from './blocks';
import { circle, type Nodes, photo, rect, shadow } from './elements';

interface PhoneStyle {
  screen?: Fill;
  photo?: PosterPhotoName;
  body?: string;
  rotation?: number;
  content?: Nodes[];
}

export const PHONE_RATIO = 2.05;

export const phone = (x: number, y: number, width: number, style: PhoneStyle = {}) => {
  const height = width * PHONE_RATIO;
  const inset = width * 0.045;
  const screenWidth = width - inset * 2;
  const screenHeight = height - inset * 2;
  const screen =
    style.photo === undefined
      ? rect(x + inset, y + inset, screenWidth, screenHeight, style.screen ?? '#ffffff', {
          name: 'Phone screen',
          cornerRadius: width * 0.12,
        })
      : photo(style.photo, x + inset, y + inset, screenWidth, screenHeight, {
          cornerRadius: width * 0.12,
        });
  const parts = [
    rect(x, y, width, height, style.body ?? '#0b0b0f', {
      name: 'Phone body',
      cornerRadius: width * 0.16,
      ...shadow(width * 0.25, width * 0.08, 'rgba(0,0,0,0.35)'),
    }),
    screen,
    offset(x + inset, y + inset, style.content ?? []),
    rect(
      x + width / 2 - width * 0.15,
      y + inset + width * 0.035,
      width * 0.3,
      width * 0.085,
      '#0b0b0f',
      {
        name: 'Dynamic island',
        cornerRadius: width * 0.05,
      },
    ),
  ];
  return group(
    style.rotation === undefined
      ? parts
      : rotateNodes(style.rotation, x + width / 2, y + height / 2, parts),
  );
};

export const phoneScreen = (width: number) => {
  const inset = width * 0.045;
  return { width: width - inset * 2, height: width * PHONE_RATIO - inset * 2 };
};

interface BrowserStyle {
  fill?: Fill;
  bar?: string;
  dots?: readonly string[];
  radius?: number;
  content?: Nodes[];
}

export const browser = (
  x: number,
  y: number,
  width: number,
  height: number,
  style: BrowserStyle = {},
) => {
  const bar = Math.max(28, height * 0.08);
  const dots = style.dots ?? ['#ff5f57', '#febc2e', '#28c840'];
  return group(
    rect(x, y, width, height, style.fill ?? '#ffffff', {
      name: 'Browser window',
      cornerRadius: style.radius ?? 18,
      ...shadow(40, 18, 'rgba(15,23,42,0.18)'),
    }),
    rect(x, y, width, bar, style.bar ?? '#f1f5f9', {
      name: 'Browser bar',
      cornerRadius: style.radius ?? 18,
    }),
    rect(x, y + bar - 10, width, 10, style.bar ?? '#f1f5f9', { name: 'Browser bar edge' }),
    dots.map((color, index) =>
      circle(x + bar * 0.6 + index * bar * 0.45, y + bar / 2, bar * 0.14, color),
    ),
    offset(x, y + bar, style.content ?? []),
  );
};

interface LaptopStyle {
  screen?: Fill;
  photo?: PosterPhotoName;
  body?: string;
  content?: Nodes[];
}

export const laptop = (x: number, y: number, width: number, style: LaptopStyle = {}) => {
  const lidHeight = width * 0.62;
  const bezel = width * 0.025;
  const screenWidth = width - bezel * 2;
  const screenHeight = lidHeight - bezel * 2;
  const body = style.body ?? '#1f2937';
  const screen =
    style.photo === undefined
      ? rect(x + bezel, y + bezel, screenWidth, screenHeight, style.screen ?? '#ffffff', {
          name: 'Laptop screen',
        })
      : photo(style.photo, x + bezel, y + bezel, screenWidth, screenHeight);
  return group(
    rect(x, y, width, lidHeight, body, { name: 'Laptop lid', cornerRadius: width * 0.02 }),
    screen,
    offset(x + bezel, y + bezel, style.content ?? []),
    rect(x - width * 0.08, y + lidHeight, width * 1.16, width * 0.035, '#cbd5e1', {
      name: 'Laptop base',
      cornerRadius: width * 0.012,
      ...shadow(30, 12, 'rgba(0,0,0,0.2)'),
    }),
  );
};
