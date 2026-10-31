import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { BrandRevealProps } from './brand-reveal';

export const brandRevealControls = defineControls<BrandRevealProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'brandName', label: 'Brand name' },
        { path: 'eyebrow', label: 'Eyebrow', hint: 'Small spaced capitals above the name' },
        { path: 'tagline', label: 'Tagline' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { path: 'markColor', label: 'Primary color', hint: 'The ring mark' },
        { ...LOOK.ink, label: 'Text color', hint: 'The brand name' },
        { ...LOOK.muted, label: 'Secondary color', hint: 'Eyebrow and tagline' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        LOOK.background,
        LOOK.backgroundEdge,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when the paper has a margin' },
        LOOK.paperLine,
      ],
    },
    {
      title: 'Logo mark',
      fields: [{ path: 'showMark', label: 'Show ring mark' }],
      more: [
        {
          path: 'markScale',
          label: 'Mark size',
          hint: 'Relative to the brand name size',
        },
        {
          path: 'markGap',
          label: 'Gap to brand name',
          hint: 'Relative to the brand name size',
        },
      ],
    },
    {
      title: 'Style',
      fields: [{ path: 'wordmarkSize', label: 'Brand name size' }],
      more: [
        { path: 'wordmarkWeight', label: 'Brand name weight' },
        {
          link: ['eyebrowGap', 'taglineGap'],
          label: 'Space around brand name',
          hint: 'Gap above to the eyebrow and below to the tagline',
        },
        {
          path: 'wordmarkTracking',
          label: 'Brand name letter spacing',
          hint: 'In em, negative pulls letters together',
        },
        { path: 'eyebrowSize', label: 'Eyebrow size' },
        { path: 'taglineSize', label: 'Tagline size' },
        { path: 'eyebrowGap', label: 'Gap below eyebrow' },
        { path: 'taglineGap', label: 'Gap above tagline' },
      ],
    },
    {
      title: 'Reveal',
      fields: [
        {
          ...MOTION.speed,
          label: 'Reveal speed',
          hint: 'Speeds up the ring drawing, the letter rise and the tagline cue',
        },
        {
          path: 'letterStagger',
          label: 'Delay between letters',
          hint: 'In frames. 0 raises every letter together',
        },
      ],
      more: [
        {
          path: 'wordmarkStart',
          label: 'Letters start at',
          hint: 'Frame number at reveal speed 1',
        },
        {
          path: 'taglineStart',
          label: 'Tagline appears at',
          hint: 'Frame number at reveal speed 1',
        },
        {
          path: 'letterRise',
          label: 'Letter rise length',
          hint: 'Frames each letter takes to rise into place',
        },
        {
          path: 'markStart',
          label: 'Ring starts drawing at',
          hint: 'Frame number at reveal speed 1',
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
      title: 'Entrance and exit',
      fields: [MOTION.enter, MOTION.exit],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float'],
});
