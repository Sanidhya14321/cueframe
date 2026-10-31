import { useId } from 'react';
import type { BatteryChargeSuccessProps } from '@/schemas';
import { Bubbles } from './bubbles';
import { labelFont } from './cable-path';
import type { BatteryBox } from './choreography';
import { mixHex, mixThree, rgba, smoothstep } from './curves';
import { boltPath, boltStrength, Ticks } from './gauge';
import { CompletionRing } from './ring';

type BatteryProps = {
  props: BatteryChargeSuccessProps;
  frame: number;
  box: BatteryBox;
  level: number;
  phase: number;
  width: number;
  height: number;
};

const wavePath = (
  left: number,
  right: number,
  surface: number,
  bottom: number,
  amplitude: number,
  wavelength: number,
  shift: number,
) => {
  const points: string[] = [`M${left} ${bottom + 2}`];
  for (let x = left; x <= right + 6; x += 6) {
    const clamped = Math.min(x, right);
    const y =
      surface +
      amplitude *
        (0.7 * Math.sin((clamped / wavelength) * Math.PI * 2 + shift) +
          0.3 * Math.sin((clamped / (wavelength * 0.57)) * Math.PI * 2 - shift * 1.35));
    points.push(`L${clamped.toFixed(1)} ${y.toFixed(2)}`);
  }
  points.push(`L${right} ${bottom + 2} Z`);
  return points.join(' ');
};

export const Battery = ({ props, frame, box, level, phase, width, height }: BatteryProps) => {
  const { battery, charge, liquid, look } = props;
  const uid = useId().replace(/:/g, '');
  const glowColor = mixThree(charge.empty, charge.mid, charge.charged, phase);
  const top = mixHex(charge.liquidTopLow, charge.liquidTopFull, level);
  const bottomColor = mixHex(charge.liquidBottomLow, charge.liquidBottomFull, level);
  const inner = {
    left: box.left + battery.inset,
    right: box.right - battery.inset,
    top: box.top + battery.inset,
    bottom: box.bottom - battery.inset,
  };
  const innerHeight = inner.bottom - inner.top;
  const fillable = innerHeight * (1 - liquid.headroom);
  const surface = inner.bottom - fillable * level;
  const amplitude = liquid.waveHeight * smoothstep(0, 0.06, level);
  const shift = frame * liquid.waveSpeed * Math.PI * 2 * 0.25;
  const front = wavePath(
    inner.left,
    inner.right,
    surface,
    inner.bottom,
    amplitude,
    liquid.waveLength,
    shift,
  );
  const back = wavePath(
    inner.left,
    inner.right,
    surface - amplitude * 0.5,
    inner.bottom,
    amplitude * 0.8,
    liquid.waveLength * 1.15,
    -shift * 0.8 + 2.1,
  );
  const innerRadius = Math.max(0, battery.radius - battery.inset);
  const percentText = `${Math.round(level * 100)}${props.copy.suffix}`;
  const percentY = box.top + box.height * battery.percentY;
  const baseHeight = innerHeight * 0.42;
  const bolt = boltPath(box.centerX, box.top + box.height * battery.boltY, battery.boltSize);
  const boltAlpha = boltStrength(frame, props.timing);
  const boltColor = mixHex(glowColor, look.ink, 0.25);
  const percent = (fill: string, clip?: string) => (
    <text
      x={box.centerX}
      y={percentY}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={labelFont}
      fontWeight={700}
      fontSize={battery.percentSize}
      fill={fill}
      clipPath={clip}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {percentText}
    </text>
  );
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`battery-inner-${uid}`}>
          <rect
            x={inner.left}
            y={inner.top}
            width={inner.right - inner.left}
            height={innerHeight}
            rx={innerRadius}
          />
        </clipPath>
        <clipPath id={`battery-liquid-${uid}`}>
          <path d={front} />
        </clipPath>
        <linearGradient id={`battery-base-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={glowColor} stopOpacity={0.95 * charge.baseGlow} />
          <stop offset="18%" stopColor={glowColor} stopOpacity={0.55 * charge.baseGlow} />
          <stop offset="45%" stopColor={glowColor} stopOpacity={0.18 * charge.baseGlow} />
          <stop offset="75%" stopColor={glowColor} stopOpacity={0.04 * charge.baseGlow} />
          <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id={`battery-fill-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={inner.left + (inner.right - inner.left) * 0.3}
          y1={surface - amplitude}
          x2={inner.left + (inner.right - inner.left) * 0.7}
          y2={inner.bottom}
        >
          <stop offset="0%" stopColor={top} />
          <stop offset="55%" stopColor={mixHex(top, bottomColor, 0.62)} />
          <stop offset="100%" stopColor={bottomColor} />
        </linearGradient>
      </defs>
      <rect
        x={box.left}
        y={box.top}
        width={box.width}
        height={box.height}
        rx={battery.radius}
        fill={look.interior}
      />
      <g clipPath={`url(#battery-inner-${uid})`}>
        <rect
          x={inner.left}
          y={inner.bottom - baseHeight}
          width={inner.right - inner.left}
          height={baseHeight}
          fill={`url(#battery-base-${uid})`}
        />
        <rect
          x={inner.left}
          y={inner.bottom - 5}
          width={inner.right - inner.left}
          height={5}
          fill={mixHex(glowColor, '#ffffff', 0.15)}
          opacity={0.9 * charge.baseGlow}
        />
        {battery.boltSize > 0 ? (
          <path
            d={bolt}
            fill={rgba(boltColor, boltAlpha)}
            style={{ filter: `drop-shadow(0 0 10px ${rgba(glowColor, 0.7 * boltAlpha)})` }}
          />
        ) : null}
        {battery.showPercent ? percent(look.ink) : null}
        <path d={back} fill={rgba(mixHex(top, liquid.backTint, 0.35), liquid.backWave)} />
        <path d={front} fill={`url(#battery-fill-${uid})`} />
        <g clipPath={`url(#battery-liquid-${uid})`}>
          {battery.boltSize > 0 ? (
            <path d={bolt} fill={rgba(charge.percentInLiquid, 0.42)} />
          ) : null}
        </g>
        {battery.showPercent
          ? percent(rgba(charge.percentInLiquid, 0.62), `url(#battery-liquid-${uid})`)
          : null}
        <Ticks props={props} inner={inner} fillable={fillable} level={level} color={look.ink} />
        <Bubbles props={props} frame={frame} inner={inner} surface={surface} level={level} />
      </g>
      <CompletionRing
        props={props}
        frame={frame}
        box={box}
        color={mixHex(charge.charged, '#ffffff', 0.2)}
      />
      <rect
        x={box.left}
        y={box.top}
        width={box.width}
        height={box.height}
        rx={battery.radius}
        fill="none"
        stroke={look.outline}
        strokeWidth={battery.stroke}
        style={{
          filter: `drop-shadow(0 0 4px ${rgba('#ffffff', 0.7 * look.outlineGlow)}) drop-shadow(0 0 14px ${rgba('#ffffff', 0.3 * look.outlineGlow)})`,
        }}
      />
      <path
        d={`M${box.centerX - battery.capWidth / 2} ${box.top - 5} v${-battery.capHeight + 8} q0 -8 8 -8 h${battery.capWidth - 16} q8 0 8 8 v${battery.capHeight - 8} Z`}
        fill={battery.cap}
        style={{ filter: `drop-shadow(0 0 5px ${rgba('#ffffff', 0.35 * look.outlineGlow)})` }}
      />
    </svg>
  );
};
