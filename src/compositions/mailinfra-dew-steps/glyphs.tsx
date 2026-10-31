import type { MailinfraDewStepsProps } from '@/schemas';

type StepIcon = MailinfraDewStepsProps['steps'][number]['icon'];

export const StepGlyph = ({
  icon,
  size,
  color,
}: {
  icon: StepIcon;
  size: number;
  color: string;
}) => {
  const unit = size / 24;
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const body = (() => {
    switch (icon) {
      case 'list':
        return (
          <g {...stroke}>
            <path d="M9 6.5 H20 M9 12 H20 M9 17.5 H17" />
            <circle cx="4.6" cy="6.5" r="1.3" fill={color} stroke="none" />
            <circle cx="4.6" cy="12" r="1.3" fill={color} stroke="none" />
            <circle cx="4.6" cy="17.5" r="1.3" fill={color} stroke="none" />
          </g>
        );
      case 'paper-plane':
        return (
          <g {...stroke}>
            <path d="M21 3.5 L2.8 10.6 L10 13.6 L21 3.5 L13.6 21 L10 13.6" />
          </g>
        );
      case 'check':
        return (
          <g {...stroke}>
            <circle cx="12" cy="12" r="9.2" />
            <path d="M7.6 12.3 L10.6 15.2 L16.6 8.9" />
          </g>
        );
      case 'envelope':
        return (
          <g {...stroke}>
            <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
            <path d="M3.6 6.6 L12 13 L20.4 6.6" />
          </g>
        );
      default:
        return null;
    }
  })();
  if (body === null) {
    return null;
  }
  return <g transform={`translate(${-size / 2} ${-size / 2}) scale(${unit})`}>{body}</g>;
};

export const EnvelopeMark = ({
  size,
  from,
  to,
  glyph,
  id,
}: {
  size: number;
  from: string;
  to: string;
  glyph: string;
  id: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="24" fill={`url(#${id})`} />
    <rect
      x="22"
      y="31"
      width="56"
      height="40"
      rx="7"
      fill="none"
      stroke={glyph}
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path
      d="M25 35 L50 54 L75 35"
      fill="none"
      stroke={glyph}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
