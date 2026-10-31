import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { HeadingListProps } from './heading-list';

export const headingListControls = defineControls<HeadingListProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'heading', label: 'Heading' },
        { path: 'items', label: 'Menu items' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['arrow.color', 'look.accent'],
          label: 'Primary color',
          hint: 'The arrow, plus the paper margin line when it is on',
        },
        {
          link: ['headingColor', 'look.ink'],
          label: 'Text color',
          hint: 'The heading and the item next to the arrow',
        },
        {
          ...LOOK.muted,
          label: 'Secondary color',
          hint: 'Items one step or more from the arrow. The active item blends into it as it moves off',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'arrow.color', label: 'Arrow color' },
        {
          ...LOOK.accent,
          label: 'Margin line color',
          hint: 'Shows when the paper margin line is on',
        },
        { path: 'headingColor', label: 'Heading color' },
        { ...LOOK.ink, label: 'Active item color' },
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
      ],
    },
    {
      title: 'Scrolling',
      fields: [
        {
          path: 'stops',
          label: 'Number of moves',
          hint: 'The list stops after this many steps, or at the last item',
        },
        { path: 'timing.interval', label: 'Time per item', hint: 'Frames between moves' },
      ],
      more: [
        {
          path: 'loop',
          label: 'Scroll forever',
          hint: 'Ignores the number of moves and wraps around the list',
        },
        {
          path: 'type.activeShift',
          label: 'Active item nudge',
          hint: 'How far the item at the arrow slides right, in pixels',
        },
        {
          path: 'timing.moveFrames',
          label: 'Move length',
          hint: 'In frames. Capped at the time per item',
        },
        { path: 'timing.delay', label: 'First move after', hint: 'In frames' },
        {
          path: 'timing.start',
          label: 'Starting item',
          hint: 'Position of the item at the arrow when the video starts, counting from 0',
        },
      ],
    },
    {
      title: 'Arrow',
      fields: [{ path: 'arrow.length', label: 'Arrow length', hint: 'In pixels' }],
      more: [
        { path: 'arrow.stroke', label: 'Line thickness', hint: 'In pixels' },
        {
          path: 'arrow.retreat',
          label: 'Pull-back on each move',
          hint: 'How far the arrow backs off, in pixels, while the list moves',
        },
        { path: 'arrow.headWidth', label: 'Arrowhead length' },
        { path: 'arrow.headHeight', label: 'Arrowhead height' },
        {
          path: 'arrow.steps',
          label: 'Arrowhead pixel steps',
          hint: 'More steps give a smoother, less blocky head',
        },
        { path: 'arrow.drawStart', label: 'Arrow appears at', hint: 'Frame number' },
        { path: 'arrow.drawFrames', label: 'Arrow draw length', hint: 'In frames' },
      ],
    },
    {
      title: 'Type',
      fields: [{ path: 'type.font', label: 'Font' }],
      more: [
        {
          link: ['type.headingWeight', 'type.activeWeight', 'type.weight'],
          label: 'Font weight',
        },
        { path: 'type.headingSize', label: 'Heading size', hint: 'In pixels' },
        { path: 'type.activeSize', label: 'Active item size', hint: 'In pixels' },
        {
          path: 'type.size',
          label: 'Other items size',
          hint: 'In pixels, one step or more from the arrow',
        },
        { path: 'type.headingWeight', label: 'Heading weight' },
        { path: 'type.activeWeight', label: 'Active item weight' },
        { path: 'type.weight', label: 'Other items weight' },
        { path: 'type.pitch', label: 'Line spacing', hint: 'Pixels between items' },
        {
          path: 'type.reach',
          label: 'Visible items each side',
          hint: 'How many items show above and below the active one',
        },
        {
          path: 'type.fade',
          label: 'Fade-out range',
          hint: 'Higher starts fading items closer to the active one',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        { path: 'layout.headingX', label: 'Heading position', hint: 'Left edge, in pixels' },
        {
          path: 'arrow.x',
          label: 'Arrow position',
          hint: 'Left end of the arrow, in pixels. Keep it between the heading and the list',
        },
        { path: 'layout.listX', label: 'List position', hint: 'Left edge, in pixels' },
        {
          path: 'layout.centerY',
          label: 'Vertical center',
          hint: 'Height of the heading, arrow and active item, in pixels from the top',
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
        {
          path: 'aura.blobs',
          label: 'Color glows',
          hint: 'Soft colored light behind the list',
          items: {
            color: 'Color',
            x: 'Horizontal position',
            y: 'Vertical position',
            size: 'Size',
            strength: 'Strength',
          },
        },
        { path: 'aura.drift', label: 'Glow drift', hint: 'How much the glows wander' },
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          ...MOTION.speed,
          hint: 'Scales the scrolling, the arrow and the text entrance. Entrance and exit keep their length',
        },
        MOTION.enter,
        MOTION.exit,
      ],
      more: [
        {
          path: 'entrance.rise',
          label: 'Text rise distance',
          hint: 'Pixels the items rise into place. The heading rises a quarter as far',
        },
        {
          path: 'entrance.stagger',
          label: 'Item entrance stagger',
          hint: 'Frames between each item appearing, from the starting item downward',
        },
        {
          path: 'entrance.delay',
          label: 'Text appears at',
          hint: 'Frame the heading begins to rise. The items follow one stagger apart',
        },
        {
          path: 'entrance.frames',
          label: 'Text entrance length',
          hint: 'In frames, for the heading and each item',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['motion.float'],
});
