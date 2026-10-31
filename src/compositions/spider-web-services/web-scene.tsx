import { useId } from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import type { SpiderWebServicesProps } from '@/schemas';
import { pixelTween, settle, tween } from '../promo/timing';
import { EndCard } from './end-card';
import { GloveHand } from './glove-hand';
import { IntroHeader } from './intro-header';
import { OrbWeb } from './orb-web';
import { type BeatLayer, ServiceBeat } from './service-beat';
import { SilkThread } from './silk-thread';
import { Spider } from './spider';
import {
  cameraBlur,
  cameraY,
  panFramesAt,
  panProgress,
  panStart,
  serviceAnchor,
  type WebTimeline,
  webTimeline,
} from './timeline';
import { WebBackdrop } from './web-backdrop';

const HAND_REST = 60;

const PALM = 40;

const SCREEN_BOTTOM = 2020;

const drop = Easing.bezier(0.35, 0.12, 0.65, 1);

const threadTip = (props: SpiderWebServicesProps, timeline: WebTimeline, frame: number) => {
  const { timing } = props;
  const descent = tween(
    frame,
    [timing.threadStart, timing.threadStart + timing.threadFrames],
    [0, 1],
    drop,
  );
  const top = HAND_REST + PALM;
  if (descent < 1) {
    return { tip: top + (SCREEN_BOTTOM - top) * descent, descent };
  }
  const camera = cameraY(timeline, frame);
  return { tip: Math.min(timeline.webWorldY, camera + SCREEN_BOTTOM), descent };
};

const Beats = ({
  layer,
  props,
  timeline,
  frame,
  camera,
}: {
  layer: BeatLayer;
  props: SpiderWebServicesProps;
  timeline: WebTimeline;
  frame: number;
  camera: number;
}) => (
  <>
    {props.services.map((service, index) => (
      <ServiceBeat
        key={`${service.seed}-${service.lines}`}
        layer={layer}
        service={service}
        props={props}
        x={props.thread.x}
        y={props.title.y + serviceAnchor(timeline, index) - camera}
        frame={frame}
        enter={panProgress(timeline, frame, index)}
        departure={panProgress(timeline, frame, index + 1)}
        arrival={panStart(timeline, index) + timeline.panFrames * 0.55}
        leave={panStart(timeline, index + 1)}
      />
    ))}
  </>
);

export const WebScene = ({ props, frame }: { props: SpiderWebServicesProps; frame: number }) => {
  const id = useId().replaceAll(':', '');
  const { timing, thread, look } = props;
  const timeline = webTimeline(props);
  const camera = cameraY(timeline, frame);
  const blur = cameraBlur(timeline, frame, timing.motionBlur);
  const handDrop = pixelTween(frame, [0, timing.handFrames], [-620, 0], settle);
  const recoil =
    tween(frame, [timing.threadStart, timing.threadStart + 4], [0, -12]) +
    tween(frame, [timing.threadStart + 4, timing.threadStart + 18], [0, 12], settle);
  const handY = HAND_REST + handDrop + Math.round(recoil) - camera;
  const { tip, descent } = threadTip(props, timeline, frame);
  const previousTip = threadTip(props, timeline, frame - 1).tip;
  const tipBlur = descent > 0 && descent < 1 ? Math.abs(tip - previousTip) * timing.motionBlur : 0;
  const lastPan = panStart(timeline, props.services.length);
  const settled = lastPan + panFramesAt(timeline, props.services.length) * 0.7;
  const webProgress = tween(frame, [settled - timing.webDrawFrames, settled], [0, 1]);
  const cardTop = timeline.cardAnchor - camera;
  const webY = timeline.webWorldY - camera;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {look.showBackdrop ? (
        <WebBackdrop
          backdrop={props.backdrop}
          camera={camera}
          blur={blur}
          beats={props.services.length}
          distance={timeline.distance}
          floorY={webY}
          frame={frame}
        />
      ) : null}
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={`${id}-pan`} x="0" y="-5%" width="100%" height="110%">
          <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
        </filter>
        <filter id={`${id}-tip`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={`0 ${tipBlur.toFixed(2)}`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: blur > 0.05 ? `url(#${id}-pan)` : undefined }}>
        <Beats layer="back" props={props} timeline={timeline} frame={frame} camera={camera} />
        <OrbWeb
          x={thread.x}
          y={webY}
          width={props.card.webWidth}
          tilt={props.card.webTilt}
          color={props.card.web}
          dewColor={props.card.dew}
          progress={webProgress}
          frame={frame}
        />
        <EndCard props={props} top={cardTop} frame={frame} settled={settled} />
        {props.spider.show && descent > 0 && frame < panStart(timeline, 0) + timeline.panFrames ? (
          <svg
            width={1080}
            height={1920}
            style={{ position: 'absolute', inset: 0 }}
            aria-hidden="true"
          >
            <g filter={tipBlur > 0.05 ? `url(#${id}-tip)` : undefined}>
              <Spider
                x={thread.x}
                y={tip - camera + 30}
                heading={180}
                gait={frame * 0.9}
                scale={1.2 * props.spider.size}
                body={props.services[0]?.spiderBody ?? '#b4572e'}
                marks={props.services[0]?.spiderMarks ?? '#3d1606'}
              />
            </g>
          </svg>
        ) : null}
        {handY > -1400 ? (
          <GloveHand
            intro={props.intro}
            x={thread.x}
            y={handY}
            sway={Math.sin(frame / 16) * 1.6}
            bob={Math.sin(frame / 13) * 6}
          />
        ) : null}
        <SilkThread
          thread={thread}
          top={handY + PALM}
          bottom={descent > 0 ? tip - camera : handY + PALM}
        />
        <Beats layer="front" props={props} timeline={timeline} frame={frame} camera={camera} />
        <IntroHeader props={props} top={props.intro.y - camera} frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
