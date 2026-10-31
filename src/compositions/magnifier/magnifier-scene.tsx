import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { MagnifierCaptionProps } from '@/schemas';
import { bodyFont, didoneFont } from '../promo/fonts';
import { BrandLine } from './brand-line';
import { type BubbleGlow, BubbleLayer } from './bubble-layer';
import { fieldState, glowFor } from './choreography';
import { type Bubble, buildField, captionWords } from './field';
import { MagnifierGlass } from './magnifier-glass';
import { TypedCaption } from './typed-caption';

const fieldMask = (field: MagnifierCaptionProps['field']): string => {
  const top = field.fadeTop;
  const bottom = field.fadeBottom;
  const length = field.fadeLength;
  return `linear-gradient(to bottom, transparent ${top}px, black ${top + length}px, black ${bottom - length}px, transparent ${bottom}px)`;
};

export const MagnifierScene = (props: MagnifierCaptionProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { field, lens, glow } = props;
  const bubbles = useMemo(
    () => buildField(field, props.caption.text, lens),
    [field, props.caption.text, lens],
  );
  const count = captionWords(props.caption.text).length;
  const state = fieldState(frame, props, count);
  const accentWord = glow.accentWord.trim().toLowerCase();
  const glowOf = (bubble: Bubble): BubbleGlow | null => {
    if (bubble.target < 0) {
      return null;
    }
    const accent = accentWord.length > 0 && bubble.word.toLowerCase() === accentWord;
    return {
      amount: Math.min(1, glowFor(bubble, frame, state, props, count) * glow.strength),
      color: accent ? glow.accent : glow.color,
      text: accent ? glow.accentText : glow.color,
      halo: glow.halo,
      weight: glow.weight,
    };
  };
  const mask = fieldMask(field);
  return (
    <AbsoluteFill>
      {props.look.showBackdrop ? (
        <AbsoluteFill
          style={{
            backgroundColor: props.look.background,
            backgroundImage: `radial-gradient(ellipse 70% 46% at 50% 52%, ${props.look.spotlight}, ${props.look.background})`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          filter: field.blur > 0 ? `blur(${field.blur}px)` : undefined,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <BubbleLayer
          bubbles={bubbles}
          offset={state.offset}
          idPrefix="outer"
          style={{
            shape: field.shape,
            ring: field.ring,
            word: field.word,
            lineWidth: field.lineWidth,
            wordSize: field.wordSize,
            wordWeight: field.wordWeight,
            font: bodyFont,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `circle(${lens.radius}px at ${state.lens.x}px ${state.lens.y}px)`,
        }}
      >
        <AbsoluteFill style={{ backgroundColor: lens.inside }} />
        <BubbleLayer
          bubbles={bubbles}
          offset={state.offset}
          scale={lens.magnify}
          center={state.lens}
          glowOf={glowOf}
          idPrefix="lens"
          style={{
            shape: field.shape,
            ring: lens.ring,
            word: lens.word,
            lineWidth: lens.lineWidth,
            wordSize: field.wordSize,
            wordWeight: field.wordWeight,
            font: bodyFont,
          }}
        />
      </AbsoluteFill>
      <MagnifierGlass pose={state.lens} lens={lens} />
      <TypedCaption
        frame={frame}
        props={props}
        font={props.caption.font === 'serif' ? didoneFont : bodyFont}
      />
      {props.brand.show ? <BrandLine brand={props.brand} font={bodyFont} /> : null}
    </AbsoluteFill>
  );
};
