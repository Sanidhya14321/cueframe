import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { FloatingCardsProps } from './floating-cards';

export const floatingCardsControls = defineControls<FloatingCardsProps>({
  sections: [
    {
      title: 'Cards',
      fields: [
        {
          path: 'cards',
          label: 'Cards',
          hint: 'Up to four cards; each one pops in after the one before it. A custom card image replaces the card design and keeps its own proportions',
          items: {
            kind: 'Card design',
            image: 'Custom card image',
            x: 'Left and right',
            y: 'Up and down',
            z: 'Toward the camera',
            turn: 'Sideways turn',
            size: 'Card width',
          },
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The backdrop behind the cards, center and corners together. A dark color also switches the 3D lighting to its dark setup',
        },
        {
          path: 'look.paperLine',
          label: 'Secondary color',
          hint: 'Paper rule lines, when a paper pattern is on',
        },
        {
          path: 'look.accent',
          label: 'Accent color',
          hint: 'Paper margin line, when the paper margin is on',
        },
      ],
      more: [
        { ...LOOK.background, label: 'Background center' },
        { ...LOOK.backgroundEdge, label: 'Background corners' },
      ],
    },
    {
      title: 'Pop-in',
      fields: [
        {
          path: 'stagger',
          label: 'Gap between cards',
          hint: 'Frames between one card starting to pop in and the next',
        },
        { path: 'popFrames', label: 'Pop-in length', hint: 'In frames' },
      ],
      more: [
        { path: 'delay', label: 'First card appears at', hint: 'Frame number at playback speed 1' },
        {
          path: 'popLift',
          label: 'Rise distance',
          hint: 'How far below its spot each card starts before rising into place',
        },
        {
          path: 'popScale',
          label: 'Starting size',
          hint: 'Each card grows from this fraction of its size to full size',
        },
      ],
    },
    {
      title: 'Float',
      fields: [
        { ...MOTION.float, label: 'Bob height', hint: 'How far the cards bob up and down' },
        {
          path: 'bobSpeed',
          label: 'Bob speed',
          hint: 'Higher bobs faster; 0 holds the cards still',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [{ ...STAGE.cameraDistance, hint: 'Higher pulls back so the cards look smaller' }],
      more: [
        { ...STAGE.cameraDrift, hint: 'Slow handheld sway of the camera' },
        {
          ...STAGE.fieldOfView,
          hint: 'Lower zooms in and flattens the depth between cards',
        },
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
          hint: 'Scales the card pop-ins and the bob. Camera drift, entrance and exit keep their pace',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: [
    'look.ink',
    'look.muted',
    'stage.keyLight',
    'stage.reflections',
    'stage.shadow',
    'stage.shadowSoftness',
  ],
});
