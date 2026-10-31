import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { WordPunchProps } from './word-punch';

export const wordPunchControls = defineControls<WordPunchProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'text', label: 'Words', hint: 'Shown one word at a time, split on spaces' },
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Words from the text to show in the accent color, separated by spaces. Case and punctuation are ignored',
        },
        { path: 'size', label: 'Text size', hint: 'Size of the first word in pixels' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        {
          path: 'shrink',
          label: 'Shrink per word',
          hint: 'Each next word is this share smaller than the one before, so 0.3 makes it 30% smaller. 0 keeps every word the same size',
        },
        { path: 'tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { ...LOOK.ink, label: 'Primary color', hint: 'The words' },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'Highlighted words, word-ending punctuation when Punctuation in accent color is on, and the paper margin line',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
        {
          path: 'accentPunctuation',
          label: 'Punctuation in accent color',
          hint: 'Colors the punctuation that ends a word, such as full stops, commas and question marks',
        },
      ],
    },
    {
      title: 'Word animation',
      fields: [
        {
          path: 'style',
          label: 'Animation style',
          hint: 'Type writes each word letter by letter and deletes it from the front; punch pops each whole word in',
        },
        {
          path: 'wordFrames',
          label: 'Time per word',
          hint: 'In frames, from when a word starts appearing until it starts leaving',
        },
      ],
      more: [
        {
          path: 'typeFrames',
          label: 'Frames per letter',
          hint: 'Type style only. Used for typing and deleting; lower is faster',
        },
        {
          path: 'swapFrames',
          label: 'Punch in and out length',
          hint: 'Punch style only. In frames',
        },
        {
          path: 'punch',
          label: 'Punch overshoot',
          hint: 'Punch style only. How much bigger a word starts before it settles, so 0.14 starts it 14% bigger',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames, before the first word' },
        {
          path: 'rise',
          label: 'Punch travel',
          hint: 'Punch style only. How far a word rises in and lifts out, as a share of its size',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [PLACEMENT.horizontal, PLACEMENT.vertical],
      more: [
        {
          ...PLACEMENT.width,
          hint: 'Words never wrap. Sets where left or right aligned words sit',
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
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        MOTION.enterFrames,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Scales the word timing and start delay. Entrance and exit keep their length',
        },
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
