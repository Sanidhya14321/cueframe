import { Composition } from 'remotion';
import {
  type RevealWipeProps,
  revealWipeDefaults,
  revealWipeMeta,
  revealWipeSchema,
} from '@/schemas/clips/imported/reveal-wipe';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const RevealWipe = (props: RevealWipeProps) => <WebMotion variant={18} {...props} />;
export const revealWipeScene: SceneModule = {
  id: 'reveal-wipe',
  component: RevealWipe,
  render: (key) => (
    <Composition
      key={key}
      id="reveal-wipe"
      component={RevealWipe}
      schema={revealWipeSchema}
      defaultProps={revealWipeDefaults}
      width={revealWipeMeta.width}
      height={revealWipeMeta.height}
      fps={revealWipeMeta.fps}
      durationInFrames={revealWipeMeta.durationInFrames}
    />
  ),
};
