import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ChalkBadgeGridProps } from './chalk-badge-grid';

export const chalkBadgeGridControls = defineControls<ChalkBadgeGridProps>({
  sections: [
    {
      title: 'Badges',
      fields: [
        {
          path: 'badges',
          label: 'Badges',
          hint: 'Filled into the grid left to right, top to bottom',
          items: {
            variant: 'Badge design',
            word: 'Word',
            line: 'Chalk line color',
            fill: 'Fill color',
            text: 'Word color',
          },
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          ...LOOK.ink,
          label: 'Primary color',
          hint: 'The chalk dots where the grid lines cross, grid pattern only. Each badge keeps its own line, fill and word colors, set in Badges',
        },
        {
          ...LOOK.paperLine,
          label: 'Secondary color',
          hint: 'The board pattern lines',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The chalkboard, center and edges together',
        },
      ],
      more: [
        { ...LOOK.background, label: 'Board color' },
        { ...LOOK.backgroundEdge, label: 'Board edge color' },
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when the margin line is on' },
      ],
    },
    {
      title: 'Grid',
      fields: [
        { path: 'columns', label: 'Columns', hint: 'Rows are added as needed to fit every badge' },
        {
          path: 'scale',
          label: 'Badge size',
          hint: '1 is full size. Large sizes with many columns make badges overlap',
        },
      ],
      more: [
        {
          path: 'insetX',
          label: 'Side margin',
          hint: 'Pixels kept clear at the left and right of the grid',
        },
        {
          path: 'insetY',
          label: 'Top and bottom margin',
          hint: 'Pixels kept clear above and below the grid',
        },
      ],
    },
    {
      title: 'Drawing',
      fields: [
        {
          path: 'order',
          label: 'Draw order',
          hint: 'Scattered at random, in grid order, or from the last badge back',
        },
        {
          path: 'timing.drawFrames',
          label: 'Draw length',
          hint: 'Frames each badge takes to sketch on',
        },
      ],
      more: [
        {
          path: 'stagger',
          label: 'Gap between badges',
          hint: 'Frames between one badge starting to draw and the next',
        },
        {
          path: 'delay',
          label: 'Start delay',
          hint: 'Frames before the first badge starts to draw',
        },
        {
          path: 'shuffle',
          label: 'Scatter pattern',
          hint: 'Scattered draw order only. Pick another number for a different random order',
        },
      ],
    },
    {
      title: 'Wipe',
      fields: [
        {
          path: 'timing.eraseAt',
          label: 'Wipe starts at',
          hint: 'Frames after the start delay when the first badge begins to wipe',
        },
      ],
      more: [
        {
          path: 'timing.eraseFrames',
          label: 'Wipe length',
          hint: 'Frames each badge takes to wipe away',
        },
        {
          path: 'eraseStagger',
          label: 'Gap between wipes',
          hint: 'Frames between one badge wiping and the next, in the same order they drew',
        },
      ],
    },
    {
      title: 'Chalk',
      fields: [{ path: 'chalk.width', label: 'Stroke width' }],
      more: [
        {
          path: 'chalk.roughness',
          label: 'Rough edges',
          hint: 'Higher makes the chalk edges more ragged',
        },
        {
          path: 'chalk.dryness',
          label: 'Dry chalk texture',
          hint: 'Higher leaves more speckled gaps in the strokes',
        },
        {
          path: 'chalk.shadow',
          label: 'Drop shadow',
          hint: 'Strength of the shadow under each badge',
        },
      ],
    },
    {
      title: 'Board',
      fields: [
        { ...LOOK.showBackdrop, label: 'Show chalkboard' },
        {
          ...LOOK.paper,
          label: 'Board pattern',
          hint: 'Grid also adds chalk dots where the lines cross',
        },
      ],
      more: [
        { ...LOOK.grain, label: 'Board grain' },
        LOOK.spotlight,
        LOOK.liveGrain,
        { ...LOOK.paperSpacing, label: 'Pattern spacing' },
        { ...LOOK.paperMargin, label: 'Margin line' },
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        {
          ...MOTION.speed,
          hint: 'Scales the drawing and wipe timing. Entrance and exit keep their length',
        },
      ],
      more: [
        MOTION.enterFrames,
        { ...MOTION.exit, hint: 'Plays only when Exit length is above 0' },
        {
          ...MOTION.exitFrames,
          hint: 'In frames. The exit only plays when this is above 0, and it is 0 by default',
        },
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
