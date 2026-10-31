import type { MailinfraSpiderDropProps } from '@/schemas';
import { settle, tween } from '../promo/timing';
import { BokehBackdrop, SkyGradient } from './bokeh';
import { Cobweb, FloorBeam, FloorSign, SignFaceGradient } from './floor-sign';
import { CheckBadge, TrayBack, TrayFaceGradient, TrayFront } from './inbox-tray';
import { Envelope, SPIDER_ANCHOR, SpiderBody, SpiderGradient } from './spider';
import {
  cameraY,
  envelopeScreenTop,
  holdsEnvelope,
  legCycle,
  restCamera,
  signCenterY,
  signSwing,
  spiderDropTimeline,
  spiderScreenY,
  spiderX,
} from './timeline';

export type WorldIds = {
  sky: string;
  bokeh: string;
  glow: string;
  tray: string;
  spider: string;
  sign: (index: number) => string;
};

export const worldIds = (prefix: string): WorldIds => ({
  sky: `${prefix}-sky`,
  bokeh: `${prefix}-bokeh`,
  glow: `${prefix}-glow`,
  tray: `${prefix}-tray`,
  spider: `${prefix}-spider`,
  sign: (index) => `${prefix}-sign-${index}`,
});

export const WorldDefs = ({ props, ids }: { props: MailinfraSpiderDropProps; ids: WorldIds }) => (
  <defs>
    <SkyGradient id={ids.sky} props={props} />
    <filter id={ids.bokeh} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={props.bokeh.blur} />
    </filter>
    <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={46} />
    </filter>
    <TrayFaceGradient id={ids.tray} color={props.inbox.color} />
    <SpiderGradient id={ids.spider} props={props} />
    {props.floors.map((floor, index) => (
      <SignFaceGradient key={`${index}:${floor.label}`} id={ids.sign(index)} color={floor.color} />
    ))}
  </defs>
);

export const motionSpread = (props: MailinfraSpiderDropProps, from: number, to: number): number =>
  Math.max(
    Math.abs(cameraY(props, to) - cameraY(props, from)),
    Math.abs(spiderScreenY(props, to) - spiderScreenY(props, from)),
    Math.abs(envelopeScreenTop(props, to) - envelopeScreenTop(props, from)),
  );

export const WorldSample = ({
  props,
  t,
  ids,
}: {
  props: MailinfraSpiderDropProps;
  t: number;
  ids: WorldIds;
}) => {
  const line = spiderDropTimeline(props);
  const camera = cameraY(props, t);
  const resting = restCamera(props);
  const trayTop = props.inbox.y + resting - camera;
  const trayBottom = trayTop + props.inbox.width * 0.44 + 16;
  const bodyY = spiderScreenY(props, t);
  const bodyX = spiderX(props, t);
  const envelopeTop = envelopeScreenTop(props, t);
  const releasedX = tween(
    t,
    [line.release, line.inserted],
    [spiderX(props, line.release), 540],
    settle,
  );
  const envelopeX = t < line.release ? bodyX : releasedX;
  const threadEnd = props.spider.show ? bodyY - SPIDER_ANCHOR * props.spider.size : bodyY;
  const threadX = props.spider.show || t < line.release ? bodyX : 540;
  return (
    <g>
      {props.look.showBackdrop ? (
        <BokehBackdrop props={props} t={t} camera={camera} skyId={ids.sky} blurId={ids.bokeh} />
      ) : null}
      <Cobweb
        x={0}
        y={-camera}
        radius={300}
        from={0}
        to={Math.PI / 2}
        color={props.silk.color}
        opacity={props.signs.cobwebs}
      />
      <Cobweb
        x={1080}
        y={-camera}
        radius={240}
        from={Math.PI / 2}
        to={Math.PI}
        color={props.silk.color}
        opacity={props.signs.cobwebs}
      />
      {props.floors.map((floor, index) => {
        const y = signCenterY(props, index) - camera;
        if (y < -900 || y > 2900) {
          return null;
        }
        const beamY = y - props.signs.height / 2 - props.signs.hang;
        return (
          <g key={`${index}:${floor.label}`}>
            <FloorBeam props={props} y={beamY} />
            <FloorSign
              props={props}
              floor={floor}
              index={index}
              y={y}
              angle={signSwing(props, index, t)}
              faceId={ids.sign(index)}
            />
          </g>
        );
      })}
      {trayTop < 2600 ? (
        <>
          <FloorBeam props={props} y={trayBottom + 22} />
          <TrayBack props={props} top={trayTop} glowId={ids.glow} />
        </>
      ) : null}
      {threadEnd > -60 ? (
        <path
          d={`M 540 -60 L ${threadX.toFixed(2)} ${threadEnd.toFixed(2)}`}
          stroke={props.silk.color}
          strokeWidth={props.silk.width}
          strokeLinecap="round"
          opacity={0.92}
        />
      ) : null}
      <Envelope props={props} x={envelopeX} top={envelopeTop} />
      {trayTop < 2600 ? (
        <>
          <TrayFront props={props} top={trayTop} faceId={ids.tray} />
          <CheckBadge
            props={props}
            top={trayTop}
            t={t}
            appearAt={line.landing + props.badge.delay}
          />
        </>
      ) : null}
      {props.spider.show && bodyY > -400 ? (
        <SpiderBody
          props={props}
          x={bodyX}
          y={bodyY}
          cycle={legCycle(props, t)}
          hold={holdsEnvelope(props, t)}
          gradientId={ids.spider}
        />
      ) : null}
    </g>
  );
};
