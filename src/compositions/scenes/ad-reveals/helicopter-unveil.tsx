import { useMemo } from 'react';
import { AbsoluteFill, Composition, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import {
  type HelicopterUnveilProps,
  helicopterUnveilDefaults,
  helicopterUnveilMeta,
  helicopterUnveilSchema,
} from '@/schemas';
import { resolveCustom } from '../../promo/screen-assets';
import { settle, smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { Billboard } from '../../unveil/billboard';
import { Cloth, Rod } from '../../unveil/cloth';
import { clothRun } from '../../unveil/cloth-sim';
import { cameraShot, helicopterPose, hookAt } from '../../unveil/flight';
import { Ground } from '../../unveil/ground';
import { Helicopter } from '../../unveil/helicopter';
import { drawPoster, POSTER_ASPECT, usePosterFonts } from '../../unveil/poster-art';
import { Roadside } from '../../unveil/roadside';
import { Clouds } from '../../unveil/sky';
import { Skyline } from '../../unveil/skyline';
import { Traffic } from '../../unveil/traffic';
import { Trees } from '../../unveil/trees';
import { UnveilStage } from '../../unveil/unveil-stage';

const GONE_AFTER = 150;

const usePosterArt = (poster: HelicopterUnveilProps['poster']) => {
  usePosterFonts();
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    drawPoster(canvas, poster);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    return { texture, dataUrl: canvas.toDataURL('image/png') };
  }, [poster]);
};

const HelicopterUnveil = ({
  poster,
  cloth,
  helicopter,
  sky,
  ground,
  camera,
  timing,
  outro,
  motion,
}: HelicopterUnveilProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const art = usePosterArt(poster);
  const run = useMemo(
    () => clothRun(cloth, timing, timing.liftStart + GONE_AFTER),
    [cloth, timing],
  );
  const customUrl = poster.image.length > 0 ? resolveCustom(poster.image) : undefined;
  const shot = cameraShot(frame, durationInFrames, camera);
  const pose = helicopterPose(frame, timing);
  const airborne = frame < timing.liftStart + GONE_AFTER;
  const outroEnd = timing.cardStart + timing.cardFrames;
  const fade = outro.showCard
    ? tween(frame, [timing.cardStart - 24, timing.cardStart + 8], [0, 1], smooth)
    : 0;
  const blur = fade * outro.blur;
  const landing: [number, number] = [timing.cardStart, outroEnd + 18];
  const arrive = tween(frame, landing, [0, 1], settle);
  const cardWidth = Math.round(width * outro.cardWidth);
  const cardHeight = Math.round(cardWidth / POSTER_ASPECT);
  const cardOpacity = tween(
    frame,
    [timing.cardStart, timing.cardStart + timing.cardFrames * 0.6],
    [0, 1],
  );
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill style={{ backgroundColor: sky.haze, overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            filter: blur > 0 ? `blur(${blur}px) brightness(${1 - fade * outro.dim})` : undefined,
            transform: blur > 0 ? `scale(${1 + (blur * 3) / (height / 2)})` : undefined,
          }}
        >
          <UnveilStage shot={shot} fov={camera.fieldOfView} sky={sky}>
            <Clouds sky={sky} frame={frame} />
            <Ground ground={ground} />
            <Trees tone={ground.trees} />
            <Skyline tint={ground.skyline} />
            {ground.showRoad ? <Roadside /> : null}
            {ground.showRoad && ground.traffic ? <Traffic frame={frame} /> : null}
            <group rotation={[0, camera.boardAngle, 0]}>
              <Billboard
                posterMap={art.texture}
                posterUrl={customUrl}
                frameColor={ground.frame}
                poleColor={ground.pole}
              />
              {airborne ? (
                <>
                  <Cloth frame={frame} run={run} cloth={cloth} cableColor={helicopter.cables} />
                  <Rod
                    from={hookAt(frame, timing)}
                    to={pose.position}
                    radius={0.05}
                    color={helicopter.cables}
                  />
                  <group position={pose.position} rotation={[pose.roll, 0, pose.pitch]}>
                    <Helicopter frame={frame} helicopter={helicopter} />
                  </group>
                </>
              ) : null}
            </group>
          </UnveilStage>
        </AbsoluteFill>
        {outro.showCard && frame >= timing.cardStart ? (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Img
              src={customUrl ?? art.dataUrl}
              style={{
                width: cardWidth,
                height: cardHeight,
                objectFit: 'cover',
                opacity: cardOpacity,
                transform: `translateY(${(1 - arrive) * 60}px) scale(${0.62 + arrive * 0.38})`,
                willChange: 'transform',
                boxShadow: `0 ${40 * arrive}px ${90 * arrive}px rgba(0, 0, 0, ${outro.shadow})`,
              }}
            />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const helicopterUnveilScene: SceneModule = {
  id: 'helicopter-unveil',
  component: HelicopterUnveil,
  render: (key) => (
    <Composition
      key={key}
      id="helicopter-unveil"
      component={HelicopterUnveil}
      schema={helicopterUnveilSchema}
      defaultProps={helicopterUnveilDefaults}
      durationInFrames={helicopterUnveilMeta.durationInFrames}
      fps={helicopterUnveilMeta.fps}
      width={helicopterUnveilMeta.width}
      height={helicopterUnveilMeta.height}
    />
  ),
};
