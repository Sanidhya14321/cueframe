import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { StickerStackProps } from './sticker-stack';

export const stickerStackControls = defineControls<StickerStackProps>({
  sections: [
    {
      title: 'Stickers',
      fields: [
        {
          path: 'stickers',
          label: 'Stickers',
          hint: 'One sticker per line, in order. Two characters or fewer make a round badge; -> draws an arrow and * a spark',
        },
        { path: 'size', label: 'Sticker size' },
        { path: 'face', label: 'Font' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        {
          path: 'badgeScale',
          label: 'Badge size',
          hint: 'Height of the round badges relative to the word pills. 1 matches them',
        },
        { path: 'shadow', label: 'Shadow strength', hint: 'Drop shadow under every sticker' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          ...LOOK.accent,
          label: 'Primary color',
          hint: 'Fill of the accent stickers and the background glow',
        },
        {
          path: 'paper',
          label: 'Surface color',
          hint: 'Fill of the light stickers, plus the outline and text of the outlined ones',
        },
        {
          link: ['paperInk', 'accentInk'],
          label: 'Text color',
          hint: 'Text on the light and accent stickers',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together. The center also fills the outlined stickers',
        },
      ],
      more: [
        { path: 'paperInk', label: 'Text on light stickers' },
        { path: 'accentInk', label: 'Text on accent stickers' },
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'Center of the background, also the fill of the outlined stickers',
        },
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Pop-in',
      fields: [
        {
          path: 'stagger',
          label: 'Time between stickers',
          hint: 'In frames. Lower stacks them faster',
        },
        {
          path: 'overshoot',
          label: 'Bounce',
          hint: 'How far each sticker overshoots its size before settling',
        },
      ],
      more: [
        { path: 'popFrames', label: 'Pop length', hint: 'In frames' },
        { path: 'delay', label: 'Start delay', hint: 'In frames, before the first sticker' },
        {
          path: 'kick',
          label: 'Landing twist',
          hint: 'Degrees each sticker turns as it lands before settling to its tilt',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          path: 'angle',
          label: 'Trail direction',
          hint: 'Degrees. 0 runs left to right, positive climbs upward',
        },
      ],
      more: [
        {
          path: 'step',
          label: 'Spacing along the trail',
          hint: 'Distance between neighboring stickers',
        },
        {
          path: 'spread',
          label: 'Side-to-side scatter',
          hint: 'How far stickers zigzag to either side of the trail. 0 lines them up',
        },
        { path: 'spin', label: 'Tilt variation', hint: 'Maximum random tilt in degrees' },
        {
          path: 'seed',
          label: 'Shuffle',
          hint: 'Change for a different scatter, tilt and twist direction',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.distance',
          label: 'Camera distance',
          hint: 'Higher shows more of the trail',
        },
      ],
      more: [
        {
          path: 'chase',
          label: 'Catch-up time',
          hint: 'In frames the camera takes to reach each new sticker. Lower snaps faster',
        },
        {
          path: 'lead',
          label: 'Camera lag',
          hint: 'How far the camera trails the newest sticker along the trail. Negative runs ahead',
        },
        {
          path: 'pullBack',
          label: 'End pull-back',
          hint: 'How much the camera widens as it settles on the last stickers. 0 holds the distance',
        },
        { path: 'camera.fieldOfView', label: 'Field of view' },
        { path: 'camera.drift', label: 'Camera drift', hint: 'Gentle handheld sway' },
        {
          path: 'lens.shutter',
          label: 'Motion blur',
          hint: 'Shutter length in frames. 0 turns it off',
        },
        {
          path: 'lens.samples',
          label: 'Motion blur quality',
          hint: 'Samples per frame in the final render; the preview uses at most 3',
        },
        { path: 'lens.distortion', label: 'Lens distortion' },
        { path: 'lens.fringe', label: 'Color fringing', hint: 'Grows toward the edges' },
        {
          path: 'lens.shift',
          label: 'Color split',
          hint: 'Sideways red and blue offset across the whole frame, in pixels at 1920 wide',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        {
          path: 'lens.glow',
          label: 'Glow strength',
          hint: 'Strength of the primary color glow on the background. Only shows while the background is on',
        },
        { path: 'lens.glowX', label: 'Glow position across', hint: '0 is left, 1 is right' },
        { path: 'lens.glowY', label: 'Glow height', hint: '0 is bottom, 1 is top' },
        {
          path: 'lens.grain',
          label: 'Film grain',
          hint: 'Only shows while the background is on',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [MOTION.speed, MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: [
    'look.ink',
    'look.muted',
    'look.grain',
    'look.liveGrain',
    'look.spotlight',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
