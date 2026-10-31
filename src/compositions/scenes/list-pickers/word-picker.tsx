import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type WordPickerProps,
  wordPickerDefaults,
  wordPickerMeta,
  wordPickerSchema,
} from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { wrapIndex } from '../../pickers/steps';
import {
  entranceOf,
  listOffset,
  listState,
  mixColor,
  visibleSlots,
} from '../../pickers/word-picker-slots';
import { pickerFonts } from '../../promo/fonts';
import { settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const SelectionFrame = ({
  frame: settings,
  frameNumber,
  centerX,
  centerY,
}: {
  frame: WordPickerProps['frame'];
  frameNumber: number;
  centerX: number;
  centerY: number;
}) => {
  const { width, height } = useVideoConfig();
  const draw = settings.drawFrames;
  const local = frameNumber - settings.drawStart;
  const left = centerX - settings.width / 2;
  const right = centerX + settings.width / 2;
  const top = centerY - settings.height / 2;
  const bottom = centerY + settings.height / 2;
  const dot = tween(local, [0, draw * 0.55], [0, 1], settle);
  const line = tween(local, [draw * 0.15, draw], [0, 1], settle);
  const fill = tween(local, [draw * 0.3, draw * 1.2], [0, 1], settle);
  const reach = settings.height + settings.overhang;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <rect
        x={left}
        y={top}
        width={settings.width}
        height={settings.height}
        fill={settings.fill}
        opacity={settings.fillOpacity * fill}
      />
      {line > 0 ? (
        <>
          <line
            x1={left}
            y1={top - settings.overhang}
            x2={left}
            y2={top - settings.overhang + reach * line}
            stroke={settings.line}
            strokeWidth={settings.lineWidth}
            strokeLinecap="butt"
          />
          <line
            x1={right}
            y1={bottom + settings.overhang}
            x2={right}
            y2={bottom + settings.overhang - reach * line}
            stroke={settings.line}
            strokeWidth={settings.lineWidth}
            strokeLinecap="butt"
          />
        </>
      ) : null}
      <circle
        cx={left}
        cy={top - settings.overhang}
        r={settings.dot * dot}
        fill={settings.line}
        opacity={dot}
      />
      <circle
        cx={right}
        cy={bottom + settings.overhang}
        r={settings.dot * dot}
        fill={settings.line}
        opacity={dot}
      />
    </svg>
  );
};

const colorAt = (distance: number, look: WordPickerProps['look']): string =>
  distance < 1
    ? mixColor(look.accent, look.ink, distance)
    : mixColor(look.ink, look.muted, distance - 1);

const WordPicker = ({
  items,
  loop,
  stops,
  timing,
  entrance,
  type,
  frame: selection,
  offsetX,
  offsetY,
  aura,
  look,
  motion,
}: WordPickerProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const centerX = width / 2 + offsetX;
  const centerY = Math.round(height / 2 + offsetY);
  const state = listState(frame, timing, items.length, loop, stops);
  const offset = listOffset(state, timing, type.pitch);
  const pitch = Math.round(type.pitch);
  const lineBox = Math.round(type.activeSize * 1.3);
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={50 + (offsetX / width) * 100}>
      {selection.show ? (
        <SelectionFrame frame={selection} frameNumber={frame} centerX={centerX} centerY={centerY} />
      ) : null}
      <AbsoluteFill>
        {visibleSlots(state.progress, type.reach, items.length, loop).map((slot) => {
          const along = slot * pitch - offset;
          const distance = Math.abs(along / pitch);
          if (distance > type.reach) {
            return null;
          }
          const enter = entranceOf(frame, entrance, Math.abs(slot - timing.start));
          const near = Math.min(1, distance);
          const scale = (type.activeSize + (type.size - type.activeSize) * near) / type.activeSize;
          const fade = tween(distance, [type.reach - type.fade, type.reach], [1, 0]);
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: 0,
                width,
                top: centerY + along + enter.rise - lineBox / 2,
                height: lineBox,
                lineHeight: `${lineBox}px`,
                textAlign: 'center',
                fontFamily: pickerFonts[type.font],
                fontSize: type.activeSize,
                fontWeight: distance < 0.5 ? type.activeWeight : type.weight,
                letterSpacing: `${type.tracking}em`,
                whiteSpace: 'nowrap',
                color: colorAt(distance, look),
                opacity: enter.opacity * fade,
                transform: `translateX(${offsetX}px) scale(${scale.toFixed(4)})`,
              }}
            >
              {items[wrapIndex(slot, items.length)]}
            </div>
          );
        })}
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const wordPickerScene: SceneModule = {
  id: 'word-picker',
  component: WordPicker,
  render: (key) => (
    <Composition
      key={key}
      id="word-picker"
      component={WordPicker}
      schema={wordPickerSchema}
      defaultProps={wordPickerDefaults}
      durationInFrames={wordPickerMeta.durationInFrames}
      fps={wordPickerMeta.fps}
      width={wordPickerMeta.width}
      height={wordPickerMeta.height}
    />
  ),
};
