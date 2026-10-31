import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { GoldMonogramInviteProps } from './gold-monogram-invite';

const SIZE = 'In pixels';
const QUOTE_CARD = 'Gold lines under the mandala panel';

export const goldMonogramInviteControls = defineControls<GoldMonogramInviteProps>({
  sections: [
    {
      title: 'Couple and monogram',
      fields: [
        {
          path: 'monogram.names',
          label: 'Couple names',
          hint: 'On the gold plaque under the monogram',
        },
        {
          path: 'monogram.first',
          label: 'First initial',
          hint: 'Left letter of the gold monogram',
        },
        {
          path: 'monogram.second',
          label: 'Second initial',
          hint: 'Right letter of the gold monogram',
        },
      ],
      more: [
        { path: 'monogram.showHeart', label: 'Heart above the initials' },
        {
          path: 'monogram.size',
          label: 'Monogram size',
          hint: 'Letter size in pixels once the camera has pushed in',
        },
        { path: 'monogram.namesSize', label: 'Names size', hint: SIZE },
        {
          path: 'monogram.glint',
          label: 'Glint across the monogram',
          hint: 'One light sweep after the names appear',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['gold.light', 'gold.highlight', 'gold.mid', 'gold.deep'],
          label: 'Primary color',
          hint: 'All the gold: mandalas, script, monogram, veil, sparks, damask and rules, keeping the shine between its tones',
        },
        {
          link: ['text.cream', 'text.ink'],
          label: 'Text color',
          hint: 'Event times and venues, the small title lines and the script on the paper',
        },
        {
          link: ['sketch.chalk', 'sketch.pencil'],
          label: 'Accent color',
          hint: 'The line-art couple and dancer',
        },
        {
          link: ['paper.floor', 'paper.wall'],
          label: 'Surface color',
          hint: 'The paper behind the dancing couple in the opening',
        },
        {
          link: ['background.night', 'background.panel', 'background.panelEdge'],
          label: 'Background color',
          hint: 'The black stage and the dark mandala panel',
        },
      ],
      more: [
        {
          path: 'gold.highlight',
          label: 'Gold shine',
          hint: 'Brightest glints and the satin highlight',
        },
        { path: 'gold.light', label: 'Light gold' },
        { path: 'gold.mid', label: 'Mid gold' },
        { path: 'gold.deep', label: 'Deep gold', hint: 'Shaded side and the embossed depth' },
        {
          path: 'text.cream',
          label: 'Detail text',
          hint: 'Times, venues and the small title lines',
        },
        { path: 'text.ink', label: 'Paper script', hint: 'The script words written on the paper' },
        {
          path: 'sketch.chalk',
          label: 'Chalk lines',
          hint: 'Light sketch lines; the dancer and the bride on black',
        },
        { path: 'sketch.pencil', label: 'Pencil lines', hint: 'Dark sketch lines on the paper' },
        { path: 'paper.wall', label: 'Paper wall', hint: 'Upper part of the paper' },
        {
          path: 'paper.floor',
          label: 'Paper floor',
          hint: 'Lower part of the paper and the figures inside the lines',
        },
        { path: 'background.night', label: 'Stage black' },
        {
          path: 'background.panel',
          label: 'Panel top',
          hint: 'Top of the mandala panel in the opening',
        },
        {
          path: 'background.panelEdge',
          label: 'Panel bottom',
          hint: 'Bottom of the panel and the shadow it casts on the paper',
        },
        { path: 'gem.stone', label: 'Diamond', hint: 'Light facets of the ring stone' },
        { path: 'gem.facet', label: 'Diamond shadow', hint: 'Dark facets of the ring stone' },
        {
          path: 'gem.sparkle',
          label: 'Diamond sparkle',
          hint: 'Halo stones, glints and the star flare',
        },
      ],
    },
    {
      title: 'Opening quote',
      fields: [
        { path: 'quote.firstCaps', label: 'First line', hint: QUOTE_CARD },
        {
          path: 'quote.paperScript',
          label: 'Large script on the paper',
          hint: 'Written on from left to right',
        },
      ],
      more: [
        { path: 'quote.firstScript', label: 'First script line', hint: QUOTE_CARD },
        {
          path: 'quote.secondScript',
          label: 'Second script word',
          hint: `${QUOTE_CARD}, after the first card fades`,
        },
        { path: 'quote.secondCaps', label: 'Second line', hint: QUOTE_CARD },
        {
          path: 'quote.paperLead',
          label: 'Small script on the paper',
          hint: 'Above the large script',
        },
        { path: 'quote.capsSize', label: 'Capitals size', hint: SIZE },
        { path: 'quote.scriptSize', label: 'Panel script size', hint: SIZE },
        {
          path: 'quote.paperScriptSize',
          label: 'Paper script size',
          hint: 'In pixels. The small paper line is half this',
        },
        { path: 'quote.wordStagger', label: 'Delay between words', hint: 'In frames' },
      ],
    },
    {
      title: 'Events',
      fields: [
        {
          path: 'events',
          label: 'Event cards',
          hint: 'First: over the lotus mandala. Second: beside the ring. Third: in the damask band, title in script',
        },
        {
          path: 'saveTheDate.text',
          label: 'Save the date',
          hint: 'The closing script; each new line stacks',
        },
      ],
      more: [
        {
          path: 'eventText.titleSize',
          label: 'Event title size',
          hint: 'In pixels. The script title in the band is 1.35 times this',
        },
        {
          path: 'eventText.detailSize',
          label: 'Event detail size',
          hint: 'In pixels. The date is 1.25 times this',
        },
        { path: 'saveTheDate.size', label: 'Save the date size', hint: SIZE },
        { path: 'saveTheDate.sprigs', label: 'Leaves around save the date' },
      ],
    },
    {
      title: 'Wedding title',
      fields: [
        { path: 'title.word', label: 'Script word', hint: 'Zooms in gold over the quote' },
        { path: 'title.eyebrow', label: 'Line above' },
      ],
      more: [
        { path: 'title.tail', label: 'Line below' },
        {
          path: 'title.size',
          label: 'Script size',
          hint: 'In pixels. The small lines and the flourish scale with it',
        },
        { path: 'title.flourish', label: 'Gold flourish', hint: 'The swash drawn around the word' },
      ],
    },
    {
      title: 'Veil and sparklers',
      fields: [],
      more: [
        { path: 'stage.veil', label: 'Satin veil', hint: 'Off shows the monogram from the start' },
        { path: 'stage.sparklers', label: 'Sparkler fountains', hint: '0 turns them off' },
        { path: 'stage.bursts', label: 'Spark bursts', hint: '0 turns them off' },
        {
          path: 'stage.dust',
          label: 'Floating gold dust',
          hint: 'Number of motes. 0 turns it off',
        },
        { path: 'stage.reflection', label: 'Floor reflection', hint: '0 turns it off' },
      ],
    },
    {
      title: 'Line art',
      fields: [],
      more: [
        {
          path: 'sketch.lineWidth',
          label: 'Line weight',
          hint: 'In pixels on the paper couple; scaled for the smaller figures',
        },
        {
          path: 'sketch.danceSpeed',
          label: 'Dance speed',
          hint: 'How fast the couples and the dancer move between poses',
        },
      ],
    },
    {
      title: 'Fonts',
      fields: [],
      more: [
        { path: 'fonts.script', label: 'Script font' },
        {
          path: 'fonts.serif',
          label: 'Capitals font',
          hint: 'Monogram, names, quote capitals and event details',
        },
      ],
    },
    {
      title: 'Background and motion',
      fields: [],
      more: [
        {
          path: 'background.show',
          label: 'Black stage',
          hint: 'Off leaves the stage transparent to layer over other clips; the paper, panel and damask stay',
        },
        { ...MOTION.enter },
        { ...MOTION.enterFrames },
        { ...MOTION.exit },
        { ...MOTION.exitFrames },
        { ...MOTION.speed, hint: 'Speeds up the whole invite; it then holds on save the date' },
      ],
    },
  ],
  hidden: ['motion.float'],
});
