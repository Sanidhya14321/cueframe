import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { WordStreamsProps } from './word-streams';

const PER_FRAME = 'In pixels per frame';

const MAY_SHRINK =
  'The word and swell shrink together if the streams would touch each other or the side margins';

const LIGHT_ONLY_EDGE =
  'Color the background fades to at the corners. In Dark look the corners darken by the same step';

export const wordStreamsControls = defineControls<WordStreamsProps>({
  sections: [
    {
      title: 'Word',
      fields: [
        {
          path: 'word.text',
          label: 'Word',
          hint: 'Repeated along every stream. Short words keep the type largest',
        },
        {
          path: 'word.size',
          label: 'Word size',
          hint: `In pixels, for the copies between swells. ${MAY_SHRINK}`,
        },
      ],
      more: [
        { path: 'word.weight', label: 'Font weight' },
        {
          path: 'word.spacing',
          label: 'Copy spacing',
          hint: 'Gap between neighboring copies, as a share of the word size. 0 lets them just touch at the tightest bend; the measured word height and width are always allowed for',
        },
        { path: 'word.tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'look.accent'],
          label: 'Primary color',
          hint: 'The words, plus the paper margin line when it is on. With Dark look on, this fills the background instead',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together. With Dark look on, this colors the words instead',
        },
      ],
      more: [
        {
          ...LOOK.ink,
          label: 'Word color',
          hint: 'With Dark look on, this becomes the background',
        },
        {
          ...LOOK.accent,
          label: 'Margin line color',
          hint: 'Shows when Paper margin line is on. In Dark look, a line matching the ink turns light with the type',
        },
        { ...LOOK.background, hint: 'With Dark look on, this colors the type instead' },
        { ...LOOK.backgroundEdge, hint: LIGHT_ONLY_EDGE },
        LOOK.paperLine,
      ],
    },
    {
      title: 'Streams',
      fields: [
        {
          path: 'streams.count',
          label: 'Streams',
          hint: 'Spread evenly across the frame between the side margins',
        },
      ],
      more: [
        {
          path: 'streams.margin',
          label: 'Side margins',
          hint: 'Smallest gap in pixels between the outer streams and the frame edges, at every frame',
        },
        {
          path: 'streams.phaseStep',
          label: 'Curve offset',
          hint: 'In degrees between neighboring streams, mirrored around the center. 180 swings neighbors in opposite directions; 0 keeps them parallel',
        },
      ],
    },
    {
      title: 'Wave',
      fields: [
        {
          path: 'wave.amplitude',
          label: 'Curve width',
          hint: `How far each stream swings to the side, in pixels. 0 runs them straight. ${MAY_SHRINK}`,
        },
      ],
      more: [
        {
          path: 'wave.length',
          label: 'Curve length',
          hint: 'In pixels from one bend to the same bend again, measured top to bottom',
        },
        {
          path: 'wave.sway',
          label: 'Sway speed',
          hint: `${PER_FRAME} the bends slide down the frame; negative slides them up, 0 holds the curves still. Scaled by Animation speed`,
        },
      ],
    },
    {
      title: 'Swell',
      fields: [
        {
          path: 'swell.peak',
          label: 'Swell size',
          hint: `Size of the biggest copy in each swell, in pixels. Set it to the word size for no swell. ${MAY_SHRINK}`,
        },
      ],
      more: [
        {
          path: 'swell.length',
          label: 'Copies per swell',
          hint: 'How many copies pass from one swell to the next',
        },
        {
          path: 'swell.offset',
          label: 'Swell offset',
          hint: 'Share of a swell between neighboring streams, mirrored around the center. 0.5 alternates big and small',
        },
        {
          path: 'swell.sharpness',
          label: 'Swell sharpness',
          hint: 'Higher keeps the big copies to a shorter run with more small ones between',
        },
        {
          path: 'swell.drift',
          label: 'Swell overtake speed',
          hint: `${PER_FRAME}. 0 carries the swell along with the copies. Above 0 it runs ahead, so copies grow and shrink as it passes and their speed varies slightly. Scaled by Animation speed`,
        },
        {
          path: 'swell.outline',
          label: 'Outline the swell',
          hint: 'Draws the biggest copies as outlines instead of solid type',
        },
        {
          path: 'swell.outlineFrom',
          label: 'Outline from',
          hint: 'Share of the swell from which copies are outlined. Lower outlines more of each swell. With an overtake speed the change blends over a short band. Outline the swell only',
        },
        {
          path: 'swell.outlineWidth',
          label: 'Outline thickness',
          hint: 'In pixels. Outline the swell only',
        },
      ],
    },
    {
      title: 'Flow',
      fields: [
        {
          path: 'flow.speed',
          label: 'Flow speed',
          hint: `${PER_FRAME} along the curve, always whole pixels so the type never judders. 0 parks the copies. Not scaled by Animation speed`,
        },
        {
          path: 'flow.direction',
          label: 'Flow direction',
          hint: 'Which way the copies travel. The slide-in follows the same direction',
        },
      ],
      more: [
        {
          path: 'flow.alternate',
          label: 'Alternate streams',
          hint: 'Every second stream flows the opposite way',
        },
        {
          path: 'flow.riseDistance',
          label: 'Slide-in distance',
          hint: 'In pixels the streams slide along their flow as they fade in. 0 keeps them in place',
        },
        {
          path: 'flow.fadeFrames',
          label: 'Fade-in length',
          hint: 'In frames for each stream to fade in. 0 shows them at once',
        },
        {
          path: 'flow.riseFrames',
          label: 'Slide-in length',
          hint: 'In frames for the first stream to settle into the flow. 0 turns the slide off',
        },
        {
          path: 'flow.riseStagger',
          label: 'Slide-in stagger',
          hint: 'Extra frames each stream takes to fade in and settle after its left neighbor',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        LOOK.showBackdrop,
        {
          path: 'tone.dark',
          label: 'Dark look',
          hint: 'Swaps the background and word colors for light type on a dark field',
        },
      ],
      more: [
        LOOK.grain,
        LOOK.spotlight,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          ...MOTION.speed,
          hint: 'Speeds up the sway and the swell overtake. Flow speed, the slide-in and the fade-in keep their own pace, and so do the entrance and exit',
        },
        MOTION.enter,
        MOTION.exit,
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
