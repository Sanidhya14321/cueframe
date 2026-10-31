import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { BrandingIsTickerProps } from './branding-is-ticker';

export const brandingIsTickerControls = defineControls<BrandingIsTickerProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'copy.lead', label: 'Opening line', hint: 'Each line break starts a new line' },
        {
          path: 'copy.words',
          label: 'Ticker words',
          hint: 'One word per line; each word adds one ticker step, so more words start the end card later',
        },
      ],
      more: [
        {
          link: ['type.size', 'type.tickerSize'],
          label: 'Text size',
          hint: 'Sets the opening line and the ticker words together',
        },
        {
          path: 'type.leadFont',
          label: 'Opening line font',
          hint: 'Italic serif, or the same rounded sans as the ticker',
        },
        { path: 'copy.separator', label: 'Separator after each word' },
        {
          path: 'type.size',
          label: 'Opening line size',
          hint: 'Also sets the line spacing of the ticker row',
        },
        { path: 'type.tickerSize', label: 'Ticker word size' },
        {
          path: 'type.weight',
          label: 'Font weight',
          hint: 'Ticker words, and the opening line when it uses the sans font',
        },
        { path: 'type.tracking', label: 'Letter spacing' },
        { path: 'type.lineHeight', label: 'Line spacing' },
        { path: 'type.x', label: 'Text left edge', hint: 'In pixels from the left' },
        { path: 'type.y', label: 'Text top', hint: 'In pixels from the top' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['type.active', 'underline.color', 'card.accent'],
          label: 'Primary color',
          hint: 'Active word, its underline, and the end card logo tile, button and contact icons',
        },
        {
          path: 'type.dim',
          label: 'Secondary color',
          hint: 'Outline, or fill when the outline width is 0, of the words around the active one',
        },
        {
          link: ['type.lead', 'brand.label'],
          label: 'Text color',
          hint: 'Opening line and the brand name under the logo',
        },
        {
          link: ['brand.mark', 'card.background'],
          label: 'Surface color',
          hint: 'Logo tile and the end card it opens into',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'type.active', label: 'Active word color' },
        { path: 'underline.color', label: 'Underline color' },
        {
          path: 'card.accent',
          label: 'End card accent',
          hint: 'Logo tile, button gradient start and contact icons',
        },
        {
          path: 'card.accentDeep',
          label: 'End card deep accent',
          hint: 'Where the logo tile and button gradients end',
        },
        { path: 'type.lead', label: 'Opening line color' },
        { path: 'brand.label', label: 'Brand name color' },
        { path: 'brand.mark', label: 'Logo tile color' },
        { path: 'brand.cutout', label: 'Logo symbol color' },
        {
          path: 'card.background',
          label: 'End card background',
          hint: 'Also the color the logo tile turns into as it opens',
        },
        { path: 'card.text', label: 'End card text color' },
        { path: 'card.buttonText', label: 'Button text color' },
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
        {
          path: 'look.accent',
          label: 'Margin line color',
          hint: 'Shows when the paper has a margin',
        },
      ],
    },
    {
      title: 'Ticker',
      fields: [
        {
          path: 'ticker.stepFrames',
          label: 'Frames per word',
          hint: 'How long each word takes to slide past; lower is faster and brings the end card sooner',
        },
      ],
      more: [
        {
          path: 'type.outline',
          label: 'Outline width',
          hint: 'Stroke of the words around the active one; 0 fills them solid',
        },
        { path: 'underline.show', label: 'Show underline' },
        {
          path: 'type.edgeFade',
          label: 'Edge fade',
          hint: 'Pixels over which the row fades out at both screen edges',
        },
        { path: 'underline.height', label: 'Underline thickness' },
        {
          path: 'underline.offset',
          label: 'Underline offset',
          hint: 'Distance below the ticker row; negative moves it up',
        },
        { path: 'type.wordGap', label: 'Gap between words' },
        {
          path: 'type.tickerOffset',
          label: 'Ticker row offset',
          hint: 'Moves the ticker row below the opening line; negative moves it up',
        },
        {
          path: 'ticker.easeX1',
          label: 'Slide ease, start handle X',
          hint: 'Cubic bezier control point; higher delays the start of each slide',
        },
        { path: 'ticker.easeY1', label: 'Slide ease, start handle Y' },
        { path: 'ticker.easeX2', label: 'Slide ease, end handle X' },
        { path: 'ticker.easeY2', label: 'Slide ease, end handle Y' },
      ],
    },
    {
      title: 'Brand',
      fields: [
        {
          path: 'brand.name',
          label: 'Brand name',
          hint: 'Shown under the logo and on the end card',
        },
      ],
      more: [
        {
          path: 'brand.kicker',
          label: 'Small line above name',
          hint: 'Also on the end card; leave empty to hide it',
        },
        { path: 'brand.size', label: 'Logo size' },
        {
          path: 'brand.roundness',
          label: 'Logo corner roundness',
          hint: 'Also shapes the end card logo and the tile that opens into it; 0.5 is a circle',
        },
        { path: 'brand.x', label: 'Logo center X', hint: 'In pixels from the left' },
        { path: 'brand.y', label: 'Logo center Y', hint: 'In pixels from the top' },
        { path: 'brand.labelSize', label: 'Brand name size' },
        {
          path: 'brand.drawFrames',
          label: 'Symbol draw length',
          hint: 'In frames; the symbol draws on at the start and erases before the end card',
        },
      ],
    },
    {
      title: 'End card',
      fields: [{ path: 'card.show', label: 'Show end card' }],
      more: [
        { path: 'card.button', label: 'Button text', hint: 'Leave empty to hide the button' },
        { path: 'card.website', label: 'Website', hint: 'Leave empty to hide this row' },
        { path: 'card.phone', label: 'Phone', hint: 'Leave empty to hide this row' },
        { path: 'card.buttonArrow', label: 'Show button arrow' },
        { path: 'card.logoSize', label: 'Logo size' },
        { path: 'card.nameSize', label: 'Brand name size' },
        { path: 'card.logoX', label: 'Logo center X', hint: 'In pixels from the left' },
        { path: 'card.logoY', label: 'Logo center Y', hint: 'In pixels from the top' },
        { path: 'card.buttonSize', label: 'Button text size' },
        { path: 'card.buttonWidth', label: 'Button width' },
        { path: 'card.buttonHeight', label: 'Button height' },
        { path: 'card.buttonRadius', label: 'Button corner radius' },
        { path: 'card.buttonX', label: 'Button center X', hint: 'In pixels from the left' },
        { path: 'card.buttonY', label: 'Button center Y', hint: 'In pixels from the top' },
        { path: 'card.rowSize', label: 'Contact text size' },
        { path: 'card.iconSize', label: 'Contact icon badge size' },
        {
          path: 'card.rowGap',
          label: 'Contact row spacing',
          hint: 'Distance between row centers in pixels',
        },
        { path: 'card.rowsX', label: 'Contact rows center X', hint: 'In pixels from the left' },
        { path: 'card.rowsY', label: 'First contact row center Y', hint: 'In pixels from the top' },
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
      title: 'Timing and motion',
      fields: [MOTION.speed, MOTION.enter, MOTION.exit],
      more: [
        {
          path: 'card.delay',
          label: 'End card delay',
          hint: 'Frames after the last word before the logo tile opens',
        },
        { path: 'card.openFrames', label: 'Tile opening length', hint: 'In frames' },
        MOTION.enterFrames,
        MOTION.exitFrames,
        {
          path: 'card.logoStart',
          label: 'End card logo start',
          hint: 'Frames after the end card begins',
        },
        { path: 'card.logoFrames', label: 'End card logo length', hint: 'In frames' },
        {
          path: 'card.buttonStart',
          label: 'Button reveal start',
          hint: 'Frames after the end card begins',
        },
        { path: 'card.buttonFrames', label: 'Button reveal length', hint: 'In frames' },
        {
          path: 'card.buttonFeather',
          label: 'Button wipe softness',
          hint: 'Width of the soft wipe edge, as a percent of the button',
        },
        {
          path: 'card.rowsStart',
          label: 'Contact rows start',
          hint: 'Frames after the end card begins',
        },
        {
          path: 'card.rowsStagger',
          label: 'Contact row stagger',
          hint: 'Frames between each row appearing',
        },
        { path: 'card.rowFrames', label: 'Contact row fade length', hint: 'In frames' },
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
