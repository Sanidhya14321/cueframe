import { AbsoluteFill } from 'remotion';
import type { KeyboardTypingCtaProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';

type WallLook = KeyboardTypingCtaProps['wall'];

export const WallBackdrop = ({ wall }: { wall: WallLook }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 70% at 80% 0%, color-mix(in oklab, ${wall.color} 88%, white) 0%, ${wall.color} 45%, ${wall.edge} 100%)`,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 985,
        top: 240,
        width: 220,
        height: 890,
        borderRadius: 30,
        background: wall.shadow,
        opacity: wall.shadowOpacity,
        filter: 'blur(36px)',
      }}
    />
  </AbsoluteFill>
);

interface Blade {
  base: [number, number];
  bend: [number, number];
  tip: [number, number];
  width: number;
  tone: number;
}

const BLADES: Blade[] = [
  { base: [-40, 1980], bend: [60, 1560], tip: [300, 1240], width: 44, tone: 0.1 },
  { base: [-30, 1960], bend: [180, 1640], tip: [430, 1300], width: 48, tone: 0 },
  { base: [-60, 1900], bend: [120, 1820], tip: [520, 1700], width: 46, tone: 0.2 },
  { base: [-20, 2000], bend: [260, 1900], tip: [610, 1990], width: 50, tone: -0.1 },
  { base: [-80, 1700], bend: [40, 1380], tip: [180, 1180], width: 38, tone: 0.3 },
  { base: [-90, 1820], bend: [200, 1720], tip: [380, 1560], width: 40, tone: -0.15 },
  { base: [-60, 1990], bend: [80, 1700], tip: [250, 1430], width: 42, tone: 0.05 },
];

const SAMPLES = 24;

const curvePoint = (blade: Blade, t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * blade.base[0] + 2 * u * t * blade.bend[0] + t * t * blade.tip[0],
    u * u * blade.base[1] + 2 * u * t * blade.bend[1] + t * t * blade.tip[1],
  ];
};

const bladePath = (blade: Blade, share: number): string => {
  const left: string[] = [];
  const right: string[] = [];
  for (let index = 0; index <= SAMPLES; index++) {
    const t = index / SAMPLES;
    const [x, y] = curvePoint(blade, t);
    const [nx, ny] = curvePoint(blade, Math.min(1, t + 0.01));
    const [px, py] = curvePoint(blade, Math.max(0, t - 0.01));
    const dx = nx - px;
    const dy = ny - py;
    const length = Math.hypot(dx, dy) || 1;
    const half = ((blade.width * share) / 2) * (1 - t) ** 0.55 * Math.min(1, t * 6 + 0.4);
    left.push(`${(x - (dy / length) * half).toFixed(1)},${(y + (dx / length) * half).toFixed(1)}`);
    right.unshift(
      `${(x + (dy / length) * half).toFixed(1)},${(y - (dx / length) * half).toFixed(1)}`,
    );
  }
  return `M${left.join(' L')} L${right.join(' L')} Z`;
};

export const Plant = ({ wall, sway }: { wall: WallLook; sway: number }) => (
  <svg
    width={1080}
    height={1920}
    viewBox="0 0 1080 1920"
    style={{ position: 'absolute', inset: 0, filter: `blur(${wall.plantBlur}px)` }}
  >
    <title>plant</title>
    <defs>
      <linearGradient id="kbtc-pot" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={wall.pot} />
        <stop offset="0.7" stopColor={wall.pot} />
        <stop offset="1" stopColor={`color-mix(in oklab, ${wall.pot} 80%, black)`} />
      </linearGradient>
    </defs>
    <ellipse cx={0} cy={1720} rx={190} ry={340} fill="url(#kbtc-pot)" />
    {BLADES.map((blade, index) => {
      const swing = Math.sin(sway / 40 + index * 1.7) * 6;
      const moved: Blade = {
        ...blade,
        tip: [blade.tip[0] + swing, blade.tip[1] - swing * 0.5],
      };
      const shade = blade.tone >= 0 ? 'white' : 'black';
      const amount = Math.round(Math.abs(blade.tone) * 100);
      return (
        <g key={`${blade.base[0]}-${blade.tip[0]}`}>
          <path
            d={bladePath(moved, 1)}
            fill={`color-mix(in oklab, ${wall.leaf} ${100 - amount}%, ${shade})`}
          />
          <path d={bladePath(moved, 0.28)} fill={wall.leafStripe} opacity={0.45} />
        </g>
      );
    })}
  </svg>
);

export const Watermark = ({
  wall,
  text,
  opacity,
}: {
  wall: WallLook;
  text: string;
  opacity: number;
}) =>
  text === '' ? null : (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: wall.watermarkY - wall.watermarkSize * 0.6,
        textAlign: 'center',
        fontFamily: bodyFont,
        fontWeight: 600,
        letterSpacing: '0.01em',
        fontSize: wall.watermarkSize,
        color: wall.watermarkColor,
        opacity,
        textShadow: '0 2px 10px rgba(0,0,0,0.18)',
      }}
    >
      {text}
    </div>
  );

const SendIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
    <title>send</title>
    <path
      d="M24 36V13M14 22l10-10 10 10"
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface PillLook {
  pill: string;
  pillOpacity: number;
  fieldColor: string;
  fieldSize: number;
  fieldY: number;
  hint: string;
  accent: string;
  iconInk: string;
}

export const MessagePill = ({
  look,
  text,
  caret,
  placeholder,
  placeholderText,
  fade,
  sent,
  pulse,
}: {
  look: PillLook;
  text: string;
  caret: number;
  placeholder: number;
  placeholderText: string;
  fade: number[];
  sent: number;
  pulse: number;
}) => {
  const size = look.fieldSize;
  const height = Math.round(size * 2.3);
  const button = Math.round(height * 0.72);
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        right: 48,
        top: look.fieldY - height / 2,
        height,
        borderRadius: height / 2,
        background: `color-mix(in srgb, ${look.pill} ${Math.round(look.pillOpacity * 100)}%, transparent)`,
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.5), 0 14px 40px color-mix(in srgb, ${look.fieldColor} 10%, transparent)`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: size,
        paddingRight: (height - button) / 2,
        gap: size * 0.5,
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            fontFamily: bodyFont,
            fontWeight: 500,
            fontSize: size,
            color: look.fieldColor,
            whiteSpace: 'pre',
            opacity: 1 - sent,
            transform: `translateY(${Math.round(-sent * size * 0.9)}px)`,
          }}
        >
          {placeholder > 0 && placeholderText !== '' ? (
            <span style={{ position: 'absolute', color: look.hint, opacity: placeholder }}>
              {placeholderText}
            </span>
          ) : null}
          {[...text].map((char, index) => (
            <span
              key={`${index}-${char}`}
              style={{
                color: `color-mix(in srgb, ${look.fieldColor} ${((fade[index] ?? 1) * 100).toFixed(1)}%, transparent)`,
              }}
            >
              {char}
            </span>
          ))}
          <span
            style={{
              display: 'inline-block',
              width: Math.max(3, size * 0.08),
              height: size * 1.15,
              marginLeft: size * 0.08,
              borderRadius: size * 0.04,
              background: look.accent,
              opacity: caret,
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: button,
          height: button,
          flexShrink: 0,
          borderRadius: button / 2,
          background: look.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${(1 + pulse * 0.14).toFixed(3)})`,
        }}
      >
        <SendIcon size={button * 0.6} color={look.iconInk} />
      </div>
    </div>
  );
};
