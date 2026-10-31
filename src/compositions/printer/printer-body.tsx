import type { PrinterColors, PrinterGeometry } from './geometry';

const VENT_COLUMNS = 7;
const VENT_ROWS = 5;
const PANEL_WIDTH = 300;

const Vents = ({ left, top }: { left: number; top: number }) => (
  <g>
    {Array.from({ length: VENT_ROWS }, (_row, row) =>
      Array.from({ length: VENT_COLUMNS }, (_column, column) => (
        <g key={`${row}-${column}`}>
          <rect
            x={left + column * 26}
            y={top + row * 24}
            width={8}
            height={30}
            rx={4}
            transform={`skewX(-18)`}
            fill="#000000"
            fillOpacity={0.34}
          />
          <rect
            x={left + column * 26 + 2}
            y={top + row * 24 + 27}
            width={6}
            height={3}
            rx={1.5}
            transform={`skewX(-18)`}
            fill="#ffffff"
            fillOpacity={0.6}
          />
        </g>
      )),
    )}
  </g>
);

const ControlPanel = ({ right, colors }: { right: number; colors: PrinterColors }) => {
  const left = right - PANEL_WIDTH;
  return (
    <g>
      <rect x={left} y={-262} width={PANEL_WIDTH} height={136} rx={22} fill={colors.trim} />
      <rect
        x={left + 1}
        y={-261}
        width={PANEL_WIDTH - 2}
        height={134}
        rx={21}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.55}
        strokeWidth={2}
      />
      <rect x={left + 24} y={-238} width={150} height={66} rx={10} fill={colors.display} />
      <rect
        x={left + 40}
        y={-222}
        width={70}
        height={7}
        rx={3.5}
        fill={colors.light}
        opacity={0.75}
      />
      <rect x={left + 40} y={-206} width={104} height={5} rx={2.5} fill="#ffffff" opacity={0.25} />
      <rect x={left + 40} y={-194} width={86} height={5} rx={2.5} fill="#ffffff" opacity={0.18} />
      {[0, 1].map((index) => (
        <g key={index}>
          <circle cx={left + 210 + index * 50} cy={-205} r={17} fill="#000000" fillOpacity={0.12} />
          <circle cx={left + 210 + index * 50} cy={-207} r={15} fill={colors.body} />
          <circle
            cx={left + 210 + index * 50}
            cy={-207}
            r={14}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.7}
            strokeWidth={1.5}
          />
        </g>
      ))}
      <circle cx={left + 210} cy={-152} r={9} fill={colors.light} opacity={0.35} />
      <circle cx={left + 210} cy={-152} r={5} fill={colors.light} />
    </g>
  );
};

export const PrinterBody = ({
  geometry,
  colors,
  uid,
}: {
  geometry: PrinterGeometry;
  colors: PrinterColors;
  uid: string;
}) => {
  const { bodyWidth, bodyDepth, front, slotWidth, slotTop, deck } = geometry;
  const half = bodyWidth / 2;
  const slotHalf = slotWidth / 2;
  const height = bodyDepth + front;
  return (
    <g>
      <defs>
        <mask
          id={`${uid}-slot-cut`}
          maskUnits="userSpaceOnUse"
          x={-half - 10}
          y={-bodyDepth - 10}
          width={bodyWidth + 20}
          height={height + 40}
        >
          <rect
            x={-half - 10}
            y={-bodyDepth - 10}
            width={bodyWidth + 20}
            height={height + 20}
            fill="#ffffff"
          />
          <rect
            x={-slotHalf}
            y={slotTop}
            width={slotWidth}
            height={front - slotTop + 20}
            rx={6}
            fill="#000000"
          />
        </mask>
        <filter id={`${uid}-body-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <linearGradient
          id={`${uid}-body-light`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={-900}
          x2="0"
          y2={front}
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id={`${uid}-face`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={deck}
          x2="0"
          y2={front}
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="0.06" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.94" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect
        x={-half + 24}
        y={-bodyDepth + 40}
        width={bodyWidth}
        height={height}
        rx={44}
        fill="#000000"
        opacity={0.3}
        filter={`url(#${uid}-body-shadow)`}
      />
      <g mask={`url(#${uid}-slot-cut)`}>
        <rect
          x={-half}
          y={-bodyDepth}
          width={bodyWidth}
          height={height}
          rx={44}
          fill={colors.body}
        />
        <rect
          x={-half}
          y={-bodyDepth}
          width={bodyWidth}
          height={height}
          rx={44}
          fill={`url(#${uid}-body-light)`}
        />
        <rect
          x={-half + 56}
          y={-bodyDepth + 60}
          width={bodyWidth - 112}
          height={bodyDepth - 400}
          rx={28}
          fill="#ffffff"
          fillOpacity={0.12}
          stroke="#000000"
          strokeOpacity={0.12}
          strokeWidth={3}
        />
        <line
          x1={-half + 84}
          y1={-338}
          x2={half - 84}
          y2={-338}
          stroke="#ffffff"
          strokeOpacity={0.6}
          strokeWidth={2}
        />
        <rect x={-150} y={-392} width={300} height={34} rx={17} fill="#000000" fillOpacity={0.1} />
        <rect x={-146} y={-366} width={292} height={6} rx={3} fill="#ffffff" fillOpacity={0.45} />
        <rect
          x={-half}
          y={deck}
          width={bodyWidth}
          height={front - deck}
          rx={0}
          fill={colors.trim}
        />
        <rect
          x={-half}
          y={deck}
          width={bodyWidth}
          height={front - deck}
          fill={`url(#${uid}-face)`}
        />
        <line
          x1={-half + 30}
          y1={deck}
          x2={half - 30}
          y2={deck}
          stroke="#ffffff"
          strokeOpacity={0.8}
          strokeWidth={2.5}
        />
        <rect
          x={-half}
          y={-bodyDepth}
          width={bodyWidth}
          height={height}
          rx={44}
          fill={`url(#${uid}-side)`}
        />
      </g>
      <rect
        x={-slotHalf - 2}
        y={slotTop - 2}
        width={slotWidth + 4}
        height={front - slotTop + 20}
        rx={8}
        fill="none"
        stroke="#000000"
        strokeOpacity={0.18}
        strokeWidth={3}
      />
      <Vents left={-half + 190} top={-268} />
      <ControlPanel right={half * 0.55} colors={colors} />
      {[-1, 1].map((side) => (
        <g key={side}>
          <line
            x1={side * (slotHalf + 22)}
            y1={deck + 22}
            x2={side * (slotHalf + 22)}
            y2={deck + 50}
            stroke="#000000"
            strokeOpacity={0.22}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={side * (slotHalf + 40)}
            y1={deck + 30}
            x2={side * (slotHalf + 40)}
            y2={deck + 50}
            stroke="#000000"
            strokeOpacity={0.16}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
};

export const SlotShade = ({ geometry, uid }: { geometry: PrinterGeometry; uid: string }) => {
  const { slotWidth, slotTop, front } = geometry;
  return (
    <g>
      <defs>
        <linearGradient
          id={`${uid}-slot-shade`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={slotTop}
          x2="0"
          y2={front + 52}
        >
          <stop offset="0" stopColor="#000000" stopOpacity="0.4" />
          <stop offset="0.3" stopColor="#000000" stopOpacity="0.16" />
          <stop offset="0.7" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={-slotWidth / 2}
        y={slotTop}
        width={slotWidth}
        height={front + 52 - slotTop}
        fill={`url(#${uid}-slot-shade)`}
      />
    </g>
  );
};
