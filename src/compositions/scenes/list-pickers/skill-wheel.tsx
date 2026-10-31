import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type SkillWheelProps,
  skillWheelDefaults,
  skillWheelMeta,
  skillWheelSchema,
} from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { stepState, wrapIndex } from '../../pickers/steps';
import { pickerFonts } from '../../promo/fonts';
import { pixelTween, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const TickRing = ({
  ticks,
  center,
  rotation,
}: {
  ticks: SkillWheelProps['ticks'];
  center: SkillWheelProps['center'];
  rotation: number;
}) => {
  const { width, height } = useVideoConfig();
  const reach = Math.min(89, (Math.asin(Math.min(1, height / ticks.radius)) * 180) / Math.PI + 4);
  const first = Math.ceil((-reach - rotation) / ticks.spacing);
  const last = Math.floor((reach - rotation) / ticks.spacing);
  const marks = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      {marks.map((mark) => {
        const theta = ((mark * ticks.spacing + rotation) * Math.PI) / 180;
        const lean = theta + (ticks.tilt * Math.PI) / 180;
        const length = ticks.length;
        const cx = center.x + Math.cos(theta) * ticks.radius;
        const cy = center.y + Math.sin(theta) * ticks.radius;
        const dx = (Math.cos(lean) * length) / 2;
        const dy = (Math.sin(lean) * length) / 2;
        const inset = ticks.radius - ticks.length * 0.18;
        return (
          <g key={mark}>
            <line
              x1={cx - dx}
              y1={cy - dy}
              x2={cx + dx}
              y2={cy + dy}
              stroke={ticks.color}
              strokeWidth={ticks.stroke}
              strokeLinecap="round"
            />
            {ticks.dot > 0 ? (
              <circle
                cx={center.x + Math.cos(theta) * inset}
                cy={center.y + Math.sin(theta) * inset}
                r={ticks.dot}
                fill={ticks.color}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const SkillWheel = ({
  title,
  subtitle,
  words,
  heading,
  pointer,
  wheel,
  ticks,
  center,
  entryFrames,
  steps,
  aura,
  look,
  motion,
}: SkillWheelProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width } = useVideoConfig();
  const entry = tween(frame, [0, entryFrames * 1.6], [0, 1], settle);
  const progress = stepState(frame, steps).progress - (1 - entry) * wheel.entryTurn;
  const turn = wheel.direction === 'down' ? 1 : -1;
  const reveal = tween(frame, [0, entryFrames], [0, 1], settle);
  const rise = pixelTween(frame, [0, entryFrames + 8], [heading.size * 0.4, 0], settle);
  const reach = Math.ceil(wheel.range / wheel.spacing) + 1;
  const nearest = Math.round(progress);
  const slots = Array.from({ length: reach * 2 + 1 }, (_, index) => nearest - reach + index);
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={40}>
      <AbsoluteFill style={{ opacity: reveal }}>
        {ticks.show ? (
          <TickRing
            ticks={ticks}
            center={center}
            rotation={turn * (progress * wheel.spacing * ticks.speed + frame * ticks.idle)}
          />
        ) : null}
        {slots.map((slot) => {
          const angle = turn * (progress - slot) * wheel.spacing;
          const distance = Math.abs(angle);
          if (distance > wheel.range) {
            return null;
          }
          const focus = smooth(Math.max(0, 1 - Math.abs(progress - slot)));
          const opacity = tween(distance, [wheel.fadeStart, wheel.range], [1, 0]);
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: center.x,
                top: center.y,
                transform: `rotate(${angle.toFixed(3)}deg) translateX(${wheel.radius}px)`,
                transformOrigin: '0 0',
              }}
            >
              <div
                style={{
                  transform: `translateY(-50%) scale(${(1 + (wheel.activeScale - 1) * focus).toFixed(4)})`,
                  transformOrigin: 'left center',
                  fontFamily: pickerFonts[wheel.font],
                  fontSize: wheel.size,
                  fontWeight: wheel.weight,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  color: `color-mix(in oklab, ${wheel.activeColor} ${(focus * 100).toFixed(1)}%, ${wheel.color})`,
                  opacity,
                }}
              >
                {words[wrapIndex(slot, words.length)]}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          right: width - center.x - heading.right,
          top: center.y,
          transform: `translateY(-${heading.size * 0.62}px) translateY(${rise}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: heading.gap,
          fontFamily: pickerFonts[heading.font],
          color: look.ink,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          opacity: reveal,
        }}
      >
        <div
          style={{ fontSize: heading.size, fontWeight: heading.weight, letterSpacing: '-0.02em' }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: heading.subtitleSize,
            fontWeight: heading.subtitleWeight,
            color: look.muted,
          }}
        >
          {subtitle}
        </div>
      </div>
      {pointer.show ? (
        <svg
          width={pointer.size}
          height={pointer.size}
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            left: center.x + pointer.offset,
            top: center.y - pointer.size / 2,
            opacity: reveal,
          }}
          aria-hidden="true"
        >
          <path d="M8 8 L94 50 L8 92 L30 50 Z" fill={pointer.color} />
        </svg>
      ) : null}
    </PickerLayer>
  );
};

export const skillWheelScene: SceneModule = {
  id: 'skill-wheel',
  component: SkillWheel,
  render: (key) => (
    <Composition
      key={key}
      id="skill-wheel"
      component={SkillWheel}
      schema={skillWheelSchema}
      defaultProps={skillWheelDefaults}
      durationInFrames={skillWheelMeta.durationInFrames}
      fps={skillWheelMeta.fps}
      width={skillWheelMeta.width}
      height={skillWheelMeta.height}
    />
  ),
};
