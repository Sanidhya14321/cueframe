import type { CSSProperties, ReactNode } from 'react';

export const TextLine = ({
  centerY,
  size,
  font,
  weight,
  color,
  tracking = 0,
  style,
  children,
}: {
  centerY: number;
  size: number;
  font: string;
  weight: number;
  color: string;
  tracking?: number;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: centerY - size / 2,
      height: size,
      lineHeight: `${size}px`,
      fontFamily: font,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: `${tracking}em`,
      color,
      textAlign: 'center',
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </div>
);
