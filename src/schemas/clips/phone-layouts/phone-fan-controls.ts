import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneFanProps } from './phone-fan';

export const phoneFanControls = defineControls<PhoneFanProps>({
  sections: [
    {
      title: 'Phones',
      fields: [
        {
          path: 'phones',
          label: 'Phones',
          hint: 'Left, center and right phone',
          items: { screen: 'Screen', customScreen: 'Custom screenshot', finish: 'Phone color' },
        },
        { path: 'scale', label: 'Phone size' },
        {
          path: 'fan',
          label: 'Fan angle',
          hint: 'How far the side phones turn in toward the center',
        },
      ],
      more: [
        { path: 'spacing', label: 'Gap between phones' },
        { path: 'position.x', label: 'Move left or right' },
        { path: 'position.y', label: 'Move up or down' },
        {
          path: 'position.z',
          label: 'Move closer or farther',
          hint: 'Higher brings the phones closer',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Primary color',
          hint: 'The backdrop behind the phones, center and corners together. A dark color also switches the 3D lighting to its dark setup',
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
      title: 'Entrance',
      fields: [
        {
          path: 'entrance',
          label: 'Entrance style',
          hint: 'Rise lifts the phones up from below one by one. Spread flies the center phone in, then slides the side phones out from behind it',
        },
        {
          path: 'stagger',
          label: 'Delay between phones',
          hint: 'In frames. Rise entrance only',
        },
      ],
      more: [
        {
          path: 'riseOrder',
          label: 'Rise order',
          hint: 'Which phone rises first. Center out raises the center, then the left, then the right. Rise entrance only',
        },
        {
          path: 'riseFrames',
          label: 'Rise length',
          hint: 'Frames each phone takes to settle. Rise entrance only',
        },
        {
          path: 'riseSpin',
          label: 'Twist while rising',
          hint: 'Fraction of a turn each phone unwinds as it rises. Rise entrance only',
        },
      ],
    },
    {
      title: 'Spread entrance',
      fields: [{ path: 'spreadDelay', label: 'Side phones slide out at', hint: 'Frame number' }],
      more: [
        { path: 'spreadFrames', label: 'Slide-out length', hint: 'In frames' },
        {
          path: 'flyFrom',
          label: 'Center phone flies in from',
          hint: 'Sideways start offset. Negative is left, 0 starts in place',
        },
        { path: 'flyFrames', label: 'Fly-in length', hint: 'In frames' },
        {
          path: 'flyYaw',
          label: 'Center phone starting turn',
          hint: 'Rotation it unwinds while flying in, in radians',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'orbit',
          label: 'Orbit swing',
          hint: 'The fan turns from one side to the other across the whole clip, in radians. 0 holds it still',
        },
      ],
      more: [
        {
          path: 'dollyFrom',
          label: 'Start distance',
          hint: 'Multiplies the camera distance on the first frame. Higher starts farther away',
        },
        {
          path: 'dollyTo',
          label: 'End distance',
          hint: 'Multiplies the camera distance on the last frame. Lower than the start pushes in',
        },
        STAGE.cameraDistance,
        STAGE.fieldOfView,
        STAGE.cameraDrift,
      ],
    },
    {
      title: 'Lighting',
      fields: [STAGE.keyLight],
      more: [
        { ...STAGE.reflections, hint: 'Glossy highlights on the phone bodies' },
        STAGE.shadow,
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
      title: 'Motion',
      fields: [
        { ...MOTION.enter, label: 'Transition in' },
        { ...MOTION.exit, label: 'Transition out' },
      ],
      more: [
        {
          link: ['motion.enterFrames', 'motion.exitFrames'],
          label: 'Transition length',
          hint: 'In frames, for both the transition in and the transition out',
        },
        {
          ...MOTION.speed,
          hint: 'Scales the phone animation timing. The camera move and the transitions keep their pace',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
        MOTION.float,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted'],
});
