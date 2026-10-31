import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { PrinterPagesProps } from './printer-pages';

export const printerPagesControls = defineControls<PrinterPagesProps>({
  sections: [
    {
      title: 'Pages',
      fields: [
        {
          path: 'pages',
          label: 'Pages',
          hint: 'Printed one after another, first page first. Text shrinks to fit the page width. Vertical positions run from the top (0) to the bottom (1) of the page, and caption size is a share of the page width. Burst and circle decorations center on the text, confetti keeps clear of it',
          items: {
            text: 'Text',
            caption: 'Caption',
            content: 'Page shows',
            image: 'Image',
            font: 'Font',
            size: 'Text size',
            weight: 'Font weight',
            ink: 'Text and caption color',
            design: 'Decoration',
            accent: 'Decoration color',
            secondary: 'Decoration second color',
            designScale: 'Decoration size',
            textY: 'Text vertical position',
            lineHeight: 'Line spacing',
            tracking: 'Letter spacing',
            captionY: 'Caption vertical position',
            captionSize: 'Caption size',
            imageY: 'Image vertical position',
            imageWidth: 'Image width',
            imageHeight: 'Image height',
            imageFit: 'Image fit',
            imageRadius: 'Image corner radius',
          },
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['printer.body', 'printer.tray'],
          label: 'Primary color',
          hint: 'The printer body, its buttons and the output tray together',
        },
        {
          path: 'printer.trim',
          label: 'Secondary color',
          hint: 'The front edge, control panel and tray end stop',
        },
        {
          path: 'printer.light',
          label: 'Accent color',
          hint: 'The glowing status light and the readout on the display',
        },
        { path: 'paper.color', label: 'Surface color', hint: 'Every printed sheet' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        {
          path: 'printer.body',
          label: 'Printer body color',
          hint: 'Also colors the panel buttons',
        },
        { path: 'printer.tray', label: 'Output tray color' },
        { path: 'printer.slot', label: 'Paper slot color' },
        { path: 'printer.display', label: 'Display screen color' },
        { ...LOOK.background, label: 'Background center color' },
        { ...LOOK.backgroundEdge, label: 'Background corner color' },
      ],
    },
    {
      title: 'Printing',
      fields: [
        {
          path: 'timing.interval',
          label: 'Time between pages',
          hint: 'In frames. Lower prints the pages in quicker succession',
        },
        {
          path: 'timing.ejectFrames',
          label: 'Page slide-out length',
          hint: 'Frames each sheet takes to feed out onto the tray. Lower is faster',
        },
      ],
      more: [{ path: 'timing.delay', label: 'First page delay', hint: 'In frames' }],
    },
    {
      title: 'Paper',
      fields: [
        {
          path: 'paper.width',
          label: 'Page size',
          hint: 'Short side of each sheet in pixels. The printer and tray grow with it',
        },
        {
          path: 'paper.scatter',
          label: 'Messy stack',
          hint: 'How far landed sheets shift and twist on the tray. 0 stacks them perfectly',
        },
      ],
      more: [
        { path: 'paper.shadow', label: 'Page shadow' },
        {
          path: 'paper.motionBlur',
          label: 'Motion blur',
          hint: 'Streak on sheets while they slide out',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [{ path: 'camera.zoom', label: 'Zoom' }],
      more: [
        {
          path: 'camera.angle',
          label: 'Rotation',
          hint: 'In degrees. Turns the whole printer and tray in the frame',
        },
        {
          path: 'camera.drift',
          label: 'Handheld drift',
          hint: 'Gentle sway and breathing zoom. 0 holds the camera still',
        },
        {
          path: 'camera.x',
          label: 'Horizontal position',
          hint: 'In pixels. Higher moves the printer right',
        },
        {
          path: 'camera.y',
          label: 'Vertical position',
          hint: 'In pixels. Higher moves the printer down',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        {
          ...LOOK.paper,
          label: 'Background lines',
          hint: 'Ruled or grid lines over the background',
        },
        { ...LOOK.paperLine, label: 'Background line color' },
        { ...LOOK.paperSpacing, label: 'Background line spacing' },
        { ...LOOK.paperMargin, label: 'Background margin line' },
        { path: 'look.accent', label: 'Margin line color' },
      ],
    },
    {
      title: 'Motion',
      fields: [
        { ...MOTION.enter, label: 'Intro transition', hint: 'How the whole frame appears' },
        {
          ...MOTION.exit,
          label: 'Outro transition',
          hint: 'How the whole frame leaves at the end',
        },
      ],
      more: [
        {
          ...MOTION.speed,
          hint: 'Speeds up or slows down the printing and the camera drift',
        },
        { ...MOTION.enterFrames, label: 'Intro length' },
        { ...MOTION.exitFrames, label: 'Outro length' },
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
