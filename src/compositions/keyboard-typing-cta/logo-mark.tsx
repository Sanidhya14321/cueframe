const LEAF = 'M28 72C26 44 46 26 74 26C76 54 58 74 28 72Z';

export const LeafShape = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <title>leaf</title>
    <path d={LEAF} fill={color} />
  </svg>
);

const LeafMark = ({
  size,
  mark,
  leaf,
  hole,
}: {
  size: number;
  mark: string;
  leaf: string;
  hole: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <title>leaf mark</title>
    <rect x={2} y={2} width={96} height={96} rx={30} fill={mark} />
    <path d={LEAF} fill={leaf} />
    <path d="M31 69L61 39" stroke={hole} strokeWidth={4.5} strokeLinecap="round" />
  </svg>
);

export const BrandLockup = ({
  size,
  word,
  mark,
  leaf,
  ink,
  hole,
  font,
}: {
  size: number;
  word: string;
  mark: string;
  leaf: string;
  ink: string;
  hole: string;
  font: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.18 }}>
    <LeafMark size={size} mark={mark} leaf={leaf} hole={hole} />
    <span
      style={{
        fontFamily: font,
        fontWeight: 700,
        fontSize: size * 0.72,
        lineHeight: 1,
        color: ink,
        letterSpacing: '-0.03em',
      }}
    >
      {word}
    </span>
  </div>
);
