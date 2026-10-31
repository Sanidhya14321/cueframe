import { displayFont } from '../promo/fonts';

const RADIUS = 42;

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GAP = 0.13;

export const RingMark = ({
  letter,
  size,
  ink,
  ring,
}: {
  letter: string;
  size: number;
  ink: string;
  ring: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden="true"
    style={{ display: 'block', overflow: 'visible' }}
  >
    <circle
      cx="50"
      cy="50"
      r={RADIUS}
      fill="none"
      stroke={ring}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeDasharray={`${CIRCUMFERENCE * (1 - GAP)} ${CIRCUMFERENCE * GAP}`}
      transform={`rotate(${-45 + GAP * 180} 50 50)`}
    />
    <circle cx={50 + RADIUS * Math.SQRT1_2} cy={50 - RADIUS * Math.SQRT1_2} r="6.5" fill={ring} />
    <text
      x="50"
      y="51"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={displayFont}
      fontWeight={700}
      fontSize="54"
      letterSpacing="-1"
      fill={ink}
    >
      {letter}
    </text>
  </svg>
);
