import type { MailinfraInboxWebProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import { linePath, type Point, type WebGeometry } from './geometry';
import { Envelopes, JunctionNodes } from './inboxes';
import { Spider, spiderTail } from './spider';
import { type Camera, gaitPhase, type Phases, spiderAt, spiderHeading } from './timeline';
import { DewGlints, WebSilk } from './web-silk';

const SKY = -6000;

const GlowGradient = ({ id, color }: { id: string; color: string }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity={0.85} />
    <stop offset="0.35" stopColor={color} stopOpacity={0.35} />
    <stop offset="1" stopColor={color} stopOpacity={0} />
  </radialGradient>
);

export const World = ({
  frame,
  width,
  height,
  web,
  phases,
  camera,
  pendulum,
  props,
  idPrefix,
}: {
  frame: number;
  width: number;
  height: number;
  web: WebGeometry;
  phases: Phases;
  camera: Camera;
  pendulum: { angle: number; opacity: number };
  props: MailinfraInboxWebProps;
  idPrefix: string;
}) => {
  const { scale } = camera;
  const viewWidth = width / scale;
  const viewHeight = height / scale;
  const left = camera.x - viewWidth / 2;
  const top = camera.y - viewHeight / 2;
  const strokeWidth = props.web.silkWidth / scale ** 0.6;
  const spider = spiderAt(frame, web, phases, props);
  const heading = spiderHeading(frame, phases);
  const tail = spiderTail(spider, heading, props.spider.size);
  const dragline: Point = frame < phases.runOut[0] || spider.y < 0 ? tail : { x: 0, y: 0 };
  const previous = spiderAt(frame - 1, web, phases, props);
  const fall =
    frame <= phases.settle
      ? Math.min(12, Math.abs(spider.y - previous.y) * scale * 0.12 * props.camera.motionBlur) /
        scale
      : 0;
  const dim = props.camera.endDim * tween(frame, phases.zoom, [0, 1], smooth);
  const depthBlur = (props.camera.endDim * 5 * tween(frame, phases.zoom, [0, 1], smooth)) / scale;
  const sway = (props.camera.drift * 9 * tween(frame, phases.zoom, [0, 1], smooth)) / scale;
  const motionX = camera.blur / scale;
  const motionY = (camera.blur + camera.blurY) / scale;
  const blurred = motionY > 0.05;
  const threadLength = props.wordmark.threadLength / props.camera.endZoom;
  const angle = (pendulum.angle * Math.PI) / 180;
  const threadEnd: Point = {
    x: -Math.sin(angle) * threadLength,
    y: Math.cos(angle) * threadLength,
  };
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${left.toFixed(3)} ${top.toFixed(3)} ${viewWidth.toFixed(3)} ${viewHeight.toFixed(3)}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <GlowGradient id={`${idPrefix}-node`} color={props.inboxes.nodeColor} />
        <GlowGradient id={`${idPrefix}-junction`} color={props.inboxes.junctionColor} />
        <filter
          id={`${idPrefix}-motion`}
          filterUnits="userSpaceOnUse"
          x={left - viewWidth}
          y={top - viewHeight}
          width={viewWidth * 3}
          height={viewHeight * 3}
        >
          <feGaussianBlur stdDeviation={`${motionX.toFixed(3)} ${motionY.toFixed(3)}`} />
        </filter>
        <filter
          id={`${idPrefix}-depth`}
          filterUnits="userSpaceOnUse"
          x={left - viewWidth}
          y={top - viewHeight}
          width={viewWidth * 3}
          height={viewHeight * 3}
        >
          <feGaussianBlur stdDeviation={depthBlur.toFixed(3)} />
        </filter>
        <filter
          id={`${idPrefix}-fall`}
          filterUnits="userSpaceOnUse"
          x={left - viewWidth}
          y={top - viewHeight}
          width={viewWidth * 3}
          height={viewHeight * 3}
        >
          <feGaussianBlur stdDeviation={`0 ${fall.toFixed(3)}`} />
        </filter>
      </defs>
      <g filter={blurred ? `url(#${idPrefix}-motion)` : undefined}>
        <g
          opacity={1 - dim}
          filter={depthBlur > 0.05 ? `url(#${idPrefix}-depth)` : undefined}
          transform={`translate(${(Math.sin(frame / 26) * sway).toFixed(3)} ${(Math.cos(frame / 33) * sway * 0.7).toFixed(3)})`}
        >
          <WebSilk
            frame={frame}
            web={web}
            phases={phases}
            props={props}
            strokeWidth={strokeWidth}
            spiderY={
              frame < phases.runOut[0] ? 0 : frame <= phases.runOut[1] ? spider.y : web.frameStart.y
            }
          />
          <JunctionNodes
            frame={frame}
            web={web}
            phases={phases}
            props={props}
            gradientId={idPrefix}
          />
          <DewGlints
            frame={frame}
            web={web}
            phases={phases}
            props={props}
            radius={strokeWidth * 1.4}
          />
          <Envelopes frame={frame} web={web} phases={phases} props={props} gradientId={idPrefix} />
        </g>
        {props.spider.show ? (
          <path
            d={linePath({ x: 0, y: SKY }, dragline)}
            fill="none"
            stroke={props.web.silkColor}
            strokeWidth={strokeWidth * 1.1}
            opacity={0.9}
          />
        ) : null}
        {pendulum.opacity > 0.01 ? (
          <path
            d={linePath({ x: 0, y: 0 }, threadEnd)}
            fill="none"
            stroke={props.web.silkColor}
            strokeWidth={strokeWidth * 1.1}
            opacity={0.9 * pendulum.opacity}
          />
        ) : null}
        {props.spider.show ? (
          <g filter={fall > 0.05 ? `url(#${idPrefix}-fall)` : undefined}>
            <Spider
              at={spider}
              heading={heading}
              gait={frame > phases.drop ? gaitPhase(frame, web, phases, props) : 0}
              size={props.spider.size}
              color={props.spider.color}
              markColor={props.spider.markColor}
              rimColor={props.web.silkColor}
            />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
