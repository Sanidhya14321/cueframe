import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ScrollerWallProps } from './scroller-wall';

export const scrollerWallControls = defineControls<ScrollerWallProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'intro.word',
          label: 'Opening word',
          hint: 'Outlined word the block rolls across, filling one letter per landing',
        },
        {
          path: 'headline.lines',
          label: 'Headline lines',
          hint: 'Stacked top to bottom, each line on its own timing',
          items: {
            text: 'Text',
            size: 'Text size',
            ink: 'Color',
            nudge: 'Vertical nudge',
            at: 'Appears at',
            hideAt: 'Disappears at',
          },
        },
        {
          path: 'words.items',
          label: 'Punchline words',
          hint: 'Shown one after another. A period ending the last word becomes the two dots',
          items: { text: 'Word', at: 'Appears at' },
        },
        {
          path: 'contact.text',
          label: 'Call to action',
          hint: 'The dots land on its first and last "o", then it repeats into the outlined wall',
        },
      ],
      more: [
        { path: 'scroller.word', label: 'Stacked word', hint: 'Repeats upward in a quick stack' },
        { path: 'scroller.count', label: 'Stacked word copies' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.field', 'square.color', 'card.logoAccent'],
          label: 'Primary color',
          hint: 'Main background after the cut, the rolling block and the logo tile, subtitle and icons',
        },
        {
          link: ['look.ink', 'card.logoInk', 'card.rowInk'],
          label: 'Text color',
          hint: 'Words, dots, brand name and contact rows',
        },
        {
          path: 'look.highlight',
          label: 'Accent color',
          hint: 'Headline lines set to Highlight',
        },
        {
          link: ['intro.outline', 'wall.outline', 'card.rings'],
          label: 'Secondary color',
          hint: 'Outlined opening word, the call-to-action wall and the end card rings',
        },
        {
          link: ['look.paper', 'card.background'],
          label: 'Background color',
          hint: 'Opening background, the end card background, its flash and the contact icon glyphs',
        },
      ],
      more: [
        {
          path: 'look.field',
          label: 'Main background',
          hint: 'Behind everything from the cut until the end card',
        },
        { path: 'square.color', label: 'Block color' },
        {
          path: 'card.logoAccent',
          label: 'Logo accent',
          hint: 'Logo tile, subtitle and row icons',
        },
        { path: 'look.ink', label: 'Words color' },
        { path: 'card.logoInk', label: 'Brand name color' },
        { path: 'card.rowInk', label: 'Contact rows color' },
        { path: 'intro.outline', label: 'Opening word outline' },
        { path: 'wall.outline', label: 'Wall outline' },
        { path: 'card.rings', label: 'Ring color' },
        { path: 'look.paper', label: 'Opening background', hint: 'Behind the opening word' },
        {
          path: 'card.background',
          label: 'End card background',
          hint: 'Also the flash just before the card and the contact icon glyphs',
        },
        {
          path: 'card.disc',
          label: 'Logo disc color',
          hint: 'Also the waves in the built-in mark',
        },
        {
          path: 'card.tint',
          label: 'Logo intro tint',
          hint: 'The logo starts in this color and settles to its own',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'card.brandTop', label: 'Brand name' },
        {
          path: 'card.logoImage',
          label: 'Logo image',
          hint: 'Replaces the built-in wave mark. Leave empty to keep it',
        },
      ],
      more: [
        { path: 'card.brandBottom', label: 'Brand subtitle' },
        { path: 'card.phone', label: 'Phone line' },
        { path: 'card.email', label: 'Email line' },
        { path: 'card.logoSize', label: 'Logo size' },
        { path: 'card.brandTopSize', label: 'Brand name size' },
        { path: 'card.brandBottomSize', label: 'Brand subtitle size' },
        { path: 'card.phoneSize', label: 'Phone text size' },
        { path: 'card.emailSize', label: 'Email text size' },
        { path: 'card.discRadius', label: 'Logo disc radius' },
        {
          path: 'card.centerY',
          label: 'Logo disc position',
          hint: 'Vertical center of the disc and rings, in pixels from the top',
        },
        {
          path: 'card.rowsY',
          label: 'Contact rows position',
          hint: 'Vertical position of the phone and email rows, in pixels from the top',
        },
        { path: 'card.ringWidth', label: 'Ring thickness' },
        { path: 'card.ringGap', label: 'Ring spacing' },
      ],
    },
    {
      title: 'Rolling block',
      fields: [{ path: 'square.size', label: 'Block size' }],
      more: [
        {
          path: 'square.radius',
          label: 'Corner roundness',
          hint: 'Share of the block size; 0.5 is a circle',
        },
        { path: 'square.hop', label: 'Hop height', hint: 'Extra arc as it rolls between letters' },
        {
          path: 'square.dip',
          label: 'Landing squash',
          hint: 'How far each letter is pressed down when the block lands',
        },
        {
          path: 'square.blur',
          label: 'Motion smear',
          hint: 'Vertical streak while it falls; 0 keeps it crisp',
        },
        { path: 'square.landAt', label: 'First landing', hint: 'Frame number' },
        { path: 'square.rollFrames', label: 'Roll length', hint: 'In frames per letter' },
        { path: 'square.rollGap', label: 'Pause between rolls', hint: 'In frames' },
        {
          path: 'square.exitLift',
          label: 'Exit jump height',
          hint: 'How high it leaps off the last letter',
        },
        {
          path: 'square.exitX',
          label: 'Exit landing spot',
          hint: 'Horizontal position it jumps to, in pixels from the left',
        },
        {
          path: 'square.floorY',
          label: 'Exit drop depth',
          hint: 'Vertical position it falls to, in pixels from the top',
        },
        { path: 'square.exitFrames', label: 'Exit length', hint: 'In frames' },
      ],
    },
    {
      title: 'Type',
      fields: [],
      more: [
        { path: 'intro.size', label: 'Opening word size' },
        { path: 'words.size', label: 'Punchline size' },
        { path: 'contact.size', label: 'Call to action size' },
        { path: 'look.weight', label: 'Font weight', hint: 'Opening word, stack and headline' },
        { path: 'words.weight', label: 'Punchline weight' },
        { path: 'contact.weight', label: 'Call to action weight' },
        {
          path: 'look.tracking',
          label: 'Letter spacing',
          hint: 'In em, for every word before the end card',
        },
        { path: 'scroller.size', label: 'Stacked word size' },
        { path: 'dots.size', label: 'Dot size' },
        {
          link: ['intro.outlineWidth', 'wall.outlineWidth'],
          label: 'Outline thickness',
          hint: 'Opening word and call-to-action wall',
        },
        { path: 'intro.outlineWidth', label: 'Opening word outline thickness' },
        { path: 'wall.outlineWidth', label: 'Wall outline thickness' },
      ],
    },
    {
      title: 'Layout',
      fields: [],
      more: [
        {
          path: 'headline.top',
          label: 'Headline top',
          hint: 'Where the first headline line starts, in pixels from the top',
        },
        {
          path: 'words.baselineY',
          label: 'Punchline baseline',
          hint: 'In pixels from the top',
        },
        {
          path: 'contact.baselineY',
          label: 'Call to action baseline',
          hint: 'In pixels from the top. The wall spreads out from here',
        },
        {
          path: 'wall.rows',
          label: 'Wall rows',
          hint: 'Outlined copies split above and below the call to action',
        },
        {
          path: 'intro.baselineY',
          label: 'Opening word baseline',
          hint: 'In pixels from the top',
        },
        {
          path: 'intro.offsetX',
          label: 'Opening word side shift',
          hint: 'In pixels from center',
        },
        {
          path: 'scroller.baseY',
          label: 'Stack position',
          hint: 'Center of the lowest copy, in pixels from the top',
        },
        { path: 'scroller.pitch', label: 'Stack spacing', hint: 'Pixels between copies' },
        { path: 'headline.gap', label: 'Headline line gap', hint: 'In pixels' },
        { path: 'wall.pitch', label: 'Wall row spacing', hint: 'Pixels between outlined rows' },
      ],
    },
    {
      title: 'Timing',
      fields: [MOTION.enter],
      more: [
        MOTION.exit,
        {
          path: 'intro.cutAt',
          label: 'Cut to primary color at',
          hint: 'Frame number; the opening background switches to the main one and the block leaves, filling every letter',
        },
        { path: 'contact.at', label: 'Call to action at', hint: 'Frame number' },
        { path: 'card.at', label: 'End card at', hint: 'Frame number' },
        {
          ...MOTION.speed,
          hint: 'Scales every beat. Entrance and exit keep their length. Below 1 the end card can be cut off',
        },
        {
          path: 'scroller.at',
          label: 'Stack starts at',
          hint: 'Frame number; the intro ends here',
        },
        { path: 'scroller.addEvery', label: 'Stack add interval', hint: 'Frames per new copy' },
        {
          path: 'scroller.removeAt',
          label: 'Stack shrinks at',
          hint: 'Frame number; copies leave from the bottom',
        },
        { path: 'scroller.removeEvery', label: 'Stack remove interval', hint: 'Frames per copy' },
        { path: 'scroller.endAt', label: 'Stack ends at', hint: 'Frame number' },
        {
          path: 'words.exitAt',
          label: 'Punchline fades at',
          hint: 'Frame number; letters of the last word fade from the right',
        },
        { path: 'words.letterStep', label: 'Letter fade stagger', hint: 'Frames between letters' },
        { path: 'words.letterFade', label: 'Letter fade length', hint: 'In frames' },
        {
          path: 'dots.splitAt',
          label: 'Dots split at',
          hint: 'Frame number; the period splits into two dots',
        },
        { path: 'dots.slideFrames', label: 'Dot slide length', hint: 'In frames' },
        { path: 'dots.riseFrames', label: 'Dot rise length', hint: 'In frames' },
        { path: 'dots.fadeAt', label: 'Dots fade at', hint: 'Frame number' },
        { path: 'dots.fadeFrames', label: 'Dot fade length', hint: 'In frames' },
        { path: 'wall.at', label: 'Wall spreads at', hint: 'Frame number' },
        { path: 'wall.spreadFrames', label: 'Wall spread length', hint: 'In frames' },
        {
          path: 'wall.washAt',
          label: 'Gradient wash at',
          hint: 'Frame number; the call to action turns to outline as the wash fades in',
        },
        { path: 'wall.washFrames', label: 'Gradient wash length', hint: 'In frames' },
        { path: 'wall.whiteAt', label: 'Fade to card at', hint: 'Frame number' },
        { path: 'wall.whiteFrames', label: 'Fade to card length', hint: 'In frames' },
        { path: 'card.fadeFrames', label: 'End card fade length', hint: 'In frames' },
        { path: 'card.tintFrames', label: 'Logo tint length', hint: 'In frames' },
        { path: 'card.ringFrames', label: 'Ring growth length', hint: 'In frames' },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        { path: 'wall.washTop', label: 'Wash top color' },
        { path: 'wall.washMiddle', label: 'Wash middle color' },
        { path: 'wall.washBottom', label: 'Wash bottom color' },
      ],
    },
  ],
  hidden: ['motion.float'],
});
