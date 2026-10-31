import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import type { WebsiteFoundSpotlightProps } from '@/schemas';
import { didoneFont, displayFont } from '../promo/fonts';
import { pixelTween, settle, tween } from '../promo/timing';
import { CodeTile } from './code-tile';
import { RingMark } from './ring-mark';

type EndCardLook = WebsiteFoundSpotlightProps['endCard'];

const RISE = 30;

const RISE_FRAMES = 14;

const fade = (color: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${Math.round(amount * 100)}%, transparent)`;

const Rise = ({
  elapsed,
  delay,
  style,
  children,
}: {
  elapsed: number;
  delay: number;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    style={{
      ...style,
      opacity: tween(elapsed, [delay, delay + RISE_FRAMES * 0.8], [0, 1]),
      transform: `translateY(${pixelTween(elapsed, [delay, delay + RISE_FRAMES], [RISE, 0], settle)}px)`,
    }}
  >
    {children}
  </div>
);

const Beam = ({ card }: { card: EndCardLook }) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: -80,
        height: 1400,
        clipPath: 'polygon(41% 0, 59% 0, 92% 100%, 8% 100%)',
        background: `linear-gradient(180deg, ${fade(card.beam, card.beamOpacity * 1.4)} 0%, ${fade(card.beam, card.beamOpacity * 0.55)} 55%, ${fade(card.beam, 0)} 100%)`,
        filter: 'blur(36px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 1150,
        width: 980,
        height: 240,
        marginLeft: -490,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${fade(card.beam, card.beamOpacity * 0.9)} 0%, ${fade(card.beam, card.beamOpacity * 0.3)} 45%, ${fade(card.beam, 0)} 72%)`,
      }}
    />
  </>
);

export const EndCard = ({
  card,
  markLetter,
  elapsed,
}: {
  card: EndCardLook;
  markLetter: string;
  elapsed: number;
}) => {
  const start = card.irisFrames * 0.45;
  const at = (index: number) => start + index * card.stagger;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${card.backdropEdge} 0%, ${card.backdrop} 42%, ${card.backdrop} 74%, ${card.backdropEdge} 100%)`,
        fontFamily: displayFont,
      }}
    >
      <Beam card={card} />
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <Rise elapsed={elapsed} delay={at(0)} style={{ marginTop: 250 }}>
          <RingMark letter={markLetter} size={176} ink={card.ink} ring={card.accent} />
        </Rise>
        <Rise
          elapsed={elapsed}
          delay={at(1)}
          style={{ marginTop: 120, textAlign: 'center', lineHeight: 1.06 }}
        >
          <div
            style={{
              color: card.ink,
              fontSize: card.headlineSize,
              fontWeight: 600,
              letterSpacing: '-0.025em',
            }}
          >
            {card.headline}
          </div>
          <div
            style={{
              color: card.accent,
              fontFamily: didoneFont,
              fontSize: card.sublineSize,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              marginTop: 6,
            }}
          >
            {card.subline}
          </div>
        </Rise>
        {card.showCode ? (
          <Rise elapsed={elapsed} delay={at(2)} style={{ marginTop: 84 }}>
            <CodeTile
              size={290}
              seed={card.codeSeed}
              frameFrom={card.accent}
              frameTo={`color-mix(in oklab, ${card.accent} 60%, #ff8a3d)`}
              ink="#0c1b1f"
            />
          </Rise>
        ) : null}
        <Rise
          elapsed={elapsed}
          delay={at(3)}
          style={{ marginTop: 70, fontSize: 44, fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          <span style={{ color: card.brandInk }}>{card.brand}</span>{' '}
          <span style={{ color: card.accent, fontWeight: 500 }}>{card.brandAccent}</span>
        </Rise>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 340,
          background: `linear-gradient(180deg, ${fade(card.band, 0)} 0%, ${card.band} 38%, ${card.band} 100%)`,
        }}
      />
      <Rise
        elapsed={elapsed}
        delay={at(4)}
        style={{
          position: 'absolute',
          top: 1640,
          width: '100%',
          textAlign: 'center',
          color: card.contactInk,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '0.01em' }}>{card.phone}</div>
        <div style={{ marginTop: 22, fontSize: 28, fontWeight: 500, opacity: 0.8 }}>
          {card.email}
          <span style={{ color: card.accent, margin: '0 16px' }}>•</span>
          {card.website}
        </div>
      </Rise>
    </AbsoluteFill>
  );
};
