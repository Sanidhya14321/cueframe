import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { galleryPreviewsDir } from '@/render/paths';
import { galleryPreviewFileNames } from '@/render/render-gallery-preview';
import { CLIP_REGISTRY } from '@/schemas';

describe('gallery previews', () => {
  it('commits a preview video, first frame and still for every clip', () => {
    const missing = CLIP_REGISTRY.flatMap((meta) =>
      galleryPreviewFileNames(meta.id).filter(
        (file) => !existsSync(join(galleryPreviewsDir, file)),
      ),
    );
    expect(missing).toEqual([]);
  });
});
