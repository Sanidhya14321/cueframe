import { type FC, useEffect, useState } from 'react';
import { AbsoluteFill, useDelayRender } from 'remotion';
import type { CompositionElement } from '@/project';
import { type ClipId, isClipId } from '@/schemas';
import { loadedSceneComponent, loadSceneComponent } from '../../scene-loader';

const LazyScene = ({ clipId, props }: { clipId: ClipId; props: Record<string, unknown> }) => {
  const { delayRender, continueRender } = useDelayRender();
  const [Component, setComponent] = useState<FC<Record<string, unknown>> | null>(() =>
    loadedSceneComponent(clipId),
  );
  const [handle] = useState(() =>
    Component === null ? delayRender(`Loading the ${clipId} scene`) : null,
  );

  useEffect(() => {
    if (Component !== null) {
      return;
    }
    loadSceneComponent(clipId)
      .then(() => {
        setComponent(() => loadedSceneComponent(clipId));
        if (handle !== null) {
          continueRender(handle);
        }
      })
      .catch(() => {
        setComponent(() => () => (
          <AbsoluteFill
            style={{
              background: '#18181b',
              color: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Animation unavailable
          </AbsoluteFill>
        ));
        if (handle !== null) {
          continueRender(handle);
        }
      });
  }, [Component, clipId, continueRender, handle]);

  return Component === null ? null : <Component {...props} />;
};

export const CompositionElementView = ({ element }: { element: CompositionElement }) => {
  if (!isClipId(element.clipId)) {
    return null;
  }
  return (
    <AbsoluteFill>
      <LazyScene key={element.clipId} clipId={element.clipId} props={element.props} />
    </AbsoluteFill>
  );
};
