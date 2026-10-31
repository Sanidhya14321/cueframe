import { Composition, useCurrentFrame } from 'remotion';
import {
  type SpiderWebServicesProps,
  spiderWebServicesDefaults,
  spiderWebServicesMeta,
  spiderWebServicesSchema,
} from '@/schemas';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';
import { WebScene } from '../../spider-web-services/web-scene';

const SpiderWebServices = (props: SpiderWebServicesProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  return (
    <PromoLayer look={{ ...props.look, showBackdrop: false }} motion={props.motion}>
      <WebScene props={props} frame={frame} />
    </PromoLayer>
  );
};

export const spiderWebServicesScene: SceneModule = {
  id: 'spider-web-services',
  component: SpiderWebServices,
  render: (key) => (
    <Composition
      key={key}
      id="spider-web-services"
      component={SpiderWebServices}
      schema={spiderWebServicesSchema}
      defaultProps={spiderWebServicesDefaults}
      durationInFrames={spiderWebServicesMeta.durationInFrames}
      fps={spiderWebServicesMeta.fps}
      width={spiderWebServicesMeta.width}
      height={spiderWebServicesMeta.height}
    />
  ),
};
