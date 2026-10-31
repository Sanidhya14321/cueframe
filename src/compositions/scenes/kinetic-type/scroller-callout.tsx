import { useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ScrollerCalloutProps,
  scrollerCalloutDefaults,
  scrollerCalloutMeta,
  scrollerCalloutSchema,
} from '@/schemas';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { CubeIntro } from '../../scroller-callout/cube-intro';
import { cubeStops } from '../../scroller-callout/cube-path';
import { ContactLine, DotCollapse } from '../../scroller-callout/dot-collapse';
import { EndCard } from '../../scroller-callout/end-card';
import { centeredLeft, layoutGlyphs, useCalloutFont } from '../../scroller-callout/glyphs';
import { PunchBeat, punchWords, ScrollBeat, StackBeat } from '../../scroller-callout/word-beats';

const useLayouts = (props: ScrollerCalloutProps, ready: boolean) => {
  const { intro, scroll, stack, punch, contact } = props;
  return useMemo(() => {
    if (!ready) {
      return null;
    }
    return {
      intro: layoutGlyphs({
        text: intro.word,
        size: intro.size,
        weight: intro.weight,
        tracking: intro.tracking,
      }),
      scroll: layoutGlyphs({
        text: scroll.word,
        size: scroll.size,
        weight: scroll.weight,
        tracking: scroll.tracking,
      }),
      stack: stack.lines.map((line) =>
        layoutGlyphs({
          text: line.text,
          size: line.size,
          weight: line.weight,
          tracking: stack.tracking,
        }),
      ),
      punch: punchWords(punch).map((word) =>
        layoutGlyphs({
          text: word,
          size: punch.size,
          weight: punch.weight,
          tracking: punch.tracking,
        }),
      ),
      contact: layoutGlyphs({
        text: contact.text,
        size: contact.size,
        weight: contact.weight,
        tracking: contact.tracking,
      }),
    };
  }, [ready, intro, scroll, stack, punch, contact]);
};

const ScrollerCallout = (props: ScrollerCalloutProps) => {
  const { palette, intro, scroll, stack, punch, collapse, contact, end, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const ready = useCalloutFont();
  const layouts = useLayouts(props, ready);
  if (layouts === null) {
    return null;
  }
  const center = width / 2;
  const introLeft = centeredLeft(layouts.intro, center + intro.offsetX);
  const stops = cubeStops(intro, layouts.intro, introLeft);
  const lastWord = layouts.punch.at(-1);
  const contactLeft = centeredLeft(layouts.contact, center);
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? <AbsoluteFill style={{ backgroundColor: palette.paper }} /> : null}
      {frame < scroll.start ? (
        <CubeIntro
          intro={intro}
          palette={palette}
          layout={layouts.intro}
          stops={stops}
          left={introLeft}
          speed={motion.speed}
        />
      ) : null}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <ScrollBeat
          scroll={scroll}
          layout={layouts.scroll}
          ink={palette.ink}
          center={center}
          frame={frame}
        />
        <StackBeat
          stack={stack}
          layouts={layouts.stack}
          palette={palette}
          center={center}
          frame={frame}
        />
        <PunchBeat
          punch={punch}
          layouts={layouts.punch}
          palette={palette}
          center={center}
          dotSize={collapse.dotSize}
          until={collapse.at}
          frame={frame}
        />
        {lastWord === undefined ? null : (
          <DotCollapse
            collapse={collapse}
            contact={contact}
            word={lastWord}
            wordLeft={centeredLeft(lastWord, center)}
            wordBaseline={punch.baseline}
            contactLayout={layouts.contact}
            contactLeft={contactLeft}
            ink={palette.ink}
            accent={palette.accent}
            frame={frame}
          />
        )}
        <ContactLine
          contact={contact}
          layout={layouts.contact}
          left={contactLeft}
          ink={palette.ink}
          accent={palette.accent}
          until={end.at}
          frame={frame}
        />
        <EndCard
          end={end}
          palette={palette}
          showBackdrop={look.showBackdrop}
          width={width}
          height={height}
          frame={frame}
        />
      </svg>
    </TransitionFrame>
  );
};

export const scrollerCalloutScene: SceneModule = {
  id: 'scroller-callout',
  component: ScrollerCallout,
  render: (key) => (
    <Composition
      key={key}
      id="scroller-callout"
      component={ScrollerCallout}
      schema={scrollerCalloutSchema}
      defaultProps={scrollerCalloutDefaults}
      durationInFrames={scrollerCalloutMeta.durationInFrames}
      fps={scrollerCalloutMeta.fps}
      width={scrollerCalloutMeta.width}
      height={scrollerCalloutMeta.height}
    />
  ),
};
