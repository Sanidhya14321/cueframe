import { Composition, useCurrentFrame } from 'remotion';
import {
  type MessageAriseProps,
  messageAriseDefaults,
  messageAriseMeta,
  messageAriseSchema,
} from '@/schemas';
import { bodyFont } from '../../promo/fonts';
import { arrivalFrame, MessageStack } from '../../promo/message-stack';
import { GLASS_SURFACE, PHONE } from '../../promo/phone-geometry';
import { PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer, placementFrame } from '../../promo/promo-layer';
import { Stage, type Vec3 } from '../../promo/stage';
import { ShadowCatcher, Sweep } from '../../promo/sweep';
import { settle, smooth, tween } from '../../promo/timing';
import { FadeIn, Headline } from '../../promo/typography';
import type { SceneModule } from '../../scene-module';

const SURFACE_LIFT = 0.004;
const PULSE_ATTACK = 6;
const SHADOW_EXTENT = 2.4;

const screenPulse = (
  frame: number,
  count: number,
  stack: MessageAriseProps['stack'],
  pulseFrames: number,
): number => {
  let peak = 0;
  for (let index = 0; index < count; index++) {
    const at = arrivalFrame(stack, index);
    const swell = tween(frame, [at, at + PULSE_ATTACK], [0, 1], smooth);
    const fade = tween(frame, [at + PULSE_ATTACK, at + PULSE_ATTACK + pulseFrames], [1, 0], smooth);
    peak = Math.max(peak, Math.min(swell, fade));
  }
  return peak;
};

const Eyebrow = ({ text, color, accent }: { text: string; color: string; accent: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 26,
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: 19,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
    }}
  >
    <div style={{ width: 28, height: 2, background: accent }} />
    {text}
  </div>
);

const MessageArise = ({
  messages,
  card,
  stack,
  phone,
  device,
  surface,
  camera,
  headline,
  look,
  stage,
  motion,
}: MessageAriseProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const dark = isDarkLook(look);
  const progress = tween(frame, [0, camera.frames], [0, 1], settle);
  const elevation = camera.elevationFrom + (camera.elevationTo - camera.elevationFrom) * progress;
  const orbit = camera.orbitFrom + (camera.orbitTo - camera.orbitFrom) * progress;
  const distance = stage.cameraDistance;
  const target: Vec3 = [camera.aimX, camera.aimY, 0];
  const cameraOffset: Vec3 = [
    camera.aimX + distance * Math.sin(orbit) * Math.cos(elevation),
    camera.aimY + distance * Math.sin(elevation),
    distance * Math.cos(orbit) * Math.cos(elevation) - distance,
  ];
  const rest = (PHONE.depth / 2 + PHONE.plateauDepth) * device.scale;
  const surfaceY = rest + GLASS_SURFACE * device.scale + SURFACE_LIFT;
  const pulse = screenPulse(frame, messages.length, stack, device.pulseFrames);
  const brightness = device.screenDim + (1 - device.screenDim) * device.screenPulse * pulse;
  const bob = Math.sin(frame / 32) * motion.float;
  const side = device.x < 0 ? -1 : 1;
  return (
    <PromoLayer look={look} motion={motion} focusX={50 + side * 18}>
      <Stage
        stage={stage}
        dark={dark}
        target={target}
        cameraOffset={cameraOffset}
        backdropZ={-90}
        keyPosition={[camera.lightX, camera.lightY, camera.lightZ]}
        far={200}
        shadowExtent={SHADOW_EXTENT}
      >
        {surface.show ? (
          <>
            <Sweep
              color={surface.color}
              texture={surface.texture}
              textureRepeat={surface.textureRepeat}
              roughness={surface.roughness}
              curve={surface.curve}
              depth={surface.depth}
            />
            {surface.haze > 0 ? (
              <fog
                attach="fog"
                args={[look.background, distance, distance * (1 + 8 * (1 - surface.haze))]}
              />
            ) : null}
          </>
        ) : null}
        <ShadowCatcher opacity={stage.shadow} dark={dark} />
        <group position={[device.x, rest, device.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[0, 0, Math.PI / 2 + device.turn]} scale={device.scale}>
            <PhoneModel phone={phone} reflections={stage.reflections} brightness={brightness} />
          </group>
        </group>
        <group
          position={[device.x + stack.offsetX, surfaceY + bob, device.z]}
          rotation={[-elevation * card.facing, orbit * card.facing, 0, 'YXZ']}
        >
          <MessageStack
            messages={messages}
            style={card}
            stack={stack}
            frame={frame}
            surfaceY={surfaceY}
          />
        </group>
      </Stage>
      {headline.show ? (
        <div style={placementFrame(headline.placement)}>
          <div style={{ width: headline.placement.width }}>
            {headline.eyebrow === '' ? null : (
              <FadeIn start={headline.start}>
                <Eyebrow text={headline.eyebrow} color={look.muted} accent={look.accent} />
              </FadeIn>
            )}
            <Headline
              text={headline.text}
              size={headline.size}
              weight={headline.weight}
              color={look.ink}
              accent={look.accent}
              highlight={headline.highlight}
              align={headline.textAlign}
              start={headline.start + 6}
            />
          </div>
        </div>
      ) : null}
    </PromoLayer>
  );
};

export const messageAriseScene: SceneModule = {
  id: 'message-arise',
  component: MessageArise,
  render: (key) => (
    <Composition
      key={key}
      id="message-arise"
      component={MessageArise}
      schema={messageAriseSchema}
      defaultProps={messageAriseDefaults}
      durationInFrames={messageAriseMeta.durationInFrames}
      fps={messageAriseMeta.fps}
      width={messageAriseMeta.width}
      height={messageAriseMeta.height}
    />
  ),
};
