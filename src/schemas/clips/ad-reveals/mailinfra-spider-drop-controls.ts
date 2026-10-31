import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { MailinfraSpiderDropProps } from './mailinfra-spider-drop';

const SCALED = 'Animation speed scales it';
const AFTER_LANDING = `Frames after the camera lands on the inbox. ${SCALED}`;
const FRAME_NUMBER = `Frame number. ${SCALED}`;
const SCREEN_Y = 'Pixels from the top of the frame';

export const mailinfraSpiderDropControls = defineControls<MailinfraSpiderDropProps>({
  sections: [
    {
      title: 'Headline',
      fields: [
        {
          path: 'headline.text',
          label: 'Opening headline',
          hint: 'Shown under the spider before the drop. Start a new line for a second line',
        },
        {
          path: 'headline.highlight',
          label: 'Highlighted word',
          hint: 'Painted in the secondary color. Leave empty for none',
        },
      ],
      more: [
        { path: 'headline.size', label: 'Headline size', hint: 'In pixels' },
        {
          path: 'headline.y',
          label: 'Headline position',
          hint: `Top of the headline. ${SCREEN_Y}`,
        },
        { path: 'headline.start', label: 'Headline appears at', hint: FRAME_NUMBER },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['inbox.color', 'badge.color', 'endCard.markColor', 'endCard.pillColor'],
          label: 'Primary color',
          hint: 'Inbox tray and its glow, the check badge, the logo tile and the link pill',
        },
        {
          link: ['stat.face', 'look.accent'],
          label: 'Secondary color',
          hint: 'Gold face of the big number and the highlighted headline word',
        },
        {
          link: ['bokeh.violet', 'spider.sheen', 'envelope.seal'],
          label: 'Accent color',
          hint: "Violet bokeh lights, the spider's sheen and the envelope's wax seal",
        },
        {
          ...LOOK.background,
          label: 'Background color',
          hint: 'Top of the indigo backdrop. Its bottom is under More options',
        },
      ],
      more: [
        { path: 'inbox.color', label: 'Inbox tray color', hint: 'Also tints its glow' },
        { path: 'badge.color', label: 'Check badge color' },
        { path: 'endCard.markColor', label: 'Logo tile color' },
        { path: 'endCard.pillColor', label: 'Link pill color', hint: 'Also tints its glow' },
        { path: 'stat.face', label: 'Number face color', hint: 'Front of the big number' },
        { path: 'look.accent', label: 'Highlighted word color' },
        { path: 'bokeh.violet', label: 'Violet bokeh color', hint: 'Every other bokeh light' },
        {
          path: 'spider.sheen',
          label: 'Spider sheen',
          hint: 'Highlights, stripes and rim of the body, and tints the legs',
        },
        { path: 'envelope.seal', label: 'Wax seal color' },
        {
          link: ['look.ink', 'signs.text'],
          label: 'Text color',
          hint: 'Headline, brand name and the floor sign labels',
        },
        { path: 'look.ink', label: 'Headline and brand color' },
        { path: 'signs.text', label: 'Sign label color' },
        {
          ...LOOK.backgroundEdge,
          label: 'Backdrop bottom',
          hint: 'The backdrop fades to it downward',
        },
        {
          path: 'silk.color',
          label: 'Silk color',
          hint: 'The thread, cobwebs, sign strands and dust',
        },
        { path: 'look.muted', label: 'Tagline color' },
      ],
    },
    {
      title: 'Spider drop',
      fields: [
        {
          path: 'floors',
          label: 'Floors',
          hint: 'Up to 4 signs the spider drops past, top to bottom. Time per floor shrinks on its own when the floors would not fit the clip',
          items: { label: 'Label', crossed: 'Crossed out with silk', color: 'Sign color' },
        },
        {
          path: 'drop.floorFrames',
          label: 'Time per floor',
          hint: `Frames between signs. Lower is a faster drop. ${SCALED}`,
        },
      ],
      more: [
        {
          path: 'spider.show',
          label: 'Show spider',
          hint: 'Off lets the envelope ride the thread on its own',
        },
        { path: 'spider.size', label: 'Spider size', hint: 'Also scales the envelope' },
        { path: 'spider.body', label: 'Body color' },
        { path: 'spider.eyes', label: 'Eye color' },
        {
          path: 'spider.restY',
          label: 'Opening height',
          hint: `Where the spider hangs at the start. ${SCREEN_Y}`,
        },
        {
          path: 'spider.arriveFrames',
          label: 'Lowers in over',
          hint: `Frames to come down from above. ${SCALED}`,
        },
        { path: 'spider.sway', label: 'Sway', hint: 'Side to side drift in pixels' },
        { path: 'spider.bob', label: 'Bob', hint: 'Up and down bounce before the drop, in pixels' },
        { path: 'silk.width', label: 'Thread width' },
        { path: 'envelope.paper', label: 'Envelope color' },
        { path: 'envelope.fold', label: 'Envelope fold lines' },
        {
          path: 'signs.firstSide',
          label: 'First sign side',
          hint: 'Signs alternate sides of the thread',
        },
        { path: 'signs.width', label: 'Sign width' },
        { path: 'signs.height', label: 'Sign height' },
        {
          path: 'signs.textSize',
          label: 'Label size',
          hint: 'In pixels. Long labels shrink to fit the sign',
        },
        {
          path: 'signs.depth',
          label: 'Sign thickness',
          hint: 'Depth of the 3D edge in pixels, 0 is flat',
        },
        {
          path: 'signs.overlap',
          label: 'Overlap with thread',
          hint: 'How far each sign reaches past the thread, in pixels',
        },
        {
          path: 'signs.y',
          label: 'Sign height on screen',
          hint: `Where each sign sits when the camera slows past it. ${SCREEN_Y}`,
        },
        {
          path: 'signs.hang',
          label: 'Strand length',
          hint: 'From the beam to the sign, in pixels',
        },
        {
          path: 'signs.swing',
          label: 'Swing when brushed',
          hint: 'Degrees each sign swings as the spider passes, 0 keeps them still',
        },
        {
          path: 'signs.crossedDim',
          label: 'Crossed label strength',
          hint: 'Opacity of a crossed out label, 1 keeps it full',
        },
        { path: 'signs.strike', label: 'Cross out strand color' },
        { path: 'signs.dust', label: 'Dust', hint: 'Specks on the signs, 0 for clean' },
        { path: 'signs.cobwebs', label: 'Cobwebs', hint: 'Strength of every cobweb, 0 hides them' },
        {
          path: 'signs.beam',
          label: 'Floor beams',
          hint: 'The ledge each sign hangs from and the one under the inbox',
        },
        { path: 'signs.beamColor', label: 'Beam color' },
        {
          path: 'drop.start',
          label: 'Drop starts at',
          hint: `${FRAME_NUMBER}. The headline leaves just before`,
        },
        {
          path: 'drop.landingFrames',
          label: 'Landing length',
          hint: `Frames from the last sign to the inbox. ${SCALED}`,
        },
        {
          path: 'drop.slowAtSigns',
          label: 'Slow down at signs',
          hint: 'How much the camera eases off as it passes each sign, 0 is an even speed',
        },
        {
          path: 'drop.floorGap',
          label: 'Floor spacing',
          hint: 'Pixels between floors. Wider makes faster whips',
        },
        {
          path: 'drop.landingGap',
          label: 'Inbox distance',
          hint: 'Pixels from the last sign down to the inbox floor. Shorter shows the inbox sooner',
        },
        {
          path: 'drop.spiderY',
          label: 'Spider height while dropping',
          hint: `Where the spider rides on screen during the drop. ${SCREEN_Y}`,
        },
        {
          path: 'drop.blurSamples',
          label: 'Motion blur samples',
          hint: 'Most copies blended per frame; the count follows the camera speed. 1 turns the whip blur off',
        },
        {
          path: 'drop.shutter',
          label: 'Motion blur length',
          hint: 'Share of a frame the blur covers, 0 turns it off',
        },
        { path: 'climb.delay', label: 'Spider climbs at', hint: AFTER_LANDING },
        {
          path: 'climb.frames',
          label: 'Climb length',
          hint: `Frames to climb out of view. ${SCALED}`,
        },
      ],
    },
    {
      title: 'Inbox and stat',
      fields: [
        { path: 'stat.value', label: 'Big number', hint: 'Swings in above the inbox' },
        { path: 'stat.caption', label: 'Number caption' },
      ],
      more: [
        { path: 'inbox.label', label: 'Tray label' },
        { path: 'inbox.labelColor', label: 'Tray label color' },
        { path: 'inbox.glow', label: 'Tray glow', hint: '0 turns the glow off' },
        { path: 'inbox.width', label: 'Tray width', hint: 'Its height follows' },
        { path: 'inbox.y', label: 'Tray position', hint: `Top of the tray front. ${SCREEN_Y}` },
        {
          path: 'inbox.releaseAfter',
          label: 'Envelope let go at',
          hint: AFTER_LANDING,
        },
        { path: 'inbox.slideFrames', label: 'Slide in length', hint: `In frames. ${SCALED}` },
        { path: 'badge.show', label: 'Check badge' },
        { path: 'badge.delay', label: 'Badge appears at', hint: AFTER_LANDING },
        { path: 'badge.size', label: 'Badge size' },
        { path: 'badge.ring', label: 'Badge ring color' },
        { path: 'badge.tick', label: 'Tick color' },
        { path: 'stat.delay', label: 'Number swings in at', hint: AFTER_LANDING },
        {
          path: 'stat.swing',
          label: 'Number swing',
          hint: 'Starting tilt in degrees, 0 drops it straight',
        },
        { path: 'stat.size', label: 'Number size' },
        { path: 'stat.y', label: 'Number position', hint: `Top of the number. ${SCREEN_Y}` },
        { path: 'stat.depth', label: 'Number thickness', hint: 'Depth of the gold edge in pixels' },
        { path: 'stat.side', label: 'Number edge color' },
        { path: 'stat.captionSize', label: 'Caption size' },
        { path: 'stat.captionColor', label: 'Caption color' },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'endCard.brand', label: 'Brand name' },
        {
          path: 'endCard.url',
          label: 'Link',
          hint: 'Shown in the pill. Leave empty to hide the pill',
        },
      ],
      more: [
        { path: 'endCard.tagline', label: 'Tagline' },
        { path: 'endCard.show', label: 'Show end card' },
        { path: 'endCard.delay', label: 'Card appears at', hint: AFTER_LANDING },
        { path: 'endCard.y', label: 'Card position', hint: `Top of the logo row. ${SCREEN_Y}` },
        { path: 'endCard.brandSize', label: 'Brand size', hint: 'The logo tile follows' },
        { path: 'endCard.taglineSize', label: 'Tagline size', hint: 'The pill follows' },
        { path: 'endCard.markInk', label: 'Logo envelope color' },
        { path: 'endCard.pillText', label: 'Link text color' },
      ],
    },
    {
      title: 'Backdrop and motion',
      fields: [
        {
          ...LOOK.showBackdrop,
          label: 'Show backdrop',
          hint: 'Off drops the indigo backdrop and bokeh for a transparent background',
        },
        {
          ...MOTION.speed,
          hint: 'Speeds up the whole story and every frame timing; the entrance and exit keep their own length',
        },
      ],
      more: [
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        { path: 'bokeh.count', label: 'Bokeh lights', hint: '0 turns them off' },
        { path: 'bokeh.blue', label: 'Blue bokeh color' },
        { path: 'bokeh.size', label: 'Bokeh size' },
        { path: 'bokeh.blur', label: 'Bokeh softness', hint: 'Blur in pixels' },
        { path: 'bokeh.opacity', label: 'Bokeh strength' },
        {
          path: 'bokeh.parallax',
          label: 'Bokeh parallax',
          hint: 'How much the lights move with the camera, 0 holds them still',
        },
        { path: 'bokeh.drift', label: 'Bokeh drift', hint: 'Slow float of the lights, 0 stops it' },
        { path: 'bokeh.seed', label: 'Bokeh layout', hint: 'Shuffles where the lights sit' },
      ],
    },
  ],
  hidden: [
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
