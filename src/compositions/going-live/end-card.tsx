import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { clamp01, progress } from './beat';
import { teaserFont } from './fonts';

const CHAR_FRAMES = 10;
const CONTACT_ROW_GAP = 96;
const CONTACT_FADE = 16;
const UNDERLINE_FRAMES = 26;

const Glyph = ({ char, shown }: { char: string; shown: number }) => (
  <span
    style={{
      display: 'inline-block',
      whiteSpace: 'pre',
      opacity: shown,
      transform: shown < 1 ? `scale(${(0.45 + 0.55 * shown).toFixed(3)})` : undefined,
      transformOrigin: '50% 80%',
    }}
  >
    {char}
  </span>
);

const iconStroke = { fill: 'none', strokeWidth: 1.6, strokeLinecap: 'round' } as const;

const Globe = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx={12} cy={12} r={9} stroke={color} {...iconStroke} />
    <ellipse cx={12} cy={12} rx={4} ry={9} stroke={color} {...iconStroke} />
    <path d="M3 12h18M5 7h14M5 17h14" stroke={color} {...iconStroke} />
  </svg>
);

const Phone = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"
      stroke={color}
      {...iconStroke}
    />
  </svg>
);

const Mail = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x={3} y={5} width={18} height={14} rx={1.5} stroke={color} {...iconStroke} />
    <path d="M3 6l9 7 9-7" stroke={color} {...iconStroke} />
  </svg>
);

const Row = ({
  icon,
  text,
  size,
  color,
}: {
  icon: ReactNode;
  text: string;
  size: number;
  color: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.6, color, fontSize: size }}>
    {icon}
    <span>{text}</span>
  </div>
);

export const EndCard = ({
  frame,
  copy,
  type,
  look,
  timing,
  layout,
}: {
  frame: number;
  copy: GoingLiveTeaserProps['copy'];
  type: GoingLiveTeaserProps['type'];
  look: GoingLiveTeaserProps['look'];
  timing: GoingLiveTeaserProps['timing'];
  layout: GoingLiveTeaserProps['endCard'];
}) => {
  if (frame < timing.taglineStart) {
    return null;
  }
  const lead = Array.from(`${copy.tagline} `);
  const tail = Array.from(copy.taglineAccent);
  const shownAt = (index: number) =>
    clamp01((frame - timing.taglineStart - index * timing.taglineCharFrames) / CHAR_FRAMES);
  const contacts = progress(frame, timing.contactsAt, timing.contactsAt + CONTACT_FADE);
  const underlineStart =
    timing.taglineStart + (lead.length + tail.length) * timing.taglineCharFrames;
  const underline =
    1 - (1 - progress(frame, underlineStart, underlineStart + UNDERLINE_FRAMES)) ** 3;
  const iconSize = type.contactSize * 1.1;
  return (
    <AbsoluteFill style={{ fontFamily: teaserFont }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: layout.taglineY,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          whiteSpace: 'pre',
          color: look.ink,
          fontSize: type.taglineSize,
          fontWeight: 500,
          letterSpacing: `${type.taglineTracking}em`,
        }}
      >
        {lead.map((char, index) => (
          <Glyph key={`l${index}:${char}`} char={char} shown={shownAt(index)} />
        ))}
        <span
          style={{
            position: 'relative',
            color: look.accent,
            fontWeight: 700,
            fontSize: type.taglineSize * 1.12,
            letterSpacing: `${type.taglineTracking * 0.7}em`,
          }}
        >
          {tail.map((char, index) => (
            <Glyph key={`t${index}:${char}`} char={char} shown={shownAt(lead.length + index)} />
          ))}
          {underline > 0 ? (
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-0.32em',
                height: Math.max(3, type.taglineSize * 0.09),
                width: `calc((100% - ${type.taglineTracking * 0.7}em) * ${underline.toFixed(4)})`,
                borderRadius: 99,
                background: look.underline,
              }}
            />
          ) : null}
        </span>
      </div>
      {copy.showContacts && contacts > 0 ? (
        <AbsoluteFill style={{ opacity: contacts, fontWeight: 500 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: layout.contactsY,
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Row
              icon={<Globe color={look.muted} size={iconSize} />}
              text={copy.website}
              size={type.contactSize}
              color={look.muted}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: layout.contactsY + CONTACT_ROW_GAP,
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Row
              icon={<Phone color={look.muted} size={iconSize} />}
              text={copy.phone}
              size={type.contactSize}
              color={look.muted}
            />
            <Row
              icon={<Mail color={look.muted} size={iconSize} />}
              text={copy.email}
              size={type.contactSize}
              color={look.muted}
            />
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
