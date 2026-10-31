import { renderDesignDataUrl } from '@/components/design-editor/render-design';
import { POSTERS } from '@/posters';

interface PosterPreviewApi {
  render: (posterId: string, width: number) => Promise<string>;
}

const api: PosterPreviewApi = {
  render: (posterId, width) => {
    const design = POSTERS.find((item) => item.meta.id === posterId)?.build();
    if (design === undefined) {
      return Promise.reject(new Error(`Unknown poster ${posterId}`));
    }
    return renderDesignDataUrl(design, {
      pixelRatio: width / design.width,
      mimeType: 'image/jpeg',
      quality: 0.82,
    });
  },
};

Object.assign(window, { posterPreview: api });
