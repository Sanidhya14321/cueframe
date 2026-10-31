import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { hash } from './geometry';
import type { Vessel } from './rig';

type Props = MailinfraDeliverabilityChargeProps;

export interface Paint {
  glow: string;
  liquidTop: string;
  liquidBottom: string;
  burst: number;
}

const GAP = 7;

const roundedBox = (vessel: Vessel, radius: number, grow: number) => ({
  x: vessel.cx - vessel.width / 2 - grow,
  y: vessel.top - grow,
  width: vessel.width + grow * 2,
  height: vessel.height + grow * 2,
  rx: Math.max(0, radius + grow),
});

const wavePath = (
  left: number,
  right: number,
  surface: number,
  bottom: number,
  amplitude: number,
  clock: number,
  phase: number,
): string => {
  const points: string[] = [];
  for (let x = left - 12; x <= right + 12; x += 12) {
    const y =
      surface +
      amplitude * Math.sin(x * 0.019 + clock + phase) +
      amplitude * 0.4 * Math.sin(x * 0.043 - clock * 1.3 + phase * 2);
    points.push(`${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return `M${left - 12} ${bottom + 4} L${points.join(' L')} L${right + 12} ${bottom + 4} Z`;
};

const Bubbles = ({
  liquid,
  frame,
  left,
  width,
  bottom,
  height,
  surface,
}: {
  liquid: Props['liquid'];
  frame: number;
  left: number;
  width: number;
  bottom: number;
  height: number;
  surface: number;
}) => (
  <g>
    {Array.from({ length: liquid.bubbles }, (_, index) => {
      const speed = 1.4 + hash(index + 40) * 2.4;
      const travel = (frame * speed + hash(index + 80) * height) % height;
      const y = bottom - 8 - travel;
      const x =
        left + 18 + hash(index + 7) * (width - 36) + Math.sin(frame / 9 + index * 1.7) * 3.5;
      const radius = liquid.bubbleSize * (0.45 + hash(index + 120) * 0.75);
      const below = Math.min(1, Math.max(0, (y - surface - radius - 4) / 36));
      const fromFloor = Math.min(1, Math.max(0, travel / 30));
      const opacity = below * fromFloor;
      if (opacity <= 0) {
        return null;
      }
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={radius}
          fill={liquid.bubbleColor}
          fillOpacity={0.16 * opacity}
          stroke={liquid.bubbleColor}
          strokeOpacity={0.6 * opacity}
          strokeWidth={1.5}
        />
      );
    })}
  </g>
);

export const VesselBody = ({
  props,
  vessel,
  frame,
  level,
  paint,
  ids,
}: {
  props: Props;
  vessel: Vessel;
  frame: number;
  level: number;
  paint: Paint;
  ids: { clip: string; liquid: string };
}) => {
  const { inbox, liquid } = props;
  const inset = inbox.outline / 2 + GAP;
  const inner = roundedBox(vessel, inbox.radius, -inset);
  const innerBottom = inner.y + inner.height;
  const depth = level * inner.height;
  const surface = innerBottom - depth;
  const amplitude = Math.min(liquid.wave, depth * 0.45);
  const clock = (frame / 30) * Math.PI * 2 * liquid.waveSpeed * 0.5;
  const body = roundedBox(vessel, inbox.radius, 0);
  return (
    <g>
      <defs>
        <clipPath id={ids.clip}>
          <rect {...inner} />
        </clipPath>
        <linearGradient
          id={ids.liquid}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={inner.y}
          x2={0}
          y2={innerBottom}
        >
          <stop offset="0" stopColor={paint.liquidTop} />
          <stop offset="1" stopColor={paint.liquidBottom} />
        </linearGradient>
      </defs>
      <rect {...body} fill={inbox.fill} />
      <g clipPath={`url(#${ids.clip})`}>
        <path
          d={wavePath(
            inner.x,
            inner.x + inner.width,
            surface,
            innerBottom,
            amplitude * 0.8,
            -clock,
            2.1,
          )}
          fill={`url(#${ids.liquid})`}
          opacity={0.5}
        />
        <path
          d={wavePath(
            inner.x,
            inner.x + inner.width,
            surface + 3,
            innerBottom,
            amplitude,
            clock,
            0,
          )}
          fill={`url(#${ids.liquid})`}
        />
        <Bubbles
          liquid={liquid}
          frame={frame}
          left={inner.x}
          width={inner.width}
          bottom={innerBottom}
          height={inner.height}
          surface={surface + amplitude * 1.4 + 3}
        />
      </g>
    </g>
  );
};

export const VesselGlass = ({
  props,
  vessel,
  paint,
  pulses,
  glowFilters,
}: {
  props: Props;
  vessel: Vessel;
  paint: Paint;
  pulses: number[];
  glowFilters: { near: string; far: string };
}) => {
  const { inbox, charge, counter } = props;
  const body = roundedBox(vessel, inbox.radius, 0);
  const seal = inbox.sealSize / 2;
  const shoulder = body.y + Math.min(inbox.radius, body.height * 0.2);
  const counterTop = vessel.top + vessel.height * counter.position - counter.size * 0.55;
  const tipLimit = counterTop - (inbox.showSeal ? seal * 1.3 : 0) - 12;
  const tipY = Math.min(
    vessel.top + vessel.height * inbox.flapDepth,
    Math.max(tipLimit, shoulder + 12),
  );
  const flap = `M${body.x} ${shoulder} L${vessel.cx} ${tipY} L${body.x + body.width} ${shoulder}`;
  const strength = Math.min(1, charge.glow * (1 + paint.burst * 0.5));
  const outline = (width: number) => (
    <>
      <rect {...body} fill="none" stroke={paint.glow} strokeWidth={width} />
      {inbox.flapDepth > 0 ? (
        <path
          d={flap}
          fill="none"
          stroke={paint.glow}
          strokeWidth={width * 0.7}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}
    </>
  );
  return (
    <g>
      {charge.glow > 0 && charge.glowSize > 0 ? (
        <>
          <g filter={`url(#${glowFilters.far})`} opacity={strength * 0.7}>
            {outline(inbox.outline * 4)}
          </g>
          <g filter={`url(#${glowFilters.near})`} opacity={strength}>
            {outline(inbox.outline * 1.6)}
          </g>
        </>
      ) : null}
      {outline(inbox.outline)}
      {pulses.map((pulse, index) =>
        pulse > 0 && pulse < 1 ? (
          <rect
            key={index}
            {...roundedBox(vessel, inbox.radius, pulse * charge.pulseSize)}
            fill="none"
            stroke={paint.glow}
            strokeWidth={inbox.outline * (1 - pulse * 0.6)}
            opacity={(1 - pulse) * (index === 0 ? 0.9 : 0.55)}
          />
        ) : null,
      )}
      {inbox.showSeal ? (
        <g transform={`translate(${vessel.cx} ${tipY})`}>
          <circle
            r={seal * 1.3}
            fill={paint.glow}
            opacity={0.35 * strength}
            filter={`url(#${glowFilters.near})`}
          />
          <circle
            r={seal}
            fill={paint.glow}
            stroke={inbox.sealIcon}
            strokeWidth={Math.max(2, seal * 0.08)}
          />
          <rect
            x={-seal * 0.5}
            y={-seal * 0.34}
            width={seal}
            height={seal * 0.68}
            rx={seal * 0.1}
            fill="none"
            stroke={inbox.sealIcon}
            strokeWidth={Math.max(2, seal * 0.08)}
          />
          <path
            d={`M${-seal * 0.46} ${-seal * 0.26} L0 ${seal * 0.08} L${seal * 0.46} ${-seal * 0.26}`}
            fill="none"
            stroke={inbox.sealIcon}
            strokeWidth={Math.max(2, seal * 0.08)}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      ) : null}
    </g>
  );
};
