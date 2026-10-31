import type { DominoWordsProps } from '@/schemas';
import { dominoFont } from './font';

export const BrandMark = ({ brand }: { brand: DominoWordsProps['brand'] }) =>
  brand.show ? (
    <div
      style={{
        position: 'absolute',
        right: brand.right,
        top: brand.top,
        display: 'flex',
        alignItems: 'center',
        gap: brand.size * 0.26,
        color: brand.color,
        fontFamily: dominoFont,
        lineHeight: 1,
      }}
    >
      <div
        style={{
          width: brand.size * 0.62,
          height: brand.size * 0.62,
          borderRadius: '50%',
          border: `${Math.max(1, brand.size * 0.07).toFixed(2)}px solid ${brand.dotColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: brand.size * 0.2,
            height: brand.size * 0.2,
            borderRadius: '50%',
            background: brand.dotColor,
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontSize: brand.size * 0.62, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {brand.name}
        </div>
        <div
          style={{
            marginTop: brand.size * 0.1,
            fontSize: brand.size * 0.22,
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            opacity: 0.72,
          }}
        >
          {brand.tagline}
        </div>
      </div>
    </div>
  ) : null;

export const FooterLink = ({ footer }: { footer: DominoWordsProps['footer'] }) =>
  footer.show ? (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: footer.bottom,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: footer.size * 0.7,
        color: footer.color,
        fontFamily: dominoFont,
        fontWeight: 500,
        fontSize: footer.size,
        letterSpacing: '0.14em',
      }}
    >
      {footer.lines ? (
        <div
          style={{ width: footer.size * 2.2, height: 1, background: footer.color, opacity: 0.5 }}
        />
      ) : null}
      {footer.text}
      {footer.lines ? (
        <div
          style={{ width: footer.size * 2.2, height: 1, background: footer.color, opacity: 0.5 }}
        />
      ) : null}
    </div>
  ) : null;
