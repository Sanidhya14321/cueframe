import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type BrandingIsTickerProps,
  brandingIsTickerDefaults,
  brandingIsTickerMeta,
  brandingIsTickerSchema,
} from '@/schemas';
import { BrandLabel, BrandMark } from '../../branding-ticker/brand-mark';
import { ContactCard } from '../../branding-ticker/contact-card';
import { tickerFont } from '../../branding-ticker/fonts';
import { tickerWords, WordTicker } from '../../branding-ticker/word-ticker';
import { PromoLayer } from '../../promo/promo-layer';
import { settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const OVERSCAN = 1.04;

const tileOpening = (
  progress: number,
  brand: BrandingIsTickerProps['brand'],
  width: number,
  height: number,
): string => {
  const half = brand.size / 2;
  const closed = 1 - progress * OVERSCAN;
  const top = (brand.y - half) * closed;
  const left = (brand.x - half) * closed;
  const right = (width - brand.x - half) * closed;
  const bottom = (height - brand.y - half) * closed;
  const round = Math.max(0, brand.size * brand.roundness * closed);
  return `inset(${top.toFixed(2)}px ${right.toFixed(2)}px ${bottom.toFixed(2)}px ${left.toFixed(2)}px round ${round.toFixed(2)}px)`;
};

const BrandingIsTicker = ({
  copy,
  type,
  underline,
  ticker,
  brand,
  card,
  look,
  motion,
}: BrandingIsTickerProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const cardStart = tickerWords(copy.words).length * ticker.stepFrames + card.delay;
  const cardFrame = frame - cardStart;
  const showCard = card.show && cardFrame >= 0;
  const opened = cardFrame >= card.openFrames;
  const opening = tween(cardFrame, [0, Math.max(1, card.openFrames)], [0, 1], smooth);
  const drawFrames = Math.max(1, brand.drawFrames);
  const markDraw = Math.min(
    tween(frame, [0, drawFrames], [0, 1], settle),
    card.show ? tween(frame, [cardStart - drawFrames, cardStart], [1, 0], smooth) : 1,
  );
  return (
    <PromoLayer look={look} motion={motion}>
      {showCard && opened ? null : (
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: brand.x - brand.size / 2,
              top: brand.y - brand.size / 2,
              width: brand.size,
            }}
          >
            <BrandMark
              size={brand.size}
              roundness={brand.roundness}
              disc={brand.mark}
              wave={brand.cutout}
              draw={markDraw}
            />
            <div style={{ marginTop: brand.size * 0.16 }}>
              <BrandLabel
                kicker={brand.kicker}
                name={brand.name}
                size={brand.labelSize}
                color={brand.label}
                font={tickerFont}
              />
            </div>
          </div>
          <WordTicker
            lead={copy.lead}
            words={copy.words}
            separator={copy.separator}
            type={type}
            underline={underline}
            timing={ticker}
            frame={frame}
          />
        </AbsoluteFill>
      )}
      {showCard ? (
        <AbsoluteFill
          style={opened ? undefined : { clipPath: tileOpening(opening, brand, width, height) }}
        >
          <ContactCard
            card={card}
            kicker={brand.kicker}
            name={brand.name}
            roundness={brand.roundness}
            frame={cardFrame}
          />
        </AbsoluteFill>
      ) : null}
    </PromoLayer>
  );
};

export const brandingIsTickerScene: SceneModule = {
  id: 'branding-is-ticker',
  component: BrandingIsTicker,
  render: (key) => (
    <Composition
      key={key}
      id="branding-is-ticker"
      component={BrandingIsTicker}
      schema={brandingIsTickerSchema}
      defaultProps={brandingIsTickerDefaults}
      durationInFrames={brandingIsTickerMeta.durationInFrames}
      fps={brandingIsTickerMeta.fps}
      width={brandingIsTickerMeta.width}
      height={brandingIsTickerMeta.height}
    />
  ),
};
