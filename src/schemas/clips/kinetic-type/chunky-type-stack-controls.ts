import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ChunkyTypeStackProps } from './chunky-type-stack';

export const chunkyTypeStackControls = defineControls<ChunkyTypeStackProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'lines',
          label: 'Headline lines',
          items: { text: 'Words', size: 'Text size', offset: 'Sideways shift' },
        },
        { path: 'font', label: 'Font', hint: 'Used for the headline, burst glyph and end tag' },
        { path: 'endTag', label: 'End tag' },
      ],
      more: [
        {
          path: 'burst.text',
          label: 'Burst glyph',
          hint: 'The giant character that punches through between the headline and the end tag',
        },
        {
          path: 'lineGap',
          label: 'Line spacing',
          hint: "Gap above each line, as a share of that line's text size",
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['color', 'endTagColor'],
          label: 'Primary color',
          hint: 'The headline letters and the end tag',
        },
        {
          path: 'burst.color',
          label: 'Secondary color',
          hint: 'The giant burst glyph that punches through',
        },
        { path: 'bar.color', label: 'Accent color', hint: 'The underline bar' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and edge of the chalkboard together',
        },
      ],
      more: [
        { path: 'color', label: 'Headline color' },
        { path: 'endTagColor', label: 'End tag color' },
        { ...LOOK.background, label: 'Board color' },
        { ...LOOK.backgroundEdge, label: 'Board edge color' },
        { ...LOOK.paperLine, label: 'Board line color' },
        {
          path: 'look.ink',
          label: 'Grid dot color',
          hint: 'Dots at the grid crossings, shown with the grid pattern',
        },
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Margin line is on' },
      ],
    },
    {
      title: 'Pop-in',
      fields: [
        {
          path: 'letterFrames',
          label: 'Frames per letter',
          hint: 'Lower pops letters in faster. Also paces the end tag letters',
        },
        {
          path: 'jitter',
          label: 'Hand-cut wobble',
          hint: 'How much each letter tilts, bobs and varies in size. 0 sets them straight',
        },
      ],
      more: [
        { path: 'popFrames', label: 'Letter pop length', hint: 'In frames' },
        {
          path: 'popBounce',
          label: 'Pop bounce',
          hint: 'How far each letter overshoots before settling. 0 grows without overshoot',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames' },
        {
          path: 'seed',
          label: 'Wobble pattern',
          hint: "Reshuffles each letter's tilt, bob and size. Needs some hand-cut wobble",
        },
      ],
    },
    {
      title: 'Underline',
      fields: [{ path: 'bar.show', label: 'Show underline' }],
      more: [
        { path: 'bar.line', label: 'Underlined line', hint: 'Counted from 0 for the top line' },
        { path: 'bar.width', label: 'Underline length', hint: 'Percent of the line width' },
        { path: 'bar.height', label: 'Underline thickness', hint: 'In pixels' },
        {
          path: 'bar.frames',
          label: 'Underline draw length',
          hint: 'In frames, starting once every letter has popped in',
        },
      ],
    },
    {
      title: 'Outro',
      fields: [
        {
          path: 'exitAt',
          label: 'Headline breaks apart at',
          hint: 'Frame number when the top line starts shrinking away. The burst and end tag follow',
        },
      ],
      more: [
        {
          path: 'lineStagger',
          label: 'Line stagger',
          hint: 'Frames between each line starting to leave',
        },
        { path: 'burst.size', label: 'Burst glyph size', hint: 'In pixels' },
        { path: 'endTagSize', label: 'End tag size', hint: 'In pixels' },
        {
          path: 'exitFrames',
          label: 'Letter shrink length',
          hint: 'In frames, also how fast the underline retracts',
        },
        {
          path: 'exitLetterStagger',
          label: 'Letter exit stagger',
          hint: 'Frames between letters in a line as it breaks apart. Longer delays the burst',
        },
        {
          path: 'burst.frames',
          label: 'Burst length',
          hint: 'In frames, the end tag pops in as it finishes',
        },
        { path: 'endTagSpacing', label: 'End tag letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Chalkboard',
      fields: [{ ...LOOK.showBackdrop, label: 'Show chalkboard' }],
      more: [
        {
          path: 'chalk.roughness',
          label: 'Chalk edge roughness',
          hint: 'Higher makes the headline, underline and end tag edges more wobbly',
        },
        {
          path: 'chalk.dryness',
          label: 'Chalk dryness',
          hint: 'Higher breaks the headline and end tag into dusty speckles',
        },
        {
          path: 'chalk.shadow',
          label: 'Drop shadow',
          hint: 'Shadow under the headline and end tag',
        },
        LOOK.grain,
        LOOK.spotlight,
        LOOK.liveGrain,
        { ...LOOK.paper, label: 'Board pattern' },
        { ...LOOK.paperSpacing, label: 'Board line spacing' },
        { ...LOOK.paperMargin, label: 'Margin line' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the pop-in, outro and burst timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float', 'chalk.width'],
});
