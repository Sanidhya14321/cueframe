import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type BrandRevealProps,
  brandRevealDefaults,
  brandRevealMeta,
  brandRevealSchema,
} from '@/schemas';
import { BrandMark } from '../../promo/brand-mark';
import { bodyFont, displayFont } from '../../promo/fonts';
import { PromoLayer } from '../../promo/promo-layer';
import { pixelTween, settle, tween } from '../../promo/timing';
import { FadeIn } from '../../promo/typography';
import type { SceneModule } from '../../scene-module';

export const BrandReveal = ({
  eyebrow,
  brandName,
  tagline,
  showMark,
  markColor,
  wordmarkSize,
  wordmarkWeight,
  wordmarkTracking,
  markScale,
  markGap,
  markStart,
  eyebrowSize,
  taglineSize,
  eyebrowGap,
  taglineGap,
  wordmarkStart,
  letterStagger,
  letterRise,
  taglineStart,
  look,
  motion,
}: BrandRevealProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const letters = brandName.split('');
  return (
    <PromoLayer look={look} motion={motion}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <FadeIn start={0} delay={2} style={{ marginBottom: eyebrowGap }}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: eyebrowSize,
              fontWeight: 500,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: look.muted,
            }}
          >
            {eyebrow}
          </div>
        </FadeIn>
        <div style={{ display: 'flex', alignItems: 'center', gap: wordmarkSize * markGap }}>
          {showMark ? (
            <BrandMark
              color={markColor}
              frame={frame}
              size={wordmarkSize * markScale}
              start={markStart}
            />
          ) : null}
          <div
            style={{
              display: 'flex',
              fontFamily: displayFont,
              fontWeight: wordmarkWeight,
              fontSize: wordmarkSize,
              letterSpacing: `${wordmarkTracking}em`,
              lineHeight: 1,
              color: look.ink,
            }}
          >
            {letters.map((letter, index) => {
              const revealStart = wordmarkStart + index * letterStagger;
              const revealWindow: [number, number] = [revealStart, revealStart + letterRise];
              const reveal = tween(frame, revealWindow, [0, 1], settle);
              return (
                <span
                  key={`${index}:${letter}`}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    opacity: reveal,
                    transform: `translateY(${pixelTween(frame, revealWindow, [0.35 * wordmarkSize, 0], settle)}px)`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
        <FadeIn start={taglineStart / motion.speed} style={{ marginTop: taglineGap }}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: taglineSize,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: look.muted,
            }}
          >
            {tagline}
          </div>
        </FadeIn>
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const brandRevealScene: SceneModule = {
  id: 'brand-reveal',
  component: BrandReveal,
  render: (key) => (
    <Composition
      key={key}
      id="brand-reveal"
      component={BrandReveal}
      schema={brandRevealSchema}
      defaultProps={brandRevealDefaults}
      durationInFrames={brandRevealMeta.durationInFrames}
      fps={brandRevealMeta.fps}
      width={brandRevealMeta.width}
      height={brandRevealMeta.height}
    />
  ),
};
