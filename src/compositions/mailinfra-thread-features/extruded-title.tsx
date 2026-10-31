import type { ThreadColors, ThreadTitleStyle } from '@/schemas';
import { mixHex } from './color';
import { titleFont } from './fonts';

const NARROW = new Set(['I', 'i', 'l', '1', '.', ',', ':', ';', '!', "'", '|', ' ', 'j', 't', 'f']);
const WIDE = new Set(['M', 'W', 'm', 'w', '%', '@']);

const TRACKING = -0.02;

const estimateWidth = (text: string, size: number): number =>
  [...text].reduce(
    (sum, glyph) => sum + (NARROW.has(glyph) ? 0.34 : WIDE.has(glyph) ? 0.98 : 0.74) + TRACKING,
    0,
  ) * size;

const fitSize = (text: string, size: number, maxWidth: number): number => {
  const width = estimateWidth(text, size);
  return width > maxWidth ? Math.floor((size * maxWidth) / width) : size;
};

export interface TitleMetrics {
  topSize: number;
  bottomSize: number;
  width: number;
  height: number;
}

export const titleMetrics = (
  top: string,
  bottom: string,
  style: ThreadTitleStyle,
): TitleMetrics => {
  const topSize = top.length > 0 ? fitSize(top, style.topSize, style.maxWidth) : 0;
  const bottomSize = bottom.length > 0 ? fitSize(bottom, style.bottomSize, style.maxWidth) : 0;
  const gap = topSize > 0 && bottomSize > 0 ? style.lineGap : 0;
  return {
    topSize,
    bottomSize,
    width: Math.max(estimateWidth(top, topSize), estimateWidth(bottom, bottomSize), 120),
    height: Math.max(topSize + bottomSize + gap, 80),
  };
};

const ExtrudedLine = ({
  text,
  size,
  depth,
  colors,
}: {
  text: string;
  size: number;
  depth: number;
  colors: ThreadColors;
}) => {
  const layers = Math.round(depth * (size / 150));
  const base = {
    position: 'absolute',
    left: 0,
    top: 0,
    whiteSpace: 'pre',
  } as const;
  const shadow = `8px 16px ${(size * 0.18).toFixed(1)}px ${colors.titleShadow}`;
  return (
    <div style={{ position: 'relative', whiteSpace: 'pre' }}>
      {Array.from({ length: layers }, (_, step) => {
        const index = layers - step;
        return (
          <div
            key={index}
            style={{
              ...base,
              color: mixHex(colors.titleSide, colors.titleDepth, index / Math.max(1, layers)),
              transform: `translate(${(index * 0.4).toFixed(1)}px, ${index}px)`,
              textShadow: index === layers ? shadow : undefined,
            }}
          >
            {text}
          </div>
        );
      })}
      <div style={{ ...base, color: colors.titleHighlight, transform: 'translate(-1.5px, -2px)' }}>
        {text}
      </div>
      <div
        style={{
          position: 'relative',
          color: colors.titleFace,
          textShadow: layers === 0 ? shadow : undefined,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const ExtrudedTitle = ({
  top,
  bottom,
  metrics,
  style,
  colors,
}: {
  top: string;
  bottom: string;
  metrics: TitleMetrics;
  style: ThreadTitleStyle;
  colors: ThreadColors;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: titleFont,
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: `${TRACKING}em`,
    }}
  >
    {metrics.topSize > 0 ? (
      <div style={{ fontSize: metrics.topSize }}>
        <ExtrudedLine text={top} size={metrics.topSize} depth={style.depth} colors={colors} />
      </div>
    ) : null}
    {metrics.bottomSize > 0 ? (
      <div
        style={{ fontSize: metrics.bottomSize, marginTop: metrics.topSize > 0 ? style.lineGap : 0 }}
      >
        <ExtrudedLine text={bottom} size={metrics.bottomSize} depth={style.depth} colors={colors} />
      </div>
    ) : null}
  </div>
);
