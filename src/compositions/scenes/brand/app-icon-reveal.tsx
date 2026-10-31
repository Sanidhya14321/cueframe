import { Composition, useCurrentFrame } from 'remotion';
import {
  type AppIconRevealProps,
  appIconRevealDefaults,
  appIconRevealMeta,
  appIconRevealSchema,
} from '@/schemas';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { artUrl } from '../../promo/screen-assets';
import { AppIconTile } from '../../promo/set-pieces';
import { Stage } from '../../promo/stage';
import { TypedLabel } from '../../promo/text-plane';
import { cameraPush, settle, swingAngle, turn, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const LABEL_LIFT = 0.004;

export const AppIconReveal = ({
  brandName,
  icon,
  reveal,
  wordmark,
  camera,
  look,
  stage,
  motion,
}: AppIconRevealProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const push = cameraPush(frame, camera.pushIn, camera.pushFrames);
  const swing = swingAngle(
    frame,
    camera.orbitAt,
    camera.orbitFrames,
    camera.orbitAngle,
    camera.orbitPeak,
  );
  const flip = tween(frame, [reveal.flipAt, reveal.flipAt + reveal.flipFrames], [0, 1], turn);
  const lift = Math.sin(Math.PI * flip) * reveal.lift;
  const turned = Math.PI * (1 + 2 * reveal.spins) * (1 - flip);
  const sideways = reveal.flipFrom === 'right' || reveal.flipFrom === 'left';
  const sign = reveal.flipFrom === 'right' || reveal.flipFrom === 'bottom' ? 1 : -1;
  const bob = Math.sin(frame / 32) * motion.float;
  const shown = (index: number): number => {
    const start = reveal.typeAt + index * reveal.letterFrames;
    return tween(frame, [start, start + reveal.letterFade], [0, 1], settle);
  };
  return (
    <PromoLayer
      look={look}
      motion={motion}
      focusX={50 + Math.sin((frame - 60) / 80) * camera.backdropSweep}
    >
      <Stage
        stage={stage}
        dark={isDarkLook(look)}
        distanceScale={push}
        backdropZ={-40}
        keyPosition={[camera.lightX, camera.lightY, camera.lightZ]}
      >
        <group position={[0, 0, camera.orbitPivot]} rotation={[0, swing, 0]}>
          <group position={[0, 0, -camera.orbitPivot]}>
            <mesh position={[0, 0, icon.z + LABEL_LIFT / 2]} receiveShadow>
              <planeGeometry args={[14, 14]} />
              <shadowMaterial transparent opacity={stage.shadow} color="#15151a" />
            </mesh>
            <group
              position={[0, icon.y + bob, icon.z + icon.depth / 2 + lift]}
              rotation={[
                0.1 * lift + (sideways ? 0 : sign * turned),
                sideways ? sign * turned : 0,
                0,
              ]}
            >
              <AppIconTile
                size={icon.size}
                depth={icon.depth}
                color={icon.faceColor}
                backColor={icon.color}
                glyphColor={icon.artTint}
                glyph={artUrl(icon.art)}
                glyphScale={icon.artScale}
                roughness={icon.roughness}
                reflections={stage.reflections}
              />
            </group>
            <group
              position={[
                0,
                icon.y - icon.size / 2 - wordmark.gap - wordmark.height / 2,
                icon.z + LABEL_LIFT,
              ]}
            >
              <TypedLabel
                text={brandName}
                shown={shown}
                color={wordmark.color}
                weight={Number(wordmark.weight)}
                tracking={wordmark.tracking}
                height={wordmark.height}
              />
            </group>
          </group>
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const appIconRevealScene: SceneModule = {
  id: 'app-icon-reveal',
  component: AppIconReveal,
  render: (key) => (
    <Composition
      key={key}
      id="app-icon-reveal"
      component={AppIconReveal}
      schema={appIconRevealSchema}
      defaultProps={appIconRevealDefaults}
      durationInFrames={appIconRevealMeta.durationInFrames}
      fps={appIconRevealMeta.fps}
      width={appIconRevealMeta.width}
      height={appIconRevealMeta.height}
    />
  ),
};
