import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { DotWordmarkRevealProps } from './dot-wordmark-reveal';

export const dotWordmarkRevealControls = defineControls<DotWordmarkRevealProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'copy.wordmark',
          label: 'Wordmark',
          hint: 'Written stroke by stroke in lowercase. Letters a to z; other characters become spaces',
        },
        {
          path: 'copy.tagline',
          label: 'Tagline',
          hint: 'One word per line. The dot drops each word as it lands',
        },
        {
          path: 'copy.monogram',
          label: 'Badge letter',
          hint: 'Only the first character is drawn inside the badge, in lowercase',
        },
      ],
      more: [
        {
          path: 'copy.accentLetter',
          label: 'Accent letter',
          hint: 'Which letter flips to the accent color, counting from 0 with spaces included. Use -1 for none',
        },
        { path: 'type.taglineSize', label: 'Tagline size' },
        { path: 'type.taglineWeight', label: 'Tagline weight' },
        { path: 'type.taglineTracking', label: 'Tagline letter spacing' },
        { path: 'type.wordGap', label: 'Space between tagline words' },
        {
          path: 'type.taglineY',
          label: 'Tagline vertical offset',
          hint: 'Pixels from the center; negative moves it up',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.brand', 'look.mark', 'look.flash'],
          label: 'Primary color',
          hint: 'The dot, tagline, swelling field, finished wordmark and the flash frames',
        },
        {
          link: ['look.onBrand', 'look.monogramInk'],
          label: 'Text color',
          hint: 'Wordmark and strokes written on the brand field, the badge letter, and the dot and tagline on flash hops',
        },
        { path: 'look.paper', label: 'Background color', hint: 'The paper behind the logo' },
        {
          ...LOOK.accent,
          hint: 'Accent letter, the dot beside the badge letter and the tile pulse',
        },
      ],
      more: [
        { path: 'look.brand', label: 'Dot, tagline and field color' },
        { path: 'look.mark', label: 'Finished wordmark color' },
        { path: 'look.flash', label: 'Flash color', hint: 'Frame color on alternate hops' },
        {
          path: 'look.onBrand',
          label: 'Lettering on the field',
          hint: 'Wordmark and swoosh strokes on the field, also the dot and tagline during flashes and the field glow',
        },
        {
          path: 'look.monogramInk',
          label: 'Badge letter color',
          hint: 'Once the badge has formed',
        },
        { path: 'look.streak', label: 'Speed streak color' },
      ],
    },
    {
      title: 'Logo',
      fields: [{ path: 'type.wordmarkSize', label: 'Wordmark size' }],
      more: [
        {
          path: 'type.stroke',
          label: 'Stroke weight',
          hint: 'Line thickness relative to the letter size',
        },
        { path: 'type.badgeSize', label: 'Badge size' },
        {
          path: 'look.badgeCorner',
          label: 'Badge roundness',
          hint: '0 is a square, 1 is a circle',
        },
        {
          path: 'look.monogramDot',
          label: 'Badge dot',
          hint: 'Accent dot beside the badge letter',
        },
        { path: 'type.tightGap', label: 'Letter spacing while writing' },
        {
          path: 'type.gap',
          label: 'Final letter spacing',
          hint: 'Letters spread out to this once written',
        },
        { path: 'type.badgeGap', label: 'Space between badge and wordmark' },
        { path: 'type.monogramSize', label: 'Badge letter size', hint: 'Relative to the badge' },
        {
          path: 'type.settleScale',
          label: 'Settle zoom',
          hint: 'Extra scale the logo eases down from as the badge forms',
        },
        { path: 'look.sheen', label: 'Badge sheen' },
        {
          path: 'look.glow',
          label: 'Field glow',
          hint: 'Soft light behind the wordmark while it writes',
        },
        {
          path: 'look.pulse',
          label: 'Tile pulse',
          hint: 'Accent outline that ripples off the badge as it lands',
        },
      ],
    },
    {
      title: 'Dot',
      fields: [{ path: 'dot.size', label: 'Dot size' }],
      more: [
        {
          path: 'dot.invertOnLanding',
          label: 'Flash on alternate hops',
          hint: 'Every other hop turns the frame to the flash color with light text',
        },
        { path: 'dot.hopHeight', label: 'Hop height' },
        {
          path: 'dot.stretch',
          label: 'Motion stretch',
          hint: 'How far the dot smears into a pill when it moves fast',
        },
        {
          path: 'dot.approachDrop',
          label: 'Entry drop height',
          hint: 'How far above the tagline the dot falls in from',
        },
        {
          path: 'dot.loopReach',
          label: 'Loop width',
          hint: 'How far right the dot swings after the last word',
        },
        { path: 'dot.loopHeight', label: 'Loop height' },
        {
          path: 'dot.riseHeight',
          label: 'Rise to center arc',
          hint: 'Arc height as the dot settles at the center before it swells',
        },
      ],
    },
    {
      title: 'Roll away',
      fields: [
        {
          path: 'roll.away',
          label: 'Roll badge away',
          hint: 'Off keeps the finished logo on screen',
        },
      ],
      more: [
        { path: 'timing.holdFrames', label: 'Hold before rolling', hint: 'In frames' },
        { path: 'roll.streaks', label: 'Speed streaks' },
        {
          path: 'roll.spin',
          label: 'Spin amount',
          hint: 'Badge rotation while rolling; 1 rolls without slipping',
        },
        { path: 'roll.blur', label: 'Motion blur' },
        { path: 'timing.rollFrames', label: 'Roll length', hint: 'In frames' },
      ],
    },
    {
      title: 'Timing',
      fields: [{ path: 'timing.hopFrames', label: 'Frames per hop', hint: 'Lower hops faster' }],
      more: [
        {
          path: 'timing.writeFrames',
          label: 'Wordmark write length',
          hint: 'In frames, for the whole wordmark',
        },
        {
          path: 'timing.irisFrames',
          label: 'Badge forming length',
          hint: 'In frames, as the field shrinks into the badge',
        },
        { path: 'timing.enterDelay', label: 'Start delay', hint: 'In frames' },
        { path: 'timing.approachFrames', label: 'Entry length', hint: 'In frames' },
        {
          path: 'timing.hopSlowdown',
          label: 'Hop slowdown',
          hint: 'Each hop takes this many frames longer than the one before',
        },
        { path: 'timing.loopFrames', label: 'Loop length', hint: 'In frames' },
        { path: 'timing.fadeFrames', label: 'Tagline fade length', hint: 'In frames' },
        { path: 'timing.settleFrames', label: 'Rise to center length', hint: 'In frames' },
        { path: 'timing.growFrames', label: 'Field swell length', hint: 'In frames' },
        { path: 'timing.letterFrames', label: 'Frames per letter' },
        { path: 'timing.spreadFrames', label: 'Letter spread length', hint: 'In frames' },
        {
          path: 'timing.swooshFrames',
          label: 'Swoosh length',
          hint: 'In frames, for the stroke from the wordmark to the badge',
        },
        { path: 'timing.monogramFrames', label: 'Badge letter draw length', hint: 'In frames' },
        {
          path: 'timing.orbitFrames',
          label: 'Orbit length',
          hint: 'In frames, for the ring traced around the badge',
        },
      ],
    },
    {
      title: 'Background',
      fields: [{ ...LOOK.showBackdrop, hint: 'Off leaves the paper transparent behind the logo' }],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [MOTION.speed, MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float'],
});
