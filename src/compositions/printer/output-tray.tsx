import type { PrinterColors, PrinterGeometry } from './geometry';

const ROLLER_SPOTS = [-0.4, -0.16, 0.16, 0.4];

export const OutputTray = ({
  geometry,
  colors,
  uid,
}: {
  geometry: PrinterGeometry;
  colors: PrinterColors;
  uid: string;
}) => {
  const { across, along, trayWidth, trayEnd, slotWidth, slotTop, front } = geometry;
  const half = trayWidth / 2;
  const bed = across / 2 + 38;
  const ribs = [-0.3, 0, 0.3].map((share) => share * across);
  return (
    <g>
      <defs>
        <filter id={`${uid}-tray-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <linearGradient
          id={`${uid}-tray-light`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={front}
          x2="0"
          y2={trayEnd}
        >
          <stop offset="0" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient
          id={`${uid}-printer-cast`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={front}
          x2="0"
          y2={front + 150}
        >
          <stop offset="0" stopColor="#000000" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#000000" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-stop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id={`${uid}-slot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={-half + 18}
        y={front + 30}
        width={trayWidth}
        height={trayEnd - front}
        rx={40}
        fill="#000000"
        opacity={0.28}
        filter={`url(#${uid}-tray-shadow)`}
      />
      <rect x={-half} y={-12} width={trayWidth} height={trayEnd + 12} rx={36} fill={colors.tray} />
      <rect
        x={-half}
        y={-12}
        width={trayWidth}
        height={trayEnd + 12}
        rx={36}
        fill={`url(#${uid}-tray-light)`}
      />
      <rect
        x={-half + 1.5}
        y={-10.5}
        width={trayWidth - 3}
        height={trayEnd + 9}
        rx={35}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.5}
        strokeWidth={3}
      />
      <rect
        x={-bed}
        y={36}
        width={bed * 2}
        height={along + 70}
        rx={20}
        fill="#000000"
        fillOpacity={0.035}
        stroke="#000000"
        strokeOpacity={0.08}
        strokeWidth={2}
      />
      {ribs.map((x) => (
        <g key={x}>
          <line
            x1={x}
            y1={70}
            x2={x}
            y2={along + 80}
            stroke="#000000"
            strokeOpacity={0.12}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={x + 3}
            y1={70}
            x2={x + 3}
            y2={along + 80}
            stroke="#ffffff"
            strokeOpacity={0.55}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect
        x={-bed - 10}
        y={along + 118}
        width={bed * 2 + 20}
        height={46}
        rx={18}
        fill={colors.trim}
      />
      <rect
        x={-bed - 10}
        y={along + 118}
        width={bed * 2 + 20}
        height={46}
        rx={18}
        fill={`url(#${uid}-stop)`}
      />
      <rect x={-half} y={front} width={trayWidth} height={150} fill={`url(#${uid}-printer-cast)`} />
      <rect
        x={-slotWidth / 2}
        y={slotTop}
        width={slotWidth}
        height={front - slotTop + 6}
        rx={6}
        fill={colors.slot}
      />
      {ROLLER_SPOTS.map((share) => (
        <rect
          key={share}
          x={share * across - 38}
          y={slotTop + 5}
          width={76}
          height={14}
          rx={7}
          fill="#121212"
          stroke="#ffffff"
          strokeOpacity={0.12}
          strokeWidth={1.5}
        />
      ))}
      <rect
        x={-slotWidth / 2}
        y={slotTop}
        width={slotWidth}
        height={front - slotTop + 6}
        rx={6}
        fill={`url(#${uid}-slot)`}
      />
    </g>
  );
};
