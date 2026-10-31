import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type HeadingListProps,
  headingListDefaults,
  headingListMeta,
  headingListSchema,
} from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { type StepState, wrapIndex } from '../../pickers/steps';
import {
  entranceOf,
  listOffset,
  listState,
  mixColor,
  pick,
  visibleSlots,
} from '../../pickers/word-picker-slots';
import { pickerFonts } from '../../promo/fonts';
import { pixelTween, settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const PixelArrow = ({
  arrow,
  centerY,
  frame,
  state,
  moveFrames,
}: {
  arrow: HeadingListProps['arrow'];
  centerY: number;
  frame: number;
  state: StepState;
  moveFrames: number;
}) => {
  const { width, height } = useVideoConfig();
  const draw = tween(frame, [arrow.drawStart, arrow.drawStart + arrow.drawFrames], [0, 1], settle);
  if (draw <= 0) {
    return null;
  }
  const back = state.local < moveFrames ? Math.sin(Math.PI * state.eased) : 0;
  const left = Math.round(arrow.x - arrow.retreat * back);
  const tip = left + Math.round(arrow.length * draw);
  const rows = Math.max(1, Math.round(arrow.steps));
  const rowHeight = arrow.headHeight / (rows * 2 + 1);
  const run = arrow.headWidth / rows;
  const blocks = Array.from({ length: rows * 2 + 1 }, (_, index) => {
    const away = Math.abs(index - rows);
    return {
      x: tip - arrow.stroke - away * run,
      y: centerY - arrow.headHeight / 2 + index * rowHeight,
      key: index,
    };
  });
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, opacity: draw }}
      aria-hidden="true"
    >
      <rect
        x={left}
        y={centerY - arrow.stroke / 2}
        width={tip - left}
        height={arrow.stroke}
        fill={arrow.color}
      />
      {blocks.map((block) => (
        <rect
          key={block.key}
          x={block.x}
          y={block.y}
          width={arrow.stroke + run * 0.5}
          height={rowHeight + 0.5}
          fill={arrow.color}
        />
      ))}
    </svg>
  );
};

const shiftFor = (
  slot: number,
  state: StepState,
  moveFrames: number,
  shift: number,
  settled: boolean,
): number => {
  const arriving = settled ? 0 : pixelTween(state.local, [0, moveFrames], [0, shift], pick);
  if (slot === state.index) {
    return Math.round(shift) - arriving;
  }
  return slot === state.index + 1 ? arriving : 0;
};

const HeadingList = ({
  heading,
  headingColor,
  items,
  loop,
  stops,
  timing,
  entrance,
  type,
  layout,
  arrow,
  aura,
  look,
  motion,
}: HeadingListProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width } = useVideoConfig();
  const state = listState(frame, timing, items.length, loop, stops);
  const moveFrames = Math.min(timing.moveFrames, timing.interval);
  const settled = state.local === 0 && state.eased === 0;
  const offset = listOffset(state, timing, type.pitch);
  const pitch = Math.round(type.pitch);
  const centerY = Math.round(layout.centerY);
  const lineBox = Math.round(type.activeSize * 1.3);
  const label = entranceOf(frame, { ...entrance, rise: entrance.rise * 0.25 }, 0);
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={(layout.listX / width) * 100}>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: layout.headingX,
            top: centerY - lineBox / 2 + label.rise,
            height: lineBox,
            lineHeight: `${lineBox}px`,
            fontFamily: pickerFonts[type.font],
            fontSize: type.headingSize,
            fontWeight: type.headingWeight,
            color: headingColor,
            whiteSpace: 'nowrap',
            opacity: label.opacity,
          }}
        >
          {heading}
        </div>
        {visibleSlots(state.progress, type.reach, items.length, loop).map((slot) => {
          const along = slot * pitch - offset;
          const distance = Math.abs(along / pitch);
          if (distance > type.reach) {
            return null;
          }
          const enter = entranceOf(frame, entrance, slot - timing.start + 1);
          const near = Math.min(1, distance);
          const scale = (type.activeSize + (type.size - type.activeSize) * near) / type.activeSize;
          const fade = tween(distance, [type.reach - type.fade, type.reach], [1, 0]);
          const shift = shiftFor(slot, state, moveFrames, type.activeShift, settled);
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: layout.listX + shift,
                top: centerY + along + enter.rise - lineBox / 2,
                height: lineBox,
                lineHeight: `${lineBox}px`,
                fontFamily: pickerFonts[type.font],
                fontSize: type.activeSize,
                fontWeight: distance < 0.5 ? type.activeWeight : type.weight,
                whiteSpace: 'nowrap',
                color: mixColor(look.ink, look.muted, distance),
                opacity: enter.opacity * fade,
                transform: `scale(${scale.toFixed(4)})`,
                transformOrigin: 'left center',
              }}
            >
              {items[wrapIndex(slot, items.length)]}
            </div>
          );
        })}
        <PixelArrow
          arrow={arrow}
          centerY={centerY}
          frame={frame}
          state={state}
          moveFrames={moveFrames}
        />
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const headingListScene: SceneModule = {
  id: 'heading-list',
  component: HeadingList,
  render: (key) => (
    <Composition
      key={key}
      id="heading-list"
      component={HeadingList}
      schema={headingListSchema}
      defaultProps={headingListDefaults}
      durationInFrames={headingListMeta.durationInFrames}
      fps={headingListMeta.fps}
      width={headingListMeta.width}
      height={headingListMeta.height}
    />
  ),
};
