import { Composition } from 'remotion';
import {
  type BrowserFrameProps,
  browserFrameDefaults,
  browserFrameMeta,
  browserFrameSchema,
} from '@/schemas/clips/imported/browser-frame';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const BrowserFrame = (props: BrowserFrameProps) => <WebMotion variant={19} {...props} />;
export const browserFrameScene: SceneModule = {
  id: 'browser-frame',
  component: BrowserFrame,
  render: (key) => (
    <Composition
      key={key}
      id="browser-frame"
      component={BrowserFrame}
      schema={browserFrameSchema}
      defaultProps={browserFrameDefaults}
      width={browserFrameMeta.width}
      height={browserFrameMeta.height}
      fps={browserFrameMeta.fps}
      durationInFrames={browserFrameMeta.durationInFrames}
    />
  ),
};
