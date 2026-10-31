import type { MailinfraSpiderDropProps } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { withAlpha } from '../promo/glow';
import { FadeIn } from '../promo/typography';

const EnvelopeMark = ({ size, color, ink }: { size: number; color: string; ink: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <rect x={2} y={2} width={96} height={96} rx={26} fill={color} />
    <rect
      x={22}
      y={31}
      width={56}
      height={40}
      rx={6}
      fill="none"
      stroke={ink}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M 25 35 L 50 54 L 75 35"
      fill="none"
      stroke={ink}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EndLockup = ({ props, start }: { props: MailinfraSpiderDropProps; start: number }) => {
  const { endCard, look } = props;
  if (!endCard.show) {
    return null;
  }
  const mark = endCard.brandSize * 1.25;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: endCard.y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: endCard.taglineSize * 0.8,
      }}
    >
      <FadeIn start={start}>
        <div style={{ display: 'flex', alignItems: 'center', gap: endCard.brandSize * 0.28 }}>
          <EnvelopeMark size={mark} color={endCard.markColor} ink={endCard.markInk} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: endCard.brandSize,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: look.ink,
            }}
          >
            {endCard.brand}
          </div>
        </div>
      </FadeIn>
      <FadeIn start={start} delay={6}>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: endCard.taglineSize,
            lineHeight: 1.3,
            color: look.muted,
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          {endCard.tagline}
        </div>
      </FadeIn>
      {endCard.url.length > 0 ? (
        <FadeIn start={start} delay={12}>
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: endCard.taglineSize * 0.95,
              lineHeight: 1,
              color: endCard.pillText,
              background: endCard.pillColor,
              borderRadius: 999,
              padding: `${endCard.taglineSize * 0.5}px ${endCard.taglineSize * 1.1}px`,
              boxShadow: `0 10px 40px ${withAlpha(endCard.pillColor, 0.4)}`,
            }}
          >
            {endCard.url}
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
};
