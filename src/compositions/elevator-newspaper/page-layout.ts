import type { ElevatorNewspaperProps } from '@/schemas';
import { drawCover } from './page-cover';
import { drawStory } from './page-story';

export type PageCopy = Pick<ElevatorNewspaperProps, 'masthead' | 'cover' | 'story' | 'ink'> & {
  print: Pick<ElevatorNewspaperProps['print'], 'softness' | 'paperTint'>;
};

export type PageSide = 'cover' | 'story';

const PAGE_WIDTH = 1024;
const PAGE_HEIGHT = 1400;

export const drawPage = (
  canvas: HTMLCanvasElement,
  side: PageSide,
  copy: PageCopy,
  photo: CanvasImageSource | null,
) => {
  const art = document.createElement('canvas');
  art.width = PAGE_WIDTH;
  art.height = PAGE_HEIGHT;
  const context = art.getContext('2d');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const target = canvas.getContext('2d');
  if (context === null || target === null) {
    return;
  }
  context.save();
  context.globalAlpha = copy.print.paperTint;
  context.fillStyle = copy.ink.paper;
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.restore();
  context.textBaseline = 'alphabetic';
  const draw = side === 'cover' ? drawCover : drawStory;
  draw(context, copy, photo, [PAGE_WIDTH, PAGE_HEIGHT]);
  target.filter = copy.print.softness > 0 ? `blur(${copy.print.softness * 2}px)` : 'none';
  target.drawImage(art, 0, 0);
};
