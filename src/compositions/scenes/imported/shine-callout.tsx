import { Composition } from 'remotion';
import {
  type ShineCalloutProps,
  shineCalloutDefaults,
  shineCalloutMeta,
  shineCalloutSchema,
} from '@/schemas/clips/imported/shine-callout';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const ShineCallout = (props: ShineCalloutProps) => <WebMotion variant={21} {...props} />;
export const shineCalloutScene: SceneModule = {
  id: 'shine-callout',
  component: ShineCallout,
  render: (key) => (
    <Composition
      key={key}
      id="shine-callout"
      component={ShineCallout}
      schema={shineCalloutSchema}
      defaultProps={shineCalloutDefaults}
      width={shineCalloutMeta.width}
      height={shineCalloutMeta.height}
      fps={shineCalloutMeta.fps}
      durationInFrames={shineCalloutMeta.durationInFrames}
    />
  ),
};
