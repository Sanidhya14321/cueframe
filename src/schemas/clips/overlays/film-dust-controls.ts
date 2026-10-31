import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { FilmDustProps } from './film-dust';

export const filmDustControls = defineControls<FilmDustProps>({
  sections: [
    {
      title: 'Film wear',
      fields: [
        {
          path: 'dust',
          label: 'Dust specks',
          hint: 'Higher scatters more specks across the frame',
        },
        { path: 'hairs', label: 'Stray hairs', hint: 'Higher shows more curled hairs at once' },
        {
          path: 'scratches',
          label: 'Scratches',
          hint: 'Higher flashes more faint vertical lines down the full height of the frame',
        },
        {
          path: 'vignette',
          label: 'Vignette',
          hint: 'Darkens the edges of the frame like an old projector. 0 turns it off',
        },
      ],
      more: [
        {
          path: 'seed',
          label: 'Random pattern',
          hint: 'Pick another number for a different arrangement of marks',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { path: 'color', label: 'Primary color', hint: 'Dust specks, hairs and scratches' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { ...LOOK.background, label: 'Background center' },
        LOOK.backgroundEdge,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when the paper has a margin' },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'gateFrames',
          label: 'Mark lifetime',
          hint: 'Higher keeps each speck, hair and scratch on screen longer',
        },
        {
          ...MOTION.speed,
          label: 'Flicker speed',
          hint: 'Higher makes marks come and go faster. Entrance and exit keep their length',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Turn off to lay the dust over other layers',
        },
      ],
      more: [
        {
          ...LOOK.grain,
          hint: 'Noise drawn over the background, so it disappears when the background is off',
        },
        LOOK.liveGrain,
        LOOK.spotlight,
        LOOK.paper,
        LOOK.paperLine,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        MOTION.exit,
        {
          ...MOTION.exitFrames,
          hint: 'In frames. Starts at 0, so raise it for the exit to play',
        },
      ],
      more: [MOTION.enterFrames],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
