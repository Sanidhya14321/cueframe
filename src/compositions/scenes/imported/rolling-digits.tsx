import { Composition } from 'remotion';
import {
  type RollingDigitsProps,
  rollingDigitsDefaults,
  rollingDigitsMeta,
  rollingDigitsSchema,
} from '@/schemas/clips/imported/rolling-digits';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const RollingDigits = (props: RollingDigitsProps) => <WebMotion variant={8} {...props} />;
export const rollingDigitsScene: SceneModule = {
  id: 'rolling-digits',
  component: RollingDigits,
  render: (key) => (
    <Composition
      key={key}
      id="rolling-digits"
      component={RollingDigits}
      schema={rollingDigitsSchema}
      defaultProps={rollingDigitsDefaults}
      width={rollingDigitsMeta.width}
      height={rollingDigitsMeta.height}
      fps={rollingDigitsMeta.fps}
      durationInFrames={rollingDigitsMeta.durationInFrames}
    />
  ),
};
