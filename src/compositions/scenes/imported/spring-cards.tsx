import { Composition } from 'remotion';
import {
  type SpringCardsProps,
  springCardsDefaults,
  springCardsMeta,
  springCardsSchema,
} from '@/schemas/clips/imported/spring-cards';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const SpringCards = (props: SpringCardsProps) => <WebMotion variant={17} {...props} />;
export const springCardsScene: SceneModule = {
  id: 'spring-cards',
  component: SpringCards,
  render: (key) => (
    <Composition
      key={key}
      id="spring-cards"
      component={SpringCards}
      schema={springCardsSchema}
      defaultProps={springCardsDefaults}
      width={springCardsMeta.width}
      height={springCardsMeta.height}
      fps={springCardsMeta.fps}
      durationInFrames={springCardsMeta.durationInFrames}
    />
  ),
};
