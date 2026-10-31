import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ArchSaveTheDateProps } from './arch-save-the-date';

const HIDE_EMPTY = 'Leave empty to hide it';
const SIZE = 'In pixels';
const FRAME = 'Frame number';
const PLANE_Y =
  'Pixels from the top of the frame on the last arch once the camera stops; nearer arches use the same measurements, seen bigger';

export const archSaveTheDateControls = defineControls<ArchSaveTheDateProps>({
  sections: [
    {
      title: 'Invitation',
      fields: [
        { path: 'copy.names', label: 'Couple names' },
        { path: 'copy.date', label: 'Date' },
        { path: 'copy.venue', label: 'Venue' },
        {
          path: 'copy.family',
          label: 'Family name',
          hint: `The last line, in script. ${HIDE_EMPTY}`,
        },
      ],
      more: [
        {
          path: 'copy.titleFirst',
          label: 'Title first word',
          hint: `Large script word on top. ${HIDE_EMPTY}`,
        },
        {
          path: 'copy.titleJoin',
          label: 'Title small word',
          hint: `Small script word in the middle. ${HIDE_EMPTY}`,
        },
        {
          path: 'copy.titleLast',
          label: 'Title last word',
          hint: `Large script word below. ${HIDE_EMPTY}`,
        },
        { path: 'copy.intro', label: 'Line above the names', hint: HIDE_EMPTY },
        {
          path: 'copy.closing',
          label: 'Sign-off',
          hint: `Small capitals above the family name. ${HIDE_EMPTY}`,
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['wall.color', 'wall.light', 'wall.shade', 'wall.relief'],
          label: 'Primary color',
          hint: 'The rose pink palace: arches, walls, columns and carving',
        },
        {
          link: ['sky.top', 'sky.middle', 'sky.horizon'],
          label: 'Secondary color',
          hint: 'The painted sky seen through the arches',
        },
        {
          link: ['garden.rose', 'garden.blossom', 'garlands.lotus'],
          label: 'Accent color',
          hint: 'The pink roses, the blossom on the garden stalks and the lotus flowers on the garlands',
        },
        {
          link: ['type.titleColor', 'type.inkColor', 'type.detailColor', 'type.flourishColor'],
          label: 'Text color',
          hint: 'Every line of the invitation and the swirls around the title',
        },
        {
          link: ['terrace.stone', 'terrace.shade', 'terrace.marble', 'terrace.vein'],
          label: 'Surface color',
          hint: 'The balustrade and the marble floor',
        },
      ],
      more: [
        { path: 'wall.color', label: 'Wall', hint: 'Main wall face and its middle molding' },
        {
          path: 'wall.light',
          label: 'Wall highlight',
          hint: 'Arch moldings, columns and carved petals',
        },
        {
          path: 'wall.shade',
          label: 'Wall shadow',
          hint: 'Grooves, the back face of each arch and the top of the wall',
        },
        {
          path: 'wall.relief',
          label: 'Carving highlight',
          hint: 'Lit edges of the moldings, columns and rosettes',
        },
        { path: 'sky.top', label: 'Sky top' },
        { path: 'sky.middle', label: 'Sky middle' },
        { path: 'sky.horizon', label: 'Sky at the horizon' },
        {
          path: 'garden.rose',
          label: 'Roses',
          hint: 'Also the rose centers on the blossom stalks',
        },
        {
          path: 'garden.blossom',
          label: 'Blossom',
          hint: 'Small flowers on the stalks and in the urns',
        },
        { path: 'garlands.lotus', label: 'Lotus flowers' },
        { path: 'type.titleColor', label: 'Title and family name' },
        { path: 'type.inkColor', label: 'Names, date and sign-off' },
        { path: 'type.detailColor', label: 'Line above the names and venue' },
        { path: 'type.flourishColor', label: 'Title swirls' },
        { path: 'terrace.stone', label: 'Balustrade stone' },
        { path: 'terrace.shade', label: 'Balustrade shadow' },
        { path: 'terrace.marble', label: 'Marble floor' },
        { path: 'terrace.vein', label: 'Marble seams', hint: 'Also the far edge of the floor' },
      ],
    },
    {
      title: 'Camera dolly',
      fields: [
        {
          path: 'camera.startDepth',
          label: 'Dolly distance',
          hint: 'How far back the camera starts, as a multiple of its final distance to the last arch. 1.02 barely moves',
        },
        {
          path: 'camera.dollyFrames',
          label: 'Dolly length',
          hint: 'In frames, from the first frame until the camera stops',
        },
      ],
      more: [
        {
          path: 'camera.eyeLevel',
          label: 'Eye level',
          hint: 'Pixels from the top of the frame to the point the corridor converges on',
        },
      ],
    },
    {
      title: 'Save the Date title',
      fields: [],
      more: [
        { path: 'type.scriptFont', label: 'Script font', hint: 'Title and family name' },
        {
          path: 'type.flourish',
          label: 'Swirls',
          hint: 'Hand-drawn swirls that draw in around the title',
        },
        { path: 'type.titleSize', label: 'Title size', hint: `${SIZE}. The first and last words` },
        { path: 'type.joinSize', label: 'Small word size', hint: SIZE },
        {
          path: 'type.titleY',
          label: 'Title height',
          hint: 'Pixels from the top of the frame to the middle of the title',
        },
        { path: 'timing.titleAt', label: 'Title focuses in at', hint: FRAME },
        {
          path: 'timing.titleFrames',
          label: 'Focus pull length',
          hint: 'In frames, from blurred to sharp',
        },
      ],
    },
    {
      title: 'Invitation lines',
      fields: [],
      more: [
        { path: 'type.serifFont', label: 'Serif font' },
        { path: 'type.introSize', label: 'Line above the names size', hint: SIZE },
        { path: 'type.namesSize', label: 'Names size', hint: SIZE },
        { path: 'type.dateSize', label: 'Date size', hint: SIZE },
        { path: 'type.venueSize', label: 'Venue size', hint: SIZE },
        { path: 'type.closingSize', label: 'Sign-off size', hint: SIZE },
        { path: 'type.familySize', label: 'Family name size', hint: SIZE },
        {
          path: 'type.linesY',
          label: 'Lines top',
          hint: 'Pixels from the top of the frame to the first line',
        },
        {
          path: 'type.gap',
          label: 'Line spacing',
          hint: 'In pixels. The gap before the sign-off is 2.4 times this',
        },
        { path: 'type.width', label: 'Text width', hint: 'In pixels. Longer lines wrap' },
        { path: 'timing.linesAt', label: 'Lines start writing at', hint: FRAME },
        { path: 'timing.lineStagger', label: 'Delay between lines', hint: 'In frames' },
        {
          path: 'timing.charFrames',
          label: 'Writing speed',
          hint: 'Frames between letters; lower writes faster',
        },
        {
          path: 'timing.charFade',
          label: 'Letter fade',
          hint: 'In frames, how long each letter takes to appear',
        },
      ],
    },
    {
      title: 'Colonnade',
      fields: [
        {
          path: 'colonnade.arches',
          label: 'Arches',
          hint: 'How many arches the camera travels through',
        },
      ],
      more: [
        {
          path: 'colonnade.spacing',
          label: 'Arch spacing',
          hint: 'Depth between arches, as a share of the final camera distance',
        },
        {
          path: 'colonnade.thickness',
          label: 'Arch depth',
          hint: 'How thick each arch looks; 0 makes them flat',
        },
        { path: 'colonnade.openingWidth', label: 'Arch width', hint: SIZE },
        { path: 'colonnade.apexY', label: 'Arch top', hint: PLANE_Y },
        { path: 'colonnade.springY', label: 'Capital height', hint: PLANE_Y },
        { path: 'colonnade.floorY', label: 'Floor line', hint: PLANE_Y },
        {
          path: 'colonnade.lobes',
          label: 'Scallops per side',
          hint: '0 gives a smooth pointed arch',
        },
        { path: 'colonnade.columnWidth', label: 'Column width', hint: SIZE },
        { path: 'colonnade.rosettes', label: 'Carved rosettes' },
      ],
    },
    {
      title: 'Chandeliers',
      fields: [{ path: 'chandeliers.show', label: 'Show chandeliers' }],
      more: [
        { path: 'chandeliers.size', label: 'Chandelier size' },
        { path: 'chandeliers.drop', label: 'Hang down to', hint: PLANE_Y },
        { path: 'chandeliers.sparkle', label: 'Crystal sparkle', hint: '0 turns the glints off' },
        { path: 'chandeliers.metal', label: 'Brass' },
        { path: 'chandeliers.crystal', label: 'Crystal', hint: 'Also the candles and the glints' },
      ],
    },
    {
      title: 'Jasmine garlands',
      fields: [
        {
          path: 'garlands.strands',
          label: 'Strands per arch',
          hint: '0 removes them. Every arch but the last has a curtain',
        },
      ],
      more: [
        { path: 'garlands.length', label: 'Strand length' },
        { path: 'garlands.sway', label: 'Sway', hint: 'In pixels at the strand tips' },
        { path: 'garlands.jasmine', label: 'Jasmine', hint: 'Also the light side of the buds' },
        {
          path: 'garlands.bud',
          label: 'Bud tint',
          hint: 'The buds at the strand ends, the lotus centers and the bead shadows',
        },
      ],
    },
    {
      title: 'Sky and clouds',
      fields: [],
      more: [
        { path: 'sky.clouds', label: 'Clouds', hint: '0 clears the sky' },
        { path: 'sky.cloudSpeed', label: 'Cloud drift', hint: 'Pixels per frame, roughly' },
        { path: 'sky.cloud', label: 'Cloud color' },
        {
          path: 'sky.cloudShade',
          label: 'Cloud shadow',
          hint: 'Also tints the chandelier crystal',
        },
        {
          path: 'sky.glow',
          label: 'Warm glow',
          hint: 'Sunset light that comes and goes near the horizon',
        },
        { path: 'sky.glowAt', label: 'Glow starts at', hint: FRAME },
        { path: 'sky.glowStrength', label: 'Glow strength', hint: '0 keeps the sky blue' },
        {
          path: 'sky.glowFrames',
          label: 'Glow cycle',
          hint: 'In frames, for the glow to rise and fade once',
        },
      ],
    },
    {
      title: 'Birds',
      fields: [],
      more: [
        { path: 'birds.count', label: 'Birds', hint: '0 removes them' },
        { path: 'birds.color', label: 'Bird color' },
        { path: 'birds.at', label: 'Fly in at', hint: FRAME },
        { path: 'birds.frames', label: 'Flight length', hint: 'In frames, to cross the sky' },
      ],
    },
    {
      title: 'Garden',
      fields: [],
      more: [
        { path: 'garden.plantSize', label: 'Plant size' },
        { path: 'garden.leaf', label: 'Leaves' },
        {
          path: 'garden.leafDark',
          label: 'Dark leaves',
          hint: 'Stems, leaf shadows and the hedge',
        },
        {
          path: 'garden.leafLight',
          label: 'Light leaves',
          hint: 'Leaf highlights, white blossom and the bud tips',
        },
      ],
    },
    {
      title: 'Terrace and floor',
      fields: [],
      more: [
        {
          path: 'terrace.depth',
          label: 'Terrace distance',
          hint: 'How far beyond the last arch the balustrade stands',
        },
        { path: 'terrace.railHeight', label: 'Balustrade height', hint: SIZE },
        {
          path: 'terrace.reflections',
          label: 'Floor reflections',
          hint: 'Pink column reflections on the marble',
        },
      ],
    },
    {
      title: 'Background and motion',
      fields: [],
      more: [
        {
          ...LOOK.showBackdrop,
          label: 'Show sky',
          hint: 'Turn off to see through the arches to layers below',
        },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up the dolly, text and ambient motion; the entrance and exit keep their own length',
        },
      ],
    },
  ],
  hidden: [
    'look.background',
    'look.backgroundEdge',
    'look.ink',
    'look.muted',
    'look.accent',
    'look.grain',
    'look.liveGrain',
    'look.spotlight',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
