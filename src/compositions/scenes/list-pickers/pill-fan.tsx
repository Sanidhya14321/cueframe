import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type PillFanProps, pillFanDefaults, pillFanMeta, pillFanSchema } from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { stepState, wrapIndex } from '../../pickers/steps';
import { mixColor } from '../../pickers/word-picker-slots';
import { pickerFonts } from '../../promo/fonts';
import { accelerate, pixelTween, settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const pillPose = (depth: number, fan: PillFanProps['fan']): { angle: number; opacity: number } => {
  if (depth < 0) {
    return {
      angle: fan.activeAngle + fan.swing * depth,
      opacity: tween(depth, [-1, -0.15], [0, 1], accelerate),
    };
  }
  return {
    angle: fan.activeAngle + depth * fan.spread,
    opacity: Math.max(0, 1 - depth * fan.fade) * tween(depth, [fan.trail, fan.trail + 1], [1, 0]),
  };
};

const PillFan = ({
  label,
  words,
  labelType,
  pill,
  fan,
  position,
  entryFrames,
  steps,
  aura,
  look,
  motion,
}: PillFanProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const entry = tween(frame, [0, entryFrames], [0, 1], settle);
  const progress = stepState(frame, steps).progress - 1 + entry;
  const hingeX = width / 2 + position.x;
  const hingeY = height / 2 + position.y;
  const newest = Math.ceil(progress);
  const slots = Array.from(
    { length: fan.trail + 3 },
    (_, offset) => newest - fan.trail - 1 + offset,
  );
  const radius = pill.height / 2;
  const labelRise = pixelTween(frame, [0, entryFrames + 8], [labelType.size * 0.4, 0], settle);
  return (
    <PickerLayer look={look} aura={aura} motion={motion}>
      <AbsoluteFill
        style={{
          transform: `rotate(${(fan.tilt + frame * fan.drift).toFixed(4)}deg) scale(${position.scale})`,
          transformOrigin: `${hingeX}px ${hingeY}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: width - hingeX + labelType.gap,
            top: hingeY,
            transform: `translateY(-50%) translateY(${labelRise}px) rotate(${labelType.tilt}deg)`,
            transformOrigin: 'right center',
            fontFamily: pickerFonts[labelType.font],
            fontSize: labelType.size,
            fontWeight: labelType.weight,
            letterSpacing: `${labelType.tracking}em`,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: look.ink,
            opacity: tween(frame, [0, entryFrames], [0, 1], settle),
          }}
        >
          {label}
        </div>
        {slots.map((slot) => {
          const depth = progress - slot;
          if (slot < steps.start || depth <= -1 || depth >= fan.trail + 1) {
            return null;
          }
          const pose = pillPose(depth, fan);
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: hingeX,
                top: hingeY - radius,
                height: pill.height,
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${pill.padding}px`,
                borderRadius: radius,
                background: pill.color,
                color: pill.text,
                fontFamily: pickerFonts[pill.font],
                fontSize: pill.textSize,
                fontWeight: pill.weight,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                opacity: pose.opacity,
                transform: `rotate(${pose.angle.toFixed(3)}deg)`,
                transformOrigin: `${radius}px ${radius}px`,
                boxShadow: `0 ${(pill.height * 0.18).toFixed(1)}px ${(pill.height * 0.32).toFixed(1)}px ${mixColor('transparent', mixColor('#000000', pill.color, 0.29), pill.shadow * 0.4)}`,
              }}
            >
              {words[wrapIndex(slot, words.length)]}
            </div>
          );
        })}
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const pillFanScene: SceneModule = {
  id: 'pill-fan',
  component: PillFan,
  render: (key) => (
    <Composition
      key={key}
      id="pill-fan"
      component={PillFan}
      schema={pillFanSchema}
      defaultProps={pillFanDefaults}
      durationInFrames={pillFanMeta.durationInFrames}
      fps={pillFanMeta.fps}
      width={pillFanMeta.width}
      height={pillFanMeta.height}
    />
  ),
};
