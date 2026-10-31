import type { CSSProperties } from 'react';
import type { WebMotionProps } from '@/schemas/clips/imported/common';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const MotionCards = ({
  variant,
  frame,
  props,
  style,
}: {
  variant: number;
  frame: number;
  props: WebMotionProps;
  style: CSSProperties;
}) => {
  const progress = 1 - (1 - clamp(frame / 35)) ** 3;
  const border = `2px solid ${props.primary}88`;
  if (variant === 9 || variant === 10 || variant === 21) {
    return (
      <div
        style={{
          position: 'relative',
          padding: variant === 21 ? '0.65em 1.2em' : '0.85em 1em',
          background: props.surface,
          borderRadius: variant === 21 ? 200 : 38,
          border,
          overflow: 'hidden',
          transform: `translateY(${(1 - progress) * 80}px)`,
          boxShadow: `0 30px 100px ${props.primary}22`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            background: `linear-gradient(115deg,transparent 30%,${props.primary} 50%,transparent 70%)`,
            transform: `translateX(${Math.sin(frame / 35) * 85}%)`,
          }}
        />
        {variant === 10 ? (
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
            role="img"
            aria-label="Traveling border beam"
          >
            <rect
              x="2"
              y="2"
              width="99%"
              height="98%"
              rx="36"
              fill="none"
              stroke={props.textColor}
              strokeWidth="4"
              strokeDasharray="120 1200"
              strokeDashoffset={-frame * 12}
            />
          </svg>
        ) : null}
        <div style={{ ...style, position: 'relative' }}>{props.text}</div>
      </div>
    );
  }
  if (variant === 17) {
    return (
      <div style={{ width: '86%', maxWidth: 1300 }}>
        {[0, 1, 2].map((index) => {
          const p = clamp((frame - index * 10) / 30);
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '30px 40px',
                marginTop: 18,
                background: props.surface,
                borderRadius: 24,
                border,
                opacity: p,
                transform: `translateX(${(1 - p) * 260}px) scale(${0.9 + p * 0.1})`,
              }}
            >
              <span style={{ fontSize: '0.6em', color: props.primary }}>0{index + 1}</span>
              <span style={{ ...style, fontSize: '0.55em', textAlign: 'left' }}>
                {index === 1 ? props.subtitle : props.text}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  if (variant === 19) {
    return (
      <div
        style={{
          width: '90%',
          maxWidth: 1500,
          background: props.surface,
          borderRadius: 28,
          overflow: 'hidden',
          border,
          transform: `translateY(${(1 - progress) * 130}px) scale(${0.92 + progress * 0.08})`,
          boxShadow: '0 60px 100px #0006',
        }}
      >
        <div
          style={{
            height: 68,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 28px',
            borderBottom: '1px solid #ffffff22',
          }}
        >
          {['#fb7185', '#fbbf24', '#4ade80'].map((color) => (
            <span
              key={color}
              style={{ width: 15, height: 15, borderRadius: 20, background: color }}
            />
          ))}
          <div
            style={{
              margin: '0 auto',
              background: props.background,
              borderRadius: 10,
              padding: '8px 130px',
              fontSize: 18,
              color: props.textColor,
            }}
          >
            your-next-idea.local
          </div>
        </div>
        <div style={{ padding: '100px 60px', textAlign: 'center', minHeight: 400 }}>
          <div style={style}>{props.text}</div>
          <p style={{ fontSize: 32, color: props.primary, marginTop: 30 }}>{props.subtitle}</p>
          <span
            style={{
              display: 'inline-block',
              marginTop: 38,
              padding: '18px 44px',
              borderRadius: 10,
              background: props.primary,
              fontSize: 24,
              color: props.background,
            }}
          >
            Explore the idea →
          </span>
        </div>
      </div>
    );
  }
  if (variant === 20) {
    return (
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {[0, 1].map((index) => (
          <div
            key={index}
            style={{
              width: 280,
              height: 550,
              border: `10px solid ${props.textColor}`,
              borderRadius: 52,
              background: props.surface,
              padding: '50px 20px',
              transform: `translateY(${(1 - progress) * 180 + index * 25}px) rotate(${(index ? 1 : -1) * (5 + Math.sin(frame / 50) * 2)}deg)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: '30%',
                width: '40%',
                height: 20,
                borderRadius: 20,
                background: props.background,
              }}
            />
            <div
              style={{
                width: 55,
                height: 55,
                borderRadius: 16,
                background: props.primary,
                margin: '0 auto 50px',
              }}
            />
            <div
              style={{
                ...style,
                fontSize: Math.min(
                  props.size * 0.36,
                  1400 / (index ? props.subtitle.length : props.text.length),
                ),
              }}
            >
              {index ? props.subtitle : props.text}
            </div>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  height: 20,
                  marginTop: 20,
                  borderRadius: 8,
                  background: props.primary,
                  opacity: 0.15 + row * 0.15,
                  width: `${90 - row * 15}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  return null;
};
