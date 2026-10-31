import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { PillFanProps } from './pill-fan';

export const pillFanControls = defineControls<PillFanProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'label', label: 'Phrase', hint: 'Sits left of the hinge, the words complete it' },
        {
          path: 'words',
          label: 'Words',
          hint: 'Each one swings in on a pill in turn, and the list loops',
        },
        {
          link: ['labelType.font', 'pill.font'],
          label: 'Font',
          hint: 'Sets the phrase and the words to one font. Shows Currently mixed while they differ; More options sets each on its own',
        },
      ],
      more: [
        { path: 'labelType.size', label: 'Phrase size', hint: 'In pixels' },
        { path: 'pill.textSize', label: 'Word size', hint: 'In pixels, the pill height stays put' },
        { path: 'labelType.font', label: 'Phrase font' },
        { path: 'pill.font', label: 'Word font' },
        { path: 'labelType.weight', label: 'Phrase weight' },
        { path: 'pill.weight', label: 'Word weight' },
        { path: 'labelType.tracking', label: 'Phrase letter spacing', hint: 'In em' },
        { path: 'labelType.tilt', label: 'Phrase tilt', hint: 'In degrees' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['pill.color', 'look.accent'],
          label: 'Primary color',
          hint: 'The word pills and the paper margin line',
        },
        { ...LOOK.ink, label: 'Text color', hint: 'The phrase left of the hinge' },
        { path: 'pill.text', label: 'Secondary color', hint: 'The words on the pills' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'pill.color', label: 'Pill color' },
        {
          ...LOOK.accent,
          label: 'Margin line color',
          hint: 'Shown when the paper margin line is on',
        },
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
      ],
    },
    {
      title: 'Fan',
      fields: [
        {
          path: 'fan.activeAngle',
          label: 'Front pill angle',
          hint: 'In degrees, where the newest pill settles',
        },
        {
          path: 'fan.spread',
          label: 'Angle between pills',
          hint: 'Degrees each older pill turns further away',
        },
        { path: 'steps.interval', label: 'Frames per word', hint: 'Lower switches words faster' },
      ],
      more: [
        {
          path: 'fan.trail',
          label: 'Pills left behind',
          hint: 'How many older pills stay visible in the fan',
        },
        {
          path: 'fan.swing',
          label: 'Swing-in angle',
          hint: 'Degrees a new pill sweeps through as it arrives',
        },
        { path: 'fan.fade', label: 'Trail fade', hint: 'Opacity each older pill loses' },
        {
          path: 'steps.moveFrames',
          label: 'Swing length',
          hint: 'In frames, capped at frames per word',
        },
        { path: 'steps.delay', label: 'Delay before switching', hint: 'In frames' },
        {
          path: 'entryFrames',
          label: 'Intro length',
          hint: 'In frames, the phrase rises in while the first pill swings in',
        },
        {
          path: 'steps.start',
          label: 'First word',
          hint: 'Position in the word list of the first pill, counting from 0',
        },
      ],
    },
    {
      title: 'Pills',
      fields: [],
      more: [
        { path: 'pill.height', label: 'Pill height', hint: 'In pixels, the ends stay fully round' },
        { path: 'pill.padding', label: 'Side padding' },
        {
          path: 'pill.shadow',
          label: 'Shadow strength',
          hint: 'The shadow is a darker shade of the pill color',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        {
          path: 'position.x',
          label: 'Horizontal position',
          hint: 'Moves the hinge where the phrase meets the pills, in pixels from center',
        },
        { path: 'position.y', label: 'Vertical position', hint: 'In pixels from center' },
        {
          path: 'position.scale',
          label: 'Scale',
          hint: 'Grows the phrase and fan around the hinge',
        },
        {
          path: 'fan.tilt',
          label: 'Overall tilt',
          hint: 'Turns the phrase and fan around the hinge, in degrees',
        },
        {
          path: 'labelType.gap',
          label: 'Gap before pills',
          hint: 'Space between the phrase and the hinge',
        },
        {
          path: 'fan.drift',
          label: 'Rotation drift',
          hint: 'Degrees per frame the whole group keeps turning',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        {
          path: 'aura.blobs',
          label: 'Color glows',
          hint: 'Soft colored light behind the fan. Position and size are in percent of the frame. Hidden when the background is off',
          items: {
            color: 'Color',
            x: 'Horizontal position',
            y: 'Vertical position',
            size: 'Size',
            strength: 'Strength',
          },
        },
        LOOK.spotlight,
        { path: 'aura.drift', label: 'Glow drift', hint: 'How much the soft glows wander' },
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
        MOTION.enter,
        MOTION.exit,
        {
          ...MOTION.speed,
          hint: 'Scales the word switching, intro and rotation drift. Entrance, exit and glow drift keep their pace',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
