import { Composition } from 'remotion';
import {
  type RippleFieldProps,
  rippleFieldDefaults,
  rippleFieldMeta,
  rippleFieldSchema,
} from '@/schemas/clips/imported/ripple-field';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const RippleField = (props: RippleFieldProps) => <WebMotion variant={12} {...props} />;
export const rippleFieldScene: SceneModule = {
  id: 'ripple-field',
  component: RippleField,
  render: (key) => (
    <Composition
      key={key}
      id="ripple-field"
      component={RippleField}
      schema={rippleFieldSchema}
      defaultProps={rippleFieldDefaults}
      width={rippleFieldMeta.width}
      height={rippleFieldMeta.height}
      fps={rippleFieldMeta.fps}
      durationInFrames={rippleFieldMeta.durationInFrames}
    />
  ),
};
