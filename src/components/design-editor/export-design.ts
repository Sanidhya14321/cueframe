'use client';

import { type Design, designSchema } from '@/design';
import { renderDesignBlob, renderDesignDataUrl } from './render-design';

export const designFileName = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'design';

const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportImage = async (
  design: Design,
  format: 'png' | 'jpg',
  scale: number,
  transparent = false,
): Promise<void> => {
  const blob = await renderDesignBlob(
    transparent && format === 'png' ? { ...design, background: 'rgba(0,0,0,0)' } : design,
    {
      pixelRatio: scale,
      mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
      quality: 0.95,
    },
  );
  downloadBlob(blob, `${designFileName(design.title)}.${format}`);
};

export const exportPdf = async (design: Design, scale: number): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: design.width >= design.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [design.width, design.height],
    hotfixes: ['px_scaling'],
    compress: true,
  });
  const dataUrl = await renderDesignDataUrl(design, {
    pixelRatio: scale,
    mimeType: 'image/jpeg',
    quality: 0.92,
  });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, design.width, design.height);
  pdf.save(`${designFileName(design.title)}.pdf`);
};

export const exportJson = (design: Design): void => {
  downloadBlob(
    new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' }),
    `${designFileName(design.title)}.json`,
  );
};

export const parseDesignJson = (text: string): Design | null => {
  try {
    const parsed = designSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
