import type { CSSProperties } from 'react';
import type { MailinfraInboxWebProps } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { glowShadow } from '../promo/glow';
import { smooth, tween } from '../promo/timing';
import { FadeIn } from '../promo/typography';
import { blend, fade } from './color';
import type { Phases } from './timeline';

export const pendulumAt = (
  frame: number,
  phases: Phases,
  props: MailinfraInboxWebProps,
): { angle: number; opacity: number } => {
  const landed = phases.zoom[1];
  const t = Math.max(0, frame - (landed - 6));
  const decay = Math.max(0, 1 - t / props.wordmark.swingSettle);
  return {
    angle:
      props.wordmark.swing * Math.cos((t / props.wordmark.swingPeriod) * Math.PI * 2) * decay ** 3,
    opacity: tween(frame, [landed - 8, landed + 6], [0, 1], smooth),
  };
};

const SHINE_EVERY = 56;

const shineAt = (frame: number, landed: number): number => {
  const since = frame - landed - 18;
  return since < 0 ? -30 : -24 + ((since % SHINE_EVERY) / SHINE_EVERY) * 148;
};

const clippedFill = (image: string): CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  color: 'transparent',
  backgroundImage: image,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
});

const ExtrudedWord = ({ props, shine }: { props: MailinfraInboxWebProps; shine: number }) => {
  const { wordmark } = props;
  const depth = Math.round(wordmark.depth);
  const text: CSSProperties = {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: wordmark.size,
    letterSpacing: '-0.035em',
    lineHeight: 1.05,
    whiteSpace: 'nowrap',
  };
  const layers = Array.from({ length: depth }, (_, index) => depth - index);
  return (
    <div style={{ position: 'relative' }}>
      {layers.map((step) => (
        <div
          key={step}
          style={{
            ...text,
            position: 'absolute',
            left: step * 0.3,
            top: step,
            color: blend(
              wordmark.side,
              props.look.backgroundEdge,
              (step / Math.max(1, depth)) * 0.45,
            ),
            textShadow:
              step === depth
                ? `0 ${(depth * 0.9).toFixed(1)}px ${(wordmark.size * 0.14).toFixed(1)}px ${fade(props.look.backgroundEdge, 0.8)}`
                : undefined,
          }}
        >
          {wordmark.text}
        </div>
      ))}
      <div style={{ ...text, position: 'absolute', left: 0, top: -1.5, color: wordmark.faceTop }}>
        {wordmark.text}
      </div>
      <div style={{ ...text, position: 'relative', color: wordmark.face }}>{wordmark.text}</div>
      <div
        style={{
          ...text,
          ...clippedFill(
            `linear-gradient(180deg, ${wordmark.faceTop} 4%, ${wordmark.face} 46%, ${blend(wordmark.face, wordmark.side, 0.45)} 100%)`,
          ),
        }}
      >
        {wordmark.text}
      </div>
      {wordmark.shine > 0 && shine > -30 && shine < 130 ? (
        <div
          style={{
            ...text,
            ...clippedFill(
              `linear-gradient(105deg, ${fade(wordmark.faceTop, 0)} ${(shine - 14).toFixed(2)}%, ${fade(wordmark.faceTop, wordmark.shine)} ${shine.toFixed(2)}%, ${fade(wordmark.faceTop, 0)} ${(shine + 14).toFixed(2)}%)`,
            ),
          }}
        >
          {wordmark.text}
        </div>
      ) : null}
    </div>
  );
};

export const EndCard = ({
  frame,
  width,
  phases,
  props,
}: {
  frame: number;
  width: number;
  phases: Phases;
  props: MailinfraInboxWebProps;
}) => {
  const { wordmark } = props;
  const landed = phases.zoom[1];
  const { angle, opacity } = pendulumAt(frame, phases, props);
  if (opacity <= 0) {
    return null;
  }
  const below = wordmark.hubY + wordmark.threadLength + wordmark.size * 1.2 + wordmark.taglineGap;
  return (
    <>
      {wordmark.text.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: width / 2,
            top: wordmark.hubY,
            width: 0,
            height: 0,
            transform: `rotate(${angle.toFixed(4)}deg)`,
            transformOrigin: '0 0',
            opacity,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: wordmark.threadLength - wordmark.size * 0.08,
              left: 0,
              transform: 'translateX(-50%)',
              filter: `blur(${((1 - opacity) * 6).toFixed(2)}px)`,
            }}
          >
            <ExtrudedWord props={props} shine={shineAt(frame, landed)} />
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: below,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: wordmark.urlGap,
        }}
      >
        {wordmark.tagline.length > 0 ? (
          <FadeIn start={(landed + 16) / props.motion.speed}>
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 500,
                fontSize: wordmark.taglineSize,
                letterSpacing: '-0.01em',
                color: props.look.ink,
              }}
            >
              {wordmark.tagline}
            </div>
          </FadeIn>
        ) : null}
        {wordmark.url.length > 0 ? (
          <FadeIn start={(landed + 26) / props.motion.speed}>
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 600,
                fontSize: wordmark.urlSize,
                letterSpacing: '0.06em',
                color: props.look.ink,
                padding: `${wordmark.urlSize * 0.5}px ${wordmark.urlSize * 1.1}px`,
                borderRadius: wordmark.urlSize * 2,
                background: props.pillColor,
                border: `2px solid ${props.inboxes.nodeColor}`,
                boxShadow: glowShadow(
                  props.inboxes.nodeColor,
                  props.inboxes.glow * 0.5,
                  wordmark.urlSize * 3,
                ),
              }}
            >
              {wordmark.url}
            </div>
          </FadeIn>
        ) : null}
      </div>
    </>
  );
};
