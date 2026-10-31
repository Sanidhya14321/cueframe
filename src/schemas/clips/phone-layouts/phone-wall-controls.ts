import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneWallProps } from './phone-wall';

export const phoneWallControls = defineControls<PhoneWallProps>({
  sections: [
    {
      title: 'Wall',
      fields: [
        {
          path: 'screens',
          label: 'Screens',
          hint: 'Spread across the wall and repeated as needed, each row starting further along the list',
        },
        { path: 'finish', label: 'Phone finish' },
        { path: 'rows', label: 'Rows' },
        { path: 'columns', label: 'Phones per row' },
      ],
      more: [
        {
          path: 'columnGap',
          label: 'Phone spacing',
          hint: 'Center to center within a row, in scene units. A phone is about 1.47 wide',
        },
        {
          path: 'rowGap',
          label: 'Row spacing',
          hint: 'Center to center between rows, in scene units. A phone is 3 tall',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The background behind the wall, center and corners together. A dark color also switches the 3D lighting to its darker setup',
        },
        {
          link: ['look.paperLine', 'look.accent'],
          label: 'Accent color',
          hint: 'Paper pattern lines and the paper margin line. Shows only when the paper pattern or margin line is on',
        },
      ],
      more: [
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'A dark color also switches the 3D lighting to its darker setup',
        },
        LOOK.backgroundEdge,
        LOOK.paperLine,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Paper margin line is on' },
      ],
    },
    {
      title: 'Animation',
      fields: [
        {
          path: 'drift',
          label: 'Row slide',
          hint: 'How far alternating rows glide in opposite directions over the clip, in scene units. 0 holds the wall still',
        },
        {
          path: 'arriveFrames',
          label: 'Fly-in length',
          hint: 'In frames, for the top center phone. Every phone starts together and the rest settle later',
        },
      ],
      more: [
        {
          path: 'stagger',
          label: 'Fly-in ripple',
          hint: 'Extra frames a phone takes to settle for each column away from the center and each row down. 0 lands them all at once',
        },
        {
          path: 'arriveDrop',
          label: 'Fly-in rise',
          hint: 'How far below its spot each phone starts, in scene units. 0 flies straight forward',
        },
        {
          ...MOTION.speed,
          label: 'Fly-in speed',
          hint: 'Scales the fly-in and its ripple. Row slide and transitions keep their timing',
        },
      ],
    },
    {
      title: 'Angle and camera',
      fields: [
        {
          path: 'tilt',
          label: 'Tilt',
          hint: 'Lower values lean the top of the wall further away from the camera',
        },
        { ...STAGE.cameraDistance, hint: 'Higher values pull back to show more of the wall' },
      ],
      more: [
        {
          path: 'turn',
          label: 'Turn',
          hint: 'Higher values swing the right side of the wall away from the camera',
        },
        { path: 'twist', label: 'Roll', hint: 'Higher values roll the wall counterclockwise' },
        {
          ...STAGE.fieldOfView,
          hint: 'In degrees. Lower values zoom in and flatten the perspective',
        },
        { ...STAGE.cameraDrift, hint: 'Slow sway of the camera while the clip plays' },
      ],
    },
    {
      title: 'Lighting',
      fields: [STAGE.keyLight],
      more: [
        { ...STAGE.reflections, label: 'Phone reflections' },
        { ...STAGE.shadow, hint: 'Shadow the phones cast on the background' },
        STAGE.shadowSoftness,
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
      title: 'Transitions',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          link: ['motion.enterFrames', 'motion.exitFrames'],
          label: 'Transition length',
          hint: 'In frames, for both the entrance and the exit',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
