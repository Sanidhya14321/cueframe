'use client';

import type Konva from 'konva';
import { createRoot } from 'react-dom/client';
import { type Design, iconDataUrl } from '@/design';
import { DesignStage } from './design-content';
import { loadFontFamilies } from './font-loader';
import { loadImage } from './image-cache';

const PLACEHOLDER_ICON = iconDataUrl('image', '#94a3b8', 1.5, 256);

const imageSources = (design: Design): string[] =>
  design.elements.flatMap((element) => {
    if (element.type === 'image') {
      return [element.src === '' ? PLACEHOLDER_ICON : element.src];
    }
    if (element.type === 'icon') {
      return [iconDataUrl(element.icon, element.color, element.strokeWidth)];
    }
    return [];
  });

const fontFamilies = (design: Design): string[] =>
  design.elements.flatMap((element) => (element.type === 'text' ? [element.fontFamily] : []));

const preloadDesign = async (design: Design): Promise<void> => {
  await Promise.all([
    loadFontFamilies(fontFamilies(design)),
    ...imageSources(design).map(loadImage),
  ]);
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const waitForStage = async (
  mounted: { stage: Konva.Stage | null },
  attempts: number,
): Promise<Konva.Stage | null> => {
  if (mounted.stage !== null || attempts <= 0) {
    return mounted.stage;
  }
  await nextFrame();
  return waitForStage(mounted, attempts - 1);
};

export interface RenderDesignOptions {
  pixelRatio: number;
  mimeType?: 'image/png' | 'image/jpeg';
  quality?: number;
}

const renderDesignCanvas = async (
  design: Design,
  { pixelRatio }: Pick<RenderDesignOptions, 'pixelRatio'>,
): Promise<HTMLCanvasElement> => {
  await preloadDesign(design);
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-100000px';
  host.style.top = '0';
  document.body.appendChild(host);
  const root = createRoot(host);
  const mounted: { stage: Konva.Stage | null } = { stage: null };
  try {
    root.render(
      <DesignStage
        design={design}
        scale={1}
        fontsVersion={1}
        stageRef={(node) => {
          mounted.stage = node;
        }}
      />,
    );
    const stage = await waitForStage(mounted, 30);
    if (stage === null) {
      throw new Error('Design stage did not mount');
    }
    await nextFrame();
    await nextFrame();
    return stage.toCanvas({ pixelRatio });
  } finally {
    root.unmount();
    host.remove();
  }
};

export const renderDesignDataUrl = async (
  design: Design,
  { pixelRatio, mimeType = 'image/png', quality = 0.92 }: RenderDesignOptions,
): Promise<string> => {
  const canvas = await renderDesignCanvas(design, { pixelRatio });
  return canvas.toDataURL(mimeType, quality);
};

export const renderDesignBlob = async (
  design: Design,
  { pixelRatio, mimeType = 'image/png', quality = 0.92 }: RenderDesignOptions,
): Promise<Blob> => {
  const canvas = await renderDesignCanvas(design, { pixelRatio });
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob === null ? reject(new Error('Export failed')) : resolve(blob)),
      mimeType,
      quality,
    );
  });
};
