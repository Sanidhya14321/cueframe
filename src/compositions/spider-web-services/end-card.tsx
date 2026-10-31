import type { SpiderWebServicesProps } from '@/schemas';
import { glide, tween } from '../promo/timing';
import { BrandMark, SocialRow } from './brand-glyphs';
import { serifFont, titleFont } from './fonts';

const LOGO_TOP = 530;

const STATEMENT_TOP = 846;

const linesOf = (text: string) => text.split('\n').filter((line) => line.trim().length > 0);

const Statement = ({
  text,
  size,
  colors,
}: {
  text: string;
  size: number;
  colors: [string, string];
}) => {
  const lines = linesOf(text);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {lines.map((line, index) => (
        <div
          key={`${line}-${index}`}
          style={{
            fontFamily: titleFont,
            fontWeight: index === lines.length - 1 ? 800 : 600,
            fontSize: index === lines.length - 1 ? size * 1.36 : size,
            lineHeight: 1.08,
            letterSpacing: index === lines.length - 1 ? '-0.02em' : '0.06em',
            color: colors[index === lines.length - 1 ? 1 : 0],
            whiteSpace: 'nowrap',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

const Punch = ({ text, size, color }: { text: string; size: number; color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {linesOf(text).map((line, index) => (
      <div
        key={`${line}-${index}`}
        style={{
          fontFamily: serifFont,
          fontStyle: 'italic',
          fontSize: size,
          lineHeight: 0.84,
          letterSpacing: '-0.01em',
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {line}
      </div>
    ))}
  </div>
);

const Divider = ({ color }: { color: string }) => (
  <svg width={220} height={18} viewBox="-110 -9 220 18" aria-hidden="true">
    <path d="M -104 0 L -16 0 M 16 0 L 104 0" stroke={color} strokeWidth={2} strokeOpacity={0.55} />
    <path d="M 0 -7 L 7 0 L 0 7 L -7 0 Z" fill={color} />
  </svg>
);

const Arrow = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M 5 12 L 19 12 M 13 6 L 19 12 L 13 18"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EndCard = ({
  props,
  top,
  frame,
  settled,
}: {
  props: SpiderWebServicesProps;
  top: number;
  frame: number;
  settled: number;
}) => {
  const { brand, card, timing } = props;
  if (top > 2000 || top < -2400) {
    return null;
  }
  const socialsAt = settled + timing.socialsDelay;
  const pillAt = socialsAt + 10;
  const pill = tween(frame, [pillAt, pillAt + timing.pillFrames], [0, 1], glide);
  const pillText = tween(
    frame,
    [pillAt + timing.pillFrames * 0.6, pillAt + timing.pillFrames + 4],
    [0, 1],
  );
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 1080, height: 1920 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: LOGO_TOP,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
        }}
      >
        <BrandMark size={card.wordmarkSize * 2.1} color={brand.mark} shade={brand.markShade} />
        <div
          style={{
            fontFamily: titleFont,
            fontWeight: 600,
            fontSize: card.wordmarkSize,
            letterSpacing: '-0.02em',
            color: brand.ink,
          }}
        >
          {brand.name}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: STATEMENT_TOP,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: card.statementSize * 0.6,
        }}
      >
        <Statement
          text={card.statement}
          size={card.statementSize}
          colors={[card.ink, card.highlight]}
        />
        <Divider color={card.highlight} />
        <Punch text={card.punch} size={card.punchSize} color={card.ink} />
        {card.showSocials ? (
          <div style={{ marginTop: card.statementSize * 0.5 }}>
            <SocialRow color={card.icons} size={32} frame={frame} start={socialsAt} />
          </div>
        ) : null}
        {card.showButton ? (
          <div
            style={{
              marginTop: card.statementSize * 0.1,
              filter: `drop-shadow(0 0 16px color-mix(in srgb, ${card.pill} 45%, transparent))`,
              opacity: Math.min(1, pill * 4),
            }}
          >
            <div
              style={{
                height: 64,
                minWidth: 340,
                clipPath: `inset(0 calc((50% - 32px) * ${(1 - pill).toFixed(4)}) round 32px)`,
                borderRadius: 32,
                background: `linear-gradient(to right, ${card.pill}, ${card.pillShade})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 22,
                padding: '0 8px 0 32px',
                fontFamily: titleFont,
                fontWeight: 600,
                fontSize: 24,
                color: card.pillInk,
              }}
            >
              <span style={{ opacity: pillText }}>{brand.url}</span>
              <span
                style={{
                  opacity: pillText,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: card.pillInk,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Arrow color={card.pill} />
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
