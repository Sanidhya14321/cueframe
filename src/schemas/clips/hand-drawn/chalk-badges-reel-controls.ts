import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { ChalkBadgesReelProps } from './chalk-badges-reel';

export const chalkBadgesReelControls = defineControls<ChalkBadgesReelProps>({
  sections: [
    {
      title: 'Badges',
      fields: [
        {
          path: 'badges',
          label: 'Badges',
          hint: 'Drawn together in the grid, then one solo beat each; the video length stays fixed',
          items: {
            variant: 'Badge design',
            word: 'Word',
            line: 'Chalk line color',
            fill: 'Fill color',
            text: 'Word color',
          },
        },
        {
          path: 'caption',
          label: 'Caption',
          hint: 'Typed across the top while the solo badges play; leave empty to hide it',
        },
      ],
      more: [
        { path: 'soloScale', label: 'Solo badge size' },
        {
          path: 'grid.columns',
          label: 'Grid columns',
          hint: 'Rows are added as needed to fit every badge',
        },
        { path: 'grid.scale', label: 'Grid badge size' },
        {
          path: 'captionSize',
          label: 'Caption size',
          hint: 'In pixels. A bigger caption also sits lower',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['outro.color', 'title.badge.fill', 'look.accent'],
          label: 'Primary color',
          hint: 'The outro headline, the sparkles and solid shapes of the center title badge, and the board margin line when it is on',
        },
        {
          link: [
            'title.color',
            'captionColor',
            'outro.endTagColor',
            'title.badge.line',
            'title.badge.text',
          ],
          label: 'Text color',
          hint: 'The chalk title words, the caption, the end tag and the center badge lines and word',
        },
        {
          link: ['outro.barColor', 'outro.burstColor'],
          label: 'Accent color',
          hint: 'The outro underline bar and the giant burst glyph. Each badge keeps its own colors, set in Badges',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the chalkboard together',
        },
      ],
      more: [
        { path: 'outro.color', label: 'Outro headline color' },
        {
          path: 'title.badge.fill',
          label: 'Center badge fill color',
          hint: 'Sparkles and solid shapes of the center title badge',
        },
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Paper margin line is on' },
        { path: 'title.color', label: 'Title word color' },
        { path: 'captionColor', label: 'Caption color' },
        { path: 'outro.endTagColor', label: 'End tag color' },
        { path: 'title.badge.line', label: 'Center badge line color' },
        { path: 'title.badge.text', label: 'Center badge word color' },
        {
          path: 'outro.barColor',
          label: 'Underline color',
          hint: 'The bar that grows under the fourth headline line, so it needs at least four lines',
        },
        { path: 'outro.burstColor', label: 'Burst glyph color' },
        { ...LOOK.background, label: 'Board color' },
        { ...LOOK.backgroundEdge, label: 'Board edge color' },
        { ...LOOK.paperLine, label: 'Pattern line color', hint: 'Grid and ruled pattern lines' },
        {
          ...LOOK.ink,
          label: 'Grid dot color',
          hint: 'Chalk dots where the grid lines cross, shown with the grid pattern',
        },
      ],
    },
    {
      title: 'Title',
      fields: [
        { path: 'title.left', label: 'Left word' },
        { path: 'title.right', label: 'Right word' },
      ],
      more: [
        { path: 'title.badge.word', label: 'Center badge word' },
        { path: 'title.size', label: 'Title word size', hint: 'In pixels' },
        {
          path: 'title.badge.variant',
          label: 'Center badge design',
          hint: 'The hand-drawn doodle between the two words',
        },
      ],
    },
    {
      title: 'Outro',
      fields: [
        {
          path: 'outro.lines',
          label: 'Headline lines',
          hint: 'Chunky letters pop in one by one, line after line',
          items: {
            text: 'Text',
            size: 'Text size',
            offset: 'Sideways shift',
          },
        },
      ],
      more: [
        {
          path: 'outro.endTag',
          label: 'End tag',
          hint: 'Pops in after the headline clears and the big glyph bursts past',
        },
        {
          path: 'outro.burstText',
          label: 'Burst glyph',
          hint: 'The giant character that sweeps past the screen before the end tag',
        },
      ],
    },
    {
      title: 'Sequence',
      fields: [
        {
          path: 'soloFrames',
          label: 'Time per solo badge',
          hint: 'In frames; the video length stays fixed, so longer parts cut the outro short',
        },
      ],
      more: [
        { path: 'title.show', label: 'Show title' },
        { path: 'grid.show', label: 'Show badge grid' },
        { path: 'outro.show', label: 'Show outro' },
        { path: 'title.frames', label: 'Title length', hint: 'In frames' },
        { path: 'grid.frames', label: 'Grid length', hint: 'In frames' },
        { path: 'outro.frames', label: 'Outro length', hint: 'In frames' },
        {
          path: 'overlap',
          label: 'Overlap between parts',
          hint: 'Frames each part starts before the previous one ends',
        },
      ],
    },
    {
      title: 'Chalk',
      fields: [
        {
          path: 'chalk.width',
          label: 'Stroke width',
          hint: 'Line thickness of the hand-drawn badges',
        },
      ],
      more: [
        {
          path: 'chalk.dryness',
          label: 'Dry chalk texture',
          hint: 'Higher leaves more speckled gaps in the badges and title. The outro keeps its own texture',
        },
        {
          path: 'chalk.roughness',
          label: 'Rough edges',
          hint: 'Higher makes the badge and title edges more ragged',
        },
        {
          path: 'chalk.shadow',
          label: 'Drop shadow',
          hint: 'Shadow under the badges and title words',
        },
      ],
    },
    {
      title: 'Board',
      fields: [{ ...LOOK.showBackdrop, label: 'Show chalkboard' }],
      more: [
        { ...LOOK.paper, label: 'Board pattern' },
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.spotlight,
        { ...LOOK.paperSpacing, label: 'Pattern spacing' },
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          ...MOTION.enter,
          hint: 'Plays at the start of the reel and again as each part comes in',
        },
        {
          ...MOTION.exit,
          hint: 'Plays as each part leaves and at the end of the reel; needs an exit length',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['look.muted', 'motion.float', 'motion.speed'],
});
