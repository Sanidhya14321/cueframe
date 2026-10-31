import { Composition, useCurrentFrame } from 'remotion';
import {
  type NumberCounterProps,
  numberCounterDefaults,
  numberCounterMeta,
  numberCounterSchema,
} from '@/schemas';
import { glowShadow } from '../../promo/glow';
import { displayType, KineticLayer } from '../../promo/kinetic';
import { land, settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const DIGIT_WIDTH = 0.6;

const columnPosition = (value: number, place: number): number => {
  const unit = 10 ** place;
  const whole = Math.floor(value / unit);
  const rest = value - whole * unit;
  return whole + Math.max(0, rest - (unit - 1));
};

const digitCount = (value: number): number => String(Math.max(0, Math.round(value))).length;

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;

const groupDigits = (value: number, separator: string): string =>
  separator.length > 0 ? String(value).replace(THOUSANDS, () => separator) : String(value);

const separatorOpacity = (value: number, place: number): number =>
  Math.min(1, Math.max(0, columnPosition(value, place)));

const SHUTTER_SAMPLES = 6;
const ZOOM_THROUGH = 0.14;

const digitOpacity = (offset: number): number => Math.max(0, 1 - Math.abs(offset));

const DigitColumn = ({
  position,
  previous,
  leading,
  roll,
}: {
  position: number;
  previous: number;
  leading: boolean;
  roll: number;
}) => {
  const base = Math.floor(position);
  const pitch = roll * 1.2;
  const smear = position - previous;
  const samples = roll > 0 && Math.abs(smear) >= 0.002 ? SHUTTER_SAMPLES : 1;
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${DIGIT_WIDTH}em`,
        height: '1em',
      }}
    >
      {[base - 2, base - 1, base, base + 1, base + 2].flatMap((digit) =>
        Array.from({ length: samples }, (_, sample) => {
          const offset = digit - (position - (smear * sample) / samples);
          const opacity = leading && digit <= 0 ? 0 : digitOpacity(offset) / samples;
          return opacity <= 0.001 ? null : (
            <span
              key={`${digit}:${sample}`}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${DIGIT_WIDTH}em`,
                textAlign: 'center',
                opacity: Math.min(1, opacity),
                transform: `translateY(${(offset * pitch).toFixed(4)}em) scale(${(1 + ZOOM_THROUGH * offset).toFixed(4)})`,
              }}
            >
              {((digit % 10) + 10) % 10}
            </span>
          );
        }),
      )}
    </span>
  );
};

export const NumberCounter = ({
  from,
  to,
  prefix,
  suffix,
  separator,
  affixScale,
  affixColor,
  size,
  weight,
  delay,
  countFrames,
  roll,
  glow,
  bloom,
  glowColor,
  placement,
  look,
  motion,
}: NumberCounterProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const minSpeed = roll > 0 ? 1.5 / (roll * 1.2 * size) : 0.004;
  const countAt = (at: number) => land(at, [delay, delay + countFrames], [from, to], minSpeed, 1.2);
  const value = countAt(frame);
  const previous = countAt(frame - motion.speed);
  const enter = roll > 0 ? tween(frame, [delay, delay + 14], [0, 1], settle) : 1;
  const flare = 1 - tween(frame, [delay, delay + countFrames + 10], [0, 1], settle);
  const shown = Math.floor(countAt(frame) + 0.0001);
  const places = Math.max(digitCount(from), digitCount(to));
  const columns = Array.from({ length: places }, (_, index) => places - 1 - index);
  const affixStyle = { color: affixColor, fontSize: `${affixScale}em` };
  return (
    <KineticLayer look={look} motion={motion} placement={placement}>
      <div
        style={{
          ...displayType(size, weight, -0.02),
          color: look.ink,
          opacity: enter,
          fontVariantNumeric: 'tabular-nums',
          textShadow: glowShadow(glowColor, glow + bloom * 1.6 * flare, size),
          filter:
            roll === 0 && flare > 0.6 ? `blur(${((flare - 0.6) * 10).toFixed(2)}px)` : undefined,
          display: 'flex',
          alignItems: 'baseline',
        }}
      >
        {prefix.length > 0 ? <span style={affixStyle}>{prefix}</span> : null}
        {roll === 0 ? <span>{groupDigits(shown, separator)}</span> : null}
        {(roll === 0 ? [] : columns).flatMap((place) => [
          <DigitColumn
            key={place}
            position={columnPosition(value, place)}
            previous={columnPosition(previous, place)}
            leading={place > 0}
            roll={roll}
          />,
          separator.length > 0 && place > 0 && place % 3 === 0 ? (
            <span key={`separator:${place}`} style={{ opacity: separatorOpacity(value, place) }}>
              {separator}
            </span>
          ) : null,
        ])}
        {suffix.length > 0 ? <span style={affixStyle}>{suffix}</span> : null}
      </div>
    </KineticLayer>
  );
};

export const numberCounterScene: SceneModule = {
  id: 'number-counter',
  component: NumberCounter,
  render: (key) => (
    <Composition
      key={key}
      id="number-counter"
      component={NumberCounter}
      schema={numberCounterSchema}
      defaultProps={numberCounterDefaults}
      durationInFrames={numberCounterMeta.durationInFrames}
      fps={numberCounterMeta.fps}
      width={numberCounterMeta.width}
      height={numberCounterMeta.height}
    />
  ),
};
