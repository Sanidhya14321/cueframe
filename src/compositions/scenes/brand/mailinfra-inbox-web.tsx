import { useId, useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type MailinfraInboxWebProps,
  mailinfraInboxWebDefaults,
  mailinfraInboxWebMeta,
  mailinfraInboxWebSchema,
} from '@/schemas';
import { Bokeh } from '../../mailinfra-inbox-web/bokeh';
import { CounterOverlay } from '../../mailinfra-inbox-web/counter';
import { EndCard, pendulumAt } from '../../mailinfra-inbox-web/end-card';
import { buildWeb } from '../../mailinfra-inbox-web/geometry';
import { cameraAt, phasesFor } from '../../mailinfra-inbox-web/timeline';
import { World } from '../../mailinfra-inbox-web/world';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const MailinfraInboxWeb = (props: MailinfraInboxWebProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const idPrefix = `inbox-web-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const web = useMemo(() => buildWeb(props), [props]);
  const phases = phasesFor(
    props,
    (durationInFrames - props.motion.exitFrames) * props.motion.speed,
  );
  const camera = cameraAt(frame, web, phases, props);
  const pendulum = pendulumAt(frame, phases, props);
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      {props.look.showBackdrop ? (
        <Bokeh
          frame={frame}
          width={width}
          height={height}
          camera={camera}
          props={props}
          idPrefix={idPrefix}
        />
      ) : null}
      <AbsoluteFill>
        <World
          frame={frame}
          width={width}
          height={height}
          web={web}
          phases={phases}
          camera={camera}
          pendulum={pendulum}
          props={props}
          idPrefix={idPrefix}
        />
        <CounterOverlay frame={frame} phases={phases} props={props} />
        <EndCard frame={frame} width={width} phases={phases} props={props} />
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const mailinfraInboxWebScene: SceneModule = {
  id: 'mailinfra-inbox-web',
  component: MailinfraInboxWeb,
  render: (key) => (
    <Composition
      key={key}
      id="mailinfra-inbox-web"
      component={MailinfraInboxWeb}
      schema={mailinfraInboxWebSchema}
      defaultProps={mailinfraInboxWebDefaults}
      durationInFrames={mailinfraInboxWebMeta.durationInFrames}
      fps={mailinfraInboxWebMeta.fps}
      width={mailinfraInboxWebMeta.width}
      height={mailinfraInboxWebMeta.height}
    />
  ),
};
