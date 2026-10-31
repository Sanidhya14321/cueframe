import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type MailinfraDeliverabilityChargeProps,
  mailinfraDeliverabilityChargeDefaults,
  mailinfraDeliverabilityChargeMeta,
  mailinfraDeliverabilityChargeSchema,
} from '@/schemas';
import { BrandLine } from '../../mailinfra-deliverability-charge/brand';
import { Plugs, Sparks, Wires } from '../../mailinfra-deliverability-charge/cables';
import { mixColor } from '../../mailinfra-deliverability-charge/geometry';
import {
  CableLabels,
  Counter,
  HeadlineGlow,
  LandedBadge,
} from '../../mailinfra-deliverability-charge/readout';
import { rigCable, vesselOf, visibleCables } from '../../mailinfra-deliverability-charge/rig';
import {
  beatsOf,
  burstAt,
  chargeAt,
  glowAt,
  pulseAt,
} from '../../mailinfra-deliverability-charge/timeline';
import { VesselBody, VesselGlass } from '../../mailinfra-deliverability-charge/vessel';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const EASED = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const backdropGradient = (center: string, edge: string): string => {
  const last = EASED.length - 1;
  const stops = [
    ...EASED.map((amount, index) => [amount, (index / last) * 50] as const),
    ...EASED.slice(0, -1)
      .reverse()
      .map((amount, index) => [amount, 50 + ((index + 1) / last) * 50] as const),
  ];
  return `linear-gradient(180deg, ${stops
    .map(([amount, at]) => `${mixColor(edge, center, amount)} ${at.toFixed(1)}%`)
    .join(', ')})`;
};

const Blur = ({
  id,
  deviation,
  width,
  height,
}: {
  id: string;
  deviation: number;
  width: number;
  height: number;
}) => (
  <filter id={id} filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
    <feGaussianBlur stdDeviation={deviation} />
  </filter>
);

const MailinfraDeliverabilityCharge = (props: MailinfraDeliverabilityChargeProps) => {
  const { headline, counter, badge, cables, sparks, charge, liquid, inbox, timing } = props;
  const { background, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = {
    clip: `mdc-clip-${uid}`,
    liquid: `mdc-liquid-${uid}`,
    near: `mdc-near-${uid}`,
    far: `mdc-far-${uid}`,
    spark: `mdc-spark-${uid}`,
    haze: `mdc-haze-${uid}`,
  };
  const beats = beatsOf(timing, charge.shiftFrames);
  const vessel = vesselOf(inbox, width);
  const level = chargeAt(frame, beats);
  const mix = glowAt(frame, beats);
  const burst = burstAt(frame, beats, charge.pulseFrames);
  const glow = mixColor(mixColor(charge.low, charge.charged, mix), '#ffffff', burst * 0.25);
  const paint = {
    glow,
    liquidTop: mixColor(charge.low, liquid.top, mix),
    liquidBottom: mixColor(charge.low, liquid.bottom, mix),
    burst,
  };
  const fill = liquid.startLevel + (liquid.fullLevel - liquid.startLevel) * level;
  const rigs = visibleCables(cables).map((key, order) =>
    rigCable(key, order, frame, props, beats, vessel),
  );
  const pulses = [
    pulseAt(frame, beats, charge.pulseFrames),
    pulseAt(frame, beats, charge.pulseFrames, 9),
  ];
  return (
    <TransitionFrame motion={motion}>
      {background.show ? (
        <AbsoluteFill style={{ background: backdropGradient(background.color, background.edge) }} />
      ) : null}
      <AbsoluteFill>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>
            <Blur id={ids.near} deviation={charge.glowSize * 0.18} width={width} height={height} />
            <Blur id={ids.far} deviation={charge.glowSize * 0.5} width={width} height={height} />
            <Blur id={ids.spark} deviation={sparks.size * 0.45} width={width} height={height} />
            <Blur
              id={ids.haze}
              deviation={Math.max(vessel.width, 200) * 0.32}
              width={width}
              height={height}
            />
          </defs>
          {background.show && background.haze > 0 ? (
            <ellipse
              cx={vessel.cx}
              cy={vessel.top + vessel.height / 2}
              rx={vessel.width * 0.85}
              ry={vessel.height * 0.6}
              fill={glow}
              opacity={background.haze * (0.55 + 0.45 * level)}
              filter={`url(#${ids.haze})`}
            />
          ) : null}
          <Wires rigs={rigs} cables={cables} />
          <VesselBody
            props={props}
            vessel={vessel}
            frame={frame}
            level={fill}
            paint={paint}
            ids={ids}
          />
          <VesselGlass
            props={props}
            vessel={vessel}
            paint={paint}
            pulses={pulses}
            glowFilters={ids}
          />
          <Sparks rigs={rigs} sparks={sparks} ink={cables.plug} glow={ids.spark} />
          <Plugs rigs={rigs} cables={cables} glow={ids.near} />
        </svg>
      </AbsoluteFill>
      <BrandLine brand={props.brand} />
      <HeadlineGlow headline={headline} glow={glow} />
      <Counter counter={counter} vessel={vessel} charge={level} />
      <LandedBadge
        badge={badge}
        vessel={vessel}
        beats={beats}
        frame={frame}
        check={charge.charged}
      />
      <CableLabels rigs={rigs} cables={cables} />
    </TransitionFrame>
  );
};

export const mailinfraDeliverabilityChargeScene: SceneModule = {
  id: 'mailinfra-deliverability-charge',
  component: MailinfraDeliverabilityCharge,
  render: (key) => (
    <Composition
      key={key}
      id="mailinfra-deliverability-charge"
      component={MailinfraDeliverabilityCharge}
      schema={mailinfraDeliverabilityChargeSchema}
      defaultProps={mailinfraDeliverabilityChargeDefaults}
      durationInFrames={mailinfraDeliverabilityChargeMeta.durationInFrames}
      fps={mailinfraDeliverabilityChargeMeta.fps}
      width={mailinfraDeliverabilityChargeMeta.width}
      height={mailinfraDeliverabilityChargeMeta.height}
    />
  ),
};
