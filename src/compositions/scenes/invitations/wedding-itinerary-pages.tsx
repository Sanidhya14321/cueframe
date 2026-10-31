import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type WeddingItineraryPagesProps,
  weddingItineraryPagesDefaults,
  weddingItineraryPagesMeta,
  weddingItineraryPagesSchema,
} from '@/schemas';
import { resolveArt } from '../../invitations/wedding-itinerary-pages/art';
import { Scenery } from '../../invitations/wedding-itinerary-pages/scenery';
import { TextPageView } from '../../invitations/wedding-itinerary-pages/text-page';
import { eraseStart, schedule } from '../../invitations/wedding-itinerary-pages/timeline';
import { Wreath, wreathHeight } from '../../invitations/wedding-itinerary-pages/wreath';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const WeddingItineraryPages = (props: WeddingItineraryPagesProps) => {
  const { timing, motion, wreath } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { scenes, texts } = schedule(props);
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill>
        {scenes.map((page, index) => {
          const next = scenes[index + 1];
          const visible =
            frame >= page.start - 1 &&
            (next === undefined || frame <= next.start + timing.fadeFrames + 1);
          if (!visible) {
            return null;
          }
          const opacity =
            index === 0
              ? 1
              : tween(frame, [page.start, page.start + timing.fadeFrames], [0, 1], smooth);
          return (
            <Scenery
              key={page.key}
              page={page}
              index={index}
              props={props}
              frame={frame}
              opacity={opacity}
            />
          );
        })}
      </AbsoluteFill>
      {texts.map((page) => {
        if (frame < page.start - 2 || frame > page.end + 2) {
          return null;
        }
        const header = page.cover
          ? {
              height: wreathHeight(wreath.radius),
              render: (top: number) => (
                <Wreath
                  art={resolveArt(props, page.look, 'wreath', frame)}
                  props={props}
                  top={top}
                  frame={frame}
                  start={page.start + 2}
                  exit={eraseStart(page, timing)}
                />
              ),
            }
          : undefined;
        return (
          <AbsoluteFill key={page.key}>
            <TextPageView page={page} props={props} frame={frame} header={header} />
          </AbsoluteFill>
        );
      })}
    </TransitionFrame>
  );
};

export const weddingItineraryPagesScene: SceneModule = {
  id: 'wedding-itinerary-pages',
  component: WeddingItineraryPages,
  render: (key) => (
    <Composition
      key={key}
      id="wedding-itinerary-pages"
      component={WeddingItineraryPages}
      schema={weddingItineraryPagesSchema}
      defaultProps={weddingItineraryPagesDefaults}
      durationInFrames={weddingItineraryPagesMeta.durationInFrames}
      fps={weddingItineraryPagesMeta.fps}
      width={weddingItineraryPagesMeta.width}
      height={weddingItineraryPagesMeta.height}
    />
  ),
};
