import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { TypewriterProps } from './typewriter';

export const typewriterControls = defineControls<TypewriterProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'text', label: 'Line' },
        { path: 'size', label: 'Text size', hint: 'In pixels' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        { path: 'tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'caretColor', 'selectionColor'],
          label: 'Primary color',
          hint: 'The typed letters, the caret, the opening block and the selection highlight together',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together. Selected letters also take the center color',
        },
      ],
      more: [
        { ...LOOK.ink, label: 'Text color', hint: 'The typed letters only' },
        { path: 'caretColor', label: 'Caret color', hint: 'The caret and the opening block' },
        {
          path: 'selectionColor',
          label: 'Selection color',
          hint: 'Highlight behind the selected line. The selected letters take the background color',
        },
        {
          ...LOOK.background,
          label: 'Background center color',
          hint: 'Center of the background. Selected letters take this color',
        },
        { ...LOOK.backgroundEdge, label: 'Background corner color' },
      ],
    },
    {
      title: 'Typing',
      fields: [
        {
          path: 'intro',
          label: 'Intro style',
          hint: 'Block: a block shrinks into the caret, then the line types. None: no block, the caret blinks for the pause and then the line types. Typed: the whole line rises in. Cut: the whole line appears at once',
        },
        {
          path: 'charFrames',
          label: 'Frames per letter',
          hint: 'Lower types faster. Also paces the erase outro',
        },
        { path: 'showCaret', label: 'Show caret' },
      ],
      more: [
        {
          path: 'zoom',
          label: 'Start zoom',
          hint: 'The line eases from this scale down to full size, settling when the outro starts (after the erase for Erase). 1 keeps it still',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames' },
        {
          path: 'caretHold',
          label: 'Caret pause before typing',
          hint: 'In frames. Block and None intros only',
        },
        { path: 'caretPulse', label: 'Caret blink length', hint: 'Frames per blink' },
      ],
    },
    {
      title: 'Outro',
      fields: [
        {
          path: 'outro',
          label: 'Outro style',
          hint: 'Select: a selection sweeps across and the line collapses away. Erase: letters delete from the end. None: the line stays',
        },
        {
          path: 'outroAt',
          label: 'Outro starts at',
          hint: 'Frame number at speed 1',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [PLACEMENT.horizontal],
      more: [
        PLACEMENT.vertical,
        {
          ...PLACEMENT.width,
          hint: 'The line never wraps. Sets where left or right aligned text sits',
        },
        PLACEMENT.insetX,
        PLACEMENT.insetY,
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
        LOOK.paperLine,
        LOOK.paperSpacing,
        LOOK.paperMargin,
        { path: 'look.accent', label: 'Margin line color' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the typing, caret and outro timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
