import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { WordFieldProps } from './word-field';

const NEEDS_BACKGROUND = 'Only shows while the background is on';

export const wordFieldControls = defineControls<WordFieldProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'words',
          label: 'Words',
          hint: 'One per line; they repeat to fill every spot in the field',
        },
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Words from the list to paint in the primary color, separated by spaces. Case does not matter',
        },
      ],
      more: [
        { path: 'face', label: 'Font' },
        { path: 'weight', label: 'Font weight' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.accent', 'glowColor'],
          label: 'Primary color',
          hint: `The highlighted words and the background glow together. The glow ${NEEDS_BACKGROUND.toLowerCase()}`,
        },
        { ...LOOK.ink, label: 'Text color', hint: 'Every word that is not highlighted' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: `Center and corners of the background together. ${NEEDS_BACKGROUND}`,
        },
      ],
      more: [
        { ...LOOK.accent, label: 'Highlight color', hint: 'The highlighted words only' },
        { path: 'glowColor', label: 'Glow color', hint: NEEDS_BACKGROUND },
        { ...LOOK.background, hint: NEEDS_BACKGROUND },
        {
          ...LOOK.backgroundEdge,
          hint: `Color the background fades to at the corners. ${NEEDS_BACKGROUND}`,
        },
      ],
    },
    {
      title: 'Field',
      fields: [
        { path: 'columns', label: 'Columns' },
        { path: 'rows', label: 'Rows' },
      ],
      more: [
        { path: 'minSize', label: 'Smallest word size' },
        {
          path: 'maxSize',
          label: 'Largest word size',
          hint: 'Long words still shrink to fit their spot',
        },
        { path: 'width', label: 'Field width' },
        { path: 'depth', label: 'Field depth', hint: 'How far the field reaches front to back' },
        {
          path: 'jitter',
          label: 'Scatter',
          hint: 'How far words stray from a neat grid',
        },
        {
          path: 'seed',
          label: 'Shuffle',
          hint: 'Rerolls word sizes, scatter, ripple order and bob timing',
        },
      ],
    },
    {
      title: 'Rise',
      fields: [
        {
          path: 'stagger',
          label: 'Ripple spread',
          hint: 'Frames between each word rising, rippling out from the centre',
        },
        { path: 'riseFrames', label: 'Rise length', hint: 'In frames, per word' },
      ],
      more: [
        {
          path: 'rise',
          label: 'Rise depth',
          hint: 'How far below the field each word starts',
        },
        { path: 'float', label: 'Bob height', hint: 'How much each word bobs once it lands' },
        { path: 'delay', label: 'Start delay', hint: 'In frames, before the first word rises' },
        {
          path: 'riseTip',
          label: 'Rise tip',
          hint: 'How far each word starts tipped back; it straightens as it lands. 0 rises flat',
        },
        { path: 'bobTempo', label: 'Bob slowness', hint: 'Higher values bob more slowly' },
      ],
    },
    {
      title: 'Camera',
      fields: [{ path: 'tilt', label: 'Field tilt', hint: 'Degrees the field leans back' }],
      more: [
        {
          path: 'spin',
          label: 'Turn over the clip',
          hint: 'Degrees the field rotates from start to end',
        },
        { path: 'camera.distance', label: 'Camera distance' },
        { path: 'turn', label: 'Field rotation', hint: 'Rotation in degrees at mid-clip' },
        {
          path: 'slide',
          label: 'Diagonal glide',
          hint: 'How far the field drifts down and across over the clip',
        },
        {
          path: 'camera.drift',
          label: 'Camera sway',
          hint: 'Gentle handheld wander of the camera',
        },
        { path: 'camera.fieldOfView', label: 'Field of view' },
      ],
    },
    {
      title: 'Lens',
      fields: [
        {
          path: 'lens.shutter',
          label: 'Motion blur',
          hint: 'Frames of movement blended into each frame',
        },
      ],
      more: [
        {
          path: 'lens.distortion',
          label: 'Lens bulge',
          hint: 'Barrel distortion toward the edges',
        },
        { path: 'lens.grain', label: 'Film grain', hint: NEEDS_BACKGROUND },
        {
          path: 'lens.fringe',
          label: 'Color fringing',
          hint: 'Red and blue edges toward the corners',
        },
        {
          path: 'lens.shift',
          label: 'Color split',
          hint: 'Sideways red and blue offset in pixels',
        },
        {
          path: 'lens.samples',
          label: 'Blur quality',
          hint: 'More samples render smoother blur but slower; the preview uses at most 3',
        },
      ],
    },
    {
      title: 'Background',
      fields: [{ ...LOOK.showBackdrop, hint: 'Off leaves the words on a transparent background' }],
      more: [
        { path: 'lens.glow', label: 'Glow strength', hint: NEEDS_BACKGROUND },
        {
          path: 'lens.glowX',
          label: 'Glow position across',
          hint: `0 is left, 1 is right. ${NEEDS_BACKGROUND}`,
        },
        {
          path: 'lens.glowY',
          label: 'Glow height',
          hint: `0 is bottom, 1 is top. ${NEEDS_BACKGROUND}`,
        },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        MOTION.enterFrames,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Scales the rise, bob, turn and camera sway. Entrance and exit keep their length',
        },
      ],
    },
  ],
  hidden: [
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
