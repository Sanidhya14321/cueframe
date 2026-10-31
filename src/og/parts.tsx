import type { ReactNode } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { isLight } from './palette';

export interface Ink {
  text: string;
  muted: string;
  hairline: string;
  chip: string;
  ring: string;
}

const DARK_INK: Ink = {
  text: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.66)',
  hairline: 'rgba(255, 255, 255, 0.16)',
  chip: 'rgba(255, 255, 255, 0.08)',
  ring: 'rgba(255, 255, 255, 0.85)',
};

const LIGHT_INK: Ink = {
  text: '#111114',
  muted: 'rgba(17, 17, 20, 0.62)',
  hairline: 'rgba(17, 17, 20, 0.14)',
  chip: 'rgba(255, 255, 255, 0.55)',
  ring: '#ffffff',
};

export const inkOn = (background: string): Ink => (isLight(background) ? LIGHT_INK : DARK_INK);

export const Wordmark = ({ ink }: { ink: Ink }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <BrandMark size={34} />
    <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6, color: ink.text }}>
      neuclip
    </div>
  </div>
);

export const Eyebrow = ({
  parts,
  accent,
  ink,
}: {
  parts: readonly string[];
  accent: string;
  ink: Ink;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: 2.6,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: ink.muted,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        background: accent,
        boxShadow: `0 0 18px ${accent}`,
      }}
    />
    {parts.join('  ·  ')}
  </div>
);

export const Chips = ({ items, ink }: { items: readonly string[]; ink: Ink }) => (
  <div style={{ display: 'flex', gap: 10 }}>
    {items.map((item) => (
      <div
        key={item}
        style={{
          display: 'flex',
          padding: '9px 18px',
          borderRadius: 999,
          border: `1px solid ${ink.hairline}`,
          background: ink.chip,
          fontSize: 18,
          fontWeight: 500,
          color: ink.text,
        }}
      >
        {item}
      </div>
    ))}
  </div>
);

export const Swatches = ({ colors, ink }: { colors: readonly string[]; ink: Ink }) => (
  <div style={{ display: 'flex' }}>
    {colors.map((color, index) => (
      <div
        key={`${color}-${String(index)}`}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          background: color,
          border: `2px solid ${ink.ring}`,
          marginLeft: index === 0 ? 0 : -10,
        }}
      />
    ))}
  </div>
);

export const Column = ({
  width,
  children,
  justify = 'space-between',
}: {
  width: number;
  children: ReactNode;
  justify?: 'space-between' | 'center';
}) => (
  <div
    style={{
      position: 'absolute',
      left: 72,
      top: 64,
      bottom: 64,
      width,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: justify,
    }}
  >
    {children}
  </div>
);

export const Clamp = ({
  lines,
  style,
  children,
}: {
  lines: number;
  style: Record<string, string | number>;
  children: string;
}) => <div style={{ display: 'block', lineClamp: lines, ...style }}>{children}</div>;
