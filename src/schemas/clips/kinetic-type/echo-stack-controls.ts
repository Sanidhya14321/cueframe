import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { EchoStackProps } from './echo-stack';

export const echoStackControls = defineControls<EchoStackProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'text', label: 'Phrase', hint: 'Repeated on every row' },
        { path: 'size', label: 'Text size', hint: 'In pixels' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        { path: 'tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { ...LOOK.ink, label: 'Primary color', hint: 'Every row of the phrase' },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'The highlighted row, and the paper margin line when it is on',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [LOOK.background, LOOK.backgroundEdge, LOOK.paperLine],
    },
    {
      title: 'Stack',
      fields: [
        { path: 'rows', label: 'Number of rows' },
        {
          path: 'accentRow',
          label: 'Highlighted row',
          hint: 'Counted from the top, 0 highlights none',
        },
      ],
      more: [
        {
          path: 'lineHeight',
          label: 'Row spacing',
          hint: 'Height of each row as a multiple of the text size',
        },
      ],
    },
    {
      title: 'Row animation',
      fields: [
        {
          path: 'rowStagger',
          label: 'Row stagger',
          hint: 'Frames between one row and the next, on the way in and out',
        },
        {
          path: 'exitAt',
          label: 'Roll away starts at',
          hint: 'Frame number when the top row starts dropping away',
        },
      ],
      more: [
        {
          path: 'rowFrames',
          label: 'Row move length',
          hint: 'In frames, how long each row takes to rise in or drop out. Lower is snappier',
        },
        {
          path: 'delay',
          label: 'Start delay',
          hint: 'In frames, before the top row starts rising',
        },
        {
          path: 'travel',
          label: 'Row travel',
          hint: 'How far each row rises in and drops away. 1 is the default distance, 0 fades in place',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [PLACEMENT.horizontal, PLACEMENT.vertical, PLACEMENT.insetX, PLACEMENT.insetY],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.grain,
        LOOK.spotlight,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'A faded line in the accent color' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales all row timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float', 'placement.width'],
});
