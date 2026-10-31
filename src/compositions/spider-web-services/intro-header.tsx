import type { SpiderWebServicesProps } from '@/schemas';
import { pixelTween, settle, tween } from '../promo/timing';
import { BrandMark } from './brand-glyphs';
import { titleFont } from './fonts';

export const IntroHeader = ({
  props,
  top,
  frame,
}: {
  props: SpiderWebServicesProps;
  top: number;
  frame: number;
}) => {
  const { intro, brand } = props;
  if (top < -900) {
    return null;
  }
  const rise = pixelTween(frame, [0, 16], [26, 0], settle);
  const fade = tween(frame, [0, 10], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: intro.x,
        top: top + rise,
        opacity: fade,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginLeft: 88,
          fontFamily: titleFont,
          fontWeight: 600,
          fontSize: 38,
          color: intro.labelColor,
        }}
      >
        <BrandMark size={50} color={intro.labelColor} shade={brand.markShade} />
        {brand.name}
      </div>
      <div
        style={{
          marginTop: 118,
          fontFamily: titleFont,
          fontWeight: 800,
          fontSize: intro.headlineSize,
          lineHeight: 0.92,
          letterSpacing: '-0.02em',
          color: intro.headlineColor,
          whiteSpace: 'pre',
        }}
      >
        {intro.headline}
      </div>
    </div>
  );
};
