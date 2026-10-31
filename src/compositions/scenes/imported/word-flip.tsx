import { Composition } from 'remotion';
import {
  type WordFlipProps,
  wordFlipDefaults,
  wordFlipMeta,
  wordFlipSchema,
} from '@/schemas/clips/imported/word-flip';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const WordFlip = (props: WordFlipProps) => <WebMotion variant={4} {...props} />;
export const wordFlipScene: SceneModule = {
  id: 'word-flip',
  component: WordFlip,
  render: (key) => (
    <Composition
      key={key}
      id="word-flip"
      component={WordFlip}
      schema={wordFlipSchema}
      defaultProps={wordFlipDefaults}
      width={wordFlipMeta.width}
      height={wordFlipMeta.height}
      fps={wordFlipMeta.fps}
      durationInFrames={wordFlipMeta.durationInFrames}
    />
  ),
};
