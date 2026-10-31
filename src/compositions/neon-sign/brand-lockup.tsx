import type { NeonSignFlickerProps } from '@/schemas';
import { labelFont } from './fonts';

export const BrandLockup = ({
  name,
  line,
  brand,
}: {
  name: string;
  line: string;
  brand: NeonSignFlickerProps['brand'];
}) => {
  const mark = brand.size * 0.62;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: brand.bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: brand.size * 0.26,
        color: brand.color,
        fontFamily: labelFont,
      }}
    >
      {brand.showMark ? (
        <div
          style={{
            width: mark,
            height: mark,
            borderRadius: '50%',
            border: `${Math.max(2, mark * 0.14)}px solid ${brand.accent}`,
            boxShadow: `0 0 ${mark * 0.4}px ${brand.accent}`,
          }}
        />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: brand.size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontWeight: 400,
            fontSize: brand.size * 0.3,
            lineHeight: 1.2,
            marginTop: brand.size * 0.08,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          {line}
        </span>
      </div>
    </div>
  );
};

export const Website = ({
  url,
  website,
}: {
  url: string;
  website: NeonSignFlickerProps['website'];
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: website.bottom,
      textAlign: 'center',
      fontFamily: labelFont,
      fontWeight: 400,
      fontSize: website.size,
      letterSpacing: `${website.tracking}em`,
      lineHeight: 1,
      color: website.color,
      textTransform: 'uppercase',
    }}
  >
    {url}
  </div>
);
