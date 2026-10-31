import { Composition, useCurrentFrame } from 'remotion';
import {
  type ReliefBackdropProps,
  reliefBackdropDefaults,
  reliefBackdropMeta,
  reliefBackdropSchema,
} from '@/schemas';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { clayMaterial } from '../../promo/set-materials';
import { ReliefWall } from '../../promo/set-pieces';
import { Stage, type Vec3 } from '../../promo/stage';
import { cameraPush, swingAngle } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const MATTE = 0.3;

export const ReliefBackdrop = ({
  wallColor,
  ringColor,
  roughness,
  rings,
  camera,
  look,
  stage,
  motion,
}: ReliefBackdropProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const push = cameraPush(frame, camera.pushIn, camera.pushFrames);
  const swing = swingAngle(
    frame,
    camera.orbitAt,
    camera.orbitFrames,
    camera.orbitAngle,
    camera.orbitPeak,
  );
  const view: Vec3 = [-camera.offsetX, -camera.offsetY, 0];
  const clayReflections = stage.reflections * MATTE;
  return (
    <PromoLayer look={{ ...look, showBackdrop: false }} motion={motion}>
      <Stage
        stage={stage}
        dark={isDarkLook(look)}
        target={view}
        cameraOffset={view}
        distanceScale={push}
        backdropZ={-40}
        keyPosition={[camera.lightX, camera.lightY, camera.lightZ]}
        shadowExtent={3}
        far={600}
      >
        <group position={[0, 0, camera.orbitPivot]} rotation={[0, swing, 0]}>
          <group position={[0, 0, -camera.orbitPivot]}>
            {look.showBackdrop ? (
              <mesh material={clayMaterial(wallColor, roughness, clayReflections)} receiveShadow>
                <planeGeometry args={[900, 300]} />
              </mesh>
            ) : null}
            <ReliefWall
              layout={rings}
              bevel={rings.bevel}
              color={ringColor}
              roughness={roughness}
              reflections={clayReflections}
              showWall={false}
            />
          </group>
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const reliefBackdropScene: SceneModule = {
  id: 'relief-backdrop',
  component: ReliefBackdrop,
  render: (key) => (
    <Composition
      key={key}
      id="relief-backdrop"
      component={ReliefBackdrop}
      schema={reliefBackdropSchema}
      defaultProps={reliefBackdropDefaults}
      durationInFrames={reliefBackdropMeta.durationInFrames}
      fps={reliefBackdropMeta.fps}
      width={reliefBackdropMeta.width}
      height={reliefBackdropMeta.height}
    />
  ),
};
