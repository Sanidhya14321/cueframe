import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { CtaEndCardProps } from './cta-end-card';

export const ctaEndCardControls = defineControls<CtaEndCardProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'headline', label: 'Headline', hint: 'Start a new line to split it in two' },
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Words from the headline shown in the primary color',
        },
        { path: 'subline', label: 'Subline', hint: 'Leave empty to hide' },
        { path: 'url', label: 'Website', hint: 'Leave empty to hide' },
      ],
      more: [
        { path: 'headlineSize', label: 'Headline size' },
        { path: 'headlineWeight', label: 'Headline weight' },
        { path: 'font', label: 'Headline font' },
        { path: 'sublineSize', label: 'Subline size' },
        {
          path: 'sublineWidth',
          label: 'Subline width',
          hint: 'In pixels. Longer sublines wrap at this width',
        },
        { path: 'urlSize', label: 'Website size' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['markColor', 'markColorEnd', 'look.accent'],
          label: 'Primary color',
          hint: 'The logo mark and the highlighted headline words, also the paper margin line',
        },
        {
          ...LOOK.ink,
          label: 'Text color',
          hint: 'Brand name, headline and pill buttons. Store badges stay black',
        },
        { ...LOOK.muted, label: 'Secondary color', hint: 'Subline and website' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background, also the label on the filled pill button',
        },
      ],
      more: [
        { path: 'markColor', label: 'Ring and icon top color' },
        { path: 'markColorEnd', label: 'Icon bottom color', hint: 'App icon gradient only' },
        {
          ...LOOK.accent,
          label: 'Highlight color',
          hint: 'Highlighted words, also the paper margin line',
        },
        { path: 'markInk', label: 'Icon symbol color', hint: 'App icon only' },
        { ...LOOK.background, hint: 'Also the label color on the filled pill button' },
        LOOK.backgroundEdge,
        LOOK.paperLine,
      ],
    },
    {
      title: 'Brand',
      fields: [{ path: 'brandName', label: 'Brand name', hint: 'Leave empty to hide' }],
      more: [
        { path: 'showMark', label: 'Show logo mark' },
        { path: 'mark', label: 'Mark style', hint: 'A ring that draws itself, or an app icon' },
        { path: 'markSize', label: 'Mark size' },
        { path: 'brandSize', label: 'Brand name size' },
        {
          path: 'markGlyph',
          label: 'Icon symbol',
          hint: 'App icon only. Its shape is cut out and filled with the symbol color; empty uses the default symbol',
        },
      ],
    },
    {
      title: 'Buttons',
      fields: [
        {
          path: 'badges',
          label: 'Button style',
          hint: 'Pills in your text color, or black app store badges',
        },
        { path: 'showSecondaryButton', label: 'Show second button' },
      ],
      more: [
        { path: 'primaryLabel', label: 'First button label' },
        { path: 'secondaryLabel', label: 'Second button label' },
        {
          path: 'primaryCaption',
          label: 'First button caption',
          hint: 'Small line above the label',
        },
        {
          path: 'secondaryCaption',
          label: 'Second button caption',
          hint: 'Small line above the label',
        },
        { path: 'badgeScale', label: 'Button size' },
      ],
    },
    {
      title: 'Layout',
      fields: [
        {
          path: 'textAlign',
          label: 'Text align',
          hint: 'Lines up the brand, headline, subline, buttons and website',
        },
      ],
      more: [
        PLACEMENT.vertical,
        PLACEMENT.horizontal,
        {
          path: 'gap',
          label: 'Spacing',
          hint: 'Space between the brand, headline, subline, buttons and website',
        },
        {
          ...PLACEMENT.width,
          label: 'Content width',
          hint: 'In pixels. The box the content aligns within',
        },
        PLACEMENT.insetX,
        PLACEMENT.insetY,
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'Drawn in the highlight color' },
      ],
    },
    {
      title: 'Timing',
      fields: [MOTION.enter],
      more: [
        {
          path: 'markAt',
          label: 'Brand appears at',
          hint: 'Frame number. The brand name follows 6 frames later',
        },
        {
          path: 'headlineAt',
          label: 'Headline appears at',
          hint: 'Frame number. The subline follows 16 frames later',
        },
        {
          path: 'badgesAt',
          label: 'Buttons appear at',
          hint: 'Frame number. The website follows 12 frames later',
        },
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        {
          path: 'motion.speed',
          label: 'Ring draw speed',
          hint: 'Higher draws the ring mark faster',
        },
      ],
    },
  ],
  hidden: ['motion.float'],
});
