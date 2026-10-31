import { AbsoluteFill, Easing, interpolateColors } from 'remotion';
import type { IncomingCallTeaserProps } from '@/schemas';
import { tween } from '../promo/timing';
import { TEASER_FONTS } from './fonts';
import { Handset } from './handset';
import { clamp01, mix } from './timeline';

type Call = IncomingCallTeaserProps['call'];

const slideEase = Easing.bezier(0.42, 0, 0.78, 1);
const landEase = Easing.bezier(0.3, 0.45, 0.2, 1);

const pulse = (call: Call, frame: number): number => {
  const phase = ((((frame - call.pulseOffset) / call.pulseFrames) % 1) + 1) % 1;
  const triangle = 1 - Math.abs(phase * 2 - 1);
  return Math.max(call.pulseFloor, clamp01(triangle * 1.25));
};

const callerOpacity = (call: Call, frame: number): number => {
  const lift = call.slideStart - 2;
  if (frame <= lift - 3) {
    return pulse(call, frame);
  }
  const ramp = mix(pulse(call, lift - 3), 1, clamp01((frame - (lift - 3)) / 3));
  return ramp * tween(frame, [lift, lift + 12], [1, 0], Easing.linear);
};

const Shimmer = ({ call, frame, size }: { call: Call; frame: number; size: number }) => {
  const sweep = (frame % call.shimmerFrames) / call.shimmerFrames;
  const center = mix(-30, 130, sweep);
  return (
    <span
      style={{
        fontFamily: TEASER_FONTS.label,
        fontSize: size,
        fontWeight: 400,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        backgroundImage: `linear-gradient(90deg, ${call.labelColor} ${center - 22}%, ${call.shimmerColor} ${center}%, ${call.labelColor} ${center + 22}%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {call.sliderLabel}
    </span>
  );
};

const HALO_RINGS = [0, 0.5] as const;

const Halo = ({
  call,
  frame,
  knob,
  x,
  strength,
}: {
  call: Call;
  frame: number;
  knob: number;
  x: number;
  strength: number;
}) => (
  <>
    {HALO_RINGS.map((shift) => {
      const phase = ((((frame - call.pulseOffset) / (call.pulseFrames * 2) + shift) % 1) + 1) % 1;
      const size = knob * mix(1, 1.9, Easing.out(Easing.quad)(phase));
      const opacity = strength * clamp01(phase / 0.12) * (1 - phase) ** 1.6;
      return (
        <div
          key={shift}
          style={{
            position: 'absolute',
            left: x - size / 2,
            top: call.centerY - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            border: `4px solid ${call.haloColor}`,
            boxShadow: `0 0 24px color-mix(in oklab, ${call.haloColor} 45%, transparent)`,
            opacity,
          }}
        />
      );
    })}
  </>
);

export const CallScreen = ({ call, frame }: { call: Call; frame: number }) => {
  const knob = call.pillHeight - 10;
  const pillLeft = 540 - call.pillWidth / 2;
  const restX = pillLeft + call.pillHeight / 2;
  const endX = pillLeft + call.pillWidth - call.pillHeight / 2;
  const slideEnd = call.slideStart + call.slideFrames;
  const slide = tween(frame, [call.slideStart, slideEnd], [0, 1], slideEase);
  const knobX = mix(restX, endX, slide);
  const decline = clamp01((frame - slideEnd) / Math.max(1, call.declineFrames));
  const declineX = tween(frame, [slideEnd, slideEnd + call.declineFrames], [endX, 540], landEase);
  const buttonX = frame <= slideEnd ? knobX : declineX;
  const blush = interpolateColors(
    decline,
    [0, 0.05, 0.45, 0.6, 1],
    [call.knobColor, call.knobColor, call.declineColor, call.declineColor, call.declineDim],
  );
  const iconColor = interpolateColors(
    decline,
    [0, 0.1, 0.4],
    [call.answerColor, call.answerColor, call.hangupIcon],
  );
  const iconTurn = tween(frame, [slideEnd + 1, slideEnd + 5], [0, 135]);
  const pillOpacity = tween(frame, [call.slideStart + 1, slideEnd], [1, 0], Easing.linear);
  const labelOpacity = tween(
    frame,
    [call.slideStart - 1, call.slideStart + 4],
    [1, 0],
    Easing.linear,
  );
  const subtitleOpacity = tween(
    frame,
    [call.slideStart - 2, call.slideStart + 8],
    [1, 0],
    Easing.linear,
  );
  const eaten = Math.max(0, knobX - pillLeft);
  const haloFade = call.halo * tween(frame, [call.slideStart - 4, call.slideStart + 2], [1, 0]);
  return (
    <AbsoluteFill>
      {haloFade > 0 ? (
        <Halo call={call} frame={frame} knob={knob} x={restX} strength={haloFade} />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: call.centerY - 250,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontFamily: TEASER_FONTS.caller,
          fontWeight: 600,
          fontSize: call.callerSize,
          lineHeight: 1,
          letterSpacing: '0.04em',
          color: call.callerColor,
          opacity: callerOpacity(call, frame),
        }}
      >
        {call.caller}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: call.centerY - 141,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontFamily: TEASER_FONTS.subtitle,
          fontWeight: 400,
          letterSpacing: '0.02em',
          fontSize: call.subtitleSize,
          lineHeight: 1,
          color: call.subtitleColor,
          opacity: subtitleOpacity,
        }}
      >
        {call.subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          left: pillLeft + eaten,
          top: call.centerY - call.pillHeight / 2,
          width: Math.max(0, call.pillWidth - eaten),
          height: call.pillHeight,
          borderRadius: call.pillHeight / 2,
          opacity: pillOpacity,
          background: `linear-gradient(180deg, ${call.pillColor}, ${call.pillShade})`,
          boxShadow: `inset 0 0 0 2px ${call.ringColor}, inset 0 3px 10px rgba(255,255,255,0.12), 0 14px 40px -12px color-mix(in oklab, ${call.haloColor} 35%, transparent)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: call.pillHeight + 18 - eaten,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: labelOpacity,
          }}
        >
          <Shimmer call={call} frame={frame} size={call.pillHeight * 0.27} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: buttonX - knob / 2,
          top: call.centerY - knob / 2,
          width: knob,
          height: knob,
          borderRadius: '50%',
          background: blush,
          boxShadow: `0 0 0 ${Math.round(knob * 0.04)}px color-mix(in oklab, ${call.ringColor} ${Math.round(100 * (1 - decline))}%, transparent), 0 0 ${knob * 0.18}px rgba(0,0,0,0.6)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Handset size={knob * 0.6} color={iconColor} rotate={iconTurn} />
      </div>
    </AbsoluteFill>
  );
};
