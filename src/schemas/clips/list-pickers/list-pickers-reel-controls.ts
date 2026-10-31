import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { ListPickersReelProps } from './list-pickers-reel';

export const listPickersReelControls = defineControls<ListPickersReelProps>({
  sections: [
    {
      title: 'Pickers',
      fields: [
        {
          path: 'beats',
          label: 'Pickers in order',
          hint: 'Each picker plays full screen in turn after the intro. The clip length stays fixed, so longer pickers run past the end and shorter ones end early on the background color',
          items: { clip: 'Picker', frames: 'Frames on screen' },
        },
        {
          path: 'crossfade',
          label: 'Crossfade between pickers',
          hint: 'In frames. Zero cuts straight from one picker to the next',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'intro.background',
          label: 'Primary color',
          hint: 'The background that fills the gaps around the grid tiles and shows if the pickers end early',
        },
      ],
    },
    {
      title: 'Intro grid',
      fields: [
        { path: 'intro.show', label: 'Show intro grid' },
        {
          path: 'grid',
          label: 'Grid tiles',
          hint: 'Nine pickers, left to right and top to bottom. The zoom dives into the tile of the first picker in the list; if that picker is not in the grid, it dives into the top left tile and crossfades',
        },
        {
          path: 'intro.frames',
          label: 'Intro length',
          hint: 'In frames, including the zoom',
        },
      ],
      more: [
        { path: 'intro.gap', label: 'Space between tiles', hint: 'In pixels' },
        {
          path: 'intro.radius',
          label: 'Tile corner radius',
          hint: 'In pixels. Corners square off as the zoom completes',
        },
      ],
    },
    {
      title: 'Intro animation',
      fields: [
        {
          path: 'intro.popOrder',
          label: 'Pop order',
          hint: 'Center tile, then corners, then edges; or row by row from the top left',
        },
        {
          path: 'intro.stagger',
          label: 'Delay between tiles',
          hint: 'In frames. Zero pops every tile at once',
        },
        { path: 'intro.popFrames', label: 'Tile pop length', hint: 'In frames' },
        {
          path: 'intro.zoomFrames',
          label: 'Zoom length',
          hint: 'In frames, at the end of the intro',
        },
      ],
      more: [
        {
          path: 'intro.popScale',
          label: 'Tile start size',
          hint: 'Each tile grows from this scale to full size as it pops in. 1 only fades the tiles in',
        },
        {
          path: 'intro.lead',
          label: 'Tile head start',
          hint: 'In frames. How far each picker has already played when its tile pops in',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        MOTION.exit,
        {
          link: ['motion.enterFrames', 'motion.exitFrames'],
          label: 'Transition length',
          hint: 'In frames, for both the entrance and the exit',
        },
      ],
      more: [MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});
