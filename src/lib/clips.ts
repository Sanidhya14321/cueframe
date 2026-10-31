import 'server-only';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { VideoGalleryItem } from '@/components/gallery/clip-gallery';
import { firstFrameFileName } from '@/lib/preview-files';
import { videoMeta } from '@/lib/video-meta';
import { CLIP_REGISTRY, type ClipId } from '@/schemas';
import { repoRoot } from './repo-root';

const previewUrl = (fileName: string): string | null =>
  existsSync(join(repoRoot(), 'public', 'previews', fileName)) ? `/previews/${fileName}` : null;

export const clipPreviewVideo = (id: ClipId): string | null => previewUrl(`${id}.mp4`);

export const listClips = (): VideoGalleryItem[] =>
  CLIP_REGISTRY.map((meta) => ({
    kind: 'video',
    meta: videoMeta(meta),
    video: clipPreviewVideo(meta.id),
    firstFrame: previewUrl(firstFrameFileName(meta.id)),
    width: meta.width,
    height: meta.height,
  }));
