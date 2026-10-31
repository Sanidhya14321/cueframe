import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { ElevatorNewspaperProps } from './elevator-newspaper';

const LINES_HINT = 'Each line is a row; long copy shrinks to fit';
const FRAME_HINT = 'Frame number; the doors are fully open from about frame 33 to 154';
const PHOTO_HINT = 'Leave empty, or use a link that fails to load, for a plain block';
const BODY_HINT =
  'Small italic copy under the box; it wraps and is cut at the bottom of the column';

export const elevatorNewspaperControls = defineControls<ElevatorNewspaperProps>({
  sections: [
    {
      title: 'Cover page',
      fields: [
        {
          path: 'cover.headline',
          label: 'Cover headline',
          hint: `Big type over the photo on the left page. ${LINES_HINT}`,
        },
        { path: 'cover.photo', label: 'Cover photo', hint: PHOTO_HINT },
      ],
      more: [
        { path: 'cover.headlineSize', label: 'Cover headline size' },
        {
          path: 'cover.photoFocus',
          label: 'Photo position',
          hint: 'Which part of the photo fills the page when it is taller than the page or zoomed: 0 shows the top, 1 the bottom',
        },
        {
          path: 'cover.photoZoom',
          label: 'Photo zoom',
          hint: '1 just fills the page; higher crops in around the center',
        },
        {
          path: 'cover.photoTint',
          label: 'Photo tint strength',
          hint: 'Darkens the middle of the photo behind the headline; 0 turns it off',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['ink.text', 'ink.band'],
          label: 'Primary color',
          hint: 'Mastheads, headline, rules, boxes, body copy and the two dark bands',
        },
        {
          link: ['ink.coverText', 'ink.bandText'],
          label: 'Secondary color',
          hint: 'Cover headline and the text inside the dark bands',
        },
        { path: 'ink.paper', label: 'Surface color', hint: 'Tint printed over the paper' },
      ],
      more: [
        { path: 'ink.text', label: 'Text ink', hint: 'Mastheads, headline, rules, boxes and copy' },
        {
          path: 'ink.band',
          label: 'Band color',
          hint: 'The dark bands under the masthead and at the foot',
        },
        { path: 'ink.bandText', label: 'Band text' },
        { path: 'ink.coverText', label: 'Cover headline ink' },
        {
          path: 'ink.tint',
          label: 'Cover photo tint',
          hint: 'Only shows when Photo tint strength is above 0',
        },
      ],
    },
    {
      title: 'Story page',
      fields: [
        {
          path: 'story.headline',
          label: 'Story headline',
          hint: `Big type under the band on the right page. ${LINES_HINT}`,
        },
        {
          path: 'story.subhead',
          label: 'Subhead',
          hint: 'Bold capitals between the rules under the headline',
        },
        { path: 'story.photo', label: 'Store photo', hint: PHOTO_HINT },
      ],
      more: [
        { path: 'story.headlineSize', label: 'Story headline size' },
        {
          path: 'story.caption',
          label: 'Photo sign',
          hint: 'Bold capitals over the photo; each line is a row',
        },
        { path: 'story.teaserTitle', label: 'Left box title', hint: LINES_HINT },
        { path: 'story.teaser', label: 'Left column copy', hint: BODY_HINT },
        { path: 'story.sidebarTitle', label: 'Right box title', hint: LINES_HINT },
        { path: 'story.sidebar', label: 'Right column copy', hint: BODY_HINT },
        {
          path: 'story.footer',
          label: 'Band text',
          hint: 'Repeated three times in both dark bands',
        },
      ],
    },
    {
      title: 'Masthead',
      fields: [
        { path: 'masthead.brand', label: 'Newspaper name', hint: 'Top of both pages' },
        {
          path: 'masthead.edition',
          label: 'Header boxes',
          hint: 'Small italic text in the boxes either side of the masthead; each line is a row',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.zoom',
          label: 'Push-in',
          hint: 'How close the camera glides; 1 stays wide',
        },
        { path: 'camera.pushStart', label: 'Push-in starts', hint: FRAME_HINT },
        { path: 'camera.pullStart', label: 'Pull-out starts', hint: FRAME_HINT },
      ],
      more: [
        {
          path: 'camera.creep',
          label: 'Slow creep',
          hint: 'Extra zoom gained slowly while the camera is close, so it never stops; 0 holds still',
        },
        { path: 'camera.pushFrames', label: 'Push-in length', hint: 'In frames' },
        { path: 'camera.pullFrames', label: 'Pull-out length', hint: 'In frames' },
        {
          path: 'camera.focusX',
          label: 'Focus across',
          hint: 'In pixels from the left of the footage; moves to the center while the camera is close',
        },
        {
          path: 'camera.focusY',
          label: 'Focus height',
          hint: 'In pixels from the top of the footage; moves to the center while the camera is close',
        },
      ],
    },
    {
      title: 'Print',
      fields: [],
      more: [
        {
          path: 'print.strength',
          label: 'Ink strength',
          hint: 'How solid the printing looks on the paper',
        },
        {
          path: 'print.shading',
          label: 'Follow the paper light',
          hint: 'Shades the print with the filmed paper so folds and shadows show through; 0 keeps it flat',
        },
        {
          path: 'print.paperTint',
          label: 'Paper tint strength',
          hint: 'How strongly the surface color tints the paper',
        },
        {
          path: 'print.softness',
          label: 'Print softness',
          hint: 'Blurs the print to match the footage; 0 is sharp',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});
