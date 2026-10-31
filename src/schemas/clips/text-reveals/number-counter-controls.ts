import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { NumberCounterProps } from './number-counter';

export const numberCounterControls = defineControls<NumberCounterProps>({
  sections: [
    {
      title: 'Number',
      fields: [
        {
          path: 'from',
          label: 'Count from',
          hint: 'Set it above Count to and the number counts down',
        },
        { path: 'to', label: 'Count to' },
        { path: 'prefix', label: 'Prefix', hint: 'Text before the number, such as $' },
        { path: 'suffix', label: 'Suffix', hint: 'Text after the number, such as % or +' },
      ],
      more: [
        {
          path: 'separator',
          label: 'Thousands separator',
          hint: 'Placed before the last three digits, such as a comma for 1,250. Leave empty for none',
        },
        {
          path: 'affixScale',
          label: 'Prefix and suffix size',
          hint: 'Relative to the number, 1 matches it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'affixColor', 'glowColor'],
          label: 'Primary color',
          hint: 'The digits, the prefix and suffix, and the glow around them',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { ...LOOK.ink, label: 'Digit color' },
        {
          path: 'affixColor',
          label: 'Prefix and suffix color',
          hint: 'Shows when a prefix or suffix is set',
        },
        {
          path: 'glowColor',
          label: 'Glow color',
          hint: 'Glow around the digits, prefix and suffix',
        },
        LOOK.background,
        LOOK.backgroundEdge,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when the paper has a margin' },
        LOOK.paperLine,
      ],
    },
    {
      title: 'Count',
      fields: [
        {
          path: 'roll',
          label: 'Digit roll',
          hint: 'At 0 the number counts in place out of a blur. Above 0 the number fades in as the count starts and each digit rolls like an odometer, with more travel between digits at higher values',
        },
        { path: 'countFrames', label: 'Count length', hint: 'In frames, lower counts faster' },
      ],
      more: [{ path: 'delay', label: 'Count starts at', hint: 'Frame number' }],
    },
    {
      title: 'Style',
      fields: [
        { path: 'size', label: 'Number size', hint: 'In pixels' },
        { path: 'glow', label: 'Glow', hint: 'Steady glow around the number' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        {
          path: 'bloom',
          label: 'Glow flash',
          hint: 'Extra glow that is brightest as the count starts and fades out as the number lands',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [PLACEMENT.horizontal],
      more: [
        PLACEMENT.vertical,
        {
          ...PLACEMENT.width,
          label: 'Number box width',
          hint: 'The number never wraps. Sets where left or right aligned numbers sit',
        },
        PLACEMENT.insetX,
        PLACEMENT.insetY,
      ],
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
        { ...LOOK.paperMargin, hint: 'Drawn in the margin line color' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the count and glow timing, including the start frame. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
