import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneSpinInProps } from './phone-spin-in';

export const phoneSpinInControls = defineControls<PhoneSpinInProps>({
  sections: [
    {
      title: 'Phone',
      fields: [
        { path: 'phone.screen', label: 'Screen' },
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the preset screen when set',
        },
        { path: 'phone.finish', label: 'Phone finish' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The backdrop behind the phone, center and corners together. A dark color also switches the 3D lighting to a darker studio',
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
          hint: 'Dark colors also switch the 3D lighting to a darker studio',
        },
        { ...LOOK.backgroundEdge, label: 'Background corners' },
      ],
    },
    {
      title: 'Spin',
      fields: [
        {
          path: 'spinTurns',
          label: 'Spin amount',
          hint: 'Full turns the phone spins through as it rises; 0.25 is a quarter turn',
        },
        {
          path: 'spinFrames',
          label: 'Spin-in length',
          hint: 'In frames at normal speed; the phone rises, spins and settles over this time',
        },
      ],
      more: [
        {
          path: 'rise',
          label: 'Rise distance',
          hint: 'How far below its resting spot the phone starts',
        },
        {
          path: 'tilt',
          label: 'Resting angle',
          hint: 'How far the phone stays turned once it settles. Positive faces the screen away from its side of the frame, to the left when centered',
        },
        {
          path: 'slideIn',
          label: 'Sideways slide',
          hint: 'How far out toward its side of the frame the phone starts before sliding into place',
        },
        {
          path: 'startPitch',
          label: 'Starting tip back',
          hint: 'How far the phone is tipped back as it rises; it straightens as it settles',
        },
        {
          path: 'startRoll',
          label: 'Starting lean',
          hint: 'How far the phone leans sideways as it rises; it levels out as it settles',
        },
      ],
    },
    {
      title: 'Position',
      fields: [
        { path: 'scale', label: 'Phone size' },
        {
          path: 'position.x',
          label: 'Horizontal position',
          hint: 'Also sets which way the phone spins and leans, and where the spotlight sits',
        },
      ],
      more: [
        { path: 'position.y', label: 'Vertical position' },
        { path: 'position.z', label: 'Depth', hint: 'Higher brings the phone toward the camera' },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Camera and lighting',
      fields: [
        {
          ...STAGE.cameraDistance,
          hint: 'Higher pulls the camera back so the phone looks smaller',
        },
      ],
      more: [
        STAGE.keyLight,
        { ...STAGE.reflections, hint: 'Strength of the studio highlights on the glass and frame' },
        STAGE.shadow,
        { ...STAGE.fieldOfView, hint: 'Lower flattens perspective like a longer lens' },
        STAGE.shadowSoftness,
        { ...STAGE.cameraDrift, hint: 'Slow wandering camera movement' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Speeds up or slows the spin, sway and float. Entrance, exit and camera drift keep their pace',
        },
        { ...MOTION.float, hint: 'Gentle up and down bob' },
        { path: 'sway', label: 'Idle sway', hint: 'Gentle side to side turn of the phone' },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted'],
});
