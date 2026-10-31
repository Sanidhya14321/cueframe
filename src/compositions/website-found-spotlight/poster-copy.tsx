import { AbsoluteFill } from 'remotion';
import type { WebsiteFoundSpotlightProps } from '@/schemas';
import { didoneFont, displayFont } from '../promo/fonts';
import { RingMark } from './ring-mark';

const lines = (text: string): string[] => text.split('\n');

export const PosterCopy = ({ props }: { props: WebsiteFoundSpotlightProps }) => {
  const { copy, type, palette } = props;
  const contactLine = Math.round(type.contactSize * 1.35);
  return (
    <AbsoluteFill style={{ fontFamily: displayFont, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: type.insetX, top: type.markTop }}>
        <RingMark
          letter={copy.markLetter}
          size={type.markSize}
          ink={palette.mark}
          ring={palette.highlight}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: type.insetX,
          top: type.markTop + type.markSize / 2 - contactLine,
          textAlign: 'right',
          color: palette.body,
          fontSize: type.contactSize,
          lineHeight: `${contactLine}px`,
          fontWeight: 500,
          letterSpacing: '0.01em',
        }}
      >
        <div style={{ color: palette.contact, fontWeight: 600 }}>{copy.website}</div>
        <div style={{ opacity: 0.72 }}>{copy.email}</div>
      </div>
      <div style={{ position: 'absolute', left: type.insetX, top: type.headlineTop }}>
        {lines(copy.headline).map((line) => (
          <div
            key={line}
            style={{
              color: palette.headline,
              fontSize: type.headlineSize,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              whiteSpace: 'pre',
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            color: palette.highlight,
            fontFamily: didoneFont,
            fontSize: type.highlightSize,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginLeft: -6,
            marginTop: type.highlightSize * 0.02,
          }}
        >
          {copy.highlight}
        </div>
        <div
          style={{
            marginTop: type.bodySize * 1.4,
            paddingLeft: 22,
            borderLeft: `3px solid ${palette.highlight}`,
          }}
        >
          {lines(copy.body).map((line) => (
            <div
              key={line}
              style={{
                color: palette.body,
                fontSize: type.bodySize,
                fontWeight: 500,
                lineHeight: 1.4,
                whiteSpace: 'pre',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
