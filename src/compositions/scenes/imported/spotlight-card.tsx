import { Composition } from 'remotion';
import {
  type SpotlightCardProps,
  spotlightCardDefaults,
  spotlightCardMeta,
  spotlightCardSchema,
} from '@/schemas/clips/imported/spotlight-card';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const SpotlightCard = (props: SpotlightCardProps) => <WebMotion variant={9} {...props} />;
export const spotlightCardScene: SceneModule = {
  id: 'spotlight-card',
  component: SpotlightCard,
  render: (key) => (
    <Composition
      key={key}
      id="spotlight-card"
      component={SpotlightCard}
      schema={spotlightCardSchema}
      defaultProps={spotlightCardDefaults}
      width={spotlightCardMeta.width}
      height={spotlightCardMeta.height}
      fps={spotlightCardMeta.fps}
      durationInFrames={spotlightCardMeta.durationInFrames}
    />
  ),
};
