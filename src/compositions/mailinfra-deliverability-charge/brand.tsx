import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { FadeIn } from '../promo/typography';

type Brand = MailinfraDeliverabilityChargeProps['brand'];

const Mark = ({ size, color, ink }: { size: number; color: string; ink: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect x={0} y={0} width={32} height={32} rx={9} fill={color} />
    <rect x={7} y={10} width={18} height={13} rx={2.5} fill="none" stroke={ink} strokeWidth={2.2} />
    <path
      d="M8 11.5 L16 17.5 L24 11.5"
      fill="none"
      stroke={ink}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BrandLine = ({ brand }: { brand: Brand }) => {
  if (!brand.show || (brand.text.length === 0 && !brand.mark)) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: brand.top,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <FadeIn start={brand.enterAt}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Math.round(brand.size * 0.4),
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: brand.size,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: brand.color,
            whiteSpace: 'pre',
          }}
        >
          {brand.mark ? (
            <Mark size={Math.round(brand.size * 1.25)} color={brand.markColor} ink={brand.color} />
          ) : null}
          {brand.text}
        </div>
      </FadeIn>
    </div>
  );
};
