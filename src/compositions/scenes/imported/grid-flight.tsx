import { Composition } from 'remotion';
import {
  type GridFlightProps,
  gridFlightDefaults,
  gridFlightMeta,
  gridFlightSchema,
} from '@/schemas/clips/imported/grid-flight';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const GridFlight = (props: GridFlightProps) => <WebMotion variant={14} {...props} />;
export const gridFlightScene: SceneModule = {
  id: 'grid-flight',
  component: GridFlight,
  render: (key) => (
    <Composition
      key={key}
      id="grid-flight"
      component={GridFlight}
      schema={gridFlightSchema}
      defaultProps={gridFlightDefaults}
      width={gridFlightMeta.width}
      height={gridFlightMeta.height}
      fps={gridFlightMeta.fps}
      durationInFrames={gridFlightMeta.durationInFrames}
    />
  ),
};
