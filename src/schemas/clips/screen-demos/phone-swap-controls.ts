import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneSwapProps } from './phone-swap';

export const phoneSwapControls = defineControls<PhoneSwapProps>({
  sections: [
    {
      title: 'Screens',
      fields: [
        {
          path: 'screens',
          label: 'Screens',
          hint: 'Two to four, shown in order with the clip length split evenly between them. A custom image replaces the picked app screen',
          items: { screen: 'App screen', customScreen: 'Custom screen image' },
        },
        { path: 'finish', label: 'Phone color' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The backdrop behind the phone, center and corners together. A dark color also switches the studio lighting to its dark setup',
        },
        {
          ...LOOK.paperLine,
          label: 'Secondary color',
          hint: 'The ruled or grid paper lines; shows when Paper pattern is not plain',
        },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'The paper margin line; shows when Paper margin line is on',
        },
      ],
      more: [
        {
          ...LOOK.background,
          hint: 'A dark color also switches the studio lighting to its dark setup',
        },
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Swap',
      fields: [
        { path: 'startSide', label: 'First screen side' },
        {
          path: 'offset',
          label: 'Side distance',
          hint: 'How far left and right of center the phone glides. 0 keeps it centered',
        },
        {
          path: 'spinTurns',
          label: 'Spins per swap',
          hint: 'Full turns the phone makes while it crosses to the other side',
        },
      ],
      more: [
        {
          path: 'turn',
          label: 'Turn toward center',
          hint: 'How far the screen angles inward on each side, in radians. 0 faces the camera',
        },
        {
          path: 'sway',
          label: 'Idle sway',
          hint: 'Slow side to side swivel, in radians. 0 holds still',
        },
        { ...MOTION.float, hint: 'Slow up and down bob' },
        {
          path: 'arriveFrames',
          label: 'Rise in length',
          hint: 'In frames. The phone rises from below the frame; 0 starts it in place',
        },
      ],
    },
    {
      title: 'Phone',
      fields: [{ path: 'scale', label: 'Phone size' }],
      more: [STAGE.reflections, STAGE.keyLight, STAGE.shadow, STAGE.shadowSoftness],
    },
    {
      title: 'Camera',
      fields: [],
      more: [STAGE.cameraDistance, STAGE.cameraDrift, STAGE.fieldOfView],
    },
    {
      title: 'Background',
      fields: [{ ...LOOK.showBackdrop, hint: 'Off leaves the phone on a transparent background' }],
      more: [
        LOOK.grain,
        { ...LOOK.spotlight, hint: 'Soft glow that follows the phone' },
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
          hint: 'Scales the swaps, rise in, sway and float. Below 1 later screens may never appear, above 1 the last screen holds longer. Entrance and exit keep their length',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.ink', 'look.muted'],
});
