import { bodyFont, displayFont } from './fonts';

export interface StoreButtonProps {
  caption: string;
  label: string;
  filled: boolean;
  ink: string;
  paper: string;
  variant: 'pill' | 'store';
  scale: number;
}

export const StoreButton = ({
  caption,
  label,
  filled,
  ink,
  paper,
  variant,
  scale,
}: StoreButtonProps) =>
  variant === 'store' ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 250 * scale,
        padding: `${12 * scale}px ${26 * scale}px`,
        borderRadius: 16 * scale,
        background: '#0b0b0c',
        border: `${1.5 * scale}px solid #a6a6a6`,
        color: '#ffffff',
        lineHeight: 1.1,
      }}
    >
      <span style={{ fontFamily: bodyFont, fontSize: 15 * scale, opacity: 0.85 }}>{caption}</span>
      <span
        style={{
          fontFamily: displayFont,
          fontSize: 32 * scale,
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </span>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 220 * scale,
        padding: `${16 * scale}px ${34 * scale}px`,
        borderRadius: 999,
        background: filled ? ink : 'transparent',
        border: `1.5px solid ${filled ? ink : `${ink}40`}`,
        color: filled ? paper : ink,
        lineHeight: 1.1,
        textAlign: 'center',
      }}
    >
      <span style={{ fontFamily: bodyFont, fontSize: 15 * scale, opacity: 0.65 }}>{caption}</span>
      <span
        style={{
          fontFamily: displayFont,
          fontSize: 30 * scale,
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </span>
    </div>
  );

export const AppIconMark = ({
  color,
  colorEnd,
  ink,
  glyph,
  size,
}: {
  color: string;
  colorEnd: string;
  ink: string;
  glyph: string;
  size: number;
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: `linear-gradient(170deg, ${color}, ${colorEnd})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: size * 0.72,
        height: size * 0.72,
        background: ink,
        maskImage: `url(${glyph})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${glyph})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  </div>
);
