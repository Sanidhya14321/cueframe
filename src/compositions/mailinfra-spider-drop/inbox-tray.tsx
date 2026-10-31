import type { MailinfraSpiderDropProps } from '@/schemas';
import { displayFont } from '../promo/fonts';
import { settle, smooth, tween } from '../promo/timing';
import { shade, tint } from './paint';

const trayBox = (props: MailinfraSpiderDropProps, top: number) => {
  const width = props.inbox.width;
  return { left: 540 - width / 2, width, top, height: width * 0.44, back: width * 0.13 };
};

export const TrayBack = ({
  props,
  top,
  glowId,
}: {
  props: MailinfraSpiderDropProps;
  top: number;
  glowId: string;
}) => {
  const { inbox } = props;
  const box = trayBox(props, top);
  const inset = box.width * 0.06;
  return (
    <g>
      {inbox.glow > 0 ? (
        <g filter={`url(#${glowId})`}>
          <rect
            x={box.left - box.width * 0.14}
            y={box.top - box.back - 70}
            width={box.width * 1.28}
            height={box.height + box.back + 150}
            rx={140}
            fill={inbox.color}
            opacity={inbox.glow * 0.42}
          />
          <rect
            x={box.left - box.width * 0.1}
            y={box.top + box.height - 10}
            width={box.width * 1.2}
            height={70}
            rx={35}
            fill={tint(inbox.color, 0.2)}
            opacity={inbox.glow * 0.7}
          />
        </g>
      ) : null}
      <path
        d={`M ${box.left + inset} ${box.top - box.back} L ${box.left + box.width - inset} ${box.top - box.back} L ${box.left + box.width} ${box.top} L ${box.left} ${box.top} Z`}
        fill={shade(inbox.color, 0.42)}
      />
      <path
        d={`M ${box.left + inset} ${box.top - box.back} L ${box.left + box.width - inset} ${box.top - box.back}`}
        stroke={tint(inbox.color, 0.3)}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  );
};

export const TrayFront = ({
  props,
  top,
  faceId,
}: {
  props: MailinfraSpiderDropProps;
  top: number;
  faceId: string;
}) => {
  const { inbox } = props;
  const box = trayBox(props, top);
  const icon = box.height * 0.26;
  const iconY = box.top + box.height * 0.34;
  const labelSize = box.height * 0.27;
  return (
    <g>
      <rect
        x={box.left}
        y={box.top + 16}
        width={box.width}
        height={box.height}
        rx={26}
        fill={shade(inbox.color, 0.5)}
      />
      <rect
        x={box.left}
        y={box.top}
        width={box.width}
        height={box.height}
        rx={26}
        fill={`url(#${faceId})`}
      />
      <rect
        x={box.left + 14}
        y={box.top + 1}
        width={box.width - 28}
        height={6}
        rx={3}
        fill={tint(inbox.color, 0.6)}
      />
      <path
        d={`M ${540 - icon} ${iconY - icon * 0.1} L ${540 - icon * 0.62} ${iconY - icon * 0.7} L ${540 + icon * 0.62} ${iconY - icon * 0.7} L ${540 + icon} ${iconY - icon * 0.1} L ${540 + icon} ${iconY + icon * 0.55} L ${540 - icon} ${iconY + icon * 0.55} Z M ${540 - icon} ${iconY - icon * 0.1} L ${540 - icon * 0.36} ${iconY - icon * 0.1} Q ${540 - icon * 0.3} ${iconY + icon * 0.2} ${540} ${iconY + icon * 0.2} Q ${540 + icon * 0.3} ${iconY + icon * 0.2} ${540 + icon * 0.36} ${iconY - icon * 0.1} L ${540 + icon} ${iconY - icon * 0.1}`}
        fill="none"
        stroke={inbox.labelColor}
        strokeWidth={icon * 0.13}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text
        x={540}
        y={box.top + box.height * 0.84}
        textAnchor="middle"
        fontFamily={displayFont}
        fontWeight={700}
        fontSize={labelSize}
        letterSpacing={`${-0.02 * labelSize}px`}
        fill={inbox.labelColor}
      >
        {inbox.label}
      </text>
    </g>
  );
};

export const TrayFaceGradient = ({ id, color }: { id: string; color: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={tint(color, 0.2)} />
    <stop offset="0.55" stopColor={color} />
    <stop offset="1" stopColor={shade(color, 0.22)} />
  </linearGradient>
);

export const CheckBadge = ({
  props,
  top,
  t,
  appearAt,
}: {
  props: MailinfraSpiderDropProps;
  top: number;
  t: number;
  appearAt: number;
}) => {
  const { badge } = props;
  if (!badge.show) {
    return null;
  }
  const grow = tween(t, [appearAt, appearAt + 26], [0, 1], settle);
  if (grow <= 0) {
    return null;
  }
  const draw = tween(t, [appearAt + 6, appearAt + 26], [0, 1], smooth);
  const box = trayBox(props, top);
  const radius = badge.size / 2;
  const cx = box.left + box.width - radius * 0.35;
  const cy = box.top - radius * 0.2;
  const scale = 0.72 + grow * 0.28;
  const tickLength = radius * 1.5;
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale.toFixed(4)})`}
      opacity={Math.min(1, grow * 1.6)}
    >
      <circle r={radius + radius * 0.14} fill={badge.ring} />
      <circle r={radius} fill={badge.color} />
      <path
        d={`M ${-radius * 0.42} ${radius * 0.02} L ${-radius * 0.12} ${radius * 0.32} L ${radius * 0.44} ${-radius * 0.3}`}
        fill="none"
        stroke={badge.tick}
        strokeWidth={radius * 0.2}
        strokeLinecap="butt"
        strokeLinejoin="round"
        strokeDasharray={`${(tickLength * draw).toFixed(2)} ${tickLength * 2}`}
        opacity={Math.min(1, (tickLength * draw) / (radius * 0.5))}
      />
    </g>
  );
};
