import type { CSSProperties } from 'react';
import type { WebMotionProps } from '@/schemas/clips/imported/common';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const TextEffects = ({
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
  const progress = clamp(frame / 35);
  const words = props.text.split(' ');
  const gradient = `linear-gradient(110deg,${props.textColor},${props.primary},${props.textColor})`;
  if (variant === 0 || variant === 6) {
    return (
      <div
        style={{
          ...style,
          backgroundImage: gradient,
          backgroundSize: '240% 100%',
          backgroundPosition: `${-frame * 2}% 0`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {props.text}
      </div>
    );
  }
  if (variant === 1) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.28em',
        }}
      >
        {words.map((word, index) => {
          const p = clamp((frame - index * 5) / 18);
          return (
            <span
              key={`${word}-${index}`}
              style={{
                opacity: p,
                filter: `blur(${(1 - p) * 12}px)`,
                transform: `translateY(${(1 - p) * 50}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }
  if (variant === 2) {
    return (
      <div style={style}>
        {[...props.text].map((char, index) => {
          const p = clamp((frame - index * 1.1) / 20);
          return (
            <span
              key={`${index}-${char}`}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: p,
                transform: `translateY(${(1 - p) * 100}px) rotate(${(1 - p) * 15}deg)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }
  if (variant === 3) {
    // biome-ignore lint/security/noSecrets: public glyph alphabet for deterministic scrambling
    const alphabet = 'XABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return (
      <div style={style}>
        {[...props.text]
          .map((char, index) =>
            char === ' '
              ? ' '
              : frame > index * 1.2 + 12
                ? char
                : alphabet[(index * 17 + Math.floor(frame / 2) * 7) % alphabet.length],
          )
          .join('')}
      </div>
    );
  }
  if (variant === 4) {
    return (
      <div
        style={{
          ...style,
          opacity: progress,
          transform: `translateY(${(1 - progress) * 70}px) scaleY(${0.15 + progress * 0.85})`,
        }}
      >
        {props.text}
      </div>
    );
  }
  if (variant === 5) {
    return (
      <div style={style}>
        {props.text.slice(
          0,
          Math.max(0, Math.floor(frame / Math.max(0.7, Math.min(1.7, 70 / props.text.length)))),
        )}
        <span style={{ color: props.primary, opacity: Math.floor(frame / 12) % 2 ? 0.2 : 1 }}>
          │
        </span>
      </div>
    );
  }
  if (variant === 7) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            ...style,
            color: props.primary,
            fontSize: '2.1em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(props.value * (1 - (1 - clamp(frame / 55)) ** 3)).toLocaleString('en-US')}
        </div>
        <div style={{ ...style, fontSize: '0.5em', marginTop: 30 }}>{props.text}</div>
      </div>
    );
  }
  if (variant === 8) {
    const digits = String(props.value).split('');
    return (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '1.3em',
            overflow: 'hidden',
            fontSize: '2em',
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          {digits.map((digit, index) => {
            const p = clamp((frame - index * 5) / 45);
            return (
              <div
                key={`${index}-${digit}`}
                style={{
                  width: '0.7em',
                  transform: `translateY(${-Number(digit) * 1.3 * p}em)`,
                  color: props.primary,
                }}
              >
                {Array.from({ length: 10 }, (_, number) => (
                  <div key={number}>{number}</div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ ...style, fontSize: '0.5em', marginTop: 30 }}>{props.text}</div>
      </div>
    );
  }
  if (variant === 11) {
    return (
      <div style={{ width: '120%', overflow: 'hidden', transform: 'rotate(-6deg)' }}>
        {[0, 1].map((row) => (
          <div
            key={row}
            style={{
              ...style,
              display: 'flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              color: row ? props.primary : props.textColor,
              transform: `translateX(${-((frame * (row ? 2.7 : 3.2)) % 800)}px)`,
            }}
          >
            {[0, 1, 2, 3].map((copy) => (
              <span style={{ padding: '0 32px' }} key={copy}>
                {props.text} ◈
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (variant === 18) {
    return (
      <div style={{ ...style, position: 'relative', padding: '0.3em 0.5em', overflow: 'hidden' }}>
        <span style={{ opacity: frame > 18 ? 1 : 0 }}>{props.text}</span>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: props.primary,
            transform: `translateX(${frame < 18 ? -100 + (frame / 18) * 100 : ((frame - 18) / 22) * 105}%)`,
          }}
        />
      </div>
    );
  }
  return (
    <div style={{ ...style, opacity: progress, transform: `translateY(${(1 - progress) * 30}px)` }}>
      {props.text}
    </div>
  );
};
