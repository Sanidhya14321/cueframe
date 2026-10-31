import { Composition } from 'remotion';
import {
  type LetterCascadeProps,
  letterCascadeDefaults,
  letterCascadeMeta,
  letterCascadeSchema,
} from '@/schemas/clips/imported/letter-cascade';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const LetterCascade = (props: LetterCascadeProps) => <WebMotion variant={2} {...props} />;
export const letterCascadeScene: SceneModule = {
  id: 'letter-cascade',
  component: LetterCascade,
  render: (key) => (
    <Composition
      key={key}
      id="letter-cascade"
      component={LetterCascade}
      schema={letterCascadeSchema}
      defaultProps={letterCascadeDefaults}
      width={letterCascadeMeta.width}
      height={letterCascadeMeta.height}
      fps={letterCascadeMeta.fps}
      durationInFrames={letterCascadeMeta.durationInFrames}
    />
  ),
};
