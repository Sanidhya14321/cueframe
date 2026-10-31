import type { ReactNode } from 'react';

const Glyph = ({ size, children }: { size: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
    <title>key icon</title>
    {children}
  </svg>
);

export type ToolIcon = 'grid' | 'sticker' | 'gear' | 'translate' | 'palette' | 'mic';

export const TOOL_ICONS: ToolIcon[] = ['grid', 'sticker', 'gear', 'translate', 'palette', 'mic'];

export const Tool = ({ icon, color, size }: { icon: ToolIcon; color: string; size: number }) => {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 3.6,
    strokeLinejoin: 'round' as const,
  };
  switch (icon) {
    case 'grid':
      return (
        <Glyph size={size}>
          {[10, 26].flatMap((x) =>
            [10, 26].map((y) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={12} height={12} rx={3.5} {...stroke} />
            )),
          )}
        </Glyph>
      );
    case 'sticker':
      return (
        <Glyph size={size}>
          <path d="M9 13a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v14L27 39H13a4 4 0 0 1-4-4z" {...stroke} />
          <path d="M27 39V31a4 4 0 0 1 4-4h8" {...stroke} />
          <circle cx={18} cy={20} r={2.4} fill={color} />
          <circle cx={30} cy={20} r={2.4} fill={color} />
          <path d="M17 28c3 3 8 3 10 0" {...stroke} strokeLinecap="round" />
        </Glyph>
      );
    case 'gear':
      return (
        <Glyph size={size}>
          <circle
            cx={24}
            cy={24}
            r={14}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeDasharray="5.5 5.5"
          />
          <circle cx={24} cy={24} r={11} fill={color} />
          <circle cx={24} cy={24} r={4.5} fill="#ffffff" fillOpacity={0.85} />
        </Glyph>
      );
    case 'translate':
      return (
        <Glyph size={size}>
          <rect x={7} y={7} width={22} height={24} rx={3} fill={color} />
          <rect
            x={19}
            y={17}
            width={22}
            height={24}
            rx={3}
            {...stroke}
            fill="#ffffff"
            fillOpacity={0.7}
          />
          <path d="M13 24l5-11 5 11M15 20h6" stroke="#ffffff" strokeWidth={2.6} fill="none" />
          <path
            d="M25 26h10M30 23v3M27 36c4-2 7-6 7-10M28 30c2 3 4 5 7 6"
            {...stroke}
            strokeWidth={2.4}
          />
        </Glyph>
      );
    case 'palette':
      return (
        <Glyph size={size}>
          <path
            d="M24 6a18 18 0 1 0 0 36c3 0 4-2 3-4-1-3 1-5 4-5h4a7 7 0 0 0 7-7c0-11-8-20-18-20z"
            fill={color}
          />
          {[
            [14, 22],
            [19, 14],
            [29, 14],
            [34, 21],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3.2} fill="#ffffff" fillOpacity={0.9} />
          ))}
        </Glyph>
      );
    default:
      return (
        <Glyph size={size}>
          <rect x={18} y={6} width={12} height={22} rx={6} fill={color} />
          <path d="M12 22a12 12 0 0 0 24 0M24 34v8" {...stroke} strokeLinecap="round" />
        </Glyph>
      );
  }
};

export const ShiftIcon = ({
  color,
  filled,
  size,
}: {
  color: string;
  filled: boolean;
  size: number;
}) => (
  <Glyph size={size}>
    <path
      d="M24 7L7 25h10v14h14V25h10z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={3.6}
      strokeLinejoin="round"
    />
  </Glyph>
);

export const BackspaceIcon = ({ color, size }: { color: string; size: number }) => (
  <Glyph size={size}>
    <path
      d="M16 10h24a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H16L4 24z"
      fill="none"
      stroke={color}
      strokeWidth={3.6}
      strokeLinejoin="round"
    />
    <path d="M22 17l13 14M35 17L22 31" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
  </Glyph>
);

export const GlobeIcon = ({ color, size }: { color: string; size: number }) => (
  <Glyph size={size}>
    <g fill="none" stroke={color} strokeWidth={3.4}>
      <circle cx={24} cy={24} r={17} />
      <ellipse cx={24} cy={24} rx={7.5} ry={17} />
      <path d="M7 24h34M10 15h28M10 33h28" />
    </g>
  </Glyph>
);

export const EnterIcon = ({ color, size }: { color: string; size: number }) => (
  <Glyph size={size}>
    <path
      d="M38 24H12M20 15l-9 9 9 9"
      fill="none"
      stroke={color}
      strokeWidth={4.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Glyph>
);

export const ChevronIcon = ({ color, size }: { color: string; size: number }) => (
  <Glyph size={size}>
    <path
      d="M12 18l12 12 12-12"
      fill="none"
      stroke={color}
      strokeWidth={3.4}
      strokeLinecap="round"
    />
  </Glyph>
);

export const KeyboardIcon = ({ color, size }: { color: string; size: number }) => (
  <Glyph size={size}>
    <rect x={5} y={12} width={38} height={24} rx={3} fill="none" stroke={color} strokeWidth={3} />
    {[12, 19, 26, 33].map((x) => (
      <rect key={x} x={x} y={18} width={4} height={4} fill={color} />
    ))}
    <rect x={15} y={27} width={18} height={4} fill={color} />
  </Glyph>
);
