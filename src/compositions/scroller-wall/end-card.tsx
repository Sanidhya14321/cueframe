import { AbsoluteFill, Easing, Img, useVideoConfig } from 'remotion';
import type { ScrollerWallProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { wallFont } from './fonts';

type Card = ScrollerWallProps['card'];

const PHONE_PATH =
  'M8.2 4.6c.7 0 1.2.6 1.6 1.6l.9 2.2c.3.8.1 1.6-.5 2.1l-1 .8c.9 1.9 2.5 3.6 4.5 4.5l.8-1c.5-.6 1.3-.8 2.1-.5l2.2.9c1 .4 1.6.9 1.6 1.6v1.3c0 1.3-1.1 2.3-2.4 2.2C10.6 19.9 4.1 13.4 3.7 6.1c-.1-1.3.9-2.4 2.2-2.4z';

const WAVE = 'M-38 0 q19 -20 38 0 t38 0';

const RING_FADES = [1, 0.7, 0.42];

const WaveMark = ({
  ink,
  accent,
  paper,
  size,
}: {
  ink: string;
  accent: string;
  paper: string;
  size: number;
}) => (
  <svg width={size} height={size} viewBox="-75 -75 150 150" aria-hidden="true">
    <rect x={-66} y={-66} width={132} height={132} rx={40} fill={accent} />
    <g fill="none" stroke={paper} strokeWidth={11} strokeLinecap="round">
      <path d={WAVE} transform="translate(0 -14)" />
      <path d={WAVE} transform="translate(0 20)" />
    </g>
    <circle cx={44} cy={-44} r={9} fill={ink} />
  </svg>
);

const Mark = ({
  card,
  ink,
  accent,
  tinted,
}: {
  card: Card;
  ink: string;
  accent: string;
  tinted: boolean;
}) => {
  if (card.logoImage === '') {
    return <WaveMark ink={ink} accent={accent} paper={card.disc} size={card.logoSize} />;
  }
  if (tinted) {
    return <div style={{ width: card.logoSize, height: card.logoSize }} />;
  }
  return (
    <Img
      src={card.logoImage}
      style={{ width: card.logoSize, height: card.logoSize, objectFit: 'contain' }}
    />
  );
};

const Logo = ({
  card,
  ink,
  accent,
  tinted,
}: {
  card: Card;
  ink: string;
  accent: string;
  tinted: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: wallFont,
      lineHeight: 1,
    }}
  >
    <Mark card={card} ink={ink} accent={accent} tinted={tinted} />
    <span
      style={{
        marginTop: 24,
        fontSize: card.brandTopSize,
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: ink,
      }}
    >
      {card.brandTop}
    </span>
    <span
      style={{
        marginTop: 14,
        fontSize: card.brandBottomSize,
        fontWeight: 600,
        letterSpacing: '0.6em',
        marginRight: '-0.6em',
        color: accent,
      }}
    >
      {card.brandBottom}
    </span>
  </div>
);

const Row = ({
  icon,
  text,
  size,
  card,
}: {
  icon: 'phone' | 'mail';
  text: string;
  size: number;
  card: Card;
}) => {
  const iconSize = Math.round(size * 1.18);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.36, height: size * 1.9 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" aria-hidden="true">
        <rect width={24} height={24} rx={7} fill={card.logoAccent} />
        {icon === 'phone' ? (
          <path d={PHONE_PATH} fill={card.background} transform="translate(1.2 0.6) scale(0.86)" />
        ) : (
          <g fill="none" stroke={card.background} strokeWidth={1.6} strokeLinejoin="round">
            <rect x={6} y={7.5} width={12} height={9} rx={1.6} />
            <path d="M6.6 8.4 L12 12.6 L17.4 8.4" />
          </g>
        )}
      </svg>
      <span
        style={{
          fontFamily: wallFont,
          fontWeight: 600,
          fontSize: size,
          color: card.rowInk,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Rings = ({ frame, card, width }: { frame: number; card: Card; width: number }) => {
  const grow = tween(frame, [card.at, card.at + card.ringFrames], [0, 1], Easing.out(Easing.cubic));
  return (
    <g fill="none" stroke={card.rings} strokeWidth={card.ringWidth}>
      {RING_FADES.map((fade, index) => (
        <circle
          key={fade}
          cx={width / 2}
          cy={card.centerY}
          r={card.discRadius + card.ringGap * (index + 1) * (0.35 + 0.65 * grow)}
          opacity={fade * grow}
        />
      ))}
    </g>
  );
};

export const EndCard = ({
  frame,
  card,
  showBackdrop,
}: {
  frame: number;
  card: Card;
  showBackdrop: boolean;
}) => {
  const { width, height } = useVideoConfig();
  const shown = tween(frame, [card.at, card.at + card.fadeFrames], [0, 1], smooth);
  const tint = 1 - tween(frame, [card.at, card.at + card.tintFrames], [0, 1], smooth);
  return (
    <AbsoluteFill style={{ opacity: shown }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        {showBackdrop ? <rect width={width} height={height} fill={card.background} /> : null}
        <Rings frame={frame} card={card} width={width} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: width / 2 - card.discRadius,
          top: card.centerY - card.discRadius,
          width: card.discRadius * 2,
          height: card.discRadius * 2,
          borderRadius: '50%',
          background: card.disc,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Logo card={card} ink={card.logoInk} accent={card.logoAccent} tinted={false} />
          <div style={{ position: 'absolute', inset: 0, opacity: tint }}>
            <Logo card={card} ink={card.tint} accent={card.tint} tinted />
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: card.rowsY - card.phoneSize * 0.85,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div>
          <Row icon="phone" text={card.phone} size={card.phoneSize} card={card} />
          <Row icon="mail" text={card.email} size={card.emailSize} card={card} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
