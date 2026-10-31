import { Composition } from 'remotion';
import {
  type TypeScanProps,
  typeScanDefaults,
  typeScanMeta,
  typeScanSchema,
} from '@/schemas/clips/imported/type-scan';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const TypeScan = (props: TypeScanProps) => <WebMotion variant={5} {...props} />;
export const typeScanScene: SceneModule = {
  id: 'type-scan',
  component: TypeScan,
  render: (key) => (
    <Composition
      key={key}
      id="type-scan"
      component={TypeScan}
      schema={typeScanSchema}
      defaultProps={typeScanDefaults}
      width={typeScanMeta.width}
      height={typeScanMeta.height}
      fps={typeScanMeta.fps}
      durationInFrames={typeScanMeta.durationInFrames}
    />
  ),
};
