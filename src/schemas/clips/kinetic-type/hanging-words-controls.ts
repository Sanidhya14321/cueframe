import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { HangingWordsProps } from './hanging-words';

export const hangingWordsControls = defineControls<HangingWordsProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'greeting.word', label: 'Opening word' },
        { path: 'hang.top', label: 'Hanging line, top' },
        { path: 'hang.bottom', label: 'Hanging line, bottom' },
        {
          path: 'words',
          label: 'Punch words',
          hint: 'Cut in one by one over the dark diamond; each stays until the next one starts',
          items: { text: 'Word', size: 'Text size', start: 'Cuts in at (frame)' },
        },
        {
          path: 'stack.word',
          label: 'Repeated word',
          hint: 'Stacks up after the punch words and scrolls away; pick its highlighted letter under Finale',
        },
        {
          path: 'outro.word',
          label: 'Final word',
          hint: 'Grows out of the highlighted letter of the repeated word; pick the shared letter under Finale',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'palette.night'],
          label: 'Primary color',
          hint: 'Opening words, string, bob, hanging bottom line and final word, plus the diamond burst and the backdrop behind the punch words',
        },
        {
          path: 'palette.light',
          label: 'Text color',
          hint: 'The punch words and the repeated word',
        },
        { ...LOOK.accent, label: 'Accent color', hint: 'The hanging top line' },
        {
          link: ['look.background', 'palette.highlight'],
          label: 'Background color',
          hint: 'The background field and the highlighted letter in the repeated word',
        },
      ],
      more: [
        {
          ...LOOK.ink,
          label: 'Ink color',
          hint: 'Opening words, string, bob, hanging bottom line and final word',
        },
        {
          path: 'palette.night',
          label: 'Diamond burst color',
          hint: 'Also the backdrop behind the punch words, the ring around the highlighted letter and that letter as the stack scrolls',
        },
        LOOK.background,
        {
          path: 'palette.highlight',
          label: 'Highlighted letter color',
        },
      ],
    },
    {
      title: 'Opening',
      fields: [],
      more: [
        {
          path: 'greeting.lines',
          label: 'Repeated lines',
          hint: 'The line level with the bob is solid, the others are outlined',
        },
        { path: 'greeting.size', label: 'Opening text size' },
        {
          link: ['greeting.font', 'hang.font'],
          label: 'Opening typeface',
          hint: 'Opening words and the hanging line',
        },
        { path: 'greeting.font', label: 'Opening words typeface' },
        { path: 'greeting.weight', label: 'Opening font weight' },
        { path: 'greeting.tracking', label: 'Letter spacing' },
        {
          path: 'greeting.outline',
          label: 'Outline width',
          hint: 'Stroke of the hollow lines; 0 makes every line solid',
        },
        { path: 'greeting.pitch', label: 'Line spacing', hint: 'Pixels between line centers' },
        { path: 'knot.dotSize', label: 'Bob size' },
        {
          path: 'knot.y',
          label: 'Bob height',
          hint: 'Distance from the top; the opening words and the diamond burst center here too',
        },
        { path: 'knot.stringWidth', label: 'String thickness' },
        { path: 'knot.corner', label: 'Bob corner rounding' },
        {
          path: 'knot.blur',
          label: 'Motion blur',
          hint: 'Streaks the flying bob and the dropping line',
        },
        { path: 'greeting.start', label: 'First line appears at', hint: 'Frame number' },
        { path: 'greeting.stagger', label: 'Delay between lines', hint: 'In frames' },
        { path: 'greeting.revealFrames', label: 'Glitch-in length', hint: 'In frames' },
        {
          path: 'greeting.exitStart',
          label: 'Lines start leaving at',
          hint: 'Frame number for the top line; the rest follow just before the hanging line lands',
        },
        { path: 'greeting.exitFrames', label: 'Line exit length', hint: 'In frames' },
        { path: 'knot.riseStart', label: 'Bob shoots up at', hint: 'Frame number' },
        { path: 'knot.riseFrames', label: 'Shoot-up length', hint: 'In frames' },
        { path: 'knot.fallStart', label: 'Bob drops back at', hint: 'Frame number' },
        { path: 'knot.fallFrames', label: 'Drop-back length', hint: 'In frames' },
      ],
    },
    {
      title: 'Hanging line',
      fields: [{ path: 'hang.swing', label: 'Swing angle', hint: 'In degrees' }],
      more: [
        { path: 'hang.topSize', label: 'Top line size' },
        { path: 'hang.bottomSize', label: 'Bottom line size' },
        { path: 'hang.font', label: 'Hanging line typeface' },
        { path: 'hang.weight', label: 'Font weight' },
        { path: 'hang.gap', label: 'Gap below the bob' },
        { path: 'hang.leading', label: 'Line spacing', hint: 'Relative to the bottom line size' },
        {
          path: 'hang.arrive',
          label: 'Lands at',
          hint: 'Frame number; the swing starts here',
        },
        { path: 'hang.dropFrames', label: 'Drop length', hint: 'In frames' },
        { path: 'hang.dropHeight', label: 'Drop distance', hint: 'How far above it starts' },
        { path: 'hang.swingPeriod', label: 'Swing length', hint: 'Frames per back-and-forth' },
        {
          path: 'hang.swingDamping',
          label: 'Swing carry',
          hint: 'Share of the angle kept on each swing; lower settles faster',
        },
        { path: 'hang.swings', label: 'Number of swings' },
      ],
    },
    {
      title: 'Burst',
      fields: [
        {
          path: 'flash.font',
          label: 'Punch typeface',
          hint: 'Punch words, repeated word and final word',
        },
      ],
      more: [
        {
          path: 'flash.weight',
          label: 'Punch font weight',
          hint: 'Punch words, repeated word and final word',
        },
        {
          path: 'drop.width',
          label: 'Diamond width',
          hint: 'Relative to its height; 1 is a square diamond',
        },
        {
          path: 'flash.baseline',
          label: 'Text baseline',
          hint: 'Distance from the top for the punch words, repeated word and final word',
        },
        { path: 'drop.fallStart', label: 'Diamond opens at', hint: 'Frame number' },
        { path: 'drop.fallFrames', label: 'Opening length', hint: 'In frames' },
        { path: 'flash.end', label: 'Last word ends at', hint: 'Frame number' },
        {
          path: 'flash.ghost',
          label: 'Afterimage strength',
          hint: 'Opacity a word drops to as it cuts out',
        },
        { path: 'flash.ghostFrames', label: 'Afterimage length', hint: 'In frames' },
        { path: 'drop.liftStart', label: 'Diamond closes at', hint: 'Frame number' },
        { path: 'drop.liftFrames', label: 'Closing length', hint: 'In frames' },
      ],
    },
    {
      title: 'Finale',
      fields: [],
      more: [
        {
          path: 'stack.highlightIndex',
          label: 'Highlighted letter',
          hint: 'Position in the repeated word, counting from 0',
        },
        {
          path: 'outro.pivotIndex',
          label: 'Shared letter in final word',
          hint: 'Position in the final word, counting from 0; the word grows out of it',
        },
        { path: 'stack.sideLines', label: 'Copies above and below' },
        { path: 'stack.size', label: 'Repeated word size' },
        { path: 'outro.size', label: 'Final word size' },
        { path: 'stack.pitch', label: 'Stack line spacing', hint: 'Pixels between copies' },
        {
          path: 'stack.ringStroke',
          label: 'Letter ring width',
          hint: 'Outline around the highlighted letter',
        },
        { path: 'stack.start', label: 'Stack appears at', hint: 'Frame number' },
        { path: 'stack.fillFrames', label: 'Stack fill length', hint: 'In frames' },
        { path: 'stack.scrollStart', label: 'Stack scrolls away at', hint: 'Frame number' },
        {
          path: 'stack.scrollFrames',
          label: 'Scroll length',
          hint: 'In frames; higher scrolls slower',
        },
        {
          path: 'outro.inkAt',
          label: 'Highlighted letter turns ink color at',
          hint: 'Frame number',
        },
        { path: 'outro.expandStart', label: 'Final word grows at', hint: 'Frame number' },
        { path: 'outro.expandFrames', label: 'Grow length', hint: 'In frames' },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Off leaves the background, diamond burst and dark flash backdrop transparent',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter],
      more: [
        { ...MOTION.exit, hint: 'Plays only once Exit length is raised above 0' },
        { ...MOTION.exitFrames, hint: 'In frames. 0 by default, so raise it for the exit to play' },
        {
          ...MOTION.speed,
          hint: 'Scales every timing in the clip. The clip length stays fixed, so below 1 the ending is cut off and above 1 the last frame holds',
        },
        MOTION.enterFrames,
      ],
    },
  ],
  hidden: [
    'look.backgroundEdge',
    'look.muted',
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
