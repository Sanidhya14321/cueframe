import { Easing, random } from 'remotion';
import type { ScrollerCalloutProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { calloutFont } from './glyphs';

type Props = ScrollerCalloutProps;

const GLOW_STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const falloff = (offset: number) => (1 - offset) ** 2 * (1 + 2 * offset);

const MarkArt = ({
  end,
  palette,
  center,
}: {
  end: Props['end'];
  palette: Props['palette'];
  center: number;
}) => {
  const size = end.markSize;
  const corner = Math.min(0.5, Math.max(0, end.markCorner));
  const tile = (inset: number) => {
    const side = size * (1 - inset * 2);
    return {
      x: center - side / 2,
      y: end.markY - side / 2,
      width: side,
      height: side,
      rx: Math.max(0, side * corner - size * inset * 0.6),
    };
  };
  return (
    <g>
      <rect {...tile(0)} fill={palette.markFill} />
      <rect {...tile(0.1)} fill={palette.markFace} />
      <rect {...tile(0.145)} fill="none" stroke={palette.markFill} strokeWidth={size * 0.0175} />
      <text
        x={center}
        y={end.markY + size * 0.105}
        textAnchor="middle"
        fill={palette.markInk}
        style={{
          fontFamily: calloutFont,
          fontWeight: 800,
          fontSize: size * 0.31,
          letterSpacing: '-0.02em',
        }}
      >
        {end.monogram}
      </text>
    </g>
  );
};

const slide = Easing.bezier(0.16, 1, 0.3, 1);

const SlicedMark = ({
  end,
  palette,
  center,
  frame,
}: {
  end: Props['end'];
  palette: Props['palette'];
  center: number;
  frame: number;
}) => {
  if (frame < end.markAt) {
    return null;
  }
  const slices = Math.max(2, Math.round(end.slices));
  const size = end.markSize;
  const top = end.markY - size / 2;
  const sliceHeight = size / slices;
  const progress = (frame - end.markAt) / Math.max(0.01, end.markFrames);
  const span = 0.55;
  if (progress >= 1 + span) {
    return <MarkArt end={end} palette={palette} center={center} />;
  }
  return (
    <g>
      <defs>
        {Array.from({ length: slices }, (_, slice) => (
          <clipPath key={`mark-slice-${slice + 1}`} id={`callout-mark-slice-${slice + 1}`}>
            <rect
              x={center - size}
              y={top + slice * sliceHeight - 0.5}
              width={size * 2}
              height={sliceHeight + 1}
            />
          </clipPath>
        ))}
      </defs>
      {Array.from({ length: slices }, (_, slice) => {
        const appear = (slice / slices) * 0.85 + random(`mark-${slice}`) * 0.15;
        const local = Math.min(1, Math.max(0, (progress - appear) / span));
        if (local <= 0) {
          return null;
        }
        const side = slice % 2 === 0 ? -1 : 1;
        const offset = side * size * 0.42 * (1 - slide(local));
        return (
          <g
            key={`mark-part-${slice + 1}`}
            clipPath={`url(#callout-mark-slice-${slice + 1})`}
            opacity={Math.min(1, local * 4)}
          >
            <g transform={`translate(${offset.toFixed(2)} 0)`}>
              <MarkArt end={end} palette={palette} center={center} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const EndCard = ({
  end,
  palette,
  showBackdrop,
  width,
  height,
  frame,
}: {
  end: Props['end'];
  palette: Props['palette'];
  showBackdrop: boolean;
  width: number;
  height: number;
  frame: number;
}) => {
  if (frame < end.at) {
    return null;
  }
  const center = width / 2;
  const grow = tween(
    frame,
    [end.lineAt, end.lineAt + Math.max(0.01, end.lineFrames)],
    [0, 1],
    Easing.out(Easing.back(1 + end.overshoot * 8)),
  );
  const lineWidth = end.lineWidth * Math.max(0, grow);
  const urlOpacity = tween(
    frame,
    [end.urlAt, end.urlAt + Math.max(0.01, end.urlFrames)],
    [0, 1],
    smooth,
  );
  return (
    <g>
      {showBackdrop ? (
        <>
          <defs>
            <radialGradient id="callout-end-glow" cx="0.5" cy="0" r="0.62">
              {GLOW_STOPS.map((offset) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={palette.glow}
                  stopOpacity={end.glow * falloff(offset)}
                />
              ))}
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill={palette.night} />
          <rect x={0} y={0} width={width} height={height} fill="url(#callout-end-glow)" />
        </>
      ) : null}
      {lineWidth > 0.5 ? (
        <rect
          x={center - lineWidth / 2}
          y={end.lineY - end.lineThickness / 2}
          width={lineWidth}
          height={end.lineThickness}
          rx={end.lineThickness / 2}
          fill={palette.accent}
        />
      ) : null}
      <SlicedMark end={end} palette={palette} center={center} frame={frame} />
      {urlOpacity > 0 ? (
        <text
          x={center + (end.urlTracking * end.urlSize) / 2}
          y={end.urlBaseline}
          textAnchor="middle"
          fill={palette.urlInk}
          opacity={urlOpacity}
          style={{
            fontFamily: calloutFont,
            fontWeight: end.urlWeight,
            fontSize: end.urlSize,
            letterSpacing: `${end.urlTracking}em`,
            textTransform: end.urlUppercase ? 'uppercase' : 'none',
          }}
        >
          {end.url}
        </text>
      ) : null}
    </g>
  );
};
