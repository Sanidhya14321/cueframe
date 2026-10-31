import type { ChargeCompareProps } from '@/schemas';

type PhoneOutlineProps = {
  look: ChargeCompareProps['look'];
  layout: ChargeCompareProps['layout'];
  left: number;
};

const BUTTON_OVERHANG = 4;

export const PhoneOutline = ({ look, layout, left }: PhoneOutlineProps) => {
  const { phoneWidth: width, phoneHeight: height, phoneRadius: radius } = layout;
  const edge = layout.edgeWidth;
  const inner = edge + layout.bezelWidth;
  const islandWidth = width * 0.26;
  const islandHeight = width * 0.08;
  const islandX = (width - islandWidth) / 2;
  const islandY = inner + width * 0.045;
  const buttons: [number, number, number][] = [
    [-BUTTON_OVERHANG, 0.17, 0.05],
    [-BUTTON_OVERHANG, 0.25, 0.085],
    [-BUTTON_OVERHANG, 0.36, 0.085],
    [width - edge / 2, 0.27, 0.13],
  ];
  return (
    <svg
      width={width + BUTTON_OVERHANG * 2}
      height={height}
      viewBox={`${-BUTTON_OVERHANG} 0 ${width + BUTTON_OVERHANG * 2} ${height}`}
      style={{ position: 'absolute', left: left - BUTTON_OVERHANG, top: layout.phoneTop }}
      role="presentation"
    >
      {buttons.map(([x, top, length]) => (
        <rect
          key={`${x}-${top}`}
          x={x}
          y={height * top}
          width={BUTTON_OVERHANG + edge / 2}
          height={height * length}
          rx={1.5}
          fill={look.phoneEdge}
        />
      ))}
      <rect
        x={edge / 2}
        y={edge / 2}
        width={width - edge}
        height={height - edge}
        rx={radius}
        fill={look.phoneBezel}
        stroke={look.phoneEdge}
        strokeWidth={edge}
      />
      <rect
        x={inner}
        y={inner}
        width={width - inner * 2}
        height={height - inner * 2}
        rx={Math.max(4, radius - inner)}
        fill={look.phoneScreen}
      />
      <rect
        x={islandX}
        y={islandY}
        width={islandWidth}
        height={islandHeight}
        rx={islandHeight / 2}
        fill={look.island}
      />
      <circle
        cx={islandX + islandWidth - islandHeight / 2}
        cy={islandY + islandHeight / 2}
        r={islandHeight * 0.26}
        fill="#16233b"
      />
      <circle
        cx={islandX + islandWidth - islandHeight / 2 - islandHeight * 0.07}
        cy={islandY + islandHeight / 2 - islandHeight * 0.07}
        r={islandHeight * 0.08}
        fill="#3d5a8c"
      />
    </svg>
  );
};
