import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneScrollProps } from './phone-scroll';

export const phoneScrollControls = defineControls<PhoneScrollProps>({
  sections: [
    {
      title: 'Phone',
      fields: [
        {
          path: 'phone.screen',
          label: 'Screen',
          hint: 'Only the Feed screen is tall enough to scroll; the others stay still',
        },
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the built-in screen and shows it without scrolling; leave empty to use the screen above',
        },
        { path: 'phone.finish', label: 'Phone finish' },
      ],
      more: [
        { path: 'scale', label: 'Phone size' },
        {
          path: 'position.x',
          label: 'Phone left to right',
          hint: 'Left of center mirrors the lean so the screen still faces the middle',
        },
        { path: 'position.y', label: 'Phone up and down' },
        {
          path: 'position.z',
          label: 'Phone depth',
          hint: 'Higher brings the phone toward the camera',
        },
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
      title: 'Scroll',
      fields: [
        {
          path: 'scrollAmount',
          label: 'Scroll distance',
          hint: 'How far down the feed it scrolls; 1 reaches the bottom',
        },
        {
          path: 'scrollEase',
          label: 'Scroll style',
          hint: 'Smooth: eases in and out. Linear: a steady screen recording pace. Ease out: a quick flick that settles. Ease in: starts slow and speeds up',
        },
        { path: 'scrollStart', label: 'Scroll starts at', hint: 'Frame number' },
      ],
      more: [
        {
          path: 'scrollHold',
          label: 'Hold before the end',
          hint: 'Frames the feed rests on its last view before the clip ends',
        },
      ],
    },
    {
      title: 'Pose',
      fields: [
        {
          path: 'lean',
          label: 'Lean',
          hint: 'Turns the screen toward the middle of the frame, in radians',
        },
      ],
      more: [
        {
          path: 'tilt',
          label: 'Tilt back',
          hint: 'Leans the top of the phone away from the camera, in radians. Negative tips it forward',
        },
        {
          path: 'sway',
          label: 'Idle sway',
          hint: 'Gentle side to side rock through the whole clip, in radians. 0 holds the phone still',
        },
        {
          path: 'roll',
          label: 'Roll',
          hint: 'Tips the top of the phone toward the middle of the frame, in radians. Negative tips it the other way',
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
      title: 'Camera and light',
      fields: [],
      more: [
        STAGE.cameraDistance,
        STAGE.keyLight,
        { ...STAGE.reflections, hint: 'Studio reflections on the phone glass and frame' },
        STAGE.fieldOfView,
        { ...STAGE.cameraDrift, hint: 'Slow handheld-style wander' },
        { ...STAGE.shadow, hint: 'Shadow the phone casts on the backdrop' },
        STAGE.shadowSoftness,
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          path: 'arriveFrames',
          label: 'Rise-in length',
          hint: 'Frames the phone takes to rise up and turn into its pose; 0 starts in place',
        },
        MOTION.enter,
        MOTION.exit,
      ],
      more: [
        {
          ...MOTION.speed,
          hint: 'Speeds up or slows the rise-in, scroll and sway; transitions keep their length. Below 1 the scroll may not finish before the clip ends',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
