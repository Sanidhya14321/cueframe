import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { MiniaturePanoramaProps } from './miniature-panorama';

const HOLD = 'In frames. The clip length stays fixed, so a longer shot shortens the closing garden';

const MOVE = 'In frames';

export const miniaturePanoramaControls = defineControls<MiniaturePanoramaProps>({
  sections: [
    {
      title: 'Invitation',
      fields: [
        {
          path: 'invite.show',
          label: 'Show invitation',
          hint: 'The text fades in over the closing garden; off leaves only the painting',
        },
        { path: 'invite.names', label: 'Names', hint: 'In the script font' },
        { path: 'invite.date', label: 'Date', hint: 'Shown in spaced capitals' },
      ],
      more: [
        {
          path: 'invite.line',
          label: 'Line below the names',
          hint: 'Shown in spaced capitals; leave empty to hide it',
        },
        { path: 'invite.scriptFont', label: 'Names font' },
        { path: 'invite.serifFont', label: 'Capitals font', hint: 'For the line and the date' },
        { path: 'invite.namesSize', label: 'Names size', hint: 'In pixels' },
        { path: 'invite.lineSize', label: 'Line size', hint: 'In pixels' },
        { path: 'invite.dateSize', label: 'Date size', hint: 'In pixels' },
        {
          path: 'invite.tracking',
          label: 'Capitals spacing',
          hint: 'Letter spacing of the line and the date, as a share of the text size',
        },
        { path: 'invite.gap', label: 'Space between lines', hint: 'In pixels' },
        {
          path: 'invite.centerY',
          label: 'Text height',
          hint: 'Pixels from the top of the frame to the middle of the text, between the chandelier and the trees',
        },
        {
          path: 'invite.start',
          label: 'Text appears at',
          hint: 'Frame number; with the default shots the bead strings and chandelier settle in near frame 1090',
        },
        {
          path: 'invite.rise',
          label: 'Rise distance',
          hint: 'How far each line rises as it fades in, in pixels; 0 only fades',
        },
        {
          path: 'invite.glow',
          label: 'Glow behind the text',
          hint: 'Soft halo that keeps the text readable over clouds',
        },
        { path: 'invite.glowStrength', label: 'Glow strength', hint: '0 turns the halo off' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['sky.dayTop', 'sky.dayHorizon', 'sky.nightTop', 'sky.nightHorizon'],
          label: 'Background color',
          hint: 'The day sky and the night sky, top and horizon',
        },
        {
          link: ['trees.dark', 'trees.mid', 'trees.light', 'lake.pad', 'garden.lawn'],
          label: 'Primary color',
          hint: 'Every green: dotted trees, bushes, banana leaves, lotus pads and the lawn',
        },
        {
          link: ['pavilions.stone', 'pavilions.shade', 'railing.marble', 'railing.shade'],
          label: 'Secondary color',
          hint: 'The sandstone chhatris and the marble jaali railings',
        },
        {
          link: ['canopies.roof', 'procession.blanket', 'flowers.orange', 'garlands.marigold'],
          label: 'Accent color',
          hint: 'The canopy roofs, the elephant blanket, the orange lilies and the marigold strings',
        },
        { path: 'invite.color', label: 'Text color', hint: 'The invitation names, line and date' },
      ],
      more: [
        { path: 'sky.dayTop', label: 'Day sky top' },
        { path: 'sky.dayHorizon', label: 'Day sky horizon' },
        { path: 'sky.nightTop', label: 'Night sky top' },
        { path: 'sky.nightHorizon', label: 'Night sky horizon' },
        {
          path: 'trees.dark',
          label: 'Dark green',
          hint: 'Behind the dotted leaves and the front bushes',
        },
        {
          path: 'trees.mid',
          label: 'Middle green',
          hint: 'The dotted leaves, banana leaves and ferns',
        },
        {
          path: 'trees.light',
          label: 'Light green',
          hint: 'Leaf hearts, highlights and the sunny side of each crown',
        },
        { path: 'lake.pad', label: 'Lotus pads' },
        { path: 'garden.lawn', label: 'Lawn' },
        { path: 'pavilions.stone', label: 'Chhatri sandstone' },
        {
          path: 'pavilions.shade',
          label: 'Chhatri carving',
          hint: 'Arch outlines, dome ribs and ledges',
        },
        { path: 'railing.marble', label: 'Railing marble' },
        {
          path: 'railing.shade',
          label: 'Railing shadow',
          hint: 'Under the top rail and the plinth',
        },
        { path: 'canopies.roof', label: 'Canopy roofs' },
        {
          path: 'procession.blanket',
          label: 'Elephant blanket',
          hint: 'Also the drums, the umbrella and the howdah cushion',
        },
        { path: 'flowers.orange', label: 'Orange lilies', hint: 'Also the berries in the bushes' },
        {
          path: 'garlands.marigold',
          label: 'Marigolds',
          hint: 'The marigold strings, the hanging blossoms and the lotus centres',
        },
      ],
    },
    {
      title: 'Shots',
      fields: [{ path: 'timing.lake', label: 'Wide lake shot', hint: HOLD }],
      more: [
        {
          path: 'timing.reveal',
          label: 'Opening reveal',
          hint: 'In frames; the camera pulls back from the sky to the swans',
        },
        { path: 'timing.swans', label: 'Swan close-up', hint: HOLD },
        { path: 'timing.toLake', label: 'Pan to the wide lake', hint: MOVE },
        { path: 'timing.toNight', label: 'Drop into the night', hint: MOVE },
        { path: 'timing.night', label: 'Night pavilion shot', hint: HOLD },
        { path: 'timing.toGarden', label: 'Whip pan to the garden', hint: MOVE },
        { path: 'timing.garden', label: 'Garden shot', hint: HOLD },
        { path: 'timing.toPath', label: 'Pan to the procession', hint: MOVE },
        { path: 'timing.procession', label: 'Procession shot', hint: HOLD },
        {
          path: 'timing.toFinale',
          label: 'Swap to the bead strings',
          hint: 'In frames; the procession and blossoms fade as the chandelier lowers in',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.drift',
          label: 'Drift',
          hint: 'Slow sideways camera move during each shot, in pixels per frame; 0 holds still',
        },
      ],
      more: [
        {
          path: 'camera.closeUp',
          label: 'Swan close-up zoom',
          hint: 'How far the first shot is zoomed in; 1 matches the wide lake',
        },
        {
          path: 'camera.parallax',
          label: 'Depth effect',
          hint: 'How much more the front bushes move than the far hills; 0 moves every layer together',
        },
        {
          path: 'camera.roll',
          label: 'Tilt in the pans',
          hint: 'Degrees the camera rolls at the middle of each pan',
        },
        {
          path: 'camera.blur',
          label: 'Motion blur',
          hint: 'Blur during the fast pans; 0 turns it off',
        },
        { ...MOTION.speed, hint: 'Speeds up the whole film; the fade out keeps its length' },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
    {
      title: 'Sky',
      fields: [
        {
          path: 'birds.count',
          label: 'Birds',
          hint: 'Size of the flock crossing each lake shot; 0 hides it',
        },
      ],
      more: [
        { path: 'birds.color', label: 'Bird color' },
        { path: 'sky.cloudCount', label: 'Clouds' },
        { path: 'sky.cloudSpeed', label: 'Cloud drift', hint: 'Pixels per frame' },
        { path: 'sky.clouds', label: 'Cloud color' },
        { path: 'sky.cloudShade', label: 'Cloud shadow', hint: 'The soft underside of each cloud' },
        {
          path: 'petals.count',
          label: 'Floating petals',
          hint: 'Small petals drifting over the whole film; 0 hides them',
        },
        { path: 'petals.color', label: 'Petal color' },
        { path: 'hills.far', label: 'Far hills' },
        { path: 'hills.near', label: 'Near hills' },
        { path: 'hills.mist', label: 'Misty treeline', hint: 'Behind the garden' },
        {
          path: 'look.showBackdrop',
          label: 'Show sky',
          hint: 'Off leaves the sky transparent for layering over another clip',
        },
      ],
    },
    {
      title: 'Lake and swans',
      fields: [{ path: 'swans.show', label: 'Show swans' }],
      more: [
        { path: 'swans.body', label: 'Swan feathers' },
        { path: 'swans.beak', label: 'Swan beaks' },
        { path: 'lake.water', label: 'Water' },
        { path: 'lake.ripple', label: 'Ripples' },
        { path: 'lake.lotus', label: 'Pink lotus' },
        { path: 'lake.lotusWhite', label: 'White lotus' },
        {
          path: 'peacocks.show',
          label: 'Show peacocks',
          hint: 'On the railings and in the bushes of every shot',
        },
        { path: 'peacocks.neck', label: 'Peacock neck' },
        { path: 'peacocks.wing', label: 'Peacock wings', hint: 'Also the beaks and legs' },
        { path: 'peacocks.tail', label: 'Peacock tail' },
        { path: 'peacocks.eyes', label: 'Tail eyes' },
        {
          path: 'trees.sprig',
          label: 'Sprig leaves',
          hint: 'The olive leaves of the tall trees and branches, and the banana trunks',
        },
        { path: 'trees.blossom', label: 'Sprig blossoms' },
        { path: 'trees.trunk', label: 'Tree bark' },
        { path: 'flowers.pink', label: 'Pink shrub flowers' },
      ],
    },
    {
      title: 'Night pavilion',
      fields: [
        {
          path: 'chandeliers.show',
          label: 'Show chandeliers',
          hint: 'The three at night and the one over the closing garden',
        },
      ],
      more: [
        { path: 'chandeliers.night', label: 'Night chandeliers' },
        { path: 'chandeliers.finale', label: 'Closing chandelier' },
        { path: 'chandeliers.crystal', label: 'Crystals and candles' },
        { path: 'chandeliers.flame', label: 'Candle flames' },
        { path: 'stars.count', label: 'Stars' },
        { path: 'stars.color', label: 'Star color' },
        { path: 'night.tint', label: 'Night shadow', hint: 'Color the night scene darkens toward' },
        {
          path: 'night.strength',
          label: 'Night darkness',
          hint: '0 keeps daytime colors at night',
        },
        {
          path: 'canopies.motif',
          label: 'Canopy gold',
          hint: 'The roof motifs, borders and finials',
        },
        {
          path: 'canopies.fringe',
          label: 'Canopy fringe',
          hint: 'The scalloped valance and the tassels',
        },
        { path: 'canopies.poles', label: 'Canopy poles' },
      ],
    },
    {
      title: 'Garden and procession',
      fields: [{ path: 'procession.show', label: 'Show procession' }],
      more: [
        {
          path: 'procession.walkers',
          label: 'Walkers',
          hint: 'One leads the elephant and the rest follow',
        },
        { path: 'procession.speed', label: 'Walking speed', hint: 'Pixels per frame' },
        { path: 'procession.scale', label: 'Procession size' },
        { path: 'procession.elephant', label: 'Elephant' },
        {
          path: 'procession.howdah',
          label: 'Howdah',
          hint: 'The gold seat and canopy, the horns and the flags',
        },
        {
          path: 'procession.trim',
          label: 'Gold trim',
          hint: 'Borders, anklets and the forehead plate',
        },
        { path: 'procession.kurta', label: 'Kurtas' },
        { path: 'procession.turban', label: 'Turbans and sashes' },
        { path: 'procession.skin', label: 'Skin' },
        { path: 'garden.lawnLines', label: 'Lawn lattice' },
        { path: 'garden.path', label: 'Path' },
        { path: 'garden.gravel', label: 'Path gravel' },
        {
          path: 'garlands.show',
          label: 'Show hanging strings',
          hint: 'The marigold strings, the blossoms and the bead strings',
        },
        { path: 'garlands.leaf', label: 'Garland leaves' },
        { path: 'garlands.bell', label: 'Bells and threads' },
        { path: 'garlands.bead', label: 'Beads' },
        {
          path: 'garlands.sway',
          label: 'String sway',
          hint: 'Degrees each string swings; 0 holds them still',
        },
      ],
    },
  ],
  hidden: ['motion.float'],
});
