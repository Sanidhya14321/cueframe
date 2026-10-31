import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type YearDialProps, yearDialDefaults, yearDialMeta, yearDialSchema } from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { stepState } from '../../pickers/steps';
import { pickerFonts } from '../../promo/fonts';
import { settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const LABEL_ROOM = 820;

const DRIFT_SPIN = 0.03;

const DRIFT_SHIFT = 0.9;

const TURN_EASINGS: Record<YearDialProps['turnEasing'], (t: number) => number> = {
  smooth,
  settle,
  linear: (t) => t,
};

const DialTicks = ({ ticks, rotation }: { ticks: YearDialProps['ticks']; rotation: number }) => {
  const count = Math.floor(360 / ticks.spacing);
  return (
    <g transform={`rotate(${rotation.toFixed(4)})`}>
      {Array.from({ length: count }, (_, index) => {
        const major = index % ticks.majorEvery === 0;
        const length = ticks.length * (major ? 1 : 0.6);
        return (
          <line
            key={index}
            x1={ticks.radius - length / 2}
            x2={ticks.radius + length / 2}
            y1={0}
            y2={0}
            transform={`rotate(${index * ticks.spacing})`}
            stroke={major ? ticks.color : ticks.minorColor}
            strokeWidth={ticks.stroke * (major ? 1 : 0.8)}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

type YearSlot = {
  key: number;
  text: string;
  transform: string;
  opacity: number;
  font: string;
  size: number;
  weight: number;
};

const YearLabels = ({ slots, fill }: { slots: YearSlot[]; fill: string }) => (
  <>
    {slots.map((slot) => (
      <text
        key={slot.key}
        transform={slot.transform}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={slot.font}
        fontSize={slot.size}
        fontWeight={slot.weight}
        fill={fill}
        opacity={slot.opacity}
      >
        {slot.text}
      </text>
    ))}
  </>
);

const YearDial = ({
  label,
  labelColor,
  firstYear,
  yearStep,
  countDown,
  yearType,
  highlight,
  pointer,
  dial,
  ticks,
  camera,
  entryFrames,
  entryTurn,
  steps,
  turnEasing,
  aura,
  look,
  motion,
}: YearDialProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const entry = tween(frame, [0, entryFrames * 1.6], [0, 1], settle);
  const progress =
    stepState(frame, steps, TURN_EASINGS[turnEasing]).progress - (1 - entry) * entryTurn;
  const reveal = tween(frame, [0, entryFrames], [0, 1], settle);
  const half = ticks.radius + LABEL_ROOM;
  const size = half * 2;
  const spin = camera.spin + frame * DRIFT_SPIN * camera.drift;
  const shift = -frame * DRIFT_SHIFT * camera.drift;
  const reach = Math.ceil(dial.range) + 1;
  const nearest = Math.round(progress);
  const slots = Array.from({ length: reach * 2 + 1 }, (_, index) => nearest - reach + index);
  const tickOuter = ticks.radius + ticks.length / 2;
  const pointerTip = tickOuter + pointer.gap;
  const font = pickerFonts[yearType.font];
  const yearsPerSlot = countDown ? -yearStep : yearStep;
  const clipId = `year-dial-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const yearSlots: YearSlot[] = slots.flatMap((slot) => {
    const offset = slot - progress;
    const distance = Math.abs(offset);
    if (distance > dial.range) {
      return [];
    }
    const angle = 180 - offset * dial.slot;
    return [
      {
        key: slot,
        text: String(firstYear + slot * yearsPerSlot),
        transform: `rotate(${angle.toFixed(4)}) translate(${dial.radius} 0) rotate(${(-angle + (angle - 180) * dial.textFollow).toFixed(4)})`,
        opacity: tween(distance, [dial.fadeStart, dial.range], [1, 0]),
        font,
        size: yearType.size,
        weight: yearType.weight,
      },
    ];
  });
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={60}>
      <AbsoluteFill style={{ perspective: camera.perspective, opacity: reveal }}>
        <div
          style={{
            position: 'absolute',
            left: width / 2 + camera.x - half,
            top: height / 2 + camera.y - half,
            width: size,
            height: size,
            transform: `translate3d(${shift.toFixed(4)}px, 0, 0) rotateX(${camera.tilt}deg) rotateZ(${spin.toFixed(4)}deg) scale(${camera.scale})`,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`${-half} ${-half} ${size} ${size}`}
            aria-hidden="true"
          >
            <DialTicks ticks={ticks} rotation={progress * dial.slot} />
            <rect
              x={-dial.radius - highlight.width / 2}
              y={-highlight.height / 2}
              width={highlight.width}
              height={highlight.height}
              rx={highlight.radius}
              fill={highlight.color}
            />
            <YearLabels slots={yearSlots} fill={look.ink} />
            <clipPath id={clipId}>
              <rect
                x={-dial.radius - highlight.width / 2}
                y={-highlight.height / 2}
                width={highlight.width}
                height={highlight.height}
                rx={highlight.radius}
              />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
              <YearLabels slots={yearSlots} fill={highlight.text} />
            </g>
            <path
              transform={`translate(${-pointerTip} 0) scale(${pointer.size / 100})`}
              d="M0 0 L-86 -42 L-64 0 L-86 42 Z"
              fill={pointer.color}
            />
            <text
              x={-(pointerTip + pointer.size * 0.9 + pointer.gap * 0.6)}
              y={0}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={font}
              fontSize={yearType.labelSize}
              fontWeight={yearType.labelWeight}
              fill={labelColor}
            >
              {label}
            </text>
          </svg>
        </div>
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const yearDialScene: SceneModule = {
  id: 'year-dial',
  component: YearDial,
  render: (key) => (
    <Composition
      key={key}
      id="year-dial"
      component={YearDial}
      schema={yearDialSchema}
      defaultProps={yearDialDefaults}
      durationInFrames={yearDialMeta.durationInFrames}
      fps={yearDialMeta.fps}
      width={yearDialMeta.width}
      height={yearDialMeta.height}
    />
  ),
};
