import { defineControls } from '../../control-layout';
import type { SceneTransitionProps } from './scene-transition';

export const sceneTransitionControls = defineControls<SceneTransitionProps>({
  sections: [
    {
      title: 'Transition',
      fields: [
        {
          path: 'kind',
          label: 'Style',
          hint: 'How the color covers the frame and opens again. Iris: a circle grows, then a hole opens from its center. Wipe: a panel slides across and out the far side. Split: a band grows from the middle line out to the top and bottom edges, then shrinks back. Split vertical does the same toward the left and right edges',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'color',
          label: 'Primary color',
          hint: 'The solid color that covers the frame',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'holdFrames',
          label: 'Hold fully covered',
          hint: 'In frames. The color fills the whole frame this long before opening, a clean spot to cut between clips. The cover and reveal speed up to keep the clip length',
        },
        {
          path: 'easing',
          label: 'Easing curve',
          hint: 'Shapes both the cover and the reveal',
        },
      ],
    },
    {
      title: 'Iris center',
      fields: [
        {
          path: 'centerX',
          label: 'Center across',
          hint: 'Iris style only. Percent of the width, 0 is the left edge',
        },
        {
          path: 'centerY',
          label: 'Center down',
          hint: 'Iris style only. Percent of the height, 0 is the top edge',
        },
      ],
    },
  ],
});
