import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { WordBuildProps } from './word-build';

export const wordBuildControls = defineControls<WordBuildProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'text',
          label: 'Line',
          hint: 'The first words fly through huge, then the whole line builds. New lines start new rows',
        },
        { path: 'size', label: 'Line text size', hint: 'In pixels' },
      ],
      more: [
        { path: 'weight', label: 'Line font weight' },
        {
          path: 'lineHeight',
          label: 'Row spacing',
          hint: 'Distance between rows as a multiple of the text size',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'bigColor'],
          label: 'Primary color',
          hint: 'The big words, their echo outlines and the line together',
        },
        {
          ...LOOK.accent,
          label: 'Accent color',
          hint: 'The walking highlight, the highlighted words and the paper margin line',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'bigColor', label: 'Big word color', hint: 'Also colors the echo outlines' },
        { ...LOOK.ink, label: 'Line text color' },
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
      ],
    },
    {
      title: 'Big words',
      fields: [
        {
          path: 'entry',
          label: 'Big word style',
          hint: 'Scroll pans all the big words across as one strip, the other styles show one word at a time',
        },
        {
          path: 'wordFrames',
          label: 'Frames per big word',
          hint: 'How long each big word holds the screen. With Scroll, the strip travels this long per word. Lower is faster',
        },
      ],
      more: [
        {
          path: 'bigWords',
          label: 'Number of big words',
          hint: 'Taken from the start of the line, 0 uses every word',
        },
        {
          path: 'bigSize',
          label: 'Big word size',
          hint: 'In pixels. With Step, the size of the last word',
        },
        {
          path: 'bigExit',
          label: 'Last big word exit',
          hint: 'Cut away, drop its letters, or squeeze down into the line. With Scroll it only delays the line',
        },
        { path: 'bigWeight', label: 'Big word font weight' },
        {
          path: 'direction',
          label: 'Scroll direction',
          hint: 'Scroll style only, which way the strip travels',
        },
        {
          path: 'sizeRamp',
          label: 'Step size ramp',
          hint: 'Step style only, each word is this fraction of the size of the word after it',
        },
        {
          path: 'zoomFrom',
          label: 'Shrink start scale',
          hint: 'Shrink style only, how zoomed in each word starts',
        },
        {
          path: 'echoes',
          label: 'Echo outlines',
          hint: 'Echo style only, outline copies trailing each word',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames, before the first big word' },
      ],
    },
    {
      title: 'Line build',
      fields: [
        {
          path: 'sentenceEntry',
          label: 'Word entrance',
          hint: 'Rise up, swing in on a wave, or type in letter by letter',
        },
        {
          path: 'walkHighlight',
          label: 'Walking highlight',
          hint: 'Each new word flashes in the accent color as it lands',
        },
      ],
      more: [
        { path: 'buildFrom', label: 'Build from', hint: 'Which end of the line appears first' },
        {
          path: 'buildFrames',
          label: 'Frames between words',
          hint: 'Lower builds the line faster',
        },
        {
          path: 'lineDelay',
          label: 'Pause before the line',
          hint: 'In frames, after the last big word leaves',
        },
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Words kept in the accent color, separated by spaces. Used when the walking highlight is off. Also tints matching big words in the Zoom, Shrink, Tilt, Pop and Echo styles',
        },
        {
          path: 'exitByWord',
          label: 'Words leave one by one',
          hint: 'Each word fades out in turn before the clip exit',
        },
        {
          path: 'exitStagger',
          label: 'Word exit stagger',
          hint: 'Frames between one word fading out and the next, 0 fades them together. Words leave one by one only',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [
        { ...PLACEMENT.horizontal, hint: 'Moves the line. The big words stay centered' },
        { ...PLACEMENT.vertical, hint: 'Moves the line. The big words stay centered' },
      ],
      more: [
        {
          ...PLACEMENT.width,
          hint: 'Rows never wrap. Sets where left or right aligned rows sit',
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
        { ...LOOK.paperMargin, hint: 'A faded line in the accent color' },
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
          hint: 'Scales the big words, line build and word exits. Entrance and exit keep their length',
        },
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
