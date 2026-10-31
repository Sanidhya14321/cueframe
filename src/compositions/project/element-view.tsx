import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import type { Element } from '@/project';
import { AudioElementView } from './elements/audio-element';
import { CaptionsElementView } from './elements/captions-element';
import { CompositionElementView } from './elements/composition-element';
import { ImageElementView } from './elements/image-element';
import { ShapeElementView } from './elements/shape-element';
import { TextElementView } from './elements/text-element';
import { VideoElementView } from './elements/video-element';
import { entranceStyle } from './entrance';

const renderInner = (element: Element) => {
  switch (element.type) {
    case 'text':
      return <TextElementView element={element} />;
    case 'image':
      return <ImageElementView element={element} />;
    case 'video':
      return <VideoElementView element={element} />;
    case 'shape':
      return <ShapeElementView element={element} />;
    default:
      return null;
  }
};

export const ElementView = ({ element }: { element: Element }) => {
  const frame = useCurrentFrame() + (element.sourceFrom ?? 0);
  if (element.type === 'audio') {
    return <AudioElementView element={element} />;
  }
  if (element.type === 'captions') {
    return <CaptionsElementView element={element} />;
  }
  const entrance = entranceStyle(element.animation, frame);
  const { transform } = element;
  const opacity = transform.opacity * entrance.opacity;
  const translateY = transform.y + entrance.translateY;
  const scale = transform.scale * entrance.scale;
  const transformCss = `translate(${transform.x}px, ${translateY}px) scale(${scale}) rotate(${transform.rotation}deg)`;

  if (element.type === 'composition') {
    return (
      <AbsoluteFill
        style={{
          opacity,
          transform: transformCss,
          transformOrigin: 'center center',
          overflow: 'hidden',
        }}
      >
        <Sequence from={-(element.sourceFrom ?? 0)}>
          <CompositionElementView element={element} />
        </Sequence>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: transformCss,
        }}
      >
        {renderInner(element)}
      </div>
    </AbsoluteFill>
  );
};
