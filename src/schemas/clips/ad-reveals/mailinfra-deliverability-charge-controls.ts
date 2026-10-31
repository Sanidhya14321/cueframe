import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { MailinfraDeliverabilityChargeProps } from './mailinfra-deliverability-charge';

const LABEL_HINT = 'Shown in the pill beside the plug. Leave empty to hide the pill';
const SHOW_HINT = 'Off removes this cable; the others keep their sockets and plug in sooner';

export const mailinfraDeliverabilityChargeControls =
  defineControls<MailinfraDeliverabilityChargeProps>({
    sections: [
      {
        title: 'Text',
        fields: [
          {
            path: 'headline.text',
            label: 'Headline',
            hint: 'The spaced glowing word above the inbox',
          },
          {
            path: 'brand.text',
            label: 'Brand line',
            hint: 'Small line above the headline, for example your website. Leave empty to show only the mark',
          },
          {
            path: 'counter.target',
            label: 'Final number',
            hint: 'The counter climbs to this value as the inbox fills',
          },
          {
            path: 'badge.text',
            label: 'Badge text',
            hint: 'Rises in above the inbox when the counter reaches its final number',
          },
        ],
        more: [
          {
            path: 'counter.caption',
            label: 'Counter caption',
            hint: 'Small line under the number, shown in capitals. Leave empty to hide it',
          },
          {
            path: 'counter.from',
            label: 'Starting number',
            hint: 'The counter starts here before charging',
          },
          {
            path: 'counter.suffix',
            label: 'Number suffix',
            hint: 'Added after the number, for example % or x',
          },
          {
            path: 'counter.decimals',
            label: 'Decimal places',
            hint: '1 shows 99.9, 0 shows whole numbers',
          },
          { path: 'brand.show', label: 'Show brand line' },
          {
            path: 'brand.mark',
            label: 'Show brand mark',
            hint: 'The small envelope tile before the brand line',
          },
          { path: 'badge.show', label: 'Show badge' },
          { path: 'headline.size', label: 'Headline size', hint: 'In pixels' },
          {
            path: 'headline.tracking',
            label: 'Headline letter spacing',
            hint: 'Space between letters, in em',
          },
          {
            path: 'headline.top',
            label: 'Headline position',
            hint: 'Distance from the top of the frame, in pixels',
          },
          { path: 'brand.size', label: 'Brand line size', hint: 'In pixels' },
          {
            path: 'brand.top',
            label: 'Brand line position',
            hint: 'Distance from the top of the frame, in pixels',
          },
          { path: 'counter.size', label: 'Number size', hint: 'In pixels' },
          { path: 'counter.captionSize', label: 'Caption size', hint: 'In pixels' },
          {
            path: 'counter.position',
            label: 'Number height in the inbox',
            hint: 'Share of the inbox height from its top edge',
          },
          { path: 'badge.size', label: 'Badge text size', hint: 'In pixels' },
          { path: 'badge.gap', label: 'Badge gap above the inbox', hint: 'In pixels' },
        ],
      },
      {
        title: 'Colors',
        fields: [
          {
            link: ['charge.charged', 'liquid.bottom', 'brand.markColor'],
            label: 'Primary color',
            hint: 'The charged glow on the inbox, headline and pulse, the badge check, the bottom of the liquid and the brand mark',
          },
          { path: 'liquid.top', label: 'Secondary color', hint: 'Top of the liquid gradient' },
          {
            link: ['sparks.color', 'cables.ring'],
            label: 'Accent color',
            hint: 'Sparks running up the wires, the plug rings, their click flash and the dots on the cable labels',
          },
          {
            link: ['headline.color', 'counter.color', 'cables.labelInk', 'brand.color'],
            label: 'Text color',
            hint: 'Headline letters, the counter, the cable label text and the brand line',
          },
          {
            path: 'background.color',
            label: 'Background color',
            hint: 'Middle of the backdrop',
          },
        ],
        more: [
          {
            path: 'charge.low',
            label: 'Spam color',
            hint: 'The warning glow and liquid before charging, which shifts to the Primary color',
          },
          {
            path: 'charge.charged',
            label: 'Charged glow color',
            hint: 'Glow on the inbox, headline, pulse and badge check once charging starts',
          },
          { path: 'liquid.bottom', label: 'Liquid bottom color' },
          { path: 'brand.markColor', label: 'Brand mark color' },
          { path: 'sparks.color', label: 'Spark color' },
          {
            path: 'cables.ring',
            label: 'Plug ring color',
            hint: 'Also the flash when a plug clicks in and the dot on each cable label',
          },
          {
            path: 'headline.color',
            label: 'Headline color',
            hint: 'Mixed with the glow by Headline tint',
          },
          { path: 'counter.color', label: 'Number color' },
          { path: 'cables.labelInk', label: 'Cable label text color' },
          {
            path: 'brand.color',
            label: 'Brand line color',
            hint: 'Also the envelope on the brand mark',
          },
          { path: 'counter.captionColor', label: 'Caption color' },
          {
            path: 'badge.fill',
            label: 'Badge color',
            hint: 'Also the tick inside the check circle',
          },
          { path: 'badge.ink', label: 'Badge text color' },
        ],
      },
      {
        title: 'Cables',
        fields: [
          { path: 'cables.spf.label', label: 'Left top cable', hint: LABEL_HINT },
          { path: 'cables.dkim.label', label: 'Right top cable', hint: LABEL_HINT },
          { path: 'cables.dmarc.label', label: 'Left lower cable', hint: LABEL_HINT },
          { path: 'cables.warmup.label', label: 'Right lower cable', hint: LABEL_HINT },
          { path: 'cables.ips.label', label: 'Bottom cable', hint: LABEL_HINT },
        ],
        more: [
          { path: 'cables.spf.show', label: 'Show left top cable', hint: SHOW_HINT },
          { path: 'cables.dkim.show', label: 'Show right top cable', hint: SHOW_HINT },
          { path: 'cables.dmarc.show', label: 'Show left lower cable', hint: SHOW_HINT },
          { path: 'cables.warmup.show', label: 'Show right lower cable', hint: SHOW_HINT },
          { path: 'cables.ips.show', label: 'Show bottom cable', hint: SHOW_HINT },
          { path: 'cables.wire', label: 'Wire color' },
          { path: 'cables.width', label: 'Wire thickness', hint: 'In pixels' },
          {
            path: 'cables.sway',
            label: 'Sway',
            hint: 'How much the wires swing as they rise and while plugged in, 0 holds them still',
          },
          { path: 'cables.plugSize', label: 'Plug size', hint: '1 is the standard slim connector' },
          {
            path: 'cables.plug',
            label: 'Plug body color',
            hint: 'Also the fold lines on envelope sparks',
          },
          {
            path: 'cables.plugEdge',
            label: 'Plug edge color',
            hint: 'Outline of each plug and the border of the label pills',
          },
          {
            path: 'cables.pin',
            label: 'Plug tip color',
            hint: 'The metal tip that goes into the inbox',
          },
          { path: 'cables.labelFill', label: 'Label pill color' },
          { path: 'cables.labelSize', label: 'Label size', hint: 'In pixels' },
        ],
      },
      {
        title: 'Glow and sparks',
        fields: [],
        more: [
          { path: 'charge.glow', label: 'Glow strength', hint: '0 leaves only the outline' },
          {
            path: 'charge.glowSize',
            label: 'Glow size',
            hint: 'Blur radius of the glow around the inbox, in pixels',
          },
          {
            path: 'charge.shiftFrames',
            label: 'Color shift length',
            hint: 'Frames the glow takes to turn from the Spam color to the Primary color once charging starts',
          },
          {
            path: 'headline.glow',
            label: 'Headline glow',
            hint: '0 turns the glow behind the letters off',
          },
          {
            path: 'headline.tint',
            label: 'Headline tint',
            hint: 'How much of the glow color tints the letters, 0 keeps the Headline color',
          },
          {
            path: 'charge.pulseSize',
            label: 'Pulse reach',
            hint: 'How far the completion rings spread past the inbox, in pixels. 0 hides them',
          },
          { path: 'charge.pulseFrames', label: 'Pulse length', hint: 'In frames' },
          { path: 'sparks.count', label: 'Sparks per cable', hint: '0 turns the sparks off' },
          { path: 'sparks.shape', label: 'Spark shape' },
          { path: 'sparks.size', label: 'Spark size', hint: 'In pixels' },
          {
            path: 'sparks.tripFrames',
            label: 'Spark trip length',
            hint: 'Frames a spark takes to run the whole wire, lower is faster',
          },
          { path: 'sparks.glow', label: 'Spark glow', hint: '0 turns the halo off' },
        ],
      },
      {
        title: 'Liquid',
        fields: [],
        more: [
          {
            path: 'liquid.fullLevel',
            label: 'Full level',
            hint: 'Share of the inbox the liquid fills when the counter reaches its final number',
          },
          {
            path: 'liquid.startLevel',
            label: 'Empty level',
            hint: 'Share of the inbox already filled before charging',
          },
          {
            path: 'liquid.wave',
            label: 'Wave height',
            hint: 'In pixels, 0 keeps the surface flat',
          },
          { path: 'liquid.waveSpeed', label: 'Wave speed' },
          {
            path: 'liquid.bubbles',
            label: 'Bubbles',
            hint: 'Number of bubbles rising in the liquid, 0 turns them off',
          },
          { path: 'liquid.bubbleSize', label: 'Bubble size', hint: 'In pixels' },
          { path: 'liquid.bubbleColor', label: 'Bubble color' },
        ],
      },
      {
        title: 'Inbox',
        fields: [],
        more: [
          {
            path: 'inbox.width',
            label: 'Width',
            hint: 'In pixels; the side cables follow its edges',
          },
          { path: 'inbox.height', label: 'Height', hint: 'In pixels' },
          {
            path: 'inbox.centerY',
            label: 'Vertical position',
            hint: 'Center of the inbox from the top of the frame, in pixels',
          },
          { path: 'inbox.radius', label: 'Corner roundness', hint: 'In pixels' },
          { path: 'inbox.outline', label: 'Outline thickness', hint: 'In pixels' },
          { path: 'inbox.fill', label: 'Inside color', hint: 'The empty inside of the inbox' },
          {
            path: 'inbox.flapDepth',
            label: 'Envelope flap depth',
            hint: 'Share of the inbox height the flap reaches down; it always stops above the number. 0 hides the flap',
          },
          {
            path: 'inbox.showSeal',
            label: 'Show envelope seal',
            hint: 'The round seal with a mail icon at the tip of the flap',
          },
          { path: 'inbox.sealSize', label: 'Seal size', hint: 'In pixels' },
          {
            path: 'inbox.sealIcon',
            label: 'Seal icon color',
            hint: 'Also the ring around the seal',
          },
        ],
      },
      {
        title: 'Timing',
        fields: [],
        more: [
          {
            path: 'timing.fullAt',
            label: 'Full at',
            hint: 'Frame number where the counter lands and the pulse and badge appear',
          },
          {
            path: 'timing.plugIn',
            label: 'First plug starts',
            hint: 'Frame number the first cable starts rising',
          },
          {
            path: 'timing.plugFrames',
            label: 'Plug-in length',
            hint: 'Frames each cable takes to rise and plug in',
          },
          {
            path: 'timing.stagger',
            label: 'Cable stagger',
            hint: 'Frames between cables; they unplug at half this spacing',
          },
          {
            path: 'timing.chargeStart',
            label: 'Charging starts',
            hint: 'Frame number the count, the fill and the color shift begin',
          },
          {
            path: 'timing.unplugAt',
            label: 'Unplug at',
            hint: 'Frame number the cables pull out and drop away. Kept at least 8 frames after Full at',
          },
          {
            path: 'timing.unplugFrames',
            label: 'Unplug length',
            hint: 'Frames each cable takes to back out and drop out of view',
          },
          {
            path: 'timing.drain',
            label: 'Drain at the end',
            hint: 'On empties the inbox back to the Spam color after the cables unplug. Off keeps it charged',
          },
          {
            path: 'timing.drainFrames',
            label: 'Drain length',
            hint: 'Frames the liquid and glow take to empty. Drain at the end only',
          },
          {
            path: 'badge.hold',
            label: 'Badge hold',
            hint: 'Frames the badge stays after it lands before it fades with the drain. Drain at the end only',
          },
          {
            path: 'brand.enterAt',
            label: 'Brand line appears at',
            hint: 'Frame number the brand line fades in',
          },
        ],
      },
      {
        title: 'Background and motion',
        fields: [],
        more: [
          {
            path: 'background.show',
            label: 'Show background',
            hint: 'Off leaves the inbox and cables on a transparent layer',
          },
          {
            path: 'background.edge',
            label: 'Background edge',
            hint: 'Color the backdrop fades to at the top and bottom',
          },
          {
            path: 'background.haze',
            label: 'Glow haze',
            hint: 'Soft colored haze behind the inbox. Needs Show background on; 0 turns it off',
          },
          {
            ...MOTION.speed,
            hint: 'Scales the whole timeline; the entrance and exit keep their own length',
          },
          MOTION.enter,
          MOTION.enterFrames,
          { ...MOTION.exit, hint: 'Fade by default, so the ad ends gently' },
          MOTION.exitFrames,
        ],
      },
    ],
    hidden: ['motion.float'],
  });
