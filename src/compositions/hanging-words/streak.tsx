import { type CSSProperties, type ReactNode, useId } from 'react';

export const Streak = ({
  x = 0,
  y = 0,
  style,
  children,
}: {
  x?: number;
  y?: number;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const id = `streak-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const active = x > 0.05 || y > 0.05;
  return (
    <div style={{ ...style, filter: active ? `url(#${id})` : undefined }}>
      {active ? (
        <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      {children}
    </div>
  );
};
