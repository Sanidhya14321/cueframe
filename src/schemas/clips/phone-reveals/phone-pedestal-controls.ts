import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhonePedestalProps } from './phone-pedestal';

export const phonePedestalControls = defineControls<PhonePedestalProps>({
  sections: [
    {
      title: 'Phone',
      fields: [
        { path: 'phone.screen', label: 'Screen' },
        { path: 'phone.finish', label: 'Phone color' },
        { path: 'scale', label: 'Phone size' },
      ],
      more: [
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the built-in screen when set',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'pedestal.color',
          label: 'Primary color',
          hint: 'The clay block the phone balances on',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The wall behind the block, center and corners together. A dark color also switches to darker studio lighting',
        },
        {
          link: ['look.paperLine', 'look.accent'],
          label: 'Accent color',
          hint: 'Paper pattern lines and the paper margin line on the wall. Shows only when the paper pattern or margin line is on',
        },
      ],
      more: [
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'A dark color also switches to darker studio lighting',
        },
        LOOK.backgroundEdge,
        LOOK.paperLine,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Paper margin line is on' },
      ],
    },
    {
      title: 'Drop and balance',
      fields: [
        {
          path: 'lean',
          label: 'Lean',
          hint: 'How far the phone tips over on its corner; positive leans the top to the right',
        },
        {
          path: 'rock',
          label: 'Rocking',
          hint: 'How far the phone sways once it lands; 0 holds it still',
        },
      ],
      more: [
        {
          path: 'entry.drop',
          label: 'Drop height',
          hint: 'How far above the block the phone starts; negative rises up from below',
        },
        { path: 'entry.frames', label: 'Landing length', hint: 'In frames' },
        {
          path: 'rockSpeed',
          label: 'Rocking speed',
          hint: 'Higher sways back and forth faster. At 1 a full sway takes about 6 seconds',
        },
        { path: 'yaw', label: 'Phone turn', hint: 'Spins the phone to show more of one side' },
        {
          path: 'pitch',
          label: 'Tip toward camera',
          hint: 'Negative leans the top of the phone back',
        },
      ],
    },
    {
      title: 'Block',
      fields: [{ path: 'pedestal.show', label: 'Show block' }],
      more: [
        { path: 'pedestal.size', label: 'Block size' },
        {
          path: 'pedestal.top',
          label: 'Peak height',
          hint: 'Raises or lowers the block and the phone together',
        },
        {
          path: 'pedestal.turn',
          label: 'Block angle',
          hint: '0 faces a flat side to the camera; about 0.79 points a corner at it',
        },
        { path: 'pedestal.bevel', label: 'Edge rounding' },
        {
          path: 'pedestal.roughness',
          label: 'Block matte',
          hint: 'Higher looks softer and less shiny',
        },
      ],
    },
    {
      title: 'Camera and light',
      fields: [
        {
          path: 'camera.orbit',
          label: 'Camera orbit',
          hint: 'How far the view swings around the phone over the clip; negative swings the other way',
        },
        STAGE.keyLight,
      ],
      more: [
        {
          path: 'camera.height',
          label: 'Camera height',
          hint: 'Lower values look up at the block from below',
        },
        {
          path: 'camera.rise',
          label: 'Camera rise',
          hint: 'How far the camera climbs over the clip',
        },
        { ...STAGE.cameraDistance, hint: 'Higher pulls the camera back from the phone' },
        {
          path: 'entry.cameraTilt',
          label: 'Camera start lift',
          hint: 'The camera starts this much higher and settles as the phone lands',
        },
        { path: 'camera.aimY', label: 'Aim height', hint: 'Where the camera points vertically' },
        STAGE.fieldOfView,
        { ...STAGE.cameraDrift, hint: 'Slow handheld wander' },
        { ...STAGE.shadow, hint: 'Shadow cast on the wall behind the block' },
        { ...STAGE.reflections, hint: 'Shine on the phone and the clay' },
        STAGE.shadowSoftness,
        { path: 'camera.lightX', label: 'Key light left to right' },
        { path: 'camera.lightY', label: 'Key light height' },
        { path: 'camera.lightZ', label: 'Key light distance in front' },
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
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the landing, rocking and camera move. Entrance, exit and camera drift keep their pace',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
