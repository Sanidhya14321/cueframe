import { Composition } from 'remotion';
import {
  type MeteorShowerProps,
  meteorShowerDefaults,
  meteorShowerMeta,
  meteorShowerSchema,
} from '@/schemas/clips/imported/meteor-shower';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const MeteorShower = (props: MeteorShowerProps) => <WebMotion variant={15} {...props} />;
export const meteorShowerScene: SceneModule = {
  id: 'meteor-shower',
  component: MeteorShower,
  render: (key) => (
    <Composition
      key={key}
      id="meteor-shower"
      component={MeteorShower}
      schema={meteorShowerSchema}
      defaultProps={meteorShowerDefaults}
      width={meteorShowerMeta.width}
      height={meteorShowerMeta.height}
      fps={meteorShowerMeta.fps}
      durationInFrames={meteorShowerMeta.durationInFrames}
    />
  ),
};
