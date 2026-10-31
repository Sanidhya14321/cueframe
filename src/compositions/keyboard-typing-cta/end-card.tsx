import { AbsoluteFill } from 'remotion';
import type { KeyboardTypingCtaProps } from '@/schemas';
import { pickerFonts } from '../promo/fonts';
import { pixelTween, settle, tween } from '../promo/timing';
import { BrandLockup, LeafShape } from './logo-mark';
import { blinkOpacity } from './schedule';

type Props = KeyboardTypingCtaProps;

const FONT = pickerFonts.sora;

const CHAR_FADE = 14;

const LINE_HEIGHT = 1.32;

const linear = (t: number) => t;

const charStart = (props: Props, lineIndex: number, offset: number): number =>
  props.timing.headlineStart +
  offset * props.timing.headlineFramesPerChar +
  lineIndex * props.timing.headlineLinePause;

const Caret = ({ color, size, opacity }: { color: string; size: number; opacity: number }) => (
  <span style={{ position: 'relative', display: 'inline-block', width: 0, height: '1em' }}>
    <span
      style={{
        position: 'absolute',
        left: size * 0.04,
        top: '-0.02em',
        width: Math.max(4, size * 0.07),
        height: '1.08em',
        borderRadius: size * 0.03,
        background: color,
        opacity,
      }}
    />
  </span>
);

const inkAt = (ink: string, frame: number, appear: number): string =>
  `color-mix(in srgb, ${ink} ${(tween(frame, [appear, appear + CHAR_FADE], [0, 1], linear) * 100).toFixed(1)}%, transparent)`;

