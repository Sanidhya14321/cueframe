import type { FC } from 'react';
import { AbsoluteFill, Composition, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  getClipDefaults,
  type ListPickersReelProps,
  listPickersReelDefaults,
  listPickersReelMeta,
  listPickersReelSchema,
  type PromoMotion,
  type ReelClipId,
} from '@/schemas';
import { glide, settle, smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { colorPillsScene } from './color-pills';
import { headingListScene } from './heading-list';
import { menuStackScene } from './menu-stack';
import { mindMapScene } from './mind-map';
import { pillFanScene } from './pill-fan';
import { productCardsScene } from './product-cards';
import { skillWheelScene } from './skill-wheel';
import { wordPickerScene } from './word-picker';
import { yearDialScene } from './year-dial';

const REEL_SCENES: Record<ReelClipId, SceneModule> = {
  'word-picker': wordPickerScene,
  'pill-fan': pillFanScene,
  'menu-stack': menuStackScene,
  'heading-list': headingListScene,
  'year-dial': yearDialScene,
  'mind-map': mindMapScene,
  'color-pills': colorPillsScene,
  'skill-wheel': skillWheelScene,
  'product-cards': productCardsScene,
};

const POP_ORDERS: Record<ListPickersReelProps['intro']['popOrder'], readonly number[]> = {
  'center-first': [4, 0, 8, 2, 6, 1, 7, 3, 5],
  'row-by-row': [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const EMBEDDED_MOTION: Partial<PromoMotion> = { exit: 'none', exitFrames: 0, enterFrames: 0 };

const looping = (value: unknown): unknown =>
  typeof value === 'object' && value !== null && 'loop' in value ? { ...value, loop: true } : value;

const EmbeddedClip = ({ id, cycle }: { id: ReelClipId; cycle: boolean }) => {
  const Component = REEL_SCENES[id].component as FC<Record<string, unknown>>;
  const defaults = getClipDefaults(id) as Record<string, unknown> & { motion: PromoMotion };
  const props = cycle
    ? (looping(
        Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, looping(value)])),
      ) as Record<string, unknown>)
    : defaults;
  return <Component {...props} motion={{ ...defaults.motion, ...EMBEDDED_MOTION }} />;
};

type TileBox = { x: number; y: number; width: number; height: number };

const tileBoxes = (width: number, height: number, gap: number): TileBox[] => {
  const tileWidth = (width - gap * 2) / 3;
  const tileHeight = (tileWidth * height) / width;
  const top = (height - (tileHeight * 3 + gap * 2)) / 2;
  return Array.from({ length: 9 }, (_, index) => ({
    x: (index % 3) * (tileWidth + gap),
    y: top + Math.floor(index / 3) * (tileHeight + gap),
    width: tileWidth,
    height: tileHeight,
  }));
};

const popStart = (index: number, intro: ListPickersReelProps['intro']): number =>
  Math.max(0, POP_ORDERS[intro.popOrder].indexOf(index)) * intro.stagger;

const tileFrom = (index: number, intro: ListPickersReelProps['intro']): number =>
  popStart(index, intro) - intro.lead;

const IntroGrid = ({
  intro,
  grid,
  target,
}: {
  intro: ListPickersReelProps['intro'];
  grid: ListPickersReelProps['grid'];
  target: number;
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const boxes = tileBoxes(width, height, intro.gap);
  const focus = boxes[target] ?? boxes[4];
  const zoomStart = intro.frames - intro.zoomFrames;
  const reach = width / (focus?.width ?? width);
  const zoom = tween(frame, [zoomStart, intro.frames], [0, 1], smooth);
  const scale = reach ** zoom;
  const originX = reach > 1 ? (reach * (focus?.x ?? 0)) / (reach - 1) : 0;
  const originY = reach > 1 ? (reach * (focus?.y ?? 0)) / (reach - 1) : 0;
  return (
    <AbsoluteFill style={{ background: intro.background }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${originX.toFixed(3)}px ${originY.toFixed(3)}px`,
          transform: `scale(${scale.toFixed(5)})`,
        }}
      >
        {grid.map((id, index) => {
          const box = boxes[index];
          if (box === undefined) {
            return null;
          }
          const start = popStart(index, intro);
          const shown = tween(frame, [start, start + intro.popFrames], [0, 1], settle);
          const grow = intro.popScale + (1 - intro.popScale) * shown;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
                opacity: shown,
                transform: `scale(${grow.toFixed(4)})`,
                borderRadius: intro.radius * (1 - zoom),
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width,
                  height,
                  transformOrigin: '0 0',
                  transform: `scale(${(box.width / width).toFixed(5)})`,
                }}
              >
                <Sequence from={tileFrom(index, intro)} layout="none">
                  <EmbeddedClip id={id} cycle />
                </Sequence>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeatLayer = ({
  id,
  fadeFrames,
  offset,
}: {
  id: ReelClipId;
  fadeFrames: number;
  offset: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeFrames > 0 ? tween(frame, [0, fadeFrames], [0, 1], glide) : 1;
  return (
    <AbsoluteFill style={{ opacity, isolation: 'isolate' }}>
      <Sequence from={-offset} layout="none">
        <EmbeddedClip id={id} cycle={offset > 0} />
      </Sequence>
    </AbsoluteFill>
  );
};

const ListPickersReel = ({ intro, grid, beats, crossfade, motion }: ListPickersReelProps) => {
  const introFrames = intro.show ? intro.frames : 0;
  const firstClip = beats[0]?.clip;
  const target = firstClip === undefined ? 4 : grid.indexOf(firstClip);
  const handoff = intro.show && target >= 0;
  let cursor = introFrames;
  const windows = beats.map((beat, index) => {
    const from = index === 0 ? cursor : cursor - crossfade;
    cursor = from + beat.frames;
    return { beat, from, fade: index === 0 && (handoff || !intro.show) ? 0 : crossfade };
  });
  const handoffOffset = handoff ? introFrames - tileFrom(target, intro) : 0;
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill style={{ background: intro.background }} />
      {intro.show ? (
        <Sequence durationInFrames={introFrames + crossfade} layout="none">
          <IntroGrid intro={intro} grid={grid} target={Math.max(0, target)} />
        </Sequence>
      ) : null}
      {windows.map(({ beat, from, fade }, index) => (
        <Sequence key={index} from={from} durationInFrames={beat.frames} layout="none">
          <BeatLayer id={beat.clip} fadeFrames={fade} offset={index === 0 ? handoffOffset : 0} />
        </Sequence>
      ))}
    </TransitionFrame>
  );
};

export const listPickersReelScene: SceneModule = {
  id: 'list-pickers-reel',
  component: ListPickersReel,
  render: (key) => (
    <Composition
      key={key}
      id="list-pickers-reel"
      component={ListPickersReel}
      schema={listPickersReelSchema}
      defaultProps={listPickersReelDefaults}
      durationInFrames={listPickersReelMeta.durationInFrames}
      fps={listPickersReelMeta.fps}
      width={listPickersReelMeta.width}
      height={listPickersReelMeta.height}
    />
  ),
};
