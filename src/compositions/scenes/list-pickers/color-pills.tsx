import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ColorPill,
  type ColorPillsProps,
  colorPillsDefaults,
  colorPillsMeta,
  colorPillsSchema,
} from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { stepState } from '../../pickers/steps';
import { pickerFonts } from '../../promo/fonts';
import { pixelTween, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const smoothstep = (value: number): number => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

const cursorTarget = (step: number, count: number): number =>
  step <= 0 ? -1 : (step - 1) % (count + 1);

const visibleAt = (slot: number, count: number): number =>
  Math.min(1, Math.max(0, slot + 1)) * Math.min(1, Math.max(0, count - slot));

type PillPose = { x: number; focus: number };

const posesAt = (
  pills: ColorPill[],
  slot: number,
  active: ColorPillsProps['active'],
): PillPose[] => {
  const visible = visibleAt(slot, pills.length);
  return pills.map((pill, index) => {
    const distance = Math.abs(slot - index);
    const focus = smoothstep(1 - distance) * visible;
    const spread = active.spread * Math.max(0, 1 - distance / 2) * visible;
    return { x: Math.round(pill.offset + active.nudge * Math.max(focus, spread)), focus };
  });
};

const offsetAt = (pills: ColorPill[], slot: number): number => {
  const clamped = Math.min(pills.length - 1, Math.max(0, slot));
  return Math.round(pills[Math.round(clamped)]?.offset ?? 0);
};

const ColorPills = ({
  pills,
  font,
  size,
  weight,
  textColor,
  dotColor,
  layout,
  active,
  cursor,
  entrance,
  timing,
  aura,
  look,
  motion,
}: ColorPillsProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const count = pills.length;
  const state = stepState(frame, timing);
  const moveFrames = Math.min(timing.moveFrames, timing.interval);
  const reached = cursorTarget(state.index - timing.start, count);
  const fromSlot = reached === count ? -1 : reached;
  const toSlot = cursorTarget(state.index - timing.start + 1, count);
  const span: [number, number] = [0, moveFrames];
  const fromPoses = posesAt(pills, fromSlot, active);
  const toPoses = posesAt(pills, toSlot, active);
  const cursorY = pixelTween(
    state.local,
    [0, moveFrames],
    [fromSlot * layout.pitch, toSlot * layout.pitch],
    smooth,
  );
  const cursorSlot = cursorY / layout.pitch;
  const visible = visibleAt(cursorSlot, count);
  const left = width / 2 + layout.x;
  const top = height / 2 + layout.y - ((count - 1) * layout.pitch) / 2;
  const family = pickerFonts[font];
  const radius = (layout.height / 2) * layout.roundness;
  const cursorX =
    left +
    pixelTween(state.local, span, [offsetAt(pills, fromSlot), offsetAt(pills, toSlot)], smooth) +
    active.nudge -
    cursor.gap -
    cursor.size / 2;
  return (
    <PickerLayer look={look} aura={aura} motion={motion}>
      <AbsoluteFill>
        {pills.map((pill, index) => {
          const start = index * entrance.stagger;
          const rise = pixelTween(
            frame,
            [start, start + entrance.frames],
            [entrance.rise, 0],
            settle,
          );
          const opacity = tween(frame, [start, start + entrance.frames * 0.7], [0, 1], settle);
          const from = fromPoses[index] ?? { x: 0, focus: 0 };
          const to = toPoses[index] ?? { x: 0, focus: 0 };
          const x = Math.round(left) + pixelTween(state.local, span, [from.x, to.x], smooth);
          const focus = tween(state.local, span, [from.focus, to.focus], smooth);
          const y = Math.round(top + index * layout.pitch - layout.height / 2 + rise);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: layout.height,
                opacity,
                transform: `translate(${x}px, ${y}px) scale(${(1 + active.grow * focus).toFixed(4)})`,
                transformOrigin: 'left center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: radius,
                  background: pill.color,
                  filter: `blur(${layout.glow}px)`,
                  opacity: layout.glowStrength,
                }}
              />
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: layout.dot * 0.9,
                  height: layout.height,
                  padding: `0 ${layout.paddingX * 1.3}px 0 ${layout.paddingX}px`,
                  borderRadius: radius,
                  background: pill.color,
                  boxShadow: `inset 0 0 ${layout.glow * 1.6}px rgba(255, 255, 255, ${layout.shine})`,
                  color: textColor,
                  fontFamily: family,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {layout.dot > 0 ? (
                  <div
                    style={{
                      width: layout.dot,
                      height: layout.dot,
                      borderRadius: '50%',
                      background: dotColor,
                      flexShrink: 0,
                    }}
                  />
                ) : null}
                {pill.label}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: cursor.size,
            height: cursor.size,
            borderRadius: '50%',
            opacity: visible,
            background: cursor.color,
            boxShadow: `0 0 0 ${(cursor.size * 0.16 * cursor.haloSize).toFixed(2)}px color-mix(in oklab, ${cursor.halo} 55%, transparent), 0 0 ${(cursor.size * 0.6 * cursor.haloSize).toFixed(2)}px ${cursor.halo}`,
            transform: `translate(${Math.round(cursorX)}px, ${Math.round(top + cursorY - cursor.size / 2)}px)`,
          }}
        />
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const colorPillsScene: SceneModule = {
  id: 'color-pills',
  component: ColorPills,
  render: (key) => (
    <Composition
      key={key}
      id="color-pills"
      component={ColorPills}
      schema={colorPillsSchema}
      defaultProps={colorPillsDefaults}
      durationInFrames={colorPillsMeta.durationInFrames}
      fps={colorPillsMeta.fps}
      width={colorPillsMeta.width}
      height={colorPillsMeta.height}
    />
  ),
};
