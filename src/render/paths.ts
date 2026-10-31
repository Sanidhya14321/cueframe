import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const srcDir = resolve(fileURLToPath(new URL('../', import.meta.url)));
export const compositionsEntry = fileURLToPath(
  new URL('../compositions/entry.ts', import.meta.url),
);
export const galleryPreviewsDir = fileURLToPath(new URL('../../public/previews/', import.meta.url));
export const clipUpdatedAtFile = fileURLToPath(
  new URL('../schemas/clip-updated-at.json', import.meta.url),
);
export const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));
export const posterPreviewsDir = fileURLToPath(
  new URL('../../public/poster-previews/', import.meta.url),
);
export const posterPreviewEntry = fileURLToPath(
  new URL('./posters/preview-entry.tsx', import.meta.url),
);
export const posterUpdatedAtFile = fileURLToPath(
  new URL('../posters/poster-updated-at.json', import.meta.url),
);
