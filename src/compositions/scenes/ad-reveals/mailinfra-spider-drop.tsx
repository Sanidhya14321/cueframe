import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type MailinfraSpiderDropProps,
  mailinfraSpiderDropDefaults,
  mailinfraSpiderDropMeta,
  mailinfraSpiderDropSchema,
} from '@/schemas';
import { EndLockup } from '../../mailinfra-spider-drop/end-lockup';
import { svgId } from '../../mailinfra-spider-drop/paint';
import { StatTitle } from '../../mailinfra-spider-drop/stat-title';
import { spiderDropTimeline } from '../../mailinfra-spider-drop/timeline';
import { motionSpread, WorldDefs, WorldSample, worldIds } from '../../mailinfra-spider-drop/world';
import { TransitionFrame } from '../../promo/transition-frame';
import { Headline } from '../../promo/typography';
import type { SceneModule } from '../../scene-module';

const SAMPLE_SPACING = 1.5;

const sampleTimes = (props: MailinfraSpiderDropProps, frame: number): number[] => {
  const { blurSamples, shutter } = props.drop;
  const speed = props.motion.speed;
  const now = frame * speed;
  const earliest = Math.max(0, frame - shutter) * speed;
  const spread = blurSamples <= 1 || shutter <= 0 ? 0 : motionSpread(props, earliest, now);
  if (spread < 0.4) {
    return [now];
  }
  const count = Math.min(blurSamples, Math.max(2, Math.ceil(spread / SAMPLE_SPACING)));
  return Array.from(
    { length: count },
    (_, index) => earliest + ((now - earliest) * index) / (count - 1),
  );
};

const MailinfraSpiderDrop = (props: MailinfraSpiderDropProps) => {
  const prefix = svgId(useId());
  const ids = worldIds(prefix);
  const realFrame = useCurrentFrame();
  const frame = realFrame * props.motion.speed;
  const line = spiderDropTimeline(props);
  const times = sampleTimes(props, realFrame);
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill>
        <svg
          viewBox="0 0 1080 1920"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
          role="img"
          aria-label={`${props.headline.text} ${props.stat.value} ${props.stat.caption}`}
        >
          <WorldDefs props={props} ids={ids} />
          {times.map((time, index) => (
            <g key={time.toFixed(4)} opacity={index === 0 ? 1 : 1 / (index + 1)}>
              <WorldSample props={props} t={time} ids={ids} />
            </g>
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: props.headline.y,
          }}
        >
          <Headline
            text={props.headline.text}
            highlight={props.headline.highlight}
            size={props.headline.size}
            color={props.look.ink}
            accent={props.look.accent}
            align="center"
            start={props.headline.start / props.motion.speed}
            end={(line.start - 8) / props.motion.speed}
          />
        </div>
        <StatTitle
          props={props}
          t={frame}
          start={line.landing + props.stat.delay}
          gradientId={`${prefix}-gold`}
          shadowId={`${prefix}-gold-shadow`}
        />
        <EndLockup
          props={props}
          start={(line.landing + props.endCard.delay) / props.motion.speed}
        />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const mailinfraSpiderDropScene: SceneModule = {
  id: 'mailinfra-spider-drop',
  component: MailinfraSpiderDrop,
  render: (key) => (
    <Composition
      key={key}
      id="mailinfra-spider-drop"
      component={MailinfraSpiderDrop}
      schema={mailinfraSpiderDropSchema}
      defaultProps={mailinfraSpiderDropDefaults}
      durationInFrames={mailinfraSpiderDropMeta.durationInFrames}
      fps={mailinfraSpiderDropMeta.fps}
      width={mailinfraSpiderDropMeta.width}
      height={mailinfraSpiderDropMeta.height}
    />
  ),
};
