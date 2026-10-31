import type { PuzzleSuccessProps } from '@/schemas';
import { displayFont } from '../promo/fonts';

const SUMMIT = [
  'M6 66 L36 22 L50 40 L62 28 L94 66 Z',
  'M36 22 L36 4 L52 9 L36 14',
  'M27 35 L33 40 L39 33 L44 38',
  'M57 33 L62 37 L67 34',
];

export const SummitIcon = ({ props }: { props: PuzzleSuccessProps }) => {
  const { icon } = props;
  if (!icon.show) {
    return null;
  }
  const scale = icon.size / 100;
  return (
    <g
      transform={`translate(${props.block.centerX - icon.size / 2} ${icon.y - 36 * scale}) scale(${scale})`}
      fill="none"
      stroke={icon.color}
      strokeWidth={icon.lineWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SUMMIT.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
};

const Diamond = ({ size, color }: { size: number; color: string }) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      background: color,
      transform: 'rotate(45deg)',
    }}
  />
);

export const Wordmark = ({ props }: { props: PuzzleSuccessProps }) => {
  const { type, copy } = props;
  if (copy.wordmark.trim() === '' && !copy.mark) {
    return null;
  }
  const diamond = type.wordmarkSize * 0.26;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: type.wordmarkY,
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: type.wordmarkSize * 0.55,
        fontFamily: displayFont,
        fontWeight: 600,
        fontSize: type.wordmarkSize,
        letterSpacing: `${type.wordmarkSpacing}em`,
        color: type.wordmarkColor,
        lineHeight: 1,
      }}
    >
      {copy.mark ? <Diamond size={diamond} color={type.markColor} /> : null}
      <span style={{ marginRight: `-${type.wordmarkSpacing}em` }}>{copy.wordmark}</span>
      {copy.mark ? <Diamond size={diamond} color={type.markColor} /> : null}
    </div>
  );
};
