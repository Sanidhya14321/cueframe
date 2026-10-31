import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { pixelTween, settle, smooth, tween } from '../promo/timing';
import { add, fade, mixColor } from './geometry';
import { type CableRig, PLUG, type Vessel } from './rig';
import { type Beats, badgeExitAt } from './timeline';

type Props = MailinfraDeliverabilityChargeProps;

const glowOf = (color: string, strength: number, size: number): string =>
  strength <= 0
    ? 'none'
    : [0.04, 0.12, 0.32]
        .map(
          (spread, index) =>
            `0 0 ${(size * spread).toFixed(1)}px ${fade(color, strength * (0.9 - index * 0.25))}`,
        )
        .join(', ');

const Digits = ({ text, width }: { text: string; width: number }) => (
  <>
    {[...text].map((character, index) =>
      character >= '0' && character <= '9' ? (
        <span
          key={`${index}:${character}`}
          style={{ display: 'inline-block', width: `${width}em`, textAlign: 'center' }}
        >
          {character}
        </span>
      ) : (
        <span key={`${index}:${character}`}>{character}</span>
      ),
    )}
  </>
);

export const HeadlineGlow = ({ headline, glow }: { headline: Props['headline']; glow: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: headline.top,
      textAlign: 'center',
      fontFamily: displayFont,
      fontWeight: 700,
      fontSize: headline.size,
      lineHeight: 1,
      letterSpacing: `${headline.tracking}em`,
      paddingLeft: `${headline.tracking}em`,
      color: mixColor(headline.color, glow, headline.tint),
      textShadow: glowOf(glow, headline.glow, headline.size * 1.6),
      whiteSpace: 'pre',
    }}
  >
    {headline.text}
  </div>
);

export const Counter = ({
  counter,
  vessel,
  charge,
}: {
  counter: Props['counter'];
  vessel: Vessel;
  charge: number;
}) => {
  const value = (counter.from + (counter.target - counter.from) * charge).toFixed(counter.decimals);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: Math.round(vessel.top + vessel.height * counter.position - counter.size * 0.55),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 600,
          fontSize: counter.size,
          lineHeight: 1.1,
          letterSpacing: '-0.035em',
          color: counter.color,
          whiteSpace: 'pre',
        }}
      >
        <Digits text={value} width={0.58} />
        {counter.suffix}
      </div>
      {counter.caption.length > 0 ? (
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: counter.captionSize,
            lineHeight: 1.2,
            letterSpacing: '0.2em',
            paddingLeft: '0.2em',
            textTransform: 'uppercase',
            color: counter.captionColor,
            whiteSpace: 'pre',
          }}
        >
          {counter.caption}
        </div>
      ) : null}
    </div>
  );
};

export const LandedBadge = ({
  badge,
  vessel,
  beats,
  frame,
  check,
}: {
  badge: Props['badge'];
  vessel: Vessel;
  beats: Beats;
  frame: number;
  check: string;
}) => {
  if (!badge.show || badge.text.length === 0) {
    return null;
  }
  const range: [number, number] = [beats.fullAt + 4, beats.fullAt + 36];
  const enter = tween(frame, range, [0, 1], settle);
  const exitAt = badgeExitAt(beats, badge.hold);
  const exit = exitAt === undefined ? 0 : tween(frame, [exitAt, exitAt + 14], [0, 1], smooth);
  const opacity = enter * (1 - exit);
  if (opacity <= 0) {
    return null;
  }
  const rise = pixelTween(frame, range, [Math.round(badge.size * 0.9), 0], settle);
  const mark = Math.round(badge.size * 1.1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: Math.round(vessel.top - badge.gap - badge.size),
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(badge.size * 0.45),
          padding: `${Math.round(badge.size * 0.4)}px ${Math.round(badge.size * 0.8)}px ${Math.round(badge.size * 0.4)}px ${Math.round(badge.size * 0.45)}px`,
          borderRadius: 999,
          background: badge.fill,
          color: badge.ink,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: badge.size,
          lineHeight: 1.1,
          whiteSpace: 'pre',
          boxShadow: glowOf(check, 0.55, badge.size * 3),
        }}
      >
        <svg width={mark} height={mark} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx={12} cy={12} r={12} fill={check} />
          <path
            d="M7 12.4 L10.5 15.8 L17 8.8"
            fill="none"
            stroke={badge.fill}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {badge.text}
      </div>
    </div>
  );
};

export const CableLabels = ({ rigs, cables }: { rigs: CableRig[]; cables: Props['cables'] }) => (
  <>
    {rigs.map((rig) => {
      if (rig.label.length === 0 || rig.labelOpacity <= 0) {
        return null;
      }
      const anchor = add(rig.tail, rig.normal, (PLUG.thick * cables.plugSize) / 2 + 8);
      const shift = (along: number, side: number) =>
        Math.min(0, Math.max(-100, -50 - 50 * along + 50 * side)).toFixed(2);
      return (
        <div
          key={rig.key}
          style={{
            position: 'absolute',
            left: anchor.x,
            top: anchor.y,
            transform: `translate(${shift(rig.heading.x, rig.normal.x)}%, ${shift(rig.heading.y, rig.normal.y)}%)`,
            opacity: rig.labelOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: Math.round(cables.labelSize * 0.35),
            padding: `${Math.round(cables.labelSize * 0.28)}px ${Math.round(cables.labelSize * 0.62)}px`,
            borderRadius: 999,
            background: cables.labelFill,
            border: `1.5px solid ${cables.plugEdge}`,
            color: cables.labelInk,
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: cables.labelSize,
            lineHeight: 1.1,
            whiteSpace: 'pre',
          }}
        >
          <div
            style={{
              width: Math.round(cables.labelSize * 0.34),
              height: Math.round(cables.labelSize * 0.34),
              borderRadius: 999,
              background: cables.ring,
            }}
          />
          {rig.label}
        </div>
      );
    })}
  </>
);
