import type { ReactNode } from 'react';
import { AbsoluteFill, Composition, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type MailinfraThreadFeaturesProps,
  mailinfraThreadFeaturesDefaults,
  mailinfraThreadFeaturesMeta,
  mailinfraThreadFeaturesSchema,
} from '@/schemas';
import { Bokeh } from '../../mailinfra-thread-features/bokeh';
import { withAlpha } from '../../mailinfra-thread-features/color';
import { EndCard } from '../../mailinfra-thread-features/end-card';
import { Opening } from '../../mailinfra-thread-features/opening';
import { buildSchedule, cameraY, stopTop } from '../../mailinfra-thread-features/schedule';
import { Smear } from '../../mailinfra-thread-features/smear';
import { Thread } from '../../mailinfra-thread-features/thread';
import { TitleStop } from '../../mailinfra-thread-features/title-stop';
import { tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const MARGIN = 760;

const VIGNETTE_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

const vignette = (color: string, strength: number): string => {
  const edge = (share: number) => strength * (1 - share) * (1 - share);
  const top = VIGNETTE_STOPS.map(
    (share) => `${withAlpha(color, edge(share))} ${(share * 20).toFixed(1)}%`,
  );
  const bottom = [...VIGNETTE_STOPS]
    .reverse()
    .map((share) => `${withAlpha(color, edge(share))} ${(100 - share * 22).toFixed(1)}%`);
  return `linear-gradient(180deg, ${[...top, ...bottom].join(', ')})`;
};

const Layer = ({ offset, children }: { offset: number; children: ReactNode }) => (
  <AbsoluteFill style={{ transform: `translateY(${offset}px)` }}>{children}</AbsoluteFill>
);

const MailinfraThreadFeatures = (props: MailinfraThreadFeaturesProps) => {
  const { opening, titles, titleStyle, web, camera, endCard, colors, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const schedule = buildSchedule(props, durationInFrames * motion.speed);
  const view = cameraY(frame, schedule);
  const velocity = view - cameraY(frame - motion.speed, schedule);
  const near = (top: number) => top - view > -height - MARGIN && top - view < height + MARGIN;
  const tip = tween(frame, [0, opening.dropFrames], [-40, height + 320], Easing.linear);
  const threadBottom = frame < opening.dropFrames ? tip : schedule.endTop + endCard.webY;
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${look.background} 0%, ${look.backgroundEdge} 100%)`,
            }}
          />
          <Bokeh
            look={look}
            titles={titles}
            schedule={schedule}
            camera={view}
            parallax={camera.parallax}
            width={width}
            height={height}
            frame={frame}
            blur={Math.abs(velocity) * camera.parallax * camera.blur * 0.08}
          />
        </>
      ) : null}
      <Smear velocity={velocity} shutter={camera.blur}>
        <Thread
          top={-MARGIN - view}
          bottom={threadBottom - view}
          height={height}
          frame={frame}
          tip={frame < opening.dropFrames}
          since={opening.dropFrames}
          web={web}
        />
        {near(0) ? (
          <Layer offset={-view}>
            <Opening
              opening={opening}
              web={web}
              colors={colors}
              frame={frame}
              speed={motion.speed}
              width={width}
            />
          </Layer>
        ) : null}
        {titles.map((item, index) => {
          const top = stopTop(schedule, index);
          const window = schedule.stops[index];
          return window !== undefined && near(top) ? (
            <Layer key={`${index}-${item.top}`} offset={top - view}>
              <TitleStop
                item={item}
                index={index}
                window={window}
                frame={frame}
                style={titleStyle}
                web={web}
                colors={colors}
              />
            </Layer>
          ) : null;
        })}
        {near(schedule.endTop) ? (
          <Layer offset={schedule.endTop - view}>
            <EndCard
              card={endCard}
              web={web}
              colors={colors}
              frame={frame}
              land={schedule.land}
              dive={camera.diveFrames}
              speed={motion.speed}
              width={width}
            />
          </Layer>
        ) : null}
      </Smear>
      {look.showBackdrop && look.vignette > 0 ? (
        <AbsoluteFill style={{ background: vignette(look.backgroundEdge, look.vignette) }} />
      ) : null}
    </TransitionFrame>
  );
};

export const mailinfraThreadFeaturesScene: SceneModule = {
  id: 'mailinfra-thread-features',
  component: MailinfraThreadFeatures,
  render: (key) => (
    <Composition
      key={key}
      id="mailinfra-thread-features"
      component={MailinfraThreadFeatures}
      schema={mailinfraThreadFeaturesSchema}
      defaultProps={mailinfraThreadFeaturesDefaults}
      durationInFrames={mailinfraThreadFeaturesMeta.durationInFrames}
      fps={mailinfraThreadFeaturesMeta.fps}
      width={mailinfraThreadFeaturesMeta.width}
      height={mailinfraThreadFeaturesMeta.height}
    />
  ),
};
