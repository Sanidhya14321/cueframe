import { defineControls } from '../../control-layout';
import { MOTION, STAGE } from '../../control-presets';
import type { ReliefBackdropProps } from './relief-backdrop';

export const reliefBackdropControls = defineControls<ReliefBackdropProps>({
  sections: [
    {
      title: 'Rings',
      fields: [
        { path: 'rings.count', label: 'Number of rings' },
        {
          path: 'rings.depthStep',
          label: 'Step height',
          hint: 'Each ring toward the center stands this much higher; 0 flattens them and removes the raised center block',
        },
      ],
      more: [
        {
          path: 'rings.core',
          label: 'Center size',
          hint: 'Width of the square at the middle of the rings',
        },
        { path: 'rings.band', label: 'Ring width' },
        { path: 'rings.gap', label: 'Gap between rings' },
        {
          path: 'rings.growth',
          label: 'Ring width growth',
          hint: 'Each ring outward is this many times wider than the one inside it',
        },
        {
          path: 'rings.depth',
          label: 'Outer ring depth',
          hint: 'How far the outermost ring stands off the wall',
        },
        { path: 'rings.bevel', label: 'Edge rounding' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['wallColor', 'ringColor'],
          label: 'Primary color',
          hint: 'The clay of the wall and every ring together',
        },
        {
          path: 'ringColor',
          label: 'Secondary color',
          hint: 'The raised rings and the center block only',
        },
        {
          path: 'wallColor',
          label: 'Background color',
          hint: 'The flat wall behind the rings only',
        },
      ],
    },
    {
      title: 'Clay',
      fields: [
        {
          path: 'look.showBackdrop',
          label: 'Show flat wall',
          hint: 'Off leaves the rings floating on a transparent background',
        },
        { path: 'roughness', label: 'Surface roughness', hint: 'Lower looks smoother and shinier' },
      ],
      more: [{ ...STAGE.reflections, hint: 'Strength of the soft studio reflections on the clay' }],
    },
    {
      title: 'Camera move',
      fields: [
        {
          path: 'camera.pushIn',
          label: 'Push-in amount',
          hint: 'Share of the camera distance closed over the push; 0 holds still',
        },
        {
          path: 'camera.orbitAngle',
          label: 'Swing angle',
          hint: 'How far the view swings around the wall, in radians (1 is about 57 degrees); negative swings the other way',
        },
      ],
      more: [
        { path: 'camera.orbitAt', label: 'Swing starts at', hint: 'Frame number' },
        {
          path: 'camera.orbitFrames',
          label: 'Swing length',
          hint: 'In frames, turning out and back again',
        },
        { path: 'camera.pushFrames', label: 'Push-in length', hint: 'In frames' },
        {
          path: 'camera.orbitPeak',
          label: 'Swing turnaround point',
          hint: 'Share of the swing spent turning out before it turns back',
        },
        {
          path: 'camera.orbitPivot',
          label: 'Swing pivot depth',
          hint: 'Negative hinges the swing behind the wall, positive in front of it',
        },
        {
          ...STAGE.cameraDrift,
          label: 'Handheld drift',
          hint: 'Slow wandering of the camera throughout the clip',
        },
      ],
    },
    {
      title: 'Lighting',
      fields: [{ ...STAGE.keyLight, label: 'Light strength' }],
      more: [
        {
          path: 'camera.lightX',
          label: 'Light left or right',
          hint: 'Negative lights from the left',
        },
        { path: 'camera.lightY', label: 'Light height', hint: 'Negative lights from below' },
        {
          path: 'camera.lightZ',
          label: 'Light distance from wall',
          hint: 'Lower rakes the light across the wall for longer shadows',
        },
        STAGE.shadowSoftness,
        {
          ...STAGE.shadow,
          hint: 'Shadow cast behind the floating rings; only visible with the flat wall off',
        },
        {
          path: 'look.background',
          label: 'Lighting mood',
          hint: 'Not drawn; a dark color switches to dim, low-key studio lighting',
        },
      ],
    },
    {
      title: 'Framing',
      fields: [{ ...STAGE.cameraDistance, hint: 'Starting distance before the push-in' }],
      more: [
        {
          path: 'camera.offsetX',
          label: 'Rings left or right',
          hint: 'Slides the rings across the frame; positive moves them right',
        },
        {
          path: 'camera.offsetY',
          label: 'Rings up or down',
          hint: 'Positive moves them up',
        },
        {
          ...STAGE.fieldOfView,
          hint: 'Lens angle in degrees; lower zooms in and flattens the perspective',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        MOTION.exit,
        { ...MOTION.speed, hint: 'Speeds up or slows down the push-in and the swing' },
      ],
      more: [
        {
          link: ['motion.exitFrames', 'motion.enterFrames'],
          label: 'Transition length',
          hint: 'In frames, for both the entrance and the exit',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: [
    'look.backgroundEdge',
    'look.ink',
    'look.muted',
    'look.accent',
    'look.grain',
    'look.liveGrain',
    'look.spotlight',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
