import { AbsoluteFill } from 'remotion';
import type { BurningPaperRevealProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { groteskFont, serifFont } from './fonts';

export const BrandCard = ({
  card,
  frame,
}: {
  card: BurningPaperRevealProps['brandCard'];
  frame: number;
}) => {
  if (!card.show) {
    return null;
  }
  const shown = tween(
    frame,
    [card.start, card.start + Math.max(1, card.fadeFrames)],
    [0, 1],
    smooth,
  );
  if (shown <= 0) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{
        opacity: shown,
        background: card.background,
        color: card.ink,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: serifFont,
          fontWeight: 400,
          fontSize: card.nameSize,
          letterSpacing: '-0.02em',
        }}
      >
        {card.name}
      </div>
      <div style={{ fontFamily: groteskFont, fontWeight: 600, fontSize: card.taglineSize }}>
        {card.tagline}
      </div>
    </AbsoluteFill>
  );
};
