import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { ProblemStrikeoutProps } from './problem-strikeout';

export const problemStrikeoutControls = defineControls<ProblemStrikeoutProps>({
  sections: [
    {
      title: 'Problems',
      fields: [
        {
          path: 'page.problems',
          label: 'Problems',
          hint: 'One per line, written in capitals in two columns and struck out in order',
        },
      ],
      more: [
        { path: 'page.font', label: 'Handwriting font' },
        { path: 'page.size', label: 'Writing size', hint: 'Letter height in page pixels' },
        { path: 'page.strikeWidth', label: 'Strike thickness', hint: 'In page pixels' },
        { path: 'page.tilt', label: 'Writing slant', hint: 'Angle of every word, in radians' },
        {
          path: 'page.jitter',
          label: 'Messiness',
          hint: "Random variation in each word's position and angle",
        },
        { path: 'page.strikeWobble', label: 'Strike wobble', hint: 'How wavy each strike is' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['card.top', 'card.badgeInk', 'card.footerInk'],
          label: 'Primary color',
          hint: 'End card top color, the monogram and the contact text together',
        },
        {
          path: 'card.bottom',
          label: 'Secondary color',
          hint: 'Bottom of the end card background gradient',
        },
        {
          path: 'card.pieceAccent',
          label: 'Accent color',
          hint: 'The puzzle piece that drops in carrying the label',
        },
        {
          link: ['page.graphite', 'page.strikeColor'],
          label: 'Text color',
          hint: 'The handwritten problems and the strike lines together',
        },
        { path: 'page.paper', label: 'Surface color', hint: 'The notebook page' },
      ],
      more: [
        { path: 'card.top', label: 'Card top color' },
        { path: 'card.badgeInk', label: 'Monogram color' },
        { path: 'card.footerInk', label: 'Contact text color' },
        { path: 'page.graphite', label: 'Writing color', hint: 'The handwritten problems only' },
        {
          path: 'page.strikeColor',
          label: 'Strike color',
          hint: 'The lines crossing out each problem, for example a red pen',
        },
        {
          link: ['card.ink', 'card.labelInk'],
          label: 'Card text color',
          hint: 'Kicker, headline, brand name and the puzzle piece label together',
        },
        { path: 'card.ink', label: 'Card headline color', hint: 'Kicker, headline and brand name' },
        {
          path: 'card.labelInk',
          label: 'Piece label color',
          hint: 'Text on the snapping piece',
        },
        {
          link: ['card.badgeFill', 'card.footerFill'],
          label: 'Badge and contact pill color',
          hint: 'The monogram circle and the contact pill behind the text together',
        },
        { path: 'card.badgeFill', label: 'Badge circle color' },
        { path: 'card.footerFill', label: 'Contact pill color' },
        { path: 'card.glow', label: 'Center glow' },
        {
          path: 'card.watermark',
          label: 'Watermark strength',
          hint: 'Opacity of the large monogram behind everything, 0 hides it',
        },
        { path: 'card.watermarkInk', label: 'Watermark color' },
        {
          path: 'card.pieceLight',
          label: 'Base piece color',
          hint: 'The puzzle piece that is already in place',
        },
        { path: 'card.arrow', label: 'Growth arrow color' },
        { path: 'card.bar', label: 'Chart bar color' },
        { path: 'page.rule', label: 'Rule line color' },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'card.headline', label: 'Headline', hint: 'Shown in capitals, one line per row' },
        { path: 'card.brand', label: 'Brand name' },
      ],
      more: [
        { path: 'card.kicker', label: 'Kicker', hint: 'Small line above the headline' },
        { path: 'card.solution', label: 'Puzzle piece label' },
        { path: 'card.contact', label: 'Phone or contact' },
        { path: 'card.website', label: 'Website' },
        {
          path: 'card.monogram',
          label: 'Monogram',
          hint: 'Initials in the badge and the large watermark',
        },
        { path: 'card.headlineSize', label: 'Headline size', hint: 'In pixels' },
        {
          path: 'card.kickerSize',
          label: 'Kicker size',
          hint: 'In pixels. The headline moves down to make room',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.strikeFrames',
          label: 'Strike length',
          hint: 'Frames per strike, lower strikes faster',
        },
        {
          ...MOTION.speed,
          hint: 'Scales the whole timeline: strikes, camera, cut and end card',
        },
      ],
      more: [
        { path: 'timing.strikeStart', label: 'First strike at', hint: 'Frame number' },
        {
          path: 'timing.cutFrame',
          label: 'End card at',
          hint: 'Frame number where the notebook cuts to the card',
        },
        {
          path: 'timing.travelFrames',
          label: 'Move to next word',
          hint: 'In frames, longer jumps take up to twice as long',
        },
        {
          path: 'timing.pullbackFrames',
          label: 'Pull back length',
          hint: 'Frames the camera takes to pull back after the last strike',
        },
        {
          path: 'timing.crossfade',
          label: 'Crossfade length',
          hint: 'Frames the card fades in over the notebook',
        },
        {
          path: 'card.stagger',
          label: 'Card stagger',
          hint: 'Frames between the puzzle, kicker, headline and chart appearing',
        },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
    {
      title: 'Notebook',
      fields: [{ path: 'notebook.cover', label: 'Cover color' }],
      more: [
        { path: 'notebook.turn', label: 'Notebook rotation', hint: 'In radians' },
        { path: 'page.ruleSpacing', label: 'Rule line spacing' },
        {
          path: 'notebook.pageEdge',
          label: 'Page edge color',
          hint: 'The stacked sides of the pages',
        },
        { path: 'notebook.coil', label: 'Spiral color' },
        {
          path: 'notebook.coils',
          label: 'Spiral loops',
          hint: 'Number of coil rings and punched holes',
        },
        { path: 'notebook.curl', label: 'Page curl', hint: 'Lifts the corner of the top page' },
        { path: 'notebook.x', label: 'Notebook left and right' },
        { path: 'notebook.z', label: 'Notebook forward and back' },
      ],
    },
    {
      title: 'Pencil and hand',
      fields: [{ path: 'pencil.show', label: 'Show pencil' }],
      more: [
        {
          path: 'hand.show',
          label: 'Show hand',
          hint: 'The hand holds the pencil, so it only shows with the pencil',
        },
        { path: 'pencil.body', label: 'Pencil color' },
        { path: 'hand.skin', label: 'Skin tone' },
        { path: 'pencil.wood', label: 'Sharpened wood color' },
        { path: 'pencil.lead', label: 'Lead tip color' },
        { path: 'pencil.lean', label: 'Pencil lean', hint: 'Tilt away from upright, in radians' },
        {
          path: 'pencil.heading',
          label: 'Pencil direction',
          hint: 'Which way the pencil points across the desk, in radians',
        },
        {
          path: 'pencil.lift',
          label: 'Lift between words',
          hint: 'How high the pencil rises while moving to the next word',
        },
        { path: 'hand.sleeve', label: 'Show sleeve' },
        { path: 'hand.sleeveColor', label: 'Sleeve color' },
        {
          path: 'hand.grip',
          label: 'Grip height',
          hint: 'How far up the pencil the fingers hold it',
        },
        { path: 'hand.offset', label: 'Hand side offset' },
        { path: 'hand.roll', label: 'Hand roll', hint: 'Rotates the hand around the pencil' },
        { path: 'hand.indexCurl', label: 'Finger curl', hint: 'Curls all four fingers' },
        { path: 'hand.thumbCurl', label: 'Thumb curl' },
        { path: 'hand.thumbReach', label: 'Thumb reach' },
        { path: 'hand.wristBend', label: 'Wrist bend' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.follow',
          label: 'Follow the pencil',
          hint: 'How closely the camera tracks the pencil while striking',
        },
      ],
      more: [
        {
          path: 'camera.closeDistance',
          label: 'Close-up distance',
          hint: 'Camera distance while the pencil strikes',
        },
        {
          path: 'camera.wideDistance',
          label: 'Final wide distance',
          hint: 'Camera distance after the pull back',
        },
        {
          path: 'camera.openDistance',
          label: 'Opening distance',
          hint: 'Camera distance on the first frame',
        },
        { path: 'camera.fieldOfView', label: 'Field of view' },
        {
          path: 'camera.elevation',
          label: 'Camera height angle',
          hint: 'In radians, higher looks more straight down',
        },
        { path: 'camera.azimuth', label: 'Camera orbit angle', hint: 'In radians' },
        {
          path: 'camera.lead',
          label: 'Framing offset',
          hint: 'Shifts the framing to one side of the pencil',
        },
        { path: 'camera.handheld', label: 'Handheld shake' },
      ],
    },
    {
      title: 'Desk and light',
      fields: [
        {
          path: 'lens.depthOfField',
          label: 'Background blur',
          hint: 'Depth of field strength, 0 turns it off',
        },
      ],
      more: [
        { path: 'desk.surface', label: 'Desk color' },
        { path: 'light.key', label: 'Key light', hint: 'Brightness of the main light' },
        { path: 'desk.roughness', label: 'Desk roughness' },
        { path: 'light.keyColor', label: 'Key light color' },
        { path: 'light.keyX', label: 'Key light left and right' },
        { path: 'light.keyY', label: 'Key light height' },
        { path: 'light.keyZ', label: 'Key light front and back' },
        { path: 'light.ambient', label: 'Ambient light' },
        { path: 'light.softness', label: 'Shadow softness' },
        { path: 'light.reflections', label: 'Reflections' },
        { path: 'lens.focusRange', label: 'Focus range', hint: 'Depth that stays sharp' },
        { path: 'lens.ambientOcclusion', label: 'Contact shadows' },
        { path: 'lens.occlusionRadius', label: 'Contact shadow reach' },
        { path: 'lens.bloom', label: 'Bloom' },
        { path: 'lens.contrast', label: 'Contrast' },
        {
          path: 'lens.motionBlur',
          label: 'Motion blur samples',
          hint: 'Final renders only, 0 or 1 turns it off',
        },
        {
          path: 'lens.shutterAngle',
          label: 'Shutter angle',
          hint: 'Higher smears motion more, needs motion blur',
        },
        { path: 'camera.vignette', label: 'Vignette', hint: 'Notebook shots only' },
        { path: 'camera.grain', label: 'Film grain', hint: 'Notebook shots only' },
      ],
    },
  ],
  hidden: ['motion.float'],
});
