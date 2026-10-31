import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ChalkBadgeProps } from './chalk-badge';

export const chalkBadgeControls = defineControls<ChalkBadgeProps>({
  sections: [
    {
      title: 'Badge',
      fields: [
        { path: 'badge.word', label: 'Word' },
        {
          path: 'badge.variant',
          label: 'Badge design',
          hint: 'The hand-drawn frame, ribbon or doodle drawn around the word. Colors stay as set below',
        },
        { path: 'scale', label: 'Size' },
      ],
      more: [
        { path: 'x', label: 'Horizontal position', hint: 'Badge center, in percent of the width' },
        { path: 'y', label: 'Vertical position', hint: 'Badge center, in percent of the height' },
        {
          path: 'tilt',
          label: 'Tilt',
          hint: 'In degrees around the badge center. Negative leans left',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['badge.line', 'badge.text', 'captionColor'],
          label: 'Primary color',
          hint: 'The chalk: badge lines, the word and the caption together',
        },
        {
          path: 'badge.fill',
          label: 'Accent color',
          hint: 'Solid shapes such as sparkles, tape, ribbons and bursts. Their shading is a darker mix of it',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The chalkboard, center and edges together',
        },
        {
          ...LOOK.paperLine,
          label: 'Secondary color',
          hint: 'The board pattern lines',
        },
      ],
      more: [
        { path: 'badge.line', label: 'Line color', hint: 'The hand-drawn chalk strokes' },
        { path: 'badge.text', label: 'Word color' },
        { path: 'captionColor', label: 'Caption color' },
        { ...LOOK.background, label: 'Board color' },
        { ...LOOK.backgroundEdge, label: 'Board edge color' },
      ],
    },
    {
      title: 'Drawing',
      fields: [
        {
          path: 'timing.drawFrames',
          label: 'Draw length',
          hint: 'In frames, lower sketches faster',
        },
        {
          path: 'timing.eraseAt',
          label: 'Erase starts after',
          hint: 'Frames after the badge starts drawing. Push it past the clip end to keep the badge on screen',
        },
      ],
      more: [
        { path: 'delay', label: 'Start delay', hint: 'Frames before the badge starts drawing' },
        { path: 'timing.eraseFrames', label: 'Erase length', hint: 'In frames' },
      ],
    },
    {
      title: 'Chalk',
      fields: [
        { path: 'chalk.width', label: 'Stroke width', hint: 'Thickness of the chalk lines' },
      ],
      more: [
        {
          path: 'chalk.dryness',
          label: 'Dry chalk texture',
          hint: 'Higher leaves patchier, dustier strokes',
        },
        { path: 'chalk.roughness', label: 'Edge wobble', hint: 'How much the edges warp' },
        {
          path: 'chalk.shadow',
          label: 'Drop shadow',
          hint: 'Strength of the soft shadow under the badge',
        },
      ],
    },
    {
      title: 'Caption',
      fields: [{ path: 'caption', label: 'Caption', hint: 'Leave empty to hide it' }],
      more: [
        {
          path: 'captionSize',
          label: 'Caption size',
          hint: 'In pixels. Larger also sits lower from the top edge',
        },
        {
          path: 'captionDelay',
          label: 'Caption start delay',
          hint: 'Frames before the caption starts typing',
        },
        {
          path: 'captionFrames',
          label: 'Frames per letter',
          hint: 'Lower types faster; it deletes at twice this speed before the end',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        { ...LOOK.showBackdrop, label: 'Show chalkboard' },
        { ...LOOK.paper, label: 'Board pattern' },
      ],
      more: [
        { ...LOOK.paperSpacing, label: 'Pattern spacing', hint: 'In pixels' },
        {
          path: 'look.ink',
          label: 'Grid dot color',
          hint: 'Dots at the grid crossings, grid pattern only',
        },
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        { ...LOOK.paperMargin, label: 'Show margin line' },
        {
          path: 'look.accent',
          label: 'Margin line color',
          hint: 'Shows when Show margin line is on',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter],
      more: [
        { ...MOTION.exit, hint: 'Plays only when Exit length is above 0' },
        {
          ...MOTION.exitFrames,
          hint: 'In frames. The exit only plays when this is above 0, and it is 0 by default',
        },
        {
          ...MOTION.speed,
          hint: 'Scales the badge drawing, erase and caption timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
