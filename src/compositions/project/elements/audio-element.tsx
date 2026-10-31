import { Audio } from '@remotion/media';
import type { AudioElement } from '@/project';
export const AudioElementView = ({ element }: { element: AudioElement }) =>
  element.src ? (
    <Audio
      src={element.src}
      trimBefore={element.sourceFrom ?? 0}
      loop={element.loop ?? false}
      playbackRate={element.playbackRate ?? 1}
      volume={(frame) =>
        element.volume *
        (element.duckRegions?.some((region) => frame >= region.from && frame <= region.to)
          ? 0.22
          : 1)
      }
    />
  ) : null;
