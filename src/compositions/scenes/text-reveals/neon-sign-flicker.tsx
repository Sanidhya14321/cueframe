import { Composition, useCurrentFrame } from 'remotion';
import {
  type NeonSignFlickerProps,
  neonSignFlickerDefaults,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from '@/schemas';
import { NeonBackdrop } from '../../neon-sign/backdrop';
import { BrandLockup, Website } from '../../neon-sign/brand-lockup';
import { flickerLevels } from '../../neon-sign/flicker';
import { NeonWord } from '../../neon-sign/neon-word';
import { PendantLamp } from '../../neon-sign/pendant-lamp';
import { Subtitle } from '../../neon-sign/subtitle';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const NeonSignFlicker = (props: NeonSignFlickerProps) => {
  const { copy, neon, flicker, pendant, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const levels = flickerLevels(frame, flicker, pendant.idle);
  const flickering = Math.round(flicker.letter);
  const letterLevels = Array.from(copy.word, (_, index) =>
    index === flickering ? levels.letter : 1,
  );
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? <NeonBackdrop look={look} /> : null}
      <NeonWord word={copy.word} neon={neon} levels={letterLevels} />
      {pendant.show ? <PendantLamp pendant={pendant} level={levels.lamp} frame={frame} /> : null}
      {props.subtitle.show ? <Subtitle text={copy.subtitle} subtitle={props.subtitle} /> : null}
      {props.brand.show ? (
        <BrandLockup name={copy.brand} line={copy.brandLine} brand={props.brand} />
      ) : null}
      {props.website.show ? <Website url={copy.website} website={props.website} /> : null}
    </TransitionFrame>
  );
};

export const neonSignFlickerScene: SceneModule = {
  id: 'neon-sign-flicker',
  component: NeonSignFlicker,
  render: (key) => (
    <Composition
      key={key}
      id="neon-sign-flicker"
      component={NeonSignFlicker}
      schema={neonSignFlickerSchema}
      defaultProps={neonSignFlickerDefaults}
      durationInFrames={neonSignFlickerMeta.durationInFrames}
      fps={neonSignFlickerMeta.fps}
      width={neonSignFlickerMeta.width}
      height={neonSignFlickerMeta.height}
    />
  ),
};
