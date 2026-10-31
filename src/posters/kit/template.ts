import type { DesignControl, DesignElement, Fill } from '@/design';
import { place } from './blocks';
import type { Nodes } from './elements';

export interface Template {
  width: number;
  height: number;
  build: () => Nodes[];
  compose?: () => { elements: DesignElement[]; controls: DesignControl[] };
}

export const template = (width: number, height: number, build: () => Nodes[]): Template => ({
  width,
  height,
  build,
});

export const POST_SIZE = { width: 1080, height: 1350 } as const;
export const SQUARE_SIZE = { width: 1080, height: 1080 } as const;
export const STORY_SIZE = { width: 1080, height: 1920 } as const;
export const SLIDE_SIZE = { width: 1920, height: 1080 } as const;
export const A4_SIZE = { width: 1240, height: 1754 } as const;
export const CARD_SIZE = { width: 1050, height: 600 } as const;

export const fitWidth = (item: Template, x: number, y: number, width: number): DesignElement[] =>
  place(x, y, width / item.width, item.build());

export const fitBox = (
  item: Template,
  x: number,
  y: number,
  width: number,
  height: number,
): DesignElement[] => {
  const scale = Math.min(width / item.width, height / item.height);
  return place(
    x + (width - item.width * scale) / 2,
    y + (height - item.height * scale) / 2,
    scale,
    item.build(),
  );
};

export const scaledHeight = (item: Template, width: number): number =>
  (item.height * width) / item.width;

export interface SlideTheme {
  background: Fill;
  text: string;
  muted: string;
  surface: string;
  ink: string;
  brand: string;
  accent: string;
  headFont: string;
  bodyFont: string;
}

export interface PageSize {
  width: number;
  height: number;
}

export const cycle = <T>(items: readonly T[], index: number): T => {
  const item = items[index % items.length];
  if (item === undefined) {
    throw new Error('cycle needs at least one item');
  }
  return item;
};
