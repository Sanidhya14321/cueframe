import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ScrollerCalloutProps } from './scroller-callout';

export const scrollerCalloutControls = defineControls<ScrollerCalloutProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'intro.word',
          label: 'Opening word',
          hint: 'Starts as an outline and fills in letter by letter as the tile lands on it. Each extra letter adds a hop, so a longer word needs a later Scroll starts at',
        },
        { path: 'scroll.word', label: 'Scrolling word', hint: 'Stacks up in copies, then clears' },
        {
          path: 'punch.words',
          label: 'Punch line',
          hint: 'Flashes one word at a time. A period ending a word becomes the accent dot, and the last word collapses into the two dots',
        },
        {
          path: 'contact.text',
          label: 'Call to action',
          hint: 'The two accent dots land on its first and last letter o, or on its first and last letters when it has fewer than two',
        },
      ],
      more: [
        {
          link: ['intro.weight', 'scroll.weight', 'contact.weight'],
          label: 'Font weight',
          hint: 'Opening word, scrolling word and call to action together',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['palette.accent', 'palette.markFill'],
          label: 'Primary color',
          hint: 'Tile, dots, accent words, end card line and badge frame',
        },
        {
          link: ['palette.ink', 'palette.markInk'],
          label: 'Text color',
          hint: 'Every word on the paper, plus the badge letters',
        },
        {
          link: ['palette.muted', 'palette.outline'],
          label: 'Secondary color',
          hint: 'Dimmed lines, the first punch line flash and the opening word outline',
        },
        {
          link: ['palette.paper', 'palette.markFace'],
          label: 'Background color',
          hint: 'The paper behind the words, plus the badge face',
        },
        {
          path: 'palette.night',
          label: 'Surface color',
          hint: 'The dark end card background',
        },
      ],
      more: [
        {
          path: 'palette.accent',
          label: 'Tile and dot color',
          hint: 'Tile, dots, accent words and end card line, without the badge frame',
        },
        { path: 'palette.markFill', label: 'Badge frame color' },
        { path: 'palette.ink', label: 'Word color', hint: 'Every word, without the badge letters' },
        { path: 'palette.markInk', label: 'Badge letters color' },
        {
          path: 'palette.muted',
          label: 'Dimmed text color',
          hint: 'Stacked lines after they dim, and the first punch line flash',
        },
        { path: 'palette.outline', label: 'Outline color', hint: 'Opening word before it fills' },
        { path: 'palette.paper', label: 'Paper color', hint: 'Without the badge face' },
        { path: 'palette.markFace', label: 'Badge face color' },
        { path: 'palette.glow', label: 'End card glow color' },
        { path: 'palette.urlInk', label: 'Website color' },
      ],
    },
    {
      title: 'Opening tile',
      fields: [],
      more: [
        { path: 'intro.cubeSize', label: 'Tile size', hint: 'In pixels' },
        { path: 'intro.size', label: 'Word size', hint: 'In pixels' },
        {
          path: 'intro.arc',
          label: 'Hop height',
          hint: 'How high the tile arcs between letters, in pixels',
        },
        { path: 'intro.weight', label: 'Font weight' },
        { path: 'intro.outlineWidth', label: 'Outline thickness', hint: 'In pixels' },
        { path: 'intro.tracking', label: 'Letter spacing', hint: 'In em' },
        {
          path: 'intro.baseline',
          label: 'Word position',
          hint: 'Baseline, in pixels from the top',
        },
        {
          path: 'intro.offsetX',
          label: 'Horizontal offset',
          hint: 'In pixels. Negative moves left',
        },
        {
          path: 'intro.cubeCorner',
          label: 'Tile corner roundness',
          hint: 'Fraction of the tile size',
        },
        {
          path: 'intro.landOffset',
          label: 'Landing offset',
          hint: 'Shifts where the tile lands on each letter, as a fraction of the tile size',
        },
        {
          path: 'intro.press',
          label: 'Press depth',
          hint: 'How far the tile sinks into each letter, in pixels',
        },
        { path: 'intro.start', label: 'Drop starts at', hint: 'Frame number' },
        { path: 'intro.dropFrames', label: 'Drop length', hint: 'In frames' },
        { path: 'intro.hopFrames', label: 'Hop length', hint: 'In frames' },
        { path: 'intro.dwellFrames', label: 'Time on each letter', hint: 'In frames' },
        {
          path: 'intro.fillDelay',
          label: 'Fill delay',
          hint: 'Frames after the tile lands before the letter fills',
        },
        { path: 'intro.exitHop', label: 'Exit hop length', hint: 'In frames' },
        { path: 'intro.exitRise', label: 'Exit hop height' },
        {
          path: 'intro.exitDistance',
          label: 'Exit distance',
          hint: 'Sideways travel as the tile leaves. Negative goes left',
        },
        {
          path: 'intro.exitFloor',
          label: 'Exit fall depth',
          hint: 'Where the tile has fallen to when it disappears, in pixels from the top',
        },
        {
          path: 'intro.exitFrames',
          label: 'Exit length',
          hint: 'Frames from leaving the last letter until the tile is gone',
        },
        { path: 'intro.motionBlur', label: 'Motion blur samples', hint: 'Higher is smoother' },
        {
          path: 'intro.shutterAngle',
          label: 'Motion blur length',
          hint: 'Shutter angle. 360 blurs across a whole frame',
        },
      ],
    },
    {
      title: 'Scroll and stack',
      fields: [
        {
          path: 'stack.lines',
          label: 'Stacked lines',
          hint: 'Built line by line from the top. Times are frame numbers. Dims at 0 never dims the line, Leaves at 0 keeps it until the stack ends',
          items: {
            text: 'Text',
            size: 'Text size (px)',
            weight: 'Font weight',
            gap: 'Gap above',
            accent: 'Use primary color',
            at: 'Appears at',
            dimAt: 'Dims at',
            leaveAt: 'Leaves at',
          },
        },
      ],
      more: [
        { path: 'scroll.count', label: 'Scrolling copies' },
        { path: 'scroll.size', label: 'Scrolling word size', hint: 'In pixels' },
        { path: 'scroll.pitch', label: 'Copy spacing', hint: 'Pixels between stacked copies' },
        { path: 'scroll.weight', label: 'Scrolling word weight' },
        { path: 'scroll.tracking', label: 'Scrolling word letter spacing', hint: 'In em' },
        {
          path: 'scroll.baseline',
          label: 'Scrolling word position',
          hint: 'Baseline of the first copy, in pixels from the top. Later copies stack above',
        },
        { path: 'scroll.start', label: 'Scroll starts at', hint: 'Frame number' },
        { path: 'scroll.addFrames', label: 'Frames between copies', hint: 'Lower stacks faster' },
        {
          path: 'scroll.clearAt',
          label: 'Copies clear at',
          hint: 'Frame number. Copies vanish from the bottom up, leaving the top one',
        },
        { path: 'scroll.clearFrames', label: 'Frames between clears' },
        { path: 'scroll.endAt', label: 'Scroll ends at', hint: 'Frame number' },
        { path: 'stack.tracking', label: 'Stack letter spacing', hint: 'In em' },
        {
          path: 'stack.baseline',
          label: 'Stack position',
          hint: 'Baseline of the top line, in pixels from the top',
        },
        {
          path: 'stack.endAt',
          label: 'Stack ends at',
          hint: 'Frame number. Every line still showing disappears here',
        },
      ],
    },
    {
      title: 'Punch line and call to action',
      fields: [],
      more: [
        { path: 'punch.size', label: 'Punch line size', hint: 'In pixels' },
        { path: 'collapse.dotSize', label: 'Dot size', hint: 'Diameter in pixels' },
        { path: 'contact.size', label: 'Call to action size', hint: 'In pixels' },
        { path: 'punch.wordFrames', label: 'Frames per word', hint: 'Lower flashes faster' },
        { path: 'punch.weight', label: 'Punch line weight' },
        { path: 'punch.tracking', label: 'Punch line letter spacing', hint: 'In em' },
        {
          path: 'punch.baseline',
          label: 'Punch line position',
          hint: 'Baseline, in pixels from the top',
        },
        { path: 'punch.start', label: 'Punch line starts at', hint: 'Frame number' },
        {
          path: 'punch.primeFrames',
          label: 'Dimmed first flash',
          hint: 'Frames the first word shows in the dimmed color',
        },
        {
          path: 'collapse.at',
          label: 'Collapse starts at',
          hint: 'Frame number. The dot sweeps left and wipes the last word',
        },
        { path: 'collapse.sweepFrames', label: 'Sweep length', hint: 'In frames' },
        {
          path: 'collapse.drift',
          label: 'Second dot drift',
          hint: 'How far the resting dot slides left during the sweep',
        },
        {
          path: 'collapse.letterFade',
          label: 'Letter fade',
          hint: 'Frames each letter takes to fade once the dot passes it',
        },
        {
          path: 'collapse.firstFade',
          label: 'First letter fade',
          hint: 'Frames the first letter takes to fade after the sweep ends',
        },
        {
          path: 'collapse.riseAt',
          label: 'Dots fly to call to action at',
          hint: 'Frame number',
        },
        { path: 'collapse.riseFrames', label: 'Dot flight length', hint: 'In frames' },
        { path: 'contact.weight', label: 'Call to action weight' },
        { path: 'contact.tracking', label: 'Call to action letter spacing', hint: 'In em' },
        {
          path: 'contact.baseline',
          label: 'Call to action position',
          hint: 'Baseline after the hop, in pixels from the top',
        },
        {
          path: 'contact.drop',
          label: 'Hop distance',
          hint: 'How far below its final spot the line appears before hopping up',
        },
        { path: 'contact.at', label: 'Call to action appears at', hint: 'Frame number' },
        {
          path: 'contact.dotHold',
          label: 'Dot overlap',
          hint: 'Frames the flying dots stay after the line appears',
        },
        { path: 'contact.hopAt', label: 'Call to action hops up at', hint: 'Frame number' },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'end.url', label: 'Website' },
        { path: 'end.monogram', label: 'Badge letters' },
      ],
      more: [
        { path: 'end.markSize', label: 'Badge size', hint: 'In pixels' },
        { path: 'end.urlSize', label: 'Website size', hint: 'In pixels' },
        { path: 'end.glow', label: 'Glow strength', hint: 'Soft light at the top of the end card' },
        { path: 'end.urlWeight', label: 'Website weight' },
        { path: 'end.urlTracking', label: 'Website letter spacing', hint: 'In em' },
        { path: 'end.urlUppercase', label: 'Uppercase website' },
        {
          path: 'end.urlBaseline',
          label: 'Website position',
          hint: 'Baseline, in pixels from the top',
        },
        {
          path: 'end.markCorner',
          label: 'Badge corner roundness',
          hint: 'Fraction of the badge size',
        },
        { path: 'end.markY', label: 'Badge position', hint: 'Center, in pixels from the top' },
        { path: 'end.slices', label: 'Badge slices', hint: 'Strips the badge slides in as' },
        { path: 'end.lineWidth', label: 'Line width', hint: 'In pixels' },
        { path: 'end.lineThickness', label: 'Line thickness', hint: 'In pixels' },
        { path: 'end.lineY', label: 'Line position', hint: 'Center, in pixels from the top' },
        {
          path: 'end.overshoot',
          label: 'Line overshoot',
          hint: 'How far the line springs past its full width',
        },
        { path: 'end.at', label: 'End card starts at', hint: 'Frame number' },
        { path: 'end.lineAt', label: 'Line grows at', hint: 'Frame number' },
        { path: 'end.lineFrames', label: 'Line grow length', hint: 'In frames' },
        { path: 'end.markAt', label: 'Badge slides in at', hint: 'Frame number' },
        { path: 'end.markFrames', label: 'Badge slide length', hint: 'In frames' },
        { path: 'end.urlAt', label: 'Website fades in at', hint: 'Frame number' },
        { path: 'end.urlFrames', label: 'Website fade length', hint: 'In frames' },
      ],
    },
    {
      title: 'Background and motion',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Off leaves the paper and the end card background transparent',
        },
        MOTION.enter,
      ],
      more: [
        MOTION.exit,
        {
          ...MOTION.speed,
          hint: 'Scales every beat. The clip length stays fixed, so below 1 the end is cut off and above 1 the end card holds longer',
        },
        MOTION.enterFrames,
        { ...MOTION.exitFrames, hint: 'In frames. Starts at 0, so raise it for the exit to play' },
      ],
    },
  ],
  hidden: ['motion.float'],
});
