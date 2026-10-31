import type { MailinfraDewStepsProps } from '@/schemas';
import { settle, smooth, tween } from '../promo/timing';
import { DewDrop } from './dew-drop';
import { BeadRow, OrbWeb, Strand } from './silk';
import { Spider } from './spider';
import {
  type Camera,
  type DewPlan,
  type DewStop,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  glintAt,
  strandY,
  swingAt,
} from './timeline';

const SPIDER_START = -120;

const endGlint = (frame: number, plan: DewPlan, pull: number, index: number): number => {
  const first = plan.pullStart + pull * 0.55 + index * 9;
  const cycle = Math.max(36, plan.stops.length * 9 + 14);
  let glint = 0;
  for (let round = 0; round < 6; round++) {
    glint = Math.max(glint, glintAt(frame, first + round * cycle, 16));
  }
  return glint;
};

const webFade = (frame: number, plan: DewPlan, pull: number): number =>
  1 - tween(frame, [plan.pullStart, plan.pullStart + pull * 0.6], [0, 1], smooth);

const SideWeb = ({
  stop,
  frame,
  props,
  fade,
}: {
  stop: DewStop;
  frame: number;
  props: MailinfraDewStepsProps;
  fade: number;
}) => {
  const right = stop.side === 'right';
  const hubX = stop.cameraX - FRAME_WIDTH / 2 + (right ? 70 : FRAME_WIDTH - 70);
  const draw = tween(frame, [stop.arrive - 10, stop.arrive + 30], [0, 1], smooth);
  return (
    <OrbWeb
      hubX={hubX}
      hubY={30}
      radius={props.silk.webSize * 0.8}
      from={right ? 8 : 92}
      to={right ? 88 : 172}
      draw={draw}
      color={props.silk.color}
      opacity={props.silk.webOpacity * fade}
    />
  );
};

const StopDrops = ({
  stop,
  frame,
  props,
  plan,
  id,
}: {
  stop: DewStop;
  frame: number;
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  id: string;
}) => {
  const step = props.steps[stop.index];
  if (step === undefined) {
    return null;
  }
  const { drop, timing, motion } = props;
  const away = stop.side === 'right' ? -1 : 1;
  const idle = Math.sin(frame / 37 + stop.index * 1.7) * motion.float * 20;
  const angle = swingAt(frame, stop, drop.swing) + idle;
  const glint = Math.max(
    glintAt(frame, stop.arrive + 2, 18),
    endGlint(frame, plan, timing.pullBackFrames, stop.index),
  );
  const twinX = stop.dropX + away * drop.size * 1.95;
  const twinRadius = drop.size * 0.4;
  const twinAngle =
    swingAt(frame, stop, drop.swing * 1.4, 5) +
    Math.sin(frame / 31 + stop.index) * motion.float * 26;
  return (
    <g>
      {step.extra === 'side-web' ? (
        <SideWeb
          stop={stop}
          frame={frame}
          props={props}
          fade={webFade(frame, plan, timing.pullBackFrames)}
        />
      ) : null}
      {step.extra === 'dew-beads' ? (
        <BeadRow
          x={stop.dropX}
          direction={away}
          frame={frame}
          arrive={stop.arrive}
          props={props}
          plan={plan}
        />
      ) : null}
      {step.extra === 'twin-drop' ? (
        <DewDrop
          id={`${id}-twin`}
          x={twinX}
          y={strandY(twinX, frame, props, plan) - 1}
          radius={twinRadius}
          angle={twinAngle}
          wobble={0}
          glint={Math.max(
            glintAt(frame, stop.arrive + 14, 16),
            endGlint(frame, plan, timing.pullBackFrames, stop.index + 0.5),
          )}
          props={props}
        />
      ) : null}
      <DewDrop
        id={id}
        x={stop.dropX}
        y={strandY(stop.dropX, frame, props, plan) - 1}
        radius={drop.size}
        angle={angle}
        wobble={swingAt(frame, stop, drop.swing, 4)}
        glint={glint}
        props={props}
        look={{
          label: step.number,
          icon: step.icon,
          iconReveal: tween(frame, [stop.arrive, stop.arrive + 22], [0, 1], settle),
          sweep: tween(frame, [stop.arrive + 6, stop.arrive + 34], [0, 1], smooth),
        }}
      />
    </g>
  );
};

export const World = ({
  frame,
  camera,
  blur,
  props,
  plan,
  id,
}: {
  frame: number;
  camera: Camera;
  blur: number;
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  id: string;
}) => {
  const { intro, silk, spider, timing } = props;
  const walkEnd = Math.max(20, timing.introFrames - 10);
  const spiderX = tween(frame, [4, walkEnd], [SPIDER_START, spider.walkTo], smooth);
  const walking = Math.min(
    1,
    Math.abs(spiderX - tween(frame - 1, [4, walkEnd], [SPIDER_START, spider.walkTo], smooth)) / 3,
  );
  const stride = (spiderX - SPIDER_START) / (13 * spider.size);
  const webDraw = tween(frame, [4, Math.max(24, timing.introFrames - 8)], [0, 1], smooth);
  const transform = `translate(${FRAME_WIDTH / 2} ${FRAME_HEIGHT / 2}) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`;
  return (
    <svg
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={`${id}-whip`}
          filterUnits="userSpaceOnUse"
          x={-300}
          y={-300}
          width={FRAME_WIDTH + 600}
          height={FRAME_HEIGHT + 600}
        >
          <feGaussianBlur stdDeviation={`${blur.toFixed(2)} 0`} />
        </filter>
      </defs>
      <g filter={blur > 0.3 ? `url(#${id}-whip)` : undefined}>
        <g transform={transform}>
          {intro.showWeb ? (
            <OrbWeb
              hubX={-40}
              hubY={-30}
              radius={silk.webSize}
              from={6}
              to={92}
              draw={webDraw}
              color={silk.color}
              opacity={silk.webOpacity * webFade(frame, plan, timing.pullBackFrames)}
            />
          ) : null}
          <Strand frame={frame} props={props} plan={plan} clipId={`${id}-front`} />
          {plan.stops.map((stop) => (
            <StopDrops
              key={stop.index}
              stop={stop}
              frame={frame}
              props={props}
              plan={plan}
              id={`${id}-drop-${stop.index}`}
            />
          ))}
          {intro.showSpider ? (
            <Spider
              x={spiderX}
              y={strandY(spiderX, frame, props, plan) - silk.width / 2}
              stride={stride}
              walking={walking}
              spider={spider}
              id={`${id}-spider`}
            />
          ) : null}
        </g>
      </g>
    </svg>
  );
};