const TypedHeadline = ({ props, frame }: { props: Props; frame: number }) => {
  const { copy, endCard } = props;
  const lines = copy.headline.split('\n');
  const starts = lines.map((_, index) =>
    lines.slice(0, index).reduce((sum, line) => sum + line.length, 0),
  );
  const finished =
    charStart(props, lines.length - 1, (starts.at(-1) ?? 0) + (lines.at(-1) ?? '').length - 1) +
    CHAR_FADE;
  const blink =
    blinkOpacity(frame - finished, 14, 56) * tween(frame, [finished, finished + 8], [0, 1], linear);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: endCard.headlineY - endCard.headlineSize * LINE_HEIGHT * (lines.length / 2),
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: endCard.headlineSize,
        lineHeight: LINE_HEIGHT,
        letterSpacing: '-0.02em',
        color: endCard.ink,
      }}
    >
      {lines.map((line, lineIndex) => {
        const lastLine = lineIndex === lines.length - 1;
        return (
          <div key={`${lineIndex}-${line}`} style={{ whiteSpace: 'pre', minHeight: '1.32em' }}>
            {[...line].map((char, index) => {
              const appear = charStart(props, lineIndex, (starts[lineIndex] ?? 0) + index);
              return (
                <span key={`${index}-${char}`}>
                  <span style={{ color: inkAt(endCard.ink, frame, appear) }}>{char}</span>
                  {lastLine && index === line.length - 1 ? (
                    <Caret color={endCard.accent} size={endCard.headlineSize} opacity={blink} />
                  ) : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const ArrowGlyph = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
    <title>arrow</title>
    <path
      d="M10 24h26M26 13l11 11-11 11"
      fill="none"
      stroke={color}
      strokeWidth={5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RisingLabel = ({ props, frame }: { props: Props; frame: number }) => {
  const { copy, endCard, timing } = props;
  const glyphs = endCard.buttonArrow ? [...copy.button, 'arrow'] : [...copy.button];
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: endCard.buttonTextSize,
        color: endCard.buttonInk,
        whiteSpace: 'pre',
        lineHeight: 1,
        letterSpacing: '0.02em',
      }}
    >
      {glyphs.map((glyph, index) => {
        const start = timing.buttonStart + index * timing.buttonStagger;
        const range: [number, number] = [start, start + timing.buttonFlyFrames];
        const rise = pixelTween(frame, range, [endCard.buttonHeight * 0.55, 0], settle);
        const isArrow = endCard.buttonArrow && index === glyphs.length - 1;
        return (
          <span
            key={`${index}-${glyph}`}
            style={{
              display: 'inline-block',
              marginLeft: isArrow ? endCard.buttonTextSize * 0.35 : 0,
              opacity: tween(frame, [start, start + timing.buttonFlyFrames * 0.45], [0, 1], linear),
              transform: `translateY(${rise}px)`,
            }}
          >
            {isArrow ? (
              <ArrowGlyph size={endCard.buttonTextSize * 0.9} color={endCard.buttonInk} />
            ) : (
              glyph
            )}
          </span>
        );
      })}
    </div>
  );
};

const LEAVES = [
  { x: 120, y: 1640, size: 560, turn: -20, dx: 0.9, dy: -0.5 },
  { x: 900, y: 240, size: 440, turn: 150, dx: -0.7, dy: 0.6 },
  { x: 1000, y: 1480, size: 340, turn: 60, dx: -0.5, dy: -0.8 },
  { x: 60, y: 520, size: 260, turn: 220, dx: 0.6, dy: 0.4 },
];

const Pattern = ({ props, frame }: { props: Props; frame: number }) => {
  const { endCard } = props;
  const elapsed = frame - props.timing.cut;
  const drift = endCard.patternDrift;
  return (
    <AbsoluteFill style={{ opacity: endCard.patternOpacity }}>
      {LEAVES.map((leaf) => (
        <div
          key={leaf.turn}
          style={{
            position: 'absolute',
            left: leaf.x - leaf.size / 2,
            top: leaf.y - leaf.size / 2,
            transform: `translate(${(elapsed * drift * leaf.dx).toFixed(2)}px, ${(elapsed * drift * leaf.dy).toFixed(2)}px) rotate(${(elapsed * drift * 0.12 + leaf.turn).toFixed(2)}deg)`,
          }}
        >
          <LeafShape size={leaf.size} color={endCard.pattern} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const EndCard = ({ props, frame }: { props: Props; frame: number }) => {
  const { copy, endCard, timing, look } = props;
  const opened = timing.cut + timing.irisFrames * 0.45;
  const logoRange: [number, number] = [opened, opened + 30];
  const buttonRange: [number, number] = [timing.buttonStart - 18, timing.buttonStart + 12];
  const fade = tween(
    frame,
    [timing.fadeOut, timing.fadeOut + timing.fadeOutFrames],
    [1, 0],
    linear,
  );
  return (
    <AbsoluteFill style={{ background: look.showBackdrop ? endCard.fadeFrom : undefined }}>
      <AbsoluteFill style={{ opacity: fade }}>
        {look.showBackdrop ? (
          <AbsoluteFill style={{ background: endCard.background }}>
            <Pattern props={props} frame={frame} />
          </AbsoluteFill>
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: endCard.logoY - endCard.logoSize / 2,
            display: 'flex',
            justifyContent: 'center',
            opacity: tween(frame, logoRange, [0, 1], linear),
            transform: `translateY(${pixelTween(frame, logoRange, [36, 0], settle)}px)`,
          }}
        >
          <BrandLockup
            size={endCard.logoSize}
            word={copy.brand}
            mark={endCard.mark}
            leaf={endCard.markLeaf}
            ink={endCard.ink}
            hole={endCard.mark}
            font={FONT}
          />
        </div>
        <TypedHeadline props={props} frame={frame} />
        <div
          style={{
            position: 'absolute',
            left: 540 - endCard.buttonWidth / 2,
            top: endCard.buttonY - endCard.buttonHeight / 2,
            width: endCard.buttonWidth,
            height: endCard.buttonHeight,
            borderRadius: endCard.buttonHeight / 2,
            background: endCard.button,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            opacity: tween(frame, buttonRange, [0, 1], linear),
            transform: `translateY(${pixelTween(frame, buttonRange, [48, 0], settle)}px)`,
          }}
        >
          <RisingLabel props={props} frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
