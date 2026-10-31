export const Handset = ({
  size,
  color,
  rotate,
}: {
  size: number;
  color: string;
  rotate: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ transform: `rotate(${rotate}deg)`, overflow: 'visible' }}
    aria-hidden
  >
    <g fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 26 C 18 54, 44 82, 74 72" fill="none" strokeWidth={17} />
      <rect x={17} y={8} width={28} height={22} rx={8} transform="rotate(66 31 19)" />
      <rect x={64} y={60} width={28} height={22} rx={8} transform="rotate(-24 78 71)" />
    </g>
  </svg>
);
