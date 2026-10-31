import { Composition, Easing, useCurrentFrame } from 'remotion';
import {
  type StickerStackProps,
  stickerStackDefaults,
  stickerStackMeta,
  stickerStackSchema,
} from '@/schemas';
import { PromoLayer } from '../../promo/promo-layer';
import { smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';
import { AnimatedWord, type Pose } from '../../type3d/animated-word';
import { FrameComposer } from '../../type3d/frame-composer';
import { CameraShot, driftCamera, TypeCanvas, type Vec3 } from '../../type3d/type-canvas';
import type { WordArt } from '../../type3d/word-art';
import { seeded } from '../../unveil/random';

interface Sticker {
  art: WordArt;
  height: number;
  x: number;
  y: number;
  angle: number;
  kick: number;
}

const stickerArt = (text: string, index: number, props: StickerStackProps): WordArt => {
  const badge = text.length <= 2;
  const accent = props.look.accent;
  const shadow = props.shadow;
  if (badge) {
    return index % 2 === 0
      ? {
          text,
          color: props.paperInk,
          weight: props.weight,
          face: props.face,
          shape: 'circle',
          fill: props.paper,
          shadow,
        }
      : {
          text,
          color: props.accentInk,
          weight: props.weight,
          face: props.face,
          shape: 'circle',
          fill: accent,
          shadow,
        };
  }
  switch (index % 3) {
    case 0:
      return {
        text,
        color: props.accentInk,
        weight: props.weight,
        face: props.face,
        shape: 'pill',
        fill: accent,
        shadow,
      };
    case 1:
      return {
        text,
        color: props.paperInk,
        weight: props.weight,
        face: props.face,
        shape: 'pill',
        fill: props.paper,
        shadow,
      };
    default:
      return {
        text,
        color: props.paper,
        weight: props.weight,
        face: props.face,
        shape: 'pill',
        fill: props.look.background,
        stroke: props.paper,
        shadow,
      };
  }
};

const layoutStickers = (props: StickerStackProps): Sticker[] => {
  const random = seeded(props.seed);
  const heading = (props.angle / 180) * Math.PI;
  const along = [Math.cos(heading), Math.sin(heading)];
  const across = [-Math.sin(heading), Math.cos(heading)];
  return props.stickers
    .split('\n')
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .map((text, index) => {
      const art = stickerArt(text, index, props);
      const distance = index * props.step;
      const side = (index % 2 === 0 ? -1 : 1) * (0.45 + 0.55 * random()) * props.spread;
      return {
        art,
        height: props.size * (art.shape === 'circle' ? props.badgeScale : 1),
        x: (along[0] ?? 1) * distance + (across[0] ?? 0) * side,
        y: (along[1] ?? 0) * distance + (across[1] ?? 1) * side,
        angle: ((random() - 0.5) * 2 * props.spin * Math.PI) / 180,
        kick: ((random() < 0.5 ? -1 : 1) * props.kick * Math.PI) / 180,
      };
    });
};

const chaseTarget = (time: number, stickers: Sticker[], props: StickerStackProps): Vec3 => {
  const heading = (props.angle / 180) * Math.PI;
  let x = stickers[0]?.x ?? 0;
  let y = stickers[0]?.y ?? 0;
  stickers.forEach((sticker, index) => {
    if (index === 0) {
      return;
    }
    const start = props.delay + index * props.stagger;
    const follow = tween(time, [start - 3, start + props.chase], [0, 1], smooth);
    const previous = stickers[index - 1];
    if (previous !== undefined) {
      x += (sticker.x - previous.x) * follow;
      y += (sticker.y - previous.y) * follow;
    }
  });
  const lastStart = props.delay + (stickers.length - 1) * props.stagger;
  const tail = stickers.slice(-6);
  const centerX = tail.reduce((sum, sticker) => sum + sticker.x, 0) / Math.max(1, tail.length);
  const centerY = tail.reduce((sum, sticker) => sum + sticker.y, 0) / Math.max(1, tail.length);
  const gather = tween(time, [lastStart, lastStart + props.chase + 10], [0, 1], smooth);
  const creep = Math.max(0, time - lastStart) * 0.012;
  const chaseX = x - Math.cos(heading) * props.lead;
  const chaseY = y - Math.sin(heading) * props.lead;
  return [
    chaseX + (centerX - chaseX) * gather + Math.cos(heading) * creep,
    chaseY + (centerY - chaseY) * gather + Math.sin(heading) * creep,
    0,
  ];
};

const endGather = (time: number, stickers: Sticker[], props: StickerStackProps): number => {
  const lastStart = props.delay + (stickers.length - 1) * props.stagger;
  return tween(time, [lastStart, lastStart + props.chase + 10], [0, 1], smooth);
};

const popEase = (overshoot: number) => Easing.out(Easing.back(overshoot));

const Pile = ({ props, stickers }: { props: StickerStackProps; stickers: Sticker[] }) => (
  <>
    {stickers.map((sticker, index) => (
      <AnimatedWord
        key={`${index}:${sticker.art.text}`}
        art={sticker.art}
        height={sticker.height}
        renderOrder={index}
        pose={(time): Pose => {
          const start = props.delay + index * props.stagger;
          const grow = tween(
            time,
            [start, start + props.popFrames],
            [0, 1],
            popEase(props.overshoot),
          );
          const settleTurn = tween(time, [start, start + props.popFrames * 1.4], [0, 1], smooth);
          return {
            position: [sticker.x, sticker.y, index * 0.012],
            rotation: [0, 0, sticker.angle + (1 - settleTurn) * sticker.kick],
            scale: Math.max(0, grow),
            opacity: tween(time, [start, start + 2], [0, 1], (t) => t),
          };
        }}
      />
    ))}
  </>
);

export const StickerStack = (props: StickerStackProps) => {
  const { look, motion, camera } = props;
  const frame = useCurrentFrame() * motion.speed;
  const stickers = layoutStickers(props);
  return (
    <PromoLayer look={{ ...look, showBackdrop: false }} motion={motion}>
      <TypeCanvas fov={camera.fieldOfView}>
        <FrameComposer
          frame={frame}
          lens={props.lens}
          backdrop={{
            show: look.showBackdrop,
            inner: look.background,
            outer: look.backgroundEdge,
            glow: look.accent,
          }}
        >
          <CameraShot
            shot={(time) =>
              driftCamera(
                time,
                camera.distance * (1 + props.pullBack * endGather(time, stickers, props)),
                camera.fieldOfView,
                camera.drift,
                chaseTarget(time, stickers, props),
              )
            }
          />
          <Pile props={props} stickers={stickers} />
        </FrameComposer>
      </TypeCanvas>
    </PromoLayer>
  );
};

export const stickerStackScene: SceneModule = {
  id: 'sticker-stack',
  component: StickerStack,
  render: (key) => (
    <Composition
      key={key}
      id="sticker-stack"
      component={StickerStack}
      schema={stickerStackSchema}
      defaultProps={stickerStackDefaults}
      durationInFrames={stickerStackMeta.durationInFrames}
      fps={stickerStackMeta.fps}
      width={stickerStackMeta.width}
      height={stickerStackMeta.height}
    />
  ),
};
