import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneTurnaroundProps } from './phone-turnaround';

export const phoneTurnaroundControls = defineControls<PhoneTurnaroundProps>({
  sections: [
    {
      title: 'Phone',
      fields: [
        { path: 'phone.screen', label: 'Screen' },
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the built-in screen when set',
        },
        { path: 'phone.finish', label: 'Phone color' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The backdrop behind the phone, center and corners together. A dark color also switches to dark studio lighting',
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
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'A dark color also switches to dark studio lighting',
        },
        { ...LOOK.backgroundEdge, label: 'Background corners' },
      ],
    },
    {
      title: 'Reveal',
      fields: [
        {
          path: 'entry',
          label: 'Reveal style',
          hint: 'Rise back: rises showing the camera, then turns to the screen. Turn in: swings in already facing you',
        },
        {
          path: 'turnAt',
          label: 'Turn point',
          hint: 'Rise back only. Share of the clip, 0.5 is halfway. The turn finishes one turn length after this point',
        },
      ],
      more: [
        {
          path: 'turnFrames',
          label: 'Turn length',
          hint: 'Rise back only. In frames after the turn point. Higher finishes the turn later',
        },
        {
          path: 'rise',
          label: 'Rise distance',
          hint: 'Rise back only. How far below its resting spot the phone starts',
        },
        {
          path: 'riseFrames',
          label: 'Rise length',
          hint: 'Rise back only. In frames. The turn starts 48 frames before the rise ends, or earlier with an early turn point',
        },
        {
          path: 'riseYaw',
          label: 'Rise start angle',
          hint: 'Rise back only. In radians. Sideways angle of the back of the phone at the start, easing to straight on as it rises',
        },
        {
          path: 'riseTilt',
          label: 'Rise start tilt',
          hint: 'Rise back only. In radians. Forward lean at the start, easing upright as it rises',
        },
        {
          path: 'driftYaw',
          label: 'Drift after the turn',
          hint: 'Rise back without a second spin only. Extra rotation in radians eased through until the end',
        },
        {
          path: 'entryYaw',
          label: 'Turn in start angle',
          hint: 'Turn in only. Starting rotation in radians',
        },
        { path: 'entryFrames', label: 'Turn in length', hint: 'Turn in only. In frames' },
      ],
    },
    {
      title: 'Second spin',
      fields: [
        {
          path: 'secondScreen',
          label: 'Second screen',
          hint: 'Picking one adds a full spin that swaps to this screen',
        },
      ],
      more: [
        {
          path: 'secondCustomScreen',
          label: 'Second screen image',
          hint: 'Your own image for the second spin. Setting it also turns the spin on',
        },
        {
          path: 'secondTurnAt',
          label: 'Spin starts at',
          hint: 'Frame number. Rise back waits for the first turn to finish',
        },
        {
          path: 'travelX',
          label: 'Slide while spinning',
          hint: 'Sideways move during the spin. Negative goes left',
        },
        { path: 'secondTurnFrames', label: 'Spin length', hint: 'In frames' },
        {
          path: 'endYaw',
          label: 'Final angle',
          hint: 'Rotation in radians the phone rests at after the spin',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [{ path: 'scale', label: 'Phone size' }],
      more: [
        { path: 'position.x', label: 'Left and right' },
        { path: 'position.y', label: 'Up and down' },
        { path: 'position.z', label: 'Toward the camera' },
        {
          path: 'pushIn',
          label: 'Slow push-in',
          hint: 'Rise back only. Size multiplier the phone grows to after the rise, by the end of the clip or of the second spin. 1 keeps it still',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [STAGE.cameraDistance],
      more: [
        STAGE.keyLight,
        STAGE.reflections,
        STAGE.fieldOfView,
        STAGE.shadow,
        STAGE.shadowSoftness,
        { ...STAGE.cameraDrift, hint: 'Eases to still during the second spin' },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.spotlight,
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [{ link: ['motion.enter', 'motion.exit'], label: 'Entrance and exit' }, MOTION.speed],
      more: [
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        { ...MOTION.float, hint: 'Gentle bob that stops during the second spin' },
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted'],
});
