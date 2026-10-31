import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { TextRingsProps } from './text-rings';

const START_FRAME = 'Frame number where it begins. Animation speed scales it';
const DARK_ONLY = 'Dark version. The light version uses Light page and Light ink';

export const textRingsControls = defineControls<TextRingsProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'words.text',
          label: 'Ring words',
          hint: 'Repeated around every ring. Leave empty to show only the center mark',
        },
        {
          path: 'words.separator',
          label: 'Separator',
          hint: 'Sits halfway between repeats. Leave empty for plain gaps',
        },
      ],
      more: [
        {
          path: 'words.innerSize',
          label: 'Inner text size',
          hint: 'In pixels, where a new ring appears next to the mark',
        },
        {
          path: 'words.outerSize',
          label: 'Outer text size',
          hint: 'In pixels, as a ring reaches the corners of the frame',
        },
        {
          link: ['words.weight', 'words.oddWeight'],
          label: 'Font weight',
          hint: 'Sets every ring. Change Every other ring weight on its own to alternate',
        },
        {
          path: 'words.weight',
          label: 'Ring weight',
          hint: 'The first ring and every other one after it',
        },
        {
          path: 'words.oddWeight',
          label: 'Every other ring weight',
          hint: 'The second, fourth and so on. Set it apart from Ring weight to alternate',
        },
        {
          path: 'words.tracking',
          label: 'Letter spacing',
          hint: 'In em. Stretched slightly so the repeats close evenly around each ring',
        },
        {
          path: 'words.gap',
          label: 'Gap around separator',
          hint: 'In em, on each side. Larger gaps fit fewer repeats per ring',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'look.accent'],
          label: 'Primary color',
          hint: 'The ring words and the center mark together. Dark version',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together. Dark version',
        },
      ],
      more: [
        { ...LOOK.ink, label: 'Ring words color', hint: DARK_ONLY },
        {
          ...LOOK.accent,
          label: 'Mark color',
          hint: 'Colors the circle, scribble and center word. Also the paper margin line. Dark version',
        },
        { ...LOOK.background, hint: DARK_ONLY },
        {
          ...LOOK.backgroundEdge,
          hint: 'Color the background fades to at the corners. Dark version only',
        },
        {
          path: 'inverted',
          label: 'Light version',
          hint: 'Draws on Light page with Light ink for the words and the mark',
        },
        { path: 'light.page', label: 'Light page', hint: 'Background in the light version' },
        {
          path: 'light.ink',
          label: 'Light ink',
          hint: 'Ring words, mark and paper margin line in the light version',
        },
        LOOK.paperLine,
      ],
    },
    {
      title: 'Rings',
      fields: [
        {
          path: 'rings.count',
          label: 'Number of rings',
          hint: 'Spread evenly from First ring to Last ring, so more rings arrive faster and expand faster',
        },
        {
          path: 'rings.spacing',
          label: 'Ring spacing',
          hint: 'How many times wider each ring is than the next one inside it. Never tighter than the text size allows',
        },
      ],
      more: [
        { path: 'rings.firstAt', label: 'First ring at', hint: START_FRAME },
        {
          path: 'rings.lastAt',
          label: 'Last ring at',
          hint: 'Frame number of the last new ring. Rings come a little later if they would expand too fast or collide',
        },
        {
          path: 'rings.startGap',
          label: 'Gap outside the circle',
          hint: 'Pixels between the circle and the words of a new ring. Rings always start outside the circle',
        },
        { path: 'rings.fadeFrames', label: 'Ring fade-in', hint: 'In frames' },
        {
          path: 'rings.oddOpacity',
          label: 'Every other ring opacity',
          hint: 'Below 1 dims the second, fourth and so on for a layered look',
        },
      ],
    },
    {
      title: 'Spin',
      fields: [
        {
          path: 'spin.speed',
          label: 'Spin speed',
          hint: 'Pixels per frame along each ring, so small rings turn faster. Keep it at 1.5 or more for smooth text. 0 stops the spin',
        },
        {
          path: 'spin.alternate',
          label: 'Alternate directions',
          hint: 'Neighboring rings turn opposite ways',
        },
      ],
      more: [
        {
          path: 'spin.clockwise',
          label: 'First ring clockwise',
          hint: 'Off turns the first ring counterclockwise',
        },
        {
          path: 'spin.offset',
          label: 'Ring turn offset',
          hint: 'In degrees, how far each ring starts turned from the one before',
        },
      ],
    },
    {
      title: 'Center mark',
      fields: [
        {
          path: 'mark.style',
          label: 'Mark style',
          hint: 'Circle with a scribble, circle with a word, the circle alone, or no mark',
        },
      ],
      more: [
        { path: 'mark.size', label: 'Circle size', hint: 'Diameter in pixels' },
        {
          link: ['mark.stroke', 'mark.scribbleStroke'],
          label: 'Line width',
          hint: 'Sets the circle and the scribble together, in pixels',
        },
        {
          path: 'mark.drawFrames',
          label: 'Draw length',
          hint: 'In frames for the circle. The scribble takes a little longer',
        },
        { path: 'mark.word', label: 'Center word', hint: 'Word style only' },
        { path: 'mark.wordSize', label: 'Center word size', hint: 'In pixels. Word style only' },
        { path: 'mark.wordWeight', label: 'Center word weight', hint: 'Word style only' },
        { path: 'mark.loops', label: 'Scribble loops', hint: 'Scribble style only' },
        { path: 'mark.stroke', label: 'Circle line width', hint: 'In pixels' },
        {
          path: 'mark.scribbleStroke',
          label: 'Scribble line width',
          hint: 'In pixels. Scribble style only',
        },
        {
          path: 'mark.scribbleSize',
          label: 'Scribble size',
          hint: 'Share of the circle radius. Scribble style only',
        },
        { path: 'mark.drawAt', label: 'Draw starts at', hint: START_FRAME },
        {
          path: 'mark.scribbleDelay',
          label: 'Scribble or word delay',
          hint: 'In frames after the circle starts drawing',
        },
        {
          path: 'mark.shrinkTo',
          label: 'Shrink to',
          hint: 'Final scale of the circle and scribble while the rings grow. 1 keeps its size. The center word holds its size',
        },
        {
          path: 'mark.shrinkFrames',
          label: 'Shrink length',
          hint: 'In frames, starting with the first ring',
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
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        MOTION.enterFrames,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up the mark drawing, ring timing, growth and spin together; the entrance and exit keep their own length',
        },
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
