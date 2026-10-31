import type { MailinfraInboxWebProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { linePath, loopFractionOf, type Point, sagPath, type WebGeometry } from './geometry';
import { framePassFrame, frameProgress, type Phases, spiralProgress } from './timeline';

const Strand = ({
  d,
  progress,
  color,
  width,
  opacity = 1,
}: {
  d: string;
  progress: number;
  color: string;
  width: number;
  opacity?: number;
}) =>
  progress <= 0.002 ? null : (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="butt"
      strokeLinejoin="round"
      strokeDasharray={progress >= 1 ? undefined : `${progress.toFixed(4)} 2`}
      opacity={opacity}
    />
  );

const scalePoint = (point: Point, factor: number): Point => ({
  x: point.x * factor,
  y: point.y * factor,
});

const HUB_RINGS = [0.035, 0.065, 0.1];

export const WebSilk = ({
  frame,
  web,
  phases,
  props,
  strokeWidth,
  spiderY,
}: {
  frame: number;
  web: WebGeometry;
  phases: Phases;
  props: MailinfraInboxWebProps;
  strokeWidth: number;
  spiderY: number;
}) => {
  const color = props.web.silkColor;
  const halfDrawn = frameProgress(frame, phases) * 0.5;
  const spiralDrawn = spiralProgress(frame, phases);
  const passAt = (point: Point) => {
    const fraction = loopFractionOf(web.frameLoop, point);
    return framePassFrame(Math.min(fraction, 1 - fraction) * 2, phases);
  };
  const [radialsFrom, radialsTo] = phases.radials;
  const radialCount = Math.max(1, web.radialEnds.length - 1);
  const radialSpan = (radialsTo - radialsFrom) * 0.6;
  return (
    <g>
      {web.vertices.map((vertex, index) => {
        const start = passAt(vertex);
        return (
          <Strand
            key={`anchor-${index}`}
            d={linePath(vertex, scalePoint(vertex, 3.4))}
            progress={tween(frame, [start, start + 30], [0, 1], smooth)}
            color={color}
            width={strokeWidth * 1.2}
            opacity={0.8}
          />
        );
      })}
      <Strand
        d={sagPath(web.frameLoop, 0)}
        progress={halfDrawn}
        color={color}
        width={strokeWidth * 1.25}
        opacity={0.9}
      />
      <Strand
        d={sagPath([...web.frameLoop].reverse(), 0)}
        progress={halfDrawn}
        color={color}
        width={strokeWidth * 1.25}
        opacity={0.9}
      />
      {web.radialEnds.map((end, index) => {
        if (index === 0) {
          return (
            <Strand
              key="radial-0"
              d={linePath({ x: 0, y: 0 }, end)}
              progress={Math.min(1, Math.max(0, spiderY / end.y))}
              color={color}
              width={strokeWidth}
              opacity={0.85}
            />
          );
        }
        const start = radialsFrom + ((index - 1) / radialCount) * radialSpan;
        return (
          <Strand
            key={`radial-${index}`}
            d={linePath({ x: 0, y: 0 }, end)}
            progress={tween(
              frame,
              [start, start + (radialsTo - radialsFrom) * 0.4],
              [0, 1],
              smooth,
            )}
            color={color}
            width={strokeWidth}
            opacity={0.85}
          />
        );
      })}
      {HUB_RINGS.map((fraction, index) => {
        const start = radialsFrom + ((index + 1) / (HUB_RINGS.length + 1)) * radialSpan;
        const ring = [...web.radialEnds, web.radialEnds[0] ?? web.frameStart].map((end) =>
          scalePoint(end, fraction),
        );
        return (
          <Strand
            key={`hub-${index}`}
            d={sagPath(ring, 0)}
            progress={tween(frame, [start, radialsTo], [0, 1], smooth)}
            color={color}
            width={strokeWidth * 0.8}
            opacity={0.7}
          />
        );
      })}
      <Strand
        d={sagPath(web.spiral, 0.05)}
        progress={spiralDrawn}
        color={color}
        width={strokeWidth * 0.85}
        opacity={0.78}
      />
    </g>
  );
};

export const DewGlints = ({
  frame,
  web,
  phases,
  props,
  radius,
}: {
  frame: number;
  web: WebGeometry;
  phases: Phases;
  props: MailinfraInboxWebProps;
  radius: number;
}) => {
  const reached = spiralProgress(frame, phases) * (web.spiral.length - 1);
  return (
    <g>
      {web.dew.map((drop) => {
        const point = web.spiral[drop.index];
        const shown = Math.min(1, Math.max(0, (reached - drop.index) / 4));
        if (point === undefined || shown <= 0) {
          return null;
        }
        const shimmer = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 17 + drop.phase));
        return (
          <circle
            key={`dew-${drop.index}`}
            cx={point.x}
            cy={point.y}
            r={radius}
            fill={props.web.dewColor}
            opacity={shown * shimmer * 0.9}
          />
        );
      })}
    </g>
  );
};
