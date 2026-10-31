import { Composition } from 'remotion';
import {
  type PhoneStackProps,
  phoneStackDefaults,
  phoneStackMeta,
  phoneStackSchema,
} from '@/schemas/clips/imported/phone-stack';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const PhoneStack = (props: PhoneStackProps) => <WebMotion variant={20} {...props} />;
export const phoneStackScene: SceneModule = {
  id: 'phone-stack',
  component: PhoneStack,
  render: (key) => (
    <Composition
      key={key}
      id="phone-stack"
      component={PhoneStack}
      schema={phoneStackSchema}
      defaultProps={phoneStackDefaults}
      width={phoneStackMeta.width}
      height={phoneStackMeta.height}
      fps={phoneStackMeta.fps}
      durationInFrames={phoneStackMeta.durationInFrames}
    />
  ),
};
