import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { ProblemStrikeoutProps } from '@/schemas';
import { bodyFont, displayFont, pageFonts } from '../promo/fonts';
import { pixelTween, settle, tween } from '../promo/timing';
import { CardObjects } from './card-objects';

type Card = ProblemStrikeoutProps['card'];

const PUZZLE_Y = 560;
const CHART_Y = 1560;
const KICKER_Y = 890;
const RISE = 36;

const Rising = ({
  frame,
  start,
  top,
  children,
}: {
  frame: number;
  start: number;
  top: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: top + pixelTween(frame, [start, start + 18], [RISE, 0], settle),
      opacity: tween(frame, [start, start + 14], [0, 1]),
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

const Badge = ({ card }: { card: Card }) => (
  <div
    style={{
      position: 'absolute',
      top: 70,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: card.badgeFill,
        boxShadow: '0 10px 28px rgba(120,50,0,0.28)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: displayFont,
        fontWeight: 700,
        fontSize: 64,
        letterSpacing: '-0.04em',
        color: card.badgeInk,
      }}
    >
      {card.monogram}
    </div>
    <div
      style={{
        fontFamily: bodyFont,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: card.ink,
        opacity: 0.92,
      }}
    >
      {card.brand}
    </div>
  </div>
);

const Footer = ({ card }: { card: Card }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 64,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '16px 34px',
        borderRadius: 999,
        background: card.footerFill,
        boxShadow: '0 8px 22px rgba(120,50,0,0.25)',
        fontFamily: bodyFont,
        fontWeight: 700,
        fontSize: 30,
        color: card.footerInk,
      }}
    >
      <span>{card.contact}</span>
      <span style={{ width: 2, height: 30, background: card.footerInk, opacity: 0.35 }} />
      <span>{card.website}</span>
    </div>
  </div>
);

export const SolutionCard = ({
  card,
  lead,
  speed,
}: {
  card: Card;
  lead: number;
  speed: number;
}) => {
  const frame = useCurrentFrame() * speed - lead;
  const lines = card.headline.split('\n');
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${card.top} 0%, ${card.bottom} 100%)`,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 42%, rgba(255,236,200,${card.glow * 0.45}) 0%, rgba(255,236,200,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 900,
          letterSpacing: '-0.08em',
          color: card.watermarkInk,
          opacity: card.watermark,
          transform: 'translateY(-60px)',
        }}
      >
        {card.monogram}
      </AbsoluteFill>
      <Badge card={card} />
      <CardObjects card={card} frame={frame} puzzleY={PUZZLE_Y} chartY={CHART_Y} />
      <Rising frame={frame} start={card.stagger} top={KICKER_Y}>
        <span
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: card.kickerSize,
            color: card.ink,
            textShadow: '0 3px 12px rgba(120,45,0,0.3)',
          }}
        >
          {card.kicker}
        </span>
      </Rising>
      <Rising frame={frame} start={card.stagger * 2} top={KICKER_Y + 24 + card.kickerSize}>
        {lines.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: pageFonts.condensed,
              fontWeight: 700,
              fontSize: card.headlineSize,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              color: card.ink,
              textShadow: '0 5px 16px rgba(110,40,0,0.35)',
            }}
          >
            {line}
          </div>
        ))}
      </Rising>
      <Footer card={card} />
    </AbsoluteFill>
  );
};
