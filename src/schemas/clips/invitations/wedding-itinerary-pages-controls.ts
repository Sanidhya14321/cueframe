import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { WeddingItineraryPagesProps } from './wedding-itinerary-pages';

const SCENE_HINT =
  'Pavilions: domed chhatris over a balustrade. Haldi lounge: a velvet sofa, gift boxes and bird cages. Dance floor: chandeliers, fireworks and a checkered floor. Mandap: a marigold mandap and red carpet. Garden dinner: a blossom tree over a dinner table';

const NIGHT_HINT = '0 paints the garden in daylight; higher values dim it toward night blue';

const TYPED_HINT = 'Types on letter by letter';

export const weddingItineraryPagesControls = defineControls<WeddingItineraryPagesProps>({
  sections: [
    {
      title: 'Cover',
      fields: [
        { path: 'cover.names', label: 'Couple names', hint: 'Types on in script under the wreath' },
        { path: 'cover.dates', label: 'Dates', hint: 'One line per row. Types on under the names' },
      ],
      more: [
        { path: 'cover.hashtag', label: 'Hashtag', hint: 'Types on last. Leave empty to hide it' },
        { path: 'cover.monogram', label: 'Monogram', hint: 'Script letters inside the wreath' },
        {
          path: 'cover.scene',
          label: 'Cover scene',
          hint: `Also behind the families page. ${SCENE_HINT}`,
        },
        { path: 'cover.night', label: 'Cover night shade', hint: NIGHT_HINT },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['greenery.mid', 'greenery.dark', 'greenery.light', 'greenery.lawn'],
          label: 'Primary color',
          hint: 'Leaves, bushes, palms, vines and the lawn on every page',
        },
        {
          link: ['cover.titleColor', 'cover.textColor', 'closing.titleColor', 'closing.textColor'],
          label: 'Text color',
          hint: 'Every line on the cover, families and closing pages. Event pages set their own under Event pages',
        },
        {
          link: ['cover.sky', 'cover.horizon', 'closing.sky', 'closing.horizon'],
          label: 'Background color',
          hint: 'Sky of the cover, families and closing pages',
        },
        {
          link: ['blooms.rose', 'blooms.blossom'],
          label: 'Accent color',
          hint: 'Roses and pink blossoms in the wreath, vines, urns and the flowering tree',
        },
        {
          link: ['stone.cream', 'stone.shade', 'stone.marble'],
          label: 'Surface color',
          hint: 'Pavilions, balustrades, urns, the mandap frame and the light floor squares',
        },
      ],
      more: [
        {
          path: 'cover.titleColor',
          label: 'Cover script color',
          hint: 'Names, monogram, flourish and the families page names',
        },
        {
          path: 'cover.textColor',
          label: 'Cover text color',
          hint: 'Typed serif lines on the cover and families pages',
        },
        { path: 'cover.sky', label: 'Cover sky top' },
        { path: 'cover.horizon', label: 'Cover sky bottom' },
        {
          path: 'closing.titleColor',
          label: 'Closing message color',
          hint: 'The bold message lines',
        },
        { path: 'closing.textColor', label: 'Closing text color', hint: 'Website and RSVP lines' },
        { path: 'closing.sky', label: 'Closing sky top' },
        { path: 'closing.horizon', label: 'Closing sky bottom' },
        {
          path: 'greenery.dark',
          label: 'Dark leaves',
          hint: 'Shadowed bushes, palm fronds and vine leaves',
        },
        { path: 'greenery.mid', label: 'Leaves', hint: 'The main bush and leaf green' },
        {
          path: 'greenery.light',
          label: 'Sunlit leaves',
          hint: 'Highlights on bushes and the agave',
        },
        { path: 'greenery.lawn', label: 'Lawn' },
        {
          path: 'greenery.mist',
          label: 'Distant trees',
          hint: 'Misty tree line and hills behind each scene',
        },
        { path: 'greenery.trunk', label: 'Trunks and stems' },
        { path: 'blooms.rose', label: 'Roses' },
        { path: 'blooms.blossom', label: 'Pink blossoms' },
        {
          path: 'blooms.marigold',
          label: 'Marigolds',
          hint: 'Marigold strands and garlands, the yellow cascade and flower centres',
        },
        {
          path: 'stone.cream',
          label: 'Sandstone',
          hint: 'Daytime pavilions, balustrades and urns',
        },
        {
          path: 'stone.shade',
          label: 'Stone shading',
          hint: 'Domes ribs, eaves, finials and cage wire',
        },
        {
          path: 'stone.marble',
          label: 'Marble',
          hint: 'Night pavilions, balustrade and the light floor squares',
        },
      ],
    },
    {
      title: 'Families page',
      fields: [
        {
          path: 'families.hosts',
          label: 'Hosting families',
          hint: `One family per line. ${TYPED_HINT}`,
        },
        { path: 'families.bride', label: 'Bride', hint: 'In script' },
        { path: 'families.groom', label: 'Groom', hint: 'In script' },
      ],
      more: [
        {
          path: 'families.invite',
          label: 'Invitation lines',
          hint: 'Smaller lines under the families',
        },
        { path: 'families.brideParents', label: "Bride's parents line" },
        {
          path: 'families.joiner',
          label: 'Joining word',
          hint: 'Small script between the two names',
        },
        { path: 'families.groomParents', label: "Groom's parents line" },
      ],
    },
    {
      title: 'Event pages',
      fields: [
        {
          path: 'events',
          label: 'Events',
          hint: `One page each, in order (1 to 3). The title sweeps in under a block, then the date, venue and schedule type on. ${SCENE_HINT}`,
          items: {
            name: 'Title (new lines stack it)',
            date: 'Date line',
            venue: 'Venue lines',
            schedule: 'Schedule lines',
            scene: 'Scene',
            sky: 'Sky top',
            horizon: 'Sky bottom',
            titleColor: 'Title and block color',
            textColor: 'Typed text color',
            night: 'Night shade (0 is daylight)',
          },
        },
      ],
    },
    {
      title: 'Closing page',
      fields: [
        { path: 'closing.message', label: 'Message', hint: `Bold lines. ${TYPED_HINT}` },
        { path: 'closing.rsvp', label: 'RSVP lines' },
      ],
      more: [
        { path: 'closing.visit', label: 'Website lines', hint: 'Leave empty to hide them' },
        { path: 'closing.scene', label: 'Closing scene', hint: SCENE_HINT },
        { path: 'closing.night', label: 'Closing night shade', hint: NIGHT_HINT },
      ],
    },
    {
      title: 'Monogram wreath',
      fields: [],
      more: [
        { path: 'wreath.radius', label: 'Wreath radius', hint: 'In pixels' },
        { path: 'wreath.leaves', label: 'Leaf pairs', hint: '0 leaves only the stem and flowers' },
        { path: 'wreath.flowers', label: 'Flowers', hint: '0 hides them' },
        {
          path: 'wreath.flourish',
          label: 'Flourish line',
          hint: 'The pen stroke through the monogram',
        },
        {
          path: 'wreath.drawFrames',
          label: 'Draw time',
          hint: 'In frames, for the leaves and flowers to grow around the ring',
        },
        { path: 'type.monogramSize', label: 'Monogram size', hint: 'In pixels' },
      ],
    },
    {
      title: 'Scenery',
      fields: [],
      more: [
        {
          path: 'scenery.build',
          label: 'Cover build distance',
          hint: 'How far the cover garden rises and slides in. 0 starts it in place',
        },
        {
          path: 'scenery.settle',
          label: 'Event settle distance',
          hint: 'Share of that distance the later scenes slide while they fade in',
        },
        {
          path: 'scenery.drift',
          label: 'Settle drift',
          hint: 'In pixels. Each later scene rises this far while it fades in. 0 turns it off',
        },
        {
          path: 'scenery.sway',
          label: 'Sway',
          hint: 'Leaves, vines, cages, strands and chandeliers. 0 holds them still',
        },
        {
          path: 'scenery.twinkle',
          label: 'Twinkle',
          hint: 'Stars and light bulbs. 0 keeps them steady',
        },
        { path: 'scenery.fireworks', label: 'Fireworks', hint: 'Dance floor scene only' },
        { path: 'decor.sofa', label: 'Sofa' },
        { path: 'decor.gift', label: 'Gift boxes', hint: 'Also two of the cushions' },
        { path: 'decor.giftAlt', label: 'Second gift color', hint: 'Also two of the cushions' },
        { path: 'decor.drape', label: 'Mandap drapes' },
        { path: 'decor.carpet', label: 'Stage and carpet', hint: 'Also the strand tassels' },
        { path: 'decor.cloth', label: 'Tablecloth' },
        { path: 'decor.wood', label: 'Chairs and sofa legs' },
        { path: 'decor.crystal', label: 'Crystal', hint: 'Chandeliers, stars and fireworks' },
        { path: 'decor.glow', label: 'Light glow', hint: 'Bulbs, candles and the chandelier halo' },
        { path: 'decor.floor', label: 'Dark floor squares' },
        {
          path: 'layout.horizon',
          label: 'Scene height',
          hint: 'In pixels. Positive values lower every scene',
        },
      ],
    },
    {
      title: 'Text',
      fields: [],
      more: [
        {
          path: 'type.scriptFont',
          label: 'Script font',
          hint: 'Names, event titles and the monogram',
        },
        { path: 'type.serifFont', label: 'Serif font', hint: 'Every typed line' },
        { path: 'type.titleSize', label: 'Event title size', hint: 'In pixels' },
        { path: 'type.namesSize', label: 'Cover names size', hint: 'In pixels' },
        {
          path: 'type.scriptSize',
          label: 'Families names size',
          hint: 'In pixels. The joining word is 62% of it',
        },
        {
          path: 'type.lineSize',
          label: 'Line size',
          hint: 'In pixels, for dates, venues, schedules and families',
        },
        {
          path: 'type.smallSize',
          label: 'Small line size',
          hint: 'In pixels, for the invitation lines',
        },
        { path: 'type.boldWeight', label: 'Bold weight' },
        { path: 'type.regularWeight', label: 'Regular weight' },
        { path: 'type.tracking', label: 'Letter spacing', hint: 'In em, for serif lines' },
        {
          path: 'type.lineSpacing',
          label: 'Line spacing',
          hint: 'Serif line height as a multiple of the size',
        },
        {
          path: 'layout.textTop',
          label: 'Text area top',
          hint: 'In pixels. The cover and families pages hang from here; event and closing pages centre between top and bottom',
        },
        {
          path: 'layout.textBottom',
          label: 'Text area bottom',
          hint: 'In pixels. Only event and closing pages use it',
        },
        { path: 'layout.blockGap', label: 'Gap between groups', hint: 'In pixels' },
      ],
    },
    {
      title: 'Timing',
      fields: [],
      more: [
        { path: 'timing.charFrames', label: 'Typing speed', hint: 'Frames per letter' },
        { path: 'timing.coverFrames', label: 'Cover length', hint: 'In frames' },
        { path: 'timing.familyFrames', label: 'Families page length', hint: 'In frames' },
        {
          path: 'timing.eventFrames',
          label: 'Event page length',
          hint: 'In frames. The clip length stays fixed, so the closing page holds for what is left',
        },
        { path: 'timing.fadeFrames', label: 'Scene crossfade', hint: 'In frames' },
        {
          path: 'timing.titleDelay',
          label: 'Title delay',
          hint: 'Frames after a scene arrives before its title block sweeps',
        },
        {
          path: 'timing.blockFrames',
          label: 'Title block sweep',
          hint: 'In frames, for the block to cover and uncover the title',
        },
        {
          path: 'timing.typeDelay',
          label: 'Typing delay',
          hint: 'Frames after an event scene arrives before its lines type',
        },
        {
          path: 'timing.blockStagger',
          label: 'Group stagger',
          hint: 'Frames between each text group starting to type',
        },
        {
          path: 'timing.eraseFrames',
          label: 'Erase time',
          hint: 'In frames, for every line to delete before the page turns',
        },
        {
          path: 'timing.buildFrames',
          label: 'Scenery build time',
          hint: 'In frames, for each layer to rise or slide in',
        },
      ],
    },
    {
      title: 'Background',
      fields: [],
      more: [
        { ...LOOK.showBackdrop, hint: 'Off leaves only the scenery and text, for layering' },
        {
          path: 'look.wash',
          label: 'Watercolor wash',
          hint: 'Soft blots in the sky. 0 turns them off',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames, MOTION.speed],
    },
  ],
  hidden: ['motion.float'],
});
