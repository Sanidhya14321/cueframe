import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { YearDialProps } from './year-dial';

export const yearDialControls = defineControls<YearDialProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'label', label: 'Label', hint: 'Word beside the pointer. Leave empty to hide it' },
        {
          path: 'firstYear',
          label: 'First year',
          hint: 'Year in the highlight before the first turn; each turn counts on from here',
        },
      ],
      more: [
        {
          path: 'yearStep',
          label: 'Count by',
          hint: 'Years per turn, e.g. 10 to count by decades',
        },
        {
          path: 'countDown',
          label: 'Count down',
          hint: 'Years go down with each turn instead of up',
        },
        { path: 'yearType.font', label: 'Font' },
        { path: 'yearType.size', label: 'Year size', hint: 'In pixels' },
        { link: ['yearType.weight', 'yearType.labelWeight'], label: 'Font weight' },
        { path: 'yearType.weight', label: 'Year weight' },
        { path: 'yearType.labelSize', label: 'Label size', hint: 'In pixels' },
        { path: 'yearType.labelWeight', label: 'Label weight' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['highlight.color', 'pointer.color', 'look.accent'],
          label: 'Primary color',
          hint: 'The highlight bar, the pointer and the paper margin line',
        },
        {
          path: 'highlight.text',
          label: 'Secondary color',
          hint: 'The year inside the highlight bar',
        },
        {
          link: ['look.ink', 'labelColor'],
          label: 'Text color',
          hint: 'The years outside the highlight and the label beside the pointer',
        },
        {
          link: ['ticks.color', 'ticks.minorColor'],
          label: 'Accent color',
          hint: 'The major and minor ticks around the dial together',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'highlight.color', label: 'Highlight color' },
        { path: 'pointer.color', label: 'Pointer color' },
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when the paper has a margin' },
        { ...LOOK.ink, label: 'Year color', hint: 'Years outside the highlight' },
        { path: 'labelColor', label: 'Label color' },
        { path: 'ticks.color', label: 'Major tick color' },
        { path: 'ticks.minorColor', label: 'Minor tick color' },
        { ...LOOK.background, label: 'Background center' },
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Turning',
      fields: [
        {
          path: 'steps.interval',
          label: 'Time per turn',
          hint: 'Frames from one turn to the next; each turn moves on one year',
        },
      ],
      more: [
        {
          path: 'steps.moveFrames',
          label: 'Turn length',
          hint: 'Frames each turn takes, capped at the time per turn',
        },
        { path: 'steps.delay', label: 'First turn at', hint: 'Frame number' },
        {
          path: 'turnEasing',
          label: 'Turn feel',
          hint: 'Smooth eases in and out. Settle starts fast and glides to a stop. Linear turns at a constant speed',
        },
        {
          path: 'entryTurn',
          label: 'Entrance spin',
          hint: 'Years the dial winds through as it eases in; 0 starts still',
        },
        {
          path: 'entryFrames',
          label: 'Entrance length',
          hint: 'In frames; the dial fades in over this and its spin settles over about 1.6 times this',
        },
        {
          path: 'steps.start',
          label: 'Turns already made',
          hint: 'Turns counted before frame 0, so the dial opens this many years past the first year',
        },
      ],
    },
    {
      title: 'Dial',
      fields: [{ path: 'highlight.width', label: 'Highlight width', hint: 'In pixels' }],
      more: [
        { path: 'highlight.height', label: 'Highlight height', hint: 'In pixels' },
        {
          path: 'highlight.radius',
          label: 'Highlight corner radius',
          hint: 'In pixels; half the height gives a pill',
        },
        { path: 'dial.slot', label: 'Year spacing', hint: 'Degrees between years around the dial' },
        {
          path: 'dial.range',
          label: 'Visible years each side',
          hint: 'Years this far from the highlight have fully faded out',
        },
        {
          path: 'dial.fadeStart',
          label: 'Fade starts at',
          hint: 'Years away from the highlight where the years begin to fade out',
        },
        {
          path: 'dial.textFollow',
          label: 'Years follow the curve',
          hint: '0 keeps every year level, 1 tilts each year along the dial',
        },
        {
          path: 'dial.radius',
          label: 'Year ring radius',
          hint: 'Distance from the dial center to the years and highlight',
        },
      ],
    },
    {
      title: 'Ticks and pointer',
      fields: [{ path: 'pointer.size', label: 'Pointer size' }],
      more: [
        { path: 'ticks.spacing', label: 'Tick spacing', hint: 'Degrees between ticks' },
        {
          path: 'pointer.gap',
          label: 'Pointer gap',
          hint: 'Space between the ticks and the pointer, which also pushes the label out',
        },
        { path: 'ticks.length', label: 'Tick length', hint: 'Minor ticks are 60% of this' },
        { path: 'ticks.stroke', label: 'Tick thickness' },
        {
          path: 'ticks.majorEvery',
          label: 'Major tick every',
          hint: 'Every nth tick is longer, thicker and drawn in the major tick color',
        },
        {
          path: 'ticks.radius',
          label: 'Tick ring radius',
          hint: 'Distance from the dial center to the tick marks',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [{ path: 'camera.tilt', label: 'Tilt', hint: 'Degrees the dial leans back' }],
      more: [
        { path: 'camera.spin', label: 'Rotation', hint: 'Degrees the dial turns in its own plane' },
        { path: 'camera.scale', label: 'Zoom' },
        {
          path: 'camera.drift',
          label: 'Drift',
          hint: 'Slow spin and slide over time; 0 holds the camera still',
        },
        {
          path: 'camera.x',
          label: 'Horizontal offset',
          hint: 'Dial center offset from the frame center, in pixels',
        },
        {
          path: 'camera.y',
          label: 'Vertical offset',
          hint: 'Dial center offset from the frame center, in pixels',
        },
        {
          path: 'camera.perspective',
          label: 'Perspective depth',
          hint: 'Lower values exaggerate the depth',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        {
          path: 'aura.blobs',
          label: 'Color glows',
          hint: 'Soft colored light behind the dial',
          items: {
            color: 'Color',
            x: 'Horizontal position',
            y: 'Vertical position',
            size: 'Size',
            strength: 'Strength',
          },
        },
        { path: 'aura.drift', label: 'Glow drift', hint: 'How much the color glows wander' },
        LOOK.paper,
        LOOK.paperLine,
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
  hidden: ['look.muted', 'motion.float'],
});
