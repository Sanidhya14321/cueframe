import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { AppIconRevealProps } from './app-icon-reveal';

export const appIconRevealControls = defineControls<AppIconRevealProps>({
  sections: [
    {
      title: 'Brand',
      fields: [
        { path: 'brandName', label: 'App name' },
        {
          path: 'icon.art',
          label: 'Icon artwork',
          hint: 'Shown on the tile face; leave empty for the sample scooter',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['icon.color', 'icon.faceColor'],
          label: 'Primary color',
          hint: 'The icon tile: its body and the face plate behind the artwork',
        },
        { path: 'wordmark.color', label: 'Text color', hint: 'The typed app name' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        {
          path: 'icon.color',
          label: 'Tile body color',
          hint: 'Sides and back of the tile, the blank side seen before the flip',
        },
        { path: 'icon.faceColor', label: 'Tile face color', hint: 'Plate behind the artwork' },
        {
          path: 'icon.artTint',
          label: 'Artwork tint',
          hint: 'Multiplies the artwork colors; white keeps them unchanged',
        },
        LOOK.background,
        LOOK.backgroundEdge,
        { ...LOOK.paperLine, hint: 'Shows when Paper pattern is not plain' },
        {
          path: 'look.accent',
          label: 'Margin line color',
          hint: 'Shows when Paper margin line is on',
        },
      ],
    },
    {
      title: 'Flip',
      fields: [
        {
          path: 'reveal.flipFrom',
          label: 'Face turns in from',
          hint: 'Side the artwork swings in from as the blank tile flips over',
        },
        {
          path: 'reveal.spins',
          label: 'Extra spins',
          hint: 'Full turns added before the tile lands face forward',
        },
      ],
      more: [
        { path: 'reveal.flipAt', label: 'Flip starts at', hint: 'Frame number' },
        { path: 'reveal.flipFrames', label: 'Flip length', hint: 'In frames' },
        {
          path: 'reveal.lift',
          label: 'Flip lift',
          hint: 'How far the tile pops toward the camera and tips mid-flip',
        },
      ],
    },
    {
      title: 'Icon',
      fields: [{ path: 'icon.size', label: 'Icon size' }],
      more: [
        { path: 'icon.artScale', label: 'Artwork size', hint: 'Relative to the tile' },
        {
          path: 'icon.depth',
          label: 'Tile thickness',
          hint: 'Thicker tiles also get a slightly smaller face',
        },
        { path: 'icon.roughness', label: 'Face finish', hint: 'Higher is more matte' },
        { path: 'icon.y', label: 'Vertical position', hint: 'Moves the icon and name together' },
        {
          path: 'icon.z',
          label: 'Distance toward camera',
          hint: 'Moves the icon, name and the wall that catches their shadow toward the camera',
        },
        { ...MOTION.float, label: 'Icon bob', hint: 'Gentle up and down float of the tile' },
      ],
    },
    {
      title: 'Name',
      fields: [{ path: 'wordmark.height', label: 'Name size' }],
      more: [
        { path: 'reveal.typeAt', label: 'Name starts typing at', hint: 'Frame number' },
        {
          path: 'reveal.letterFrames',
          label: 'Frames between letters',
          hint: 'Lower types faster',
        },
        { path: 'reveal.letterFade', label: 'Letter fade-in', hint: 'In frames' },
        { path: 'wordmark.weight', label: 'Font weight' },
        { path: 'wordmark.gap', label: 'Gap below icon' },
        { path: 'wordmark.tracking', label: 'Letter spacing' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.pushIn',
          label: 'Camera push in',
          hint: 'Share of the camera distance closed over the push length; 0 keeps the camera still',
        },
      ],
      more: [
        STAGE.cameraDistance,
        {
          path: 'camera.orbitAngle',
          label: 'Swing angle',
          hint: 'Turns the icon and name sideways and back, in radians (1 is about 57 degrees); 0 turns it off',
        },
        {
          path: 'camera.orbitAt',
          label: 'Swing starts at',
          hint: 'Frame number; the clip is 120 frames long, so set this below 120 to see the swing',
        },
        { ...STAGE.cameraDrift, hint: 'Slow handheld-style wander' },
        {
          path: 'camera.pushFrames',
          label: 'Push length',
          hint: 'In frames; longer than the clip leaves the push still moving at the end',
        },
        { path: 'camera.orbitFrames', label: 'Swing length', hint: 'In frames' },
        {
          path: 'camera.orbitPeak',
          label: 'Swing peak',
          hint: 'Fraction of the swing at which the turn is widest',
        },
        {
          path: 'camera.orbitPivot',
          label: 'Swing pivot depth',
          hint: 'Moves the turning point toward or away from the camera',
        },
        STAGE.fieldOfView,
      ],
    },
    {
      title: 'Lighting',
      fields: [STAGE.keyLight],
      more: [
        STAGE.shadow,
        STAGE.reflections,
        STAGE.shadowSoftness,
        { path: 'camera.lightX', label: 'Key light left to right' },
        { path: 'camera.lightY', label: 'Key light height' },
        {
          path: 'camera.lightZ',
          label: 'Key light distance',
          hint: 'Higher sits nearer the camera',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.grain,
        LOOK.spotlight,
        {
          path: 'camera.backdropSweep',
          label: 'Glow sway',
          hint: 'How far the background glow drifts side to side, in percent of the width',
        },
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [MOTION.speed, MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.ink', 'look.muted'],
});
