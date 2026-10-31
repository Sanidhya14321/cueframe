import type { PuzzleSuccessProps } from '@/schemas';
import { displayFont } from '../promo/fonts';
import type { PuzzleBeat } from './choreography';
import {
  CORNER_EDGES,
  CORNER_LABEL_ROTATION,
  CORNER_SHADE_DIRECTION,
  CORNERS,
  type Corner,
  piecePath,
} from './geometry';

const SHADE_STOPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1];

const rampAt = (offset: number): number => {
  const t = Math.min(1, Math.max(0, (offset - 0.04) / 0.72));
  return t * t * (3 - 2 * t);
};

const hexChannels = (hex: string): number[] =>
  [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));

const mixHex = (from: string, to: string, amount: number): string => {
  const a = hexChannels(from);
  const b = hexChannels(to);
  return `#${a
    .map((channel, index) =>
      Math.round(channel + ((b[index] ?? channel) - channel) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

const gradientId = (prefix: string, corner: Corner) => `${prefix}-fill-${corner}`;

export const PieceDefs = ({ props, prefix }: { props: PuzzleSuccessProps; prefix: string }) => {
  const half = props.block.size / 2;
  const { block, type } = props;
  return (
    <>
      {CORNERS.map((corner) => {
        const [dx, dy] = CORNER_SHADE_DIRECTION[corner];
        return (
          <linearGradient
            key={corner}
            id={gradientId(prefix, corner)}
            gradientUnits="userSpaceOnUse"
            x1={dx * half}
            y1={dy * half}
            x2={-dx * half}
            y2={-dy * half}
          >
            {SHADE_STOPS.map((offset) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={mixHex(block.shade, block.fill, rampAt(offset))}
              />
            ))}
          </linearGradient>
        );
      })}
      <filter id={`${prefix}-piece-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation={block.glowSize} />
      </filter>
      <filter id={`${prefix}-text-glow`} x="-40%" y="-80%" width="180%" height="260%">
        <feGaussianBlur stdDeviation={type.labelSize * 0.22} />
      </filter>
      <filter id={`${prefix}-word-glow`} x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation={type.wordSize * 0.16} />
      </filter>
    </>
  );
};

const Piece = ({
  corner,
  props,
  beat,
  prefix,
}: {
  corner: Corner;
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => {
  const { block, type } = props;
  const pose = beat.poses[corner];
  const shape = piecePath(block.size, CORNER_EDGES[corner], block.knob);
  const glow = beat.glow * block.glowStrength * (0.5 + 0.5 * beat.breathAlt);
  return (
    <g
      transform={`translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.tilt.toFixed(3)}) scale(${pose.scale.toFixed(4)})`}
    >
      {glow > 0 ? (
        <path
          d={shape}
          fill={block.glow}
          opacity={Math.min(1, glow)}
          filter={`url(#${prefix}-piece-glow)`}
        />
      ) : null}
      {glow > 1 ? (
        <path
          d={shape}
          fill={block.glow}
          opacity={glow - 1}
          filter={`url(#${prefix}-piece-glow)`}
        />
      ) : null}
      <path
        d={shape}
        fill={`url(#${gradientId(prefix, corner)})`}
        stroke={block.edge}
        strokeWidth={block.edgeWidth}
        strokeLinejoin="round"
      />
      {beat.labels > 0 ? (
        <g
          transform={`rotate(${CORNER_LABEL_ROTATION[corner]})`}
          opacity={beat.labels}
          style={{ fontFamily: displayFont, fontWeight: 600, fontSize: type.labelSize }}
        >
          {type.labelGlow > 0 ? (
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill={type.labelColor}
              opacity={type.labelGlow}
              filter={`url(#${prefix}-text-glow)`}
            >
              {props[corner].label}
            </text>
          ) : null}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={type.labelColor}
            textRendering="geometricPrecision"
          >
            {props[corner].label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const PuzzlePieces = ({
  props,
  beat,
  prefix,
}: {
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => (
  <>
    {CORNERS.map((corner) => (
      <Piece key={corner} corner={corner} props={props} beat={beat} prefix={prefix} />
    ))}
  </>
);

export const SuccessWord = ({
  props,
  beat,
  prefix,
}: {
  props: PuzzleSuccessProps;
  beat: PuzzleBeat;
  prefix: string;
}) => {
  if (beat.word <= 0) {
    return null;
  }
  const { type, block } = props;
  const style = {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: type.wordSize,
    letterSpacing: `${type.wordSpacing}em`,
  };
  return (
    <g
      transform={`translate(${block.centerX} ${block.centerY}) scale(${beat.wordScale.toFixed(4)})`}
      opacity={beat.word}
      style={style}
    >
      {type.wordGlowStrength > 0 ? (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={type.wordGlow}
          opacity={Math.min(1, type.wordGlowStrength) * (0.5 + 0.5 * beat.breathAlt)}
          filter={`url(#${prefix}-word-glow)`}
        >
          {props.copy.word}
        </text>
      ) : null}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={type.wordColor}
        textRendering="geometricPrecision"
      >
        {props.copy.word}
      </text>
    </g>
  );
};
