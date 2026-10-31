import { Composition } from 'remotion';
import {
  type AuroraRibbonsProps,
  auroraRibbonsDefaults,
  auroraRibbonsMeta,
  auroraRibbonsSchema,
} from '@/schemas/clips/imported/aurora-ribbons';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const AuroraRibbons = (props: AuroraRibbonsProps) => <WebMotion variant={22} {...props} />;
export const auroraRibbonsScene: SceneModule = {
  id: 'aurora-ribbons',
  component: AuroraRibbons,
  render: (key) => (
    <Composition
      key={key}
      id="aurora-ribbons"
      component={AuroraRibbons}
      schema={auroraRibbonsSchema}
      defaultProps={auroraRibbonsDefaults}
      width={auroraRibbonsMeta.width}
      height={auroraRibbonsMeta.height}
      fps={auroraRibbonsMeta.fps}
      durationInFrames={auroraRibbonsMeta.durationInFrames}
    />
  ),
};
