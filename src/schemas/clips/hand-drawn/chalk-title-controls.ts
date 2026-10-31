import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ChalkTitleProps } from './chalk-title';

export const chalkTitleControls = defineControls<ChalkTitleProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'left', label: 'Left word' },
        { path: 'right', label: 'Right word' },
        { path: 'center.word', label: 'Center word', hint: 'Drawn between the two words' },
        {
          path: 'wordFont',
          label: 'Word font',
          hint: 'Script: brush handwriting. Thin: narrow hand lettering. Bold: tall condensed sans. Chunky: rounded cartoon caps. Serif: heavy display serif',
        },
      ],
      more: [
        {
          path: 'center.variant',
          label: 'Center badge style',
          hint: 'Wider styles may need more space around the center',
        },
        { path: 'wordSize', label: 'Word size', hint: 'In pixels' },
        { path: 'centerScale', label: 'Center badge size' },
        {
          path: 'gap',
          label: 'Space around the center',
          hint: 'Distance in pixels from the middle to each word',
        },
        {
          path: 'wordTilt',
          label: 'Word tilt',
          hint: 'In degrees, negative tilts the words up to the right',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['wordColor', 'center.text', 'center.line'],
          label: 'Primary color',
          hint: 'The chalk: both words, the center word and the center badge lines together',
        },
        {
          link: ['center.fill', 'look.accent'],
          label: 'Accent color',
          hint: 'Sparkles and solid shapes of the center badge, and the board margin line when it is on',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the chalkboard together',
        },
      ],
      more: [
        { path: 'wordColor', label: 'Word color', hint: 'The left and right words' },
        { path: 'center.text', label: 'Center word color' },
        {
          path: 'center.line',
          label: 'Center line color',
          hint: 'Outlines and drawn lines of the center badge',
        },
        {
          path: 'center.fill',
          label: 'Center accent color',
          hint: 'Sparkles and solid shapes of the center badge',
        },
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Paper margin line is on' },
        { ...LOOK.background, label: 'Board color' },
        { ...LOOK.backgroundEdge, label: 'Board edge color' },
        { ...LOOK.paperLine, label: 'Pattern line color', hint: 'Grid and ruled pattern lines' },
        {
          ...LOOK.ink,
          label: 'Grid dot color',
          hint: 'Chalk dots at the grid crossings, Grid pattern only',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'drawFrames',
          label: 'Writing length',
          hint: 'Frames to write the left word, the center badge and the right word',
        },
        {
          path: 'eraseAt',
          label: 'Erase starts at',
          hint: 'Frames after the start delay',
        },
      ],
      more: [
        {
          path: 'eraseFrames',
          label: 'Erase length',
          hint: 'In frames, the right word unwrites first',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames' },
      ],
    },
    {
      title: 'Chalk',
      fields: [
        {
          path: 'chalk.dryness',
          label: 'Chalk dryness',
          hint: 'Higher leaves more gaps in the chalk',
        },
      ],
      more: [
        {
          path: 'chalk.roughness',
          label: 'Edge roughness',
          hint: 'Higher makes the chalk edges wobble more',
        },
        { path: 'chalk.shadow', label: 'Drop shadow' },
        {
          path: 'chalk.width',
          label: 'Stroke thickness',
          hint: 'Only for center badge styles drawn with lines',
        },
      ],
    },
    {
      title: 'Board',
      fields: [{ ...LOOK.showBackdrop, label: 'Show chalkboard' }],
      more: [
        { path: 'look.paper', label: 'Board pattern' },
        LOOK.grain,
        LOOK.spotlight,
        LOOK.liveGrain,
        { ...LOOK.paperSpacing, label: 'Pattern spacing', hint: 'In pixels' },
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        MOTION.exit,
        {
          ...MOTION.speed,
          hint: 'Scales the writing and erase timing. Entrance and exit keep their length',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
