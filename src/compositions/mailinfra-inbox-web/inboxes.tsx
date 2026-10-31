import { Easing } from 'remotion';
import type { MailinfraInboxWebProps } from '@/schemas';
import { settle, smooth, tween } from '../promo/timing';
import type { EnvelopeTarget, Point, WebGeometry } from './geometry';
import type { Phases } from './timeline';

const flightEase = Easing.out(Easing.quad);

const envelopeAt = (
  target: EnvelopeTarget,
  frame: number,
  start: number,
  flight: number,
): Point => {
  const t = tween(frame, [start, start + flight], [0, 1], flightEase);
  return {
    x: target.origin.x + (target.x - target.origin.x) * t,
    y: target.origin.y + (target.y - target.origin.y) * t,
  };
};

const Envelope = ({
  target,
  index,
  frame,
  phases,
  props,
  gradientId,
}: {
  target: EnvelopeTarget;
  index: number;
  frame: number;
  phases: Phases;
  props: MailinfraInboxWebProps;
  gradientId: string;
}) => {
  const start = phases.envelopesAt + index * phases.stagger;
  if (frame <= start) {
    return null;
  }
  const { envelopes, inboxes } = props;
  const land = start + phases.flight;
  const at = envelopeAt(target, frame, start, phases.flight);
  const tail = envelopeAt(target, frame - 1 - 3 * envelopes.streak, start, phases.flight);
  const width = envelopes.size;
  const height = width * 0.68;
  const flying = 1 - tween(frame, [land - 4, land], [0, 1], smooth);
  const impact =
    frame > land ? Math.sin((frame - land) * 0.9) * Math.exp(-(frame - land) * 0.25) : 0;
  const spin = (1 - tween(frame, [start, land], [0, 1], flightEase)) * (index % 2 === 0 ? 30 : -30);
  const rotation = target.tilt + spin + impact * 6;
  const scale = 1 + impact * 0.06;
  const badge = tween(frame, [land + 2, land + 12], [0, 1], settle);
  const check = tween(frame, [land + 7, land + 17], [0, 1], smooth);
  const streakLength = Math.hypot(at.x - tail.x, at.y - tail.y);
  const badgeX = width * 0.46;
  const badgeY = -height * 0.5;
  const badgeRadius = inboxes.nodeSize * 0.62;
  return (
    <g>
      {envelopes.streak > 0 && streakLength > 2 && flying > 0.01 ? (
        <>
          <defs>
            <linearGradient
              id={`${gradientId}-${index}`}
              gradientUnits="userSpaceOnUse"
              x1={tail.x}
              y1={tail.y}
              x2={at.x}
              y2={at.y}
            >
              <stop offset="0" stopColor={envelopes.paperColor} stopOpacity={0} />
              <stop offset="1" stopColor={envelopes.paperColor} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <line
            x1={tail.x}
            y1={tail.y}
            x2={at.x}
            y2={at.y}
            stroke={`url(#${gradientId}-${index})`}
            strokeWidth={height * 0.5}
            strokeLinecap="butt"
            opacity={flying}
          />
        </>
      ) : null}
      <g
        transform={`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${rotation.toFixed(2)}) scale(${scale.toFixed(4)})`}
      >
        <rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={width * 0.07}
          fill={envelopes.paperColor}
          stroke={envelopes.lineColor}
          strokeWidth={width * 0.035}
        />
        <path
          d={`M ${-width / 2 + width * 0.05} ${-height / 2 + width * 0.04} L 0 ${height * 0.1} L ${width / 2 - width * 0.05} ${-height / 2 + width * 0.04}`}
          fill="none"
          stroke={envelopes.lineColor}
          strokeWidth={width * 0.035}
          strokeLinejoin="round"
        />
        {badge > 0.01 ? (
          <g transform={`translate(${badgeX} ${badgeY}) scale(${badge.toFixed(4)})`}>
            <circle
              r={badgeRadius * 2.4}
              fill={`url(#${gradientId}-node)`}
              opacity={inboxes.glow}
            />
            <circle r={badgeRadius} fill={inboxes.nodeColor} />
            {check > 0.01 ? (
              <path
                d={`M ${-badgeRadius * 0.45} ${badgeRadius * 0.02} L ${-badgeRadius * 0.12} ${badgeRadius * 0.34} L ${badgeRadius * 0.48} ${-badgeRadius * 0.32}`}
                pathLength={1}
                fill="none"
                stroke={inboxes.checkColor}
                strokeWidth={badgeRadius * 0.26 * (0.35 + 0.65 * Math.min(1, check * 2.5))}
                opacity={Math.min(1, check * 5)}
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeDasharray={check >= 1 ? undefined : `${check.toFixed(4)} 2`}
              />
            ) : null}
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const Envelopes = ({
  frame,
  web,
  phases,
  props,
  gradientId,
}: {
  frame: number;
  web: WebGeometry;
  phases: Phases;
  props: MailinfraInboxWebProps;
  gradientId: string;
}) => (
  <g>
    {web.envelopes.map((target, index) => (
      <Envelope
        key={`envelope-${target.junction}`}
        target={target}
        index={index}
        frame={frame}
        phases={phases}
        props={props}
        gradientId={gradientId}
      />
    ))}
  </g>
);

export const JunctionNodes = ({
  frame,
  web,
  phases,
  props,
  gradientId,
}: {
  frame: number;
  web: WebGeometry;
  phases: Phases;
  props: MailinfraInboxWebProps;
  gradientId: string;
}) => {
  const [from, to] = phases.countRange;
  const steps = Math.max(1, web.spiral.length - 1);
  const { inboxes } = props;
  return (
    <g>
      {web.spiral.map((junction) => {
        const start = from + (junction.index / steps) * (to - from - 8);
        const lit = tween(frame, [start, start + 8], [0, 1], smooth);
        if (lit <= 0.01) {
          return null;
        }
        return (
          <g
            key={`junction-${junction.index}`}
            opacity={lit * (0.8 + 0.2 * Math.sin(frame / 13 + junction.index * 2.4))}
          >
            <circle
              cx={junction.x}
              cy={junction.y}
              r={inboxes.nodeSize * 0.9}
              fill={`url(#${gradientId}-junction)`}
              opacity={inboxes.glow}
            />
            <circle
              cx={junction.x}
              cy={junction.y}
              r={inboxes.nodeSize * 0.2}
              fill={inboxes.junctionColor}
            />
          </g>
        );
      })}
    </g>
  );
};

export const counterValue = (
  frame: number,
  phases: Phases,
  props: MailinfraInboxWebProps,
): number =>
  Math.round(
    props.counterFrom +
      (props.counterTarget - props.counterFrom) * tween(frame, phases.countRange, [0, 1], (t) => t),
  );
