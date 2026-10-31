import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { DominoWordsProps } from './domino-words';

export const dominoWordsControls = defineControls<DominoWordsProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'words',
          label: 'Dominoes',
          hint: 'Each word stands as one domino, left to right. Gap before sets how far the previous word tips before it rests on this one, and is ignored on the first word',
          items: { text: 'Word', size: 'Size', gap: 'Gap before' },
        },
      ],
      more: [
        { path: 'type.weight', label: 'Font weight' },
        {
          path: 'type.outline',
          label: 'Outline width',
          hint: 'Standing words are hollow outlines that fill in as they tip. 0 makes them solid',
        },
        {
          path: 'type.condense',
          label: 'Letter width',
          hint: 'Squeezes or stretches the words sideways, which also changes how far they reach',
        },
        { path: 'type.colorFrames', label: 'Color change length', hint: 'In frames' },
        { path: 'type.firstActive', label: 'First word starts lit' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['orb.color', 'finale.color', 'brand.dotColor'],
          label: 'Primary color',
          hint: 'The orb, the landed final word with its glow and floor tint, and the ring mark beside the brand name',
        },
        {
          link: ['type.activeColor', 'brand.color'],
          label: 'Text color',
          hint: 'Toppled words, and the brand name with its tagline',
        },
        {
          link: ['type.idleColor', 'footer.color'],
          label: 'Secondary color',
          hint: 'Standing word outlines and the footer',
        },
        { path: 'floor.color', label: 'Accent color', hint: 'The glowing floor line' },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { path: 'orb.color', label: 'Orb color' },
        { path: 'finale.color', label: 'Final word color' },
        { path: 'brand.dotColor', label: 'Ring mark color' },
        {
          path: 'type.activeColor',
          label: 'Toppled word color',
          hint: 'Words turn this color as they are hit',
        },
        { path: 'brand.color', label: 'Brand text color', hint: 'The brand name and its tagline' },
        { path: 'type.idleColor', label: 'Standing word color' },
        { path: 'footer.color', label: 'Footer color' },
        LOOK.background,
        LOOK.backgroundEdge,
      ],
    },
    {
      title: 'Domino fall',
      fields: [
        {
          path: 'fall.stepFrames',
          label: 'Frames between hits',
          hint: 'How long each word takes to tip into the next. Lower is a faster chain',
        },
      ],
      more: [
        {
          path: 'orb.hitFrame',
          label: 'First hit at',
          hint: 'Frame number where the orb strikes the first word',
        },
        { path: 'fall.lastFrames', label: 'Last word fall length', hint: 'In frames' },
        {
          path: 'layout.startX',
          label: 'First word position',
          hint: 'Distance from the left edge, in pixels',
        },
        {
          path: 'fall.curve',
          label: 'Fall acceleration',
          hint: 'Higher starts slower and slams down harder',
        },
        { path: 'fall.lastCurve', label: 'Last word fall acceleration' },
        {
          path: 'fall.push',
          label: 'Initial push',
          hint: 'How hard the orb shoves the first word',
        },
        {
          path: 'fall.transfer',
          label: 'Momentum transfer',
          hint: 'How much speed each word passes on to the next',
        },
        {
          path: 'fall.nudge',
          label: 'Minimum push',
          hint: 'Lowest starting speed a knocked word can have',
        },
        {
          path: 'fall.lastLaunch',
          label: 'Last word max push',
          hint: 'Caps the starting speed of the final word',
        },
      ],
    },
    {
      title: 'Final word glow',
      fields: [],
      more: [
        { path: 'finale.flashColor', label: 'Landing flash color' },
        {
          path: 'finale.flashFrames',
          label: 'Landing flash length',
          hint: 'In frames. The finale glows also fade in over this time',
        },
        { path: 'finale.glow', label: 'Final word glow' },
        {
          path: 'finale.wash',
          label: 'Final word backlight',
          hint: 'Soft halo behind the landed word',
        },
        { path: 'finale.floorTint', label: 'Floor tint under final word' },
        {
          path: 'finale.spill',
          label: 'Glow spill on previous word',
          hint: 'Tints the second to last word with the final color',
        },
      ],
    },
    {
      title: 'Orb',
      fields: [{ path: 'orb.show', label: 'Show orb' }],
      more: [
        { path: 'orb.radius', label: 'Orb size', hint: 'Radius in pixels' },
        { path: 'orb.speed', label: 'Roll-in speed', hint: 'Pixels per frame before the hit' },
        { path: 'orb.shade', label: 'Orb edge shade' },
        { path: 'orb.stripes', label: 'Show stripes' },
        { path: 'orb.stripeColor', label: 'Stripe color' },
        { path: 'orb.glow', label: 'Orb glow' },
        {
          path: 'orb.bounceSpeed',
          label: 'Bounce-back speed',
          hint: 'Pixels per frame it rolls back after the hit. 0 stops it dead',
        },
      ],
    },
    {
      title: 'Floor',
      fields: [{ path: 'floor.glow', label: 'Floor glow' }],
      more: [
        {
          path: 'floor.y',
          label: 'Floor height',
          hint: 'Distance of the floor line from the top, in pixels',
        },
        { path: 'floor.reflection', label: 'Reflection strength' },
        { path: 'floor.thickness', label: 'Line thickness' },
        {
          path: 'floor.inset',
          label: 'Side margin',
          hint: 'Gap between the line ends and the edges',
        },
        { path: 'floor.glowSpread', label: 'Glow spread' },
        {
          path: 'floor.reflectionDepth',
          label: 'Reflection depth',
          hint: 'How far below the floor the reflection fades out, in pixels',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [],
      more: [
        {
          path: 'camera.landingX',
          label: 'Final word landing spot',
          hint: 'The camera pans until the base of the final word sits this many pixels from the left',
        },
        {
          path: 'camera.zoomStart',
          label: 'Pull back at',
          hint: 'Frame number where the camera zooms out to show the whole line',
        },
        { path: 'camera.zoomFrames', label: 'Pull back length', hint: 'In frames' },
        {
          path: 'camera.fitPadding',
          label: 'Final framing margin',
          hint: 'Space kept between the fallen line and the floor ends after the pull back',
        },
        { path: 'camera.panStart', label: 'Pan starts at', hint: 'Frame number' },
        { path: 'camera.panRamp', label: 'Pan speed-up', hint: 'Frames to reach full speed' },
        {
          path: 'camera.panHold',
          label: 'Pan full speed',
          hint: 'Frames at full speed before slowing down',
        },
        { path: 'camera.panEnd', label: 'Pan ends at', hint: 'Frame number' },
        {
          path: 'camera.panEase',
          label: 'Pan slowdown curve',
          hint: 'Higher slows down sooner and glides into place',
        },
      ],
    },
    {
      title: 'Branding',
      fields: [
        { path: 'brand.name', label: 'Brand name' },
        { path: 'footer.text', label: 'Footer text' },
      ],
      more: [
        { path: 'brand.show', label: 'Show brand' },
        { path: 'brand.tagline', label: 'Tagline' },
        { path: 'footer.show', label: 'Show footer' },
        { path: 'brand.size', label: 'Brand size' },
        { path: 'brand.right', label: 'Brand right margin' },
        { path: 'brand.top', label: 'Brand top margin' },
        { path: 'footer.lines', label: 'Footer side lines' },
        { path: 'footer.size', label: 'Footer text size' },
        { path: 'footer.bottom', label: 'Footer bottom margin' },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperLine,
        LOOK.paperSpacing,
        LOOK.paperMargin,
        { path: 'look.accent', label: 'Margin line color' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        { ...MOTION.exitFrames, hint: 'In frames. Starts at 0, so raise it to see the exit' },
        MOTION.enterFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up or slows down the whole animation. The clip length stays the same, so below 1 the ending is cut off',
        },
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float'],
});
