import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { LensOrbitProps } from './lens-orbit';

export const lensOrbitControls = defineControls<LensOrbitProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'words',
          label: 'Big words',
          hint: 'One per line. The sphere turns to each in order; past six words the faces repeat their spots',
        },
        {
          path: 'satellites',
          label: 'Orbiting words',
          hint: 'Separated by spaces. Two small words orbit each big word, taken in order',
        },
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Separated by spaces. Big words listed here use the primary color',
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
          link: ['look.accent', 'satelliteAccent'],
          label: 'Primary color',
          hint: 'Highlighted big words, the lower orbiting word and the corner glow',
        },
        {
          link: ['look.ink', 'satelliteColor'],
          label: 'Text color',
          hint: 'Big words that are not highlighted and the upper orbiting word',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and edges of the background together',
        },
      ],
      more: [
        {
          ...LOOK.accent,
          label: 'Highlight and glow color',
          hint: 'Highlighted big words and the corner glow',
        },
        { path: 'satelliteAccent', label: 'Lower orbiting word color' },
        { ...LOOK.ink, label: 'Big word color', hint: 'Big words that are not highlighted' },
        { path: 'satelliteColor', label: 'Upper orbiting word color' },
        LOOK.background,
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Sphere',
      fields: [
        {
          path: 'radius',
          label: 'Sphere size',
          hint: 'Radius the words wrap around. Words are sized in degrees, so they grow with it',
        },
      ],
      more: [
        {
          path: 'wordHeight',
          label: 'Word size',
          hint: 'Letter height in degrees of the sphere. Also sets how far the orbiting words sit from it',
        },
        {
          path: 'satelliteScale',
          label: 'Orbiting word size',
          hint: 'Relative to the big words',
        },
        {
          path: 'maxArc',
          label: 'Longest word width',
          hint: 'In degrees of the sphere. Longer words shrink to fit',
        },
        {
          path: 'edgeFade',
          label: 'Edge fade',
          hint: 'Fades letters as they curve away from the camera',
        },
        {
          path: 'wobble',
          label: 'Wobble',
          hint: 'Constant gentle sway of the sphere, in radians. 0 keeps it still between turns',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        { path: 'holdFrames', label: 'Hold on each word', hint: 'In frames' },
        { path: 'turnFrames', label: 'Turn length', hint: 'In frames. Lower snaps faster' },
      ],
      more: [
        { path: 'introFrames', label: 'Intro length', hint: 'In frames' },
        { path: 'delay', label: 'Start delay', hint: 'In frames' },
        {
          path: 'introSpin',
          label: 'Intro spin',
          hint: 'How far the sphere spins as it arrives, in radians. 0 arrives without spinning',
        },
        {
          path: 'introScale',
          label: 'Intro start size',
          hint: 'The sphere grows from this scale to full size during the intro',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'lens.shutter',
          label: 'Motion blur',
          hint: 'Frames of movement blended into each frame. Higher smears the sphere more as it turns, 0 is sharp',
        },
      ],
      more: [
        { path: 'camera.distance', label: 'Camera distance', hint: 'Higher pulls the camera back' },
        { path: 'camera.drift', label: 'Camera drift', hint: 'Slow handheld sway' },
        { path: 'camera.fieldOfView', label: 'Field of view', hint: 'In degrees' },
        {
          path: 'lens.distortion',
          label: 'Lens bulge',
          hint: 'Barrel distortion toward the edges',
        },
        { path: 'lens.fringe', label: 'Color fringing', hint: 'Rainbow edges toward the corners' },
        {
          path: 'lens.shift',
          label: 'Color split',
          hint: 'Sideways red and blue offset, in pixels at 1920 wide',
        },
        {
          path: 'lens.samples',
          label: 'Blur quality',
          hint: 'Exposures blended per frame. The live preview uses at most 3',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        { ...LOOK.showBackdrop, hint: 'Off renders the words over transparency' },
        {
          path: 'lens.glow',
          label: 'Corner glow',
          hint: 'Glow in the primary color, shown with the background on',
        },
      ],
      more: [
        { path: 'lens.glowX', label: 'Glow position across', hint: '0 is left, 1 is right' },
        { path: 'lens.glowY', label: 'Glow position up', hint: '0 is bottom, 1 is top' },
        {
          path: 'lens.grain',
          label: 'Film grain',
          hint: 'Only shows with the background on',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the intro, holds, turns, wobble and camera drift. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
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
