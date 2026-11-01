import { Img, useVideoConfig } from 'remotion';
import type { ImageElement } from '@/project';
import { MediaPlaceholder } from './media-placeholder';

export const ImageElementView = ({ element }: { element: ImageElement }) => {
  const { width, height } = useVideoConfig();
  if (element.src === '') {
    return <MediaPlaceholder label="image" />;
  }
  return <Img src={element.src} style={{ width, height, objectFit: 'contain' }} />;
};
