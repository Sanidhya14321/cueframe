import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ColorPillsProps } from './color-pills';

export const colorPillsControls = defineControls<ColorPillsProps>({
  sections: [
    {
      title: 'Pills',
      fields: [
        {
          path: 'pills',
          label: 'Pills',
          hint: 'Top to bottom, up to 10. Sideways offset staggers each pill left or right in pixels',
          items: { label: 'Name', color: 'Pill color', offset: 'Sideways offset' },
        },
        { path: 'font', label: 'Font' },
      ],
      more: [
        { path: 'size', label: 'Text size', hint: 'In pixels' },
        { path: 'weight', label: 'Font weight' },
        {
          path: 'layout.dot',
          label: 'Pill dot size',
          hint: 'Diameter in pixels. 0 hides the dot inside each pill',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { path: 'cursor.color', label: 'Primary color', hint: 'The selector dot' },
        {
          path: 'cursor.halo',
          label: 'Secondary color',
          hint: 'The ring and soft glow around the selector dot',
        },
        {
          link: ['textColor', 'dotColor'],
          label: 'Text color',
          hint: 'The names and the small dot inside every pill together',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'textColor', label: 'Pill name color', hint: 'The pill names only' },
        { path: 'dotColor', label: 'Pill dot color', hint: 'The small dot inside each pill only' },
        LOOK.background,
        LOOK.backgroundEdge,
        {
          ...LOOK.accent,
          label: 'Margin line color',
          hint: 'Shown when the paper margin line is on',
        },
        LOOK.paperLine,
      ],
    },
    {
      title: 'Selection',
      fields: [
        { path: 'timing.interval', label: 'Time on each pill', hint: 'In frames' },
        {
          path: 'active.nudge',
          label: 'Selected pill shift',
          hint: 'How far the chosen pill slides right, in pixels',
        },
      ],
      more: [
        {
          path: 'timing.moveFrames',
          label: 'Slide length',
          hint: 'In frames, never longer than the time on each pill',
        },
        {
          path: 'active.grow',
          label: 'Selected pill grow',
          hint: 'Extra scale the chosen pill gains. 0.1 makes it 10% larger',
        },
        {
          path: 'timing.delay',
          label: 'Start delay',
          hint: 'Frames before the selector slides onto the first pill',
        },
        {
          path: 'active.spread',
          label: 'Neighbor shift',
          hint: 'Share of the shift the pills next to the chosen one also get. 0 keeps them still',
        },
      ],
    },
    {
      title: 'Selector dot',
      fields: [{ path: 'cursor.size', label: 'Selector size', hint: 'Diameter in pixels' }],
      more: [
        {
          path: 'cursor.haloSize',
          label: 'Halo size',
          hint: 'Scales the ring and soft glow around the selector. 0 removes them',
        },
        {
          path: 'cursor.gap',
          label: 'Distance from pill',
          hint: 'From the selector center to the left edge of the chosen pill, in pixels',
        },
      ],
    },
    {
      title: 'Style',
      fields: [
        {
          path: 'layout.glow',
          label: 'Glow size',
          hint: 'Blur of the colored glow around each pill, also sizes the inner shine',
        },
      ],
      more: [
        { path: 'layout.height', label: 'Pill height', hint: 'In pixels' },
        {
          path: 'layout.roundness',
          label: 'Corner roundness',
          hint: '1 is a full pill, 0 is square corners',
        },
        {
          path: 'layout.glowStrength',
          label: 'Glow strength',
          hint: 'Opacity of the colored glow behind each pill. 0 removes it',
        },
        {
          path: 'layout.shine',
          label: 'Inner shine',
          hint: 'Strength of the white glow along the inside of each pill. 0 removes it',
        },
        {
          path: 'layout.paddingX',
          label: 'Side padding',
          hint: 'Space inside each pill in pixels. The right side gets a little more',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        {
          path: 'layout.x',
          label: 'Horizontal position',
          hint: 'Left edge of the column, in pixels from the center',
        },
        { path: 'layout.y', label: 'Vertical position', hint: 'In pixels from the center' },
        {
          path: 'layout.pitch',
          label: 'Pill spacing',
          hint: 'Distance between pill centers, in pixels',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        LOOK.showBackdrop,
        {
          path: 'aura.blobs',
          label: 'Color glows',
          hint: 'Soft color clouds behind the pills. Position and size are in percent of the frame. Hidden when the background is off',
          items: {
            color: 'Color',
            x: 'Horizontal position',
            y: 'Vertical position',
            size: 'Size',
            strength: 'Strength',
          },
        },
      ],
      more: [
        { path: 'aura.drift', label: 'Glow drift', hint: 'How much the color glows wander' },
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
      fields: [
        { ...MOTION.enter, label: 'Scene entrance' },
        { ...MOTION.exit, label: 'Scene exit' },
      ],
      more: [
        {
          path: 'entrance.stagger',
          label: 'Pill stagger',
          hint: 'Frames between each pill rising in',
        },
        {
          path: 'entrance.frames',
          label: 'Pill rise length',
          hint: 'In frames. Each pill fades in over the first 70% of it',
        },
        { path: 'entrance.rise', label: 'Pill rise distance', hint: 'In pixels' },
        { ...MOTION.enterFrames, label: 'Scene entrance length' },
        { ...MOTION.exitFrames, label: 'Scene exit length' },
        {
          ...MOTION.speed,
          hint: 'Speeds up the pills and selector. The background and scene transitions keep their pace',
        },
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float', 'timing.start'],
});
