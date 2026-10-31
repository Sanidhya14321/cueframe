import type { CSSProperties } from 'react';
import { Composition, useCurrentFrame } from 'remotion';
import {
  type CtaEndCardProps,
  ctaEndCardDefaults,
  ctaEndCardMeta,
  ctaEndCardSchema,
} from '@/schemas';
import { BrandMark } from '../../promo/brand-mark';
import { bodyFont, displayFont, roundedFont } from '../../promo/fonts';
import { PromoLayer, placementFrame } from '../../promo/promo-layer';
import { glyphUrl } from '../../promo/screen-assets';
import { AppIconMark, StoreButton } from '../../promo/store-badges';
import { BodyCopy, FadeIn, Headline } from '../../promo/typography';
import type { SceneModule } from '../../scene-module';

const COLUMN_ALIGN: Record<CtaEndCardProps['textAlign'], CSSProperties['alignItems']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const CtaEndCard = ({
  brandName,
  showMark,
  markColor,
  markColorEnd,
  markInk,
  mark,
  font,
  headlineWeight,
  badges,
  badgeScale,
  gap,
  markAt,
  headlineAt,
  badgesAt,
  markGlyph,
  markSize,
  headlineSize,
  brandSize,
  sublineSize,
  sublineWidth,
  urlSize,
  showSecondaryButton,
  textAlign,
  placement,
  headline,
  highlight,
  subline,
  primaryCaption,
  primaryLabel,
  secondaryCaption,
  secondaryLabel,
  url,
  look,
  motion,
}: CtaEndCardProps) => {
  const ringFrame = markAt + (useCurrentFrame() - markAt) * motion.speed;
  return (
    <PromoLayer look={look} motion={motion}>
      <div style={placementFrame(placement)}>
        <div
          style={{
            width: placement.width,
            display: 'flex',
            flexDirection: 'column',
            alignItems: COLUMN_ALIGN[textAlign],
            gap,
          }}
        >
          {showMark || brandName.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {showMark && mark === 'ring' ? (
                <BrandMark color={markColor} frame={ringFrame} size={markSize} start={markAt} />
              ) : null}
              {showMark && mark === 'app-icon' ? (
                <FadeIn start={markAt}>
                  <AppIconMark
                    color={markColor}
                    colorEnd={markColorEnd}
                    ink={markInk}
                    glyph={glyphUrl(markGlyph)}
                    size={markSize}
                  />
                </FadeIn>
              ) : null}
              {brandName.length > 0 ? (
                <FadeIn start={markAt + 6}>
                  <span
                    style={{
                      fontFamily: displayFont,
                      fontSize: brandSize,
                      fontWeight: 600,
                      letterSpacing: '-0.05em',
                      color: look.ink,
                    }}
                  >
                    {brandName}
                  </span>
                </FadeIn>
              ) : null}
            </div>
          ) : null}
          <Headline
            text={headline}
            highlight={highlight}
            size={headlineSize}
            color={look.ink}
            accent={look.accent}
            align={textAlign}
            weight={headlineWeight}
            family={font === 'rounded' ? roundedFont : displayFont}
            tracking={font === 'rounded' ? -0.01 : -0.045}
            start={headlineAt}
          />
          {subline.length > 0 ? (
            <FadeIn start={headlineAt + 16}>
              <BodyCopy
                text={subline}
                color={look.muted}
                width={sublineWidth}
                align={textAlign}
                size={sublineSize}
              />
            </FadeIn>
          ) : null}
          <FadeIn start={badgesAt} style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            <StoreButton
              caption={primaryCaption}
              label={primaryLabel}
              filled
              ink={look.ink}
              paper={look.background}
              variant={badges}
              scale={badgeScale}
            />
            {showSecondaryButton ? (
              <StoreButton
                caption={secondaryCaption}
                label={secondaryLabel}
                filled={false}
                ink={look.ink}
                paper={look.background}
                variant={badges}
                scale={badgeScale}
              />
            ) : null}
          </FadeIn>
          {url.length > 0 ? (
            <FadeIn start={badgesAt + 12}>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: urlSize,
                  fontWeight: 500,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: look.muted,
                }}
              >
                {url}
              </div>
            </FadeIn>
          ) : null}
        </div>
      </div>
    </PromoLayer>
  );
};

export const ctaEndCardScene: SceneModule = {
  id: 'cta-end-card',
  component: CtaEndCard,
  render: (key) => (
    <Composition
      key={key}
      id="cta-end-card"
      component={CtaEndCard}
      schema={ctaEndCardSchema}
      defaultProps={ctaEndCardDefaults}
      durationInFrames={ctaEndCardMeta.durationInFrames}
      fps={ctaEndCardMeta.fps}
      width={ctaEndCardMeta.width}
      height={ctaEndCardMeta.height}
    />
  ),
};
