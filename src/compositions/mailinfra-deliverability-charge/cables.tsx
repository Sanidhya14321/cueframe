import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { add, pathOf } from './geometry';
import { type CableRig, PLUG, type Spark } from './rig';

type Props = MailinfraDeliverabilityChargeProps;

const degrees = (rig: CableRig): number =>
  (Math.atan2(rig.heading.y, rig.heading.x) * 180) / Math.PI;

export const Wires = ({ rigs, cables }: { rigs: CableRig[]; cables: Props['cables'] }) => (
  <g fill="none" stroke={cables.wire} strokeWidth={cables.width} strokeLinecap="round">
    {rigs.map((rig) => (
      <path key={rig.key} d={pathOf(rig.cable)} />
    ))}
  </g>
);

const Plug = ({ rig, cables, glow }: { rig: CableRig; cables: Props['cables']; glow: string }) => {
  const { body, pin, thick } = PLUG;
  const ringX = -body * 0.42;
  const ringWidth = thick * 0.38;
  return (
    <g
      transform={`translate(${rig.head.x.toFixed(2)} ${rig.head.y.toFixed(2)}) rotate(${degrees(rig).toFixed(3)}) scale(${cables.plugSize})`}
    >
      <rect
        x={-body - 14}
        y={-thick * 0.27}
        width={20}
        height={thick * 0.54}
        rx={thick * 0.18}
        fill={cables.plug}
        stroke={cables.plugEdge}
        strokeWidth={1.5}
      />
      <rect x={0} y={-thick * 0.22} width={pin} height={thick * 0.44} rx={2} fill={cables.pin} />
      <rect
        x={-body}
        y={-thick / 2}
        width={body}
        height={thick}
        rx={thick * 0.32}
        fill={cables.plug}
        stroke={cables.plugEdge}
        strokeWidth={1.5}
      />
      <rect
        x={ringX - ringWidth * 0.6}
        y={-thick / 2 - 3}
        width={ringWidth * 2.2}
        height={thick + 6}
        rx={4}
        fill={cables.ring}
        opacity={0.35}
        filter={`url(#${glow})`}
      />
      <rect
        x={ringX}
        y={-thick / 2 - 1}
        width={ringWidth}
        height={thick + 2}
        rx={2.5}
        fill={cables.ring}
      />
    </g>
  );
};

const SocketFlash = ({ rig, color, glow }: { rig: CableRig; color: string; glow: string }) =>
  rig.click > 0 ? (
    <circle
      cx={rig.head.x}
      cy={rig.head.y}
      r={26}
      fill={color}
      opacity={rig.click * 0.85}
      filter={`url(#${glow})`}
    />
  ) : null;

export const Plugs = ({
  rigs,
  cables,
  glow,
}: {
  rigs: CableRig[];
  cables: Props['cables'];
  glow: string;
}) => (
  <g>
    {rigs.map((rig) => (
      <g key={rig.key}>
        <SocketFlash rig={rig} color={cables.ring} glow={glow} />
        <Plug rig={rig} cables={cables} glow={glow} />
      </g>
    ))}
  </g>
);

const Envelope = ({ size, color, ink }: { size: number; color: string; ink: string }) => (
  <>
    <rect
      x={-size / 2}
      y={-size * 0.34}
      width={size}
      height={size * 0.68}
      rx={size * 0.1}
      fill={color}
    />
    <path
      d={`M${-size * 0.44} ${-size * 0.26} L0 ${size * 0.08} L${size * 0.44} ${-size * 0.26}`}
      fill="none"
      stroke={ink}
      strokeWidth={Math.max(1.2, size * 0.09)}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </>
);

const SparkMark = ({
  spark,
  sparks,
  ink,
  glow,
}: {
  spark: Spark;
  sparks: Props['sparks'];
  ink: string;
  glow: string;
}) => {
  const trail = add(spark.at, spark.heading, -sparks.size * 1.2);
  return (
    <g opacity={spark.opacity}>
      {sparks.glow > 0 ? (
        <g filter={`url(#${glow})`} opacity={sparks.glow}>
          <circle cx={spark.at.x} cy={spark.at.y} r={sparks.size * 0.9} fill={sparks.color} />
          <circle cx={trail.x} cy={trail.y} r={sparks.size * 0.55} fill={sparks.color} />
        </g>
      ) : null}
      <g transform={`translate(${spark.at.x.toFixed(2)} ${spark.at.y.toFixed(2)})`}>
        {sparks.shape === 'envelope' ? (
          <Envelope size={sparks.size} color={sparks.color} ink={ink} />
        ) : (
          <circle r={sparks.size * 0.36} fill={sparks.color} />
        )}
      </g>
    </g>
  );
};

export const Sparks = ({
  rigs,
  sparks,
  ink,
  glow,
}: {
  rigs: CableRig[];
  sparks: Props['sparks'];
  ink: string;
  glow: string;
}) => (
  <g>
    {rigs.flatMap((rig) =>
      rig.sparks.map((spark, index) => (
        <SparkMark
          key={`${rig.key}:${index}`}
          spark={spark}
          sparks={sparks}
          ink={ink}
          glow={glow}
        />
      )),
    )}
  </g>
);
