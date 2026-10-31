import { useThree } from '@react-three/fiber';
import {
  Bloom,
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  N8AO,
  ToneMapping,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { type ReactElement, useEffect } from 'react';
import { useDelayRender } from 'remotion';
import type { Vec3 } from '../stage';

export interface DeskLens {
  ambientOcclusion: number;
  occlusionRadius: number;
  depthOfField: number;
  focusRange: number;
  bloom: number;
  contrast: number;
  motionBlur: number;
  shutterAngle: number;
  screenGlow: number;
}

const ComposerPrimer = () => {
  const advance = useThree((state) => state.advance);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    const handle = delayRender('Waiting for the effect composer to draw its first frame');
    const request = requestAnimationFrame(() => {
      advance(performance.now());
      continueRender(handle);
    });
    return () => {
      cancelAnimationFrame(request);
      continueRender(handle);
    };
  }, [advance, delayRender, continueRender]);
  return null;
};

export const DeskEffects = ({
  lens,
  focus,
  multisampling,
}: {
  lens: DeskLens;
  focus: Vec3;
  multisampling: number;
}) => {
  const effects: ReactElement[] = [];
  if (lens.ambientOcclusion > 0) {
    effects.push(
      <N8AO
        key="ao"
        aoRadius={lens.occlusionRadius}
        intensity={lens.ambientOcclusion}
        distanceFalloff={1}
        quality="high"
      />,
    );
  }
  if (lens.depthOfField > 0) {
    effects.push(
      <DepthOfField
        key="dof"
        target={focus}
        worldFocusRange={lens.focusRange}
        bokehScale={lens.depthOfField}
      />,
    );
  }
  if (lens.bloom > 0) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={lens.bloom}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.2}
        mipmapBlur
      />,
    );
  }
  if (lens.contrast !== 0) {
    effects.push(<BrightnessContrast key="contrast" contrast={lens.contrast} />);
  }
  effects.push(<ToneMapping key="tone" mode={ToneMappingMode.NEUTRAL} />);
  return (
    <>
      <EffectComposer multisampling={multisampling}>{effects}</EffectComposer>
      <ComposerPrimer />
    </>
  );
};
