import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ComingSoonFlipsProps } from './coming-soon-flips';

export const comingSoonFlipsControls = defineControls<ComingSoonFlipsProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'beats',
          label: 'Words',
          hint: 'Each word holds on its own color plate, then hard cuts to the next. The title and logo play in the frames left after the last word',
          items: {
            text: 'Word',
            tone: 'Plate',
            frames: 'Frames on screen',
            blank: 'Blank frames after',
            cycleFonts: 'Flicker through fonts',
          },
        },
      ],
      more: [
        { path: 'words.size', label: 'Word size', hint: 'In pixels' },
        { path: 'words.bar.show', label: 'Show underline' },
        {
          path: 'words.weight',
          label: 'Word weight',
          hint: 'Applies to the condensed typeface',
        },
        { path: 'words.tracking', label: 'Word letter spacing', hint: 'In em' },
        {
          path: 'words.centerY',
          label: 'Word vertical position',
          hint: 'Share of the frame height from the top to the word center',
        },
        {
          path: 'words.cycle',
          label: 'Flicker fonts',
          hint: 'Typefaces a word with font flicker on steps through, in order',
        },
        {
          path: 'words.cycleHold',
          label: 'Frames per font',
          hint: 'How long each typeface shows while a word flickers',
        },
        { path: 'words.bar.length', label: 'Underline length' },
        { path: 'words.bar.thickness', label: 'Underline thickness' },
        { path: 'words.bar.gap', label: 'Underline gap', hint: 'Distance below the word' },
        {
          path: 'words.bar.startWidth',
          label: 'Underline start width',
          hint: 'Share of its length the underline starts at before growing to full over each word',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.light', 'words.bar.onDark', 'title.accent'],
          label: 'Primary color',
          hint: 'Light plates, underlines on dark plates and the solid bottom title line',
        },
        {
          link: ['look.onLight', 'words.bar.onLight', 'logo.color', 'logo.captionColor'],
          label: 'Secondary color',
          hint: 'Words and underlines on light plates, and the logo with its caption',
        },
        {
          link: ['look.onDark', 'title.color'],
          label: 'Text color',
          hint: 'Words on dark plates and the title',
        },
        {
          path: 'wall.base',
          label: 'Surface color',
          hint: 'The plaster wall the light sweeps behind the logo',
        },
        {
          path: 'look.dark',
          label: 'Background color',
          hint: 'Dark plates, and the backdrop around the light sweep in the finale',
        },
      ],
      more: [
        { path: 'look.light', label: 'Light plate' },
        { path: 'look.onDark', label: 'Words on dark plates' },
        { path: 'look.onLight', label: 'Words on light plates' },
        { path: 'words.bar.onDark', label: 'Underline on dark plates' },
        { path: 'words.bar.onLight', label: 'Underline on light plates' },
        {
          path: 'title.color',
          label: 'Title color',
          hint: 'The outlined line, and the top line when it is solid',
        },
        {
          path: 'title.accent',
          label: 'Solid bottom line color',
          hint: 'The solid bottom line, used when the top line is outlined',
        },
        { path: 'logo.color', label: 'Logo color' },
        { path: 'logo.captionColor', label: 'Caption color' },
      ],
    },
    {
      title: 'Title',
      fields: [
        { path: 'title.top', label: 'Top line' },
        { path: 'title.bottom', label: 'Bottom line' },
      ],
      more: [
        { path: 'title.topSize', label: 'Top line size' },
        { path: 'title.bottomSize', label: 'Bottom line size' },
        {
          path: 'title.outlined',
          label: 'Outlined line',
          hint: 'This line is drawn as an outline, the other stays solid',
        },
        { path: 'title.outline', label: 'Outline thickness' },
        { path: 'title.weight', label: 'Title weight' },
        {
          path: 'title.topStretch',
          label: 'Top line stretch',
          hint: 'Horizontal stretch, below 1 squeezes the letters',
        },
        {
          path: 'title.bottomStretch',
          label: 'Bottom line stretch',
          hint: 'Horizontal stretch, below 1 squeezes the letters',
        },
        { path: 'title.tracking', label: 'Title letter spacing', hint: 'In em' },
        { path: 'title.gap', label: 'Line gap' },
        {
          path: 'title.topY',
          label: 'Title vertical position',
          hint: 'Share of the frame height from the top to the top line',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'logo.mark',
          label: 'Logo letters',
          hint: 'The first letter sits in front and cuts a gap into the rest',
        },
        { path: 'logo.caption', label: 'Caption' },
      ],
      more: [
        { path: 'logo.size', label: 'Logo size' },
        { path: 'logo.captionSize', label: 'Caption size' },
        {
          path: 'logo.overlap',
          label: 'Letter overlap',
          hint: 'How far the front letter overlaps the rest, in pixels',
        },
        {
          path: 'logo.gap',
          label: 'Cut-out gap',
          hint: 'Gap carved around the front letter',
        },
        { path: 'logo.captionGap', label: 'Caption gap', hint: 'Distance below the logo' },
        {
          path: 'logo.centerY',
          label: 'Logo vertical position',
          hint: 'Share of the frame height from the top to the logo center',
        },
      ],
    },
    {
      title: 'Wall light',
      fields: [{ path: 'beam.strength', label: 'Light strength' }],
      more: [
        {
          path: 'beam.slats',
          label: 'Light slats',
          hint: 'Number of light bands sweeping the wall',
        },
        {
          path: 'beam.tint',
          label: 'Light tint',
          hint: 'Multiplied over the wall behind the logo',
        },
        { path: 'beam.angle', label: 'Light angle', hint: 'In degrees' },
        { path: 'beam.softness', label: 'Slat softness', hint: 'Higher blurs the slat edges' },
        { path: 'beam.slatGap', label: 'Slat spacing', hint: 'In pixels' },
        { path: 'wall.blotch', label: 'Patch color' },
        { path: 'wall.speck', label: 'Speck color' },
        { path: 'wall.blotchAmount', label: 'Patch coverage' },
        {
          path: 'wall.blotchScale',
          label: 'Patch detail',
          hint: 'Higher makes smaller, busier patches',
        },
        { path: 'wall.speckAmount', label: 'Speck amount' },
        { path: 'wall.grit', label: 'Grit' },
        { path: 'wall.seed', label: 'Texture variation' },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'title.settleFrames',
          label: 'Title track-in length',
          hint: 'In frames',
        },
      ],
      more: [
        {
          path: 'flashFrames',
          label: 'Wall flash',
          hint: 'Frames the fully lit wall flashes between the words and the title',
        },
        {
          path: 'beam.turnAt',
          label: 'Light turns at',
          hint: 'Frames into the finale when the sweep reverses',
        },
        {
          path: 'title.settleStart',
          label: 'Title track-in delay',
          hint: 'Frames into the finale',
        },
        {
          path: 'title.spread',
          label: 'Title starting spread',
          hint: 'How far apart the letters start, 1 is no spread',
        },
        {
          path: 'title.appearSpan',
          label: 'Letter pop-in span',
          hint: 'Frames over which the title letters appear in random order',
        },
        {
          path: 'title.flickerFrames',
          label: 'Letter flicker length',
          hint: 'Frames each letter flickers after it appears',
        },
        {
          path: 'title.seed',
          label: 'Letter order variation',
          hint: 'Changes the random pop-in order and flicker',
        },
        {
          path: 'beam.start',
          label: 'Light start position',
          hint: 'Pixels along the light angle',
        },
        {
          path: 'beam.peak',
          label: 'Light turn position',
          hint: 'Pixels along the light angle where the sweep reverses',
        },
        { path: 'beam.end', label: 'Light end position', hint: 'Pixels along the light angle' },
        {
          path: 'beam.turnFrames',
          label: 'Light turn smoothness',
          hint: 'Frames spent easing through the reversal',
        },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          path: 'look.showBackdrop',
          label: 'Show color plates',
          hint: 'Off leaves the plates and the finale backdrop transparent',
        },
      ],
      more: [LOOK.grain, LOOK.liveGrain],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter],
      more: [
        { ...MOTION.exit, hint: 'Off by default, so the logo holds to the last frame' },
        {
          ...MOTION.speed,
          hint: 'Scales the word, flash and finale timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['motion.float'],
});
