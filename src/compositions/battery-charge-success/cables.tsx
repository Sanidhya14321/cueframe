import { useId } from 'react';
import type { BatteryChargeSuccessProps } from '@/schemas';
import { cablePoints, labelFont, pathData, pointAt } from './cable-path';
import {
  type BatteryBox,
  CABLE_IDS,
  type CableId,
  cablePose,
  PLUG,
  type Pose,
  usesMirroredLabel,
} from './choreography';
import { clamp01, mixHex, rgba, smoothstep } from './curves';

const SPARK_PERIOD = 900;

type CablesProps = {
  props: BatteryChargeSuccessProps;
  frame: number;
  duration: number;
  box: BatteryBox;
  phase: number;
  height: number;
};

const sparkWindow = (frame: number, props: BatteryChargeSuccessProps) => {
  const start = props.timing.riseStart + 20;
  const end = props.timing.fullFrame;
  return clamp01((frame - start) / 12) * clamp01((end - frame) / 14);
};

const Plug = ({
  pose,
  props,
  band,
}: {
  pose: Pose;
  props: BatteryChargeSuccessProps;
  band: string;
}) => {
  const { look } = props;
  const half = PLUG.width / 2;
  const bodyStart = -PLUG.connector - PLUG.body;
  return (
    <g
      transform={`translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.angle.toFixed(3)})`}
    >
      <rect
        x={-PLUG.connector}
        y={-half + 3}
        width={PLUG.connector}
        height={PLUG.width - 6}
        rx={3}
        fill={look.interior}
        stroke={look.plug}
        strokeWidth={2.5}
      />
      <rect x={bodyStart - PLUG.neck} y={-4} width={PLUG.neck + 2} height={8} fill={look.cable} />
      <rect
        x={bodyStart}
        y={-half}
        width={PLUG.body}
        height={PLUG.width}
        rx={6}
        fill={look.plug}
        stroke={look.plugEdge}
        strokeWidth={1.5}
      />
      <rect
        x={bodyStart + PLUG.body * 0.6}
        y={-half + 4}
        width={9}
        height={PLUG.width - 8}
        rx={2}
        fill={band}
      />
      <rect
        x={bodyStart + PLUG.body * 0.6 + 14}
        y={-half + 4}
        width={4}
        height={PLUG.width - 8}
        rx={2}
        fill={band}
        opacity={0.55}
      />
    </g>
  );
};

const Label = ({
  id,
  pose,
  props,
  dot,
}: {
  id: CableId;
  pose: Pose;
  props: BatteryChargeSuccessProps;
  dot: string;
}) => {
  const mirrored = usesMirroredLabel(id);
  const { labels, look } = props;
  const x = mirrored ? -PLUG.connector - PLUG.body - 8 : -PLUG.connector - 28;
  const y = mirrored ? -labels.offset : labels.offset;
  return (
    <g
      transform={`translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.angle.toFixed(3)})`}
    >
      <text
        transform={`translate(${x} ${y})${mirrored ? '' : ' rotate(180)'}`}
        textAnchor={mirrored ? 'end' : 'start'}
        dominantBaseline="central"
        fontFamily={labelFont}
        fontSize={labels.size}
        fontWeight={500}
        fill={look.ink}
      >
        <tspan fill={dot}>•</tspan>
        <tspan dx={labels.size * 0.3}>{props.cables[id].label}</tspan>
      </text>
    </g>
  );
};

export const Cables = ({ props, frame, duration, box, phase, height }: CablesProps) => {
  const { look, sparks, cableShape } = props;
  const window = sparkWindow(frame, props);
  const visible = CABLE_IDS.filter((id) => props.cables[id].show);
  const cables = visible.map((id, index) => {
    const pose = cablePose(id, frame, props, box, duration);
    const points = cablePoints(pose, frame, cableShape.wave, index * 2.1 + 0.4, {
      width: box.centerX * 2,
      height,
    });
    return { id, pose, points };
  });
  const plugGlow = look.plugGlow;
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${box.centerX * 2} ${height}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {visible.map((id) => (
          <radialGradient key={id} id={`spark-${id}-${uid}`}>
            <stop offset="0%" stopColor={mixHex(props.cables[id].spark, '#ffffff', 0.7)} />
            <stop offset="30%" stopColor={props.cables[id].spark} stopOpacity={0.95} />
            <stop offset="100%" stopColor={props.cables[id].spark} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      <g
        style={{
          filter: `drop-shadow(0 0 3px ${rgba(look.cable, 0.45 * plugGlow)})`,
        }}
      >
        {cables.map(({ id, points }) => (
          <path
            key={id}
            d={pathData(points)}
            fill="none"
            stroke={look.cable}
            strokeWidth={cableShape.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
      <g style={{ mixBlendMode: 'screen' }}>
        {window > 0
          ? cables.flatMap(({ id, points }) => {
              const total = points.at(-1)?.along ?? 0;
              return Array.from({ length: sparks.count }, (_, index) => {
                const travel =
                  ((frame - props.timing.riseStart) * sparks.speed +
                    (index * SPARK_PERIOD) / Math.max(1, sparks.count) +
                    CABLE_IDS.indexOf(id) * 173) %
                  SPARK_PERIOD;
                const along = total - travel;
                const point = along > 0 ? pointAt(points, along) : undefined;
                if (point === undefined) {
                  return null;
                }
                const alpha = window * smoothstep(0, 90, along);
                const degrees = (point.angle * 180) / Math.PI;
                return (
                  <g
                    key={`${id}-${index}`}
                    opacity={alpha}
                    transform={`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${degrees.toFixed(2)})`}
                  >
                    <ellipse
                      rx={sparks.size * 1.9}
                      ry={sparks.size * 1.1}
                      fill={`url(#spark-${id}-${uid})`}
                      opacity={0.55}
                    />
                    <ellipse
                      rx={sparks.size * 0.9}
                      ry={sparks.size * 0.42}
                      fill={`url(#spark-${id}-${uid})`}
                    />
                  </g>
                );
              });
            })
          : null}
      </g>
      <g
        style={{
          filter: `drop-shadow(0 0 5px ${rgba('#ffffff', 0.85 * plugGlow)}) drop-shadow(0 0 16px ${rgba('#ffffff', 0.35 * plugGlow)})`,
        }}
      >
        {cables.map(({ id, pose }) => (
          <Plug
            key={id}
            pose={pose}
            props={props}
            band={mixHex(props.charge.empty, props.cables[id].spark, phase)}
          />
        ))}
      </g>
      <g
        style={{
          filter: `drop-shadow(0 0 6px ${rgba('#ffffff', 0.5 * look.labelGlow)})`,
        }}
      >
        {cables.map(({ id, pose }) => (
          <Label
            key={id}
            id={id}
            pose={pose}
            props={props}
            dot={mixHex(props.charge.empty, props.cables[id].spark, phase)}
          />
        ))}
      </g>
    </svg>
  );
};
