export const BrandMark = ({
  size,
  color,
  shade,
}: {
  size: number;
  color: string;
  shade: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M 50 6 L 88 28 L 88 72 L 50 94 L 12 72 L 12 28 Z M 50 24 L 72.5 37 L 72.5 63 L 50 76 L 27.5 63 L 27.5 37 Z"
      fill={color}
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M 50 39 L 59.5 44.5 L 59.5 55.5 L 50 61 L 40.5 55.5 L 40.5 44.5 Z"
      fill={shade}
      stroke={shade}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS: string[] = [
  'M 5 7 h 14 a 2 2 0 0 1 2 2 v 9 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 v -9 a 2 2 0 0 1 2 -2 z M 12 10 a 3.5 3.5 0 1 0 0.01 0 z M 8 7 l 1.5 -3 h 5 l 1.5 3',
  'M 4 5 h 16 a 1 1 0 0 1 1 1 v 10 a 1 1 0 0 1 -1 1 h -9 l -4 3.5 v -3.5 h -3 a 1 1 0 0 1 -1 -1 v -10 a 1 1 0 0 1 1 -1 z',
  'M 4 6 h 16 a 2 2 0 0 1 2 2 v 8 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -8 a 2 2 0 0 1 2 -2 z M 10 9 l 5 3 l -5 3 z',
  'M 12 3 a 6 6 0 0 1 6 6 c 0 5 -6 12 -6 12 c 0 0 -6 -7 -6 -12 a 6 6 0 0 1 6 -6 z M 12 7 a 2 2 0 1 0 0.01 0 z',
  'M 12 3 a 9 9 0 1 0 0.01 0 z M 3 12 h 18 M 12 3 c 4 3 4 15 0 18 M 12 3 c -4 3 -4 15 0 18',
  'M 3 6 h 18 v 12 h -18 z M 3 6 l 9 7 l 9 -7',
  'M 6 16 v -5 a 6 6 0 0 1 12 0 v 5 l 2 2 h -16 z M 10 20 a 2 2 0 0 0 4 0',
  'M 9 18 a 3 3 0 1 1 0 -0.01 z M 12 18 v -14 l 7 2 v 4 l -7 -2',
];

export const SocialRow = ({
  color,
  size,
  frame,
  start,
}: {
  color: string;
  size: number;
  frame: number;
  start: number;
}) => (
  <div style={{ display: 'flex', gap: size * 0.32, justifyContent: 'center' }}>
    {ICONS.map((icon, index) => {
      const local = Math.min(1, Math.max(0, (frame - start - index * 1.5) / 6));
      return (
        <svg
          key={icon}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ opacity: local, transform: `scale(${0.6 + local * 0.4})` }}
        >
          <path
            d={icon}
            fill="none"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    })}
  </div>
);
