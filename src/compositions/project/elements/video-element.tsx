import { Video } from '@remotion/media';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { VideoElement } from '@/project';
import { MediaPlaceholder } from './media-placeholder';

export const VideoElementView = ({ element }: { element: VideoElement }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale =
    element.punchIns?.find((region) => frame >= region.from && frame <= region.to)?.scale ?? 1;
  if (element.src === '') {
    return <MediaPlaceholder label="video" />;
  }
  return (
    <Video
      src={element.src}
      trimBefore={element.sourceFrom ?? 0}
      objectFit="contain"
      style={{ width, height, transform: `scale(${scale})` }}
    />
  );
};
