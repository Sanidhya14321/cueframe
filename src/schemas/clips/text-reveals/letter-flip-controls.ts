import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { LetterFlipProps } from './letter-flip';

export const letterFlipControls = defineControls<LetterFlipProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'text', label: 'Word', hint: 'Each character flips in on its own' },
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
        { path: 'look.ink', label: 'Primary color', hint: 'The word and its burn-out glow' },
        {
          path: 'look.accent',
          label: 'Accent color',
          hint: 'The highlighted letter and the paper margin line',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [LOOK.background, LOOK.backgroundEdge, LOOK.paperLine],
    },
    {
      title: 'Flip',
      fields: [
        {
          path: 'startAngle',
          label: 'Flip angle',
          hint: 'Degrees each letter turns before it lands; 180 starts from its mirror image',
        },
        {
          path: 'stagger',
          label: 'Delay between letters',
          hint: 'In frames; 0 flips every letter at once',
        },
      ],
      more: [
        { path: 'flipFrames', label: 'Flip length', hint: 'In frames per letter' },
        {
          path: 'slide',
          label: 'Sideways slide',
          hint: 'How far each letter travels as it flips, as a multiple of the text size',
        },
        { path: 'delay', label: 'Start delay', hint: 'In frames before the first letter flips' },
        {
          path: 'depth',
          label: 'Flip perspective',
          hint: 'Viewing distance as a multiple of the text size; lower looks more dramatic',
        },
      ],
    },
    {
      title: 'Highlight',
      fields: [
        {
          path: 'highlight',
          label: 'Highlighted letter',
          hint: 'Position of the letter drawn in the accent color, counting from 1; 0 for none',
        },
      ],
    },
    {
      title: 'Ending',
      fields: [
        {
          path: 'glowOut',
          label: 'Glow burn-out',
          hint: 'Near the end the word glows, blurs and fades letter by letter; 0 turns it off',
        },
        MOTION.exit,
      ],
      more: [
        {
          ...MOTION.exitFrames,
          hint: 'In frames; a longer exit also starts the glow burn-out earlier',
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
          hint: 'The word never wraps. Sets where left or right aligned text sits',
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
        { ...LOOK.paperMargin, hint: 'Drawn in the accent color' },
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        {
          ...MOTION.speed,
          hint: 'Scales the letter flips. The glow burn-out, entrance and exit keep their timing',
        },
      ],
      more: [MOTION.enterFrames],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
