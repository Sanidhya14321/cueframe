import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { CirclePopProps } from './circle-pop';

const AFTER_FLOOD_STARTS = 'In frames after the flood starts';

export const circlePopControls = defineControls<CirclePopProps>({
  sections: [
    {
      title: 'Word',
      fields: [{ path: 'word.text', label: 'Word', hint: 'Stays on one line' }],
      more: [
        {
          path: 'word.startSize',
          label: 'Size on the disc',
          hint: 'Largest font size in pixels while the word sits on the disc. Longer words shrink to fit inside it',
        },
        {
          path: 'word.endSize',
          label: 'Size after the flood',
          hint: 'Largest font size in pixels once the frame is flooded. Longer words shrink to stay inside the frame width',
        },
        { path: 'word.weight', label: 'Font weight' },
        { path: 'word.tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          ...LOOK.ink,
          label: 'Primary color',
          hint: 'The disc and the color that floods the frame',
        },
        {
          link: ['word.color', 'word.floodColor', 'subline.color'],
          label: 'Text color',
          hint: 'The word on the disc, the word after the flood and the sub-line',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Shows around the disc until the flood covers it. Sets the center and the corners together',
        },
      ],
      more: [
        { path: 'word.color', label: 'Word color on the disc' },
        {
          path: 'word.floodColor',
          label: 'Word color after the flood',
          hint: 'The word blends to this color while the frame floods',
        },
        { path: 'subline.color', label: 'Sub-line color' },
        { ...LOOK.background, label: 'Background center' },
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Disc',
      fields: [
        { path: 'disc.size', label: 'Disc size', hint: 'Diameter in pixels once it lands' },
        {
          path: 'pop.overshoot',
          label: 'Pop bounce',
          hint: 'How far the disc and word overshoot before they settle, so 0.08 is 8% bigger. 0 lands with no bounce',
        },
      ],
      more: [
        {
          path: 'pop.frames',
          label: 'Pop length',
          hint: 'In frames, from a point to resting size',
        },
        { path: 'pop.delay', label: 'Start delay', hint: 'In frames before the disc appears' },
        {
          path: 'pop.fadeFrames',
          label: 'Fade-in length',
          hint: 'In frames. The disc and word fade in as they grow, so nothing pops in. Never longer than the pop',
        },
        {
          path: 'disc.offsetX',
          label: 'Move across',
          hint: 'In pixels from the center, positive is right. The word moves with the disc',
        },
        {
          path: 'disc.offsetY',
          label: 'Move up or down',
          hint: 'In pixels from the center, positive is down. The word moves with the disc',
        },
      ],
    },
    {
      title: 'Wobble',
      fields: [
        {
          path: 'wobble.shape',
          label: 'Edge shape',
          hint: 'Wobble rolls soft waves around the edge; starburst gives it sharp sticker points',
        },
        {
          path: 'wobble.amount',
          label: 'Wobble depth',
          hint: 'Bump height as a share of the radius, so 0.06 is 6%. 0 keeps a clean circle',
        },
      ],
      more: [
        { path: 'wobble.lobes', label: 'Wobble bumps', hint: 'Number of bumps around the edge' },
        {
          path: 'wobble.speed',
          label: 'Wobble spin',
          hint: 'How fast the bumps travel around the edge, in degrees of wave per frame. 0 holds them still',
        },
        {
          path: 'wobble.buildFrames',
          label: 'Wobble build-up',
          hint: 'In frames, from the disc landing to the flood starting. The bumps start growing at the top of the pop bounce',
        },
      ],
    },
    {
      title: 'Flood',
      fields: [
        {
          path: 'flood.frames',
          label: 'Flood length',
          hint: 'In frames, from the blob starting to swell until it is past every corner',
        },
      ],
      more: [
        {
          path: 'flood.wordFrames',
          label: 'Word grow length',
          hint: 'In frames, from the size on the disc to the size after the flood',
        },
        {
          path: 'flood.wordDelay',
          label: 'Word grow delay',
          hint: `${AFTER_FLOOD_STARTS}. A few frames keep the word inside the swelling blob`,
        },
        {
          path: 'flood.reach',
          label: 'Flood overshoot',
          hint: 'How far past the farthest corner the blob ends, as a multiple of that distance. Higher fills the corners sooner',
        },
      ],
    },
    {
      title: 'Tilt',
      fields: [
        {
          path: 'tilt.angle',
          label: 'Final tilt',
          hint: 'In degrees, where the word lands after the flood',
        },
      ],
      more: [
        {
          path: 'word.rotation',
          label: 'Starting tilt',
          hint: 'In degrees, while the word sits on the disc',
        },
        { path: 'tilt.delay', label: 'Tilt delay', hint: AFTER_FLOOD_STARTS },
        { path: 'tilt.frames', label: 'Tilt length', hint: 'In frames' },
      ],
    },
    {
      title: 'Sub-line',
      fields: [
        {
          path: 'subline.text',
          label: 'Sub-line',
          hint: 'A small line under the word that rises in after the flood. Leave empty to hide it',
        },
      ],
      more: [
        {
          path: 'subline.size',
          label: 'Sub-line size',
          hint: 'Largest font size in pixels. Longer lines shrink to stay inside the frame width',
        },
        { path: 'subline.delay', label: 'Sub-line delay', hint: AFTER_FLOOD_STARTS },
        { path: 'subline.frames', label: 'Sub-line fade-in length', hint: 'In frames' },
        {
          path: 'subline.rise',
          label: 'Sub-line rise',
          hint: 'In pixels it travels up while it fades in. 0 only fades it',
        },
        {
          path: 'subline.gap',
          label: 'Gap under the word',
          hint: 'In pixels below the lowest point of the word at its size after the flood',
        },
        { path: 'subline.weight', label: 'Sub-line weight' },
        { path: 'subline.tracking', label: 'Sub-line letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Off leaves only the disc, the flood and the word, so the clip can sit over another layer',
        },
      ],
      more: [
        {
          path: 'inverted',
          label: 'Invert colors',
          hint: 'Swaps the background, disc, word and sub-line colors for their opposites, so a dark disc floods a white frame. The spotlight glow stays white',
        },
        {
          ...LOOK.grain,
          hint: 'Off by default for a clean black. Shows on the background only, never on the flood',
        },
        LOOK.spotlight,
        { ...LOOK.liveGrain, hint: 'Film grain only. Off holds one grain pattern' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the pop, wobble, flood and tilt timing. If the word would not land and hold for 8 frames before the exit starts, the motion plays faster so it always does, which limits how far it can slow down. The entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: [
    'look.muted',
    'look.accent',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
