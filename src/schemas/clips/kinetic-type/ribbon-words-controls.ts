import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { RibbonWordsProps } from './ribbon-words';

const FRAME_NUMBER = 'Frame number';
const IN_FRAMES = 'In frames';
const TIGHT_BENDS =
  'Bends never get tighter than the ribbon can take: the waves flatten a little instead of pinching';

export const ribbonWordsControls = defineControls<RibbonWordsProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'text',
          label: 'Phrase',
          hint: 'Rides along the ribbon on one line. Keep it short so it fits inside the frame',
        },
        {
          path: 'highlight',
          label: 'Highlighted word',
          hint: 'Colored with the Accent color. Leave empty to keep every letter one color',
        },
        {
          path: 'words.size',
          label: 'Text size',
          hint: 'In pixels. Keep it under the ribbon width',
        },
      ],
      more: [
        { path: 'words.weight', label: 'Font weight' },
        { path: 'words.tracking', label: 'Letter spacing', hint: 'In em' },
        {
          path: 'words.centering',
          label: 'Vertical centering',
          hint: 'Moves the letters across the ribbon, as a share of the text size. Raise it to push them toward the lower edge',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'ribbon.color',
          label: 'Primary color',
          hint: 'The ribbon, plus the letters in Outline style. Light version swaps it with the Background color',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The background, plus the letters cut into a solid ribbon. Light version swaps it with the Primary color',
        },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'The highlighted word, and the margin line when Paper margin is on',
        },
      ],
      more: [
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'Also the letter color on a solid ribbon, and the ribbon color in Light version',
        },
        {
          ...LOOK.backgroundEdge,
          hint: 'Color the background fades to at the corners. Light version uses a flat Primary color instead',
        },
        { ...LOOK.paperLine, hint: 'Shows when Paper pattern is on' },
      ],
    },
    {
      title: 'Ribbon',
      fields: [
        {
          path: 'ribbon.style',
          label: 'Ribbon style',
          hint: 'Solid cuts the letters out of the ribbon in the background color. Outline draws two thin edges with a see-through middle and letters in the Primary color',
        },
      ],
      more: [
        { path: 'ribbon.width', label: 'Ribbon width', hint: 'In pixels' },
        {
          path: 'ribbon.outline',
          label: 'Outline thickness',
          hint: 'In pixels. Outline style only',
        },
      ],
    },
    {
      title: 'Second ribbon',
      fields: [
        {
          path: 'second.enabled',
          label: 'Show second ribbon',
          hint: 'A parallel ribbon behind the first, with its own phrase',
        },
      ],
      more: [
        { path: 'second.text', label: 'Second phrase' },
        {
          path: 'second.offsetY',
          label: 'Distance',
          hint: 'Gap from the first ribbon, center to center, measured across the overall direction of the path, in pixels. Negative puts it above',
        },
        {
          path: 'second.shift',
          label: 'Wave offset',
          hint: 'Shifts its waves against the first ribbon, in degrees. 0 keeps the two parallel',
        },
        {
          path: 'second.delay',
          label: 'Draw-on delay',
          hint: 'Frames it starts after the first ribbon. It retracts with the first one, but never before it has finished drawing, so long delays can still be leaving when the clip ends',
        },
      ],
    },
    {
      title: 'Path',
      fields: [
        {
          path: 'path.shape',
          label: 'Path shape',
          hint: 'Wave snakes up and down, Swoop is one big arc across the frame, Swell is a wave that grows toward the right',
        },
        {
          path: 'path.amplitude',
          label: 'Wave height',
          hint: `In pixels above and below the center line. 0 makes a straight ribbon. ${TIGHT_BENDS}`,
        },
      ],
      more: [
        {
          path: 'path.waves',
          label: 'Wave count',
          hint: `Full waves you see across the frame width. Swoop ignores it. ${TIGHT_BENDS}`,
        },
        {
          path: 'path.drop',
          label: 'Tilt',
          hint: 'How much lower the ribbon meets the right edge of the frame than the left edge, in pixels. Negative tilts it up',
        },
        {
          path: 'path.centerY',
          label: 'Vertical position',
          hint: 'Where the center line crosses the middle of the frame, in pixels from the top',
        },
        {
          path: 'path.shift',
          label: 'Wave shift',
          hint: 'Slides the waves sideways, in degrees. For Swoop, 0 arcs upward, 180 arcs downward and 90 flattens it',
        },
        {
          path: 'path.breathe',
          label: 'Wave breathing',
          hint: 'How far the ribbon slowly sways, in pixels. 0 holds the path still',
        },
        { path: 'path.breatheFrames', label: 'Breathing cycle', hint: 'Frames per sway' },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          ...MOTION.speed,
          hint: 'Scales every beat. The exit fade keeps its length. Below 1 the retract can be cut off',
        },
      ],
      more: [
        { path: 'timing.drawFrames', label: 'Draw-on length', hint: IN_FRAMES },
        {
          path: 'timing.settleAt',
          label: 'Resting spot',
          hint: 'Where the middle of the phrase settles, as a share of the path from the left. The second phrase rests beside it',
        },
        {
          path: 'timing.drift',
          label: 'Drift speed',
          hint: 'Pixels per frame the words keep gliding on screen while they rest; they never move slower than this. 1 is the slowest',
        },
        {
          path: 'timing.retractAt',
          label: 'Retract at',
          hint: `${FRAME_NUMBER}; the ribbon pulls off from the left and takes the words with it. Never starts before the draw-on finishes`,
        },
        { path: 'timing.drawAt', label: 'Draw-on starts at', hint: FRAME_NUMBER },
        {
          path: 'timing.lag',
          label: 'Text lag',
          hint: 'Gap between the end of the phrase and the drawing tip while it rides, in pixels',
        },
        {
          path: 'timing.settleFrames',
          label: 'Settle length',
          hint: 'Frames the words take to slow from the ribbon tip to the drift speed',
        },
        { path: 'timing.retractFrames', label: 'Retract length', hint: IN_FRAMES },
      ],
    },
    {
      title: 'Background',
      fields: [
        LOOK.showBackdrop,
        {
          path: 'inverted',
          label: 'Light version',
          hint: 'Swaps the two colors: Primary color fills the background, Background color fills the ribbon, and solid-ribbon letters turn light',
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
      fields: [MOTION.exit],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
