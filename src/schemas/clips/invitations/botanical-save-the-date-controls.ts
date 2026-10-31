import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { BotanicalSaveTheDateProps } from './botanical-save-the-date';

const ROWS = 'One line per row. Rows alternate: spaced capitals, then script';
const DETAILS = 'One line per row, typed in under the event name';
const STARTS = 'Frame number. The part before it erases its text and its flowers slide away first';

export const botanicalSaveTheDateControls = defineControls<BotanicalSaveTheDateProps>({
  sections: [
    {
      title: 'Couple and date',
      fields: [
        {
          path: 'partnerOne',
          label: 'First name',
          hint: 'Shown with the couple and again on the invitation',
        },
        {
          path: 'partnerTwo',
          label: 'Second name',
          hint: 'Shown with the couple and again on the invitation',
        },
        { path: 'date', label: 'Date', hint: 'Under Save the Date' },
      ],
      more: [
        { path: 'saveTop', label: 'Top big word' },
        {
          path: 'saveJoiner',
          label: 'Script word',
          hint: 'Between the big words. Leave empty to hide it',
        },
        { path: 'saveBottom', label: 'Bottom big word' },
        { path: 'coupleIntro', label: 'Line above the names' },
        { path: 'partnerJoiner', label: 'Word before the second name', hint: 'In script' },
        { path: 'lettering.saveSize', label: 'Big words size', hint: 'In pixels' },
        { path: 'lettering.saveWeight', label: 'Big words weight' },
        { path: 'lettering.saveScriptSize', label: 'Script word size', hint: 'In pixels' },
        {
          path: 'lettering.dateSize',
          label: 'Date size',
          hint: 'In pixels. Also the date on the wedding arch',
        },
        {
          path: 'lettering.nameSize',
          label: 'Names size',
          hint: 'In pixels. Long names shrink to fit the width; the script word before the second name follows it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['florals.leaf', 'frames.eucalyptus', 'frames.garland', 'frames.tropical'],
          label: 'Primary color',
          hint: 'Every leaf: the sprays, the willow sprig, the eucalyptus frame, the peony garland and the tropical leaves',
        },
        {
          link: ['florals.petal', 'frames.peony', 'frames.anthurium', 'wash.color'],
          label: 'Secondary color',
          hint: 'The petals: blossoms, peonies and lilies, and the peach watercolour wash',
        },
        {
          path: 'florals.gold',
          label: 'Accent color',
          hint: 'Gold flecks and fine lines, the gold berries, the hexagon frame and the lily centers',
        },
        {
          link: ['look.ink', 'look.muted', 'look.accent'],
          label: 'Text color',
          hint: 'All lettering; small print and script keep their own shades',
        },
        {
          link: ['look.background', 'look.backgroundEdge', 'frames.archFill'],
          label: 'Background color',
          hint: 'The blush page, its corners and the cream wedding arch',
        },
      ],
      more: [
        {
          path: 'florals.leaf',
          label: 'Spray leaves',
          hint: 'Also the willow sprig, a little paler',
        },
        { path: 'frames.eucalyptus', label: 'Eucalyptus frame leaves' },
        { path: 'frames.garland', label: 'Garland leaves', hint: 'Around the peonies' },
        { path: 'frames.tropical', label: 'Tropical leaves', hint: 'Beside the wedding arch' },
        {
          path: 'florals.petal',
          label: 'Blossom petals',
          hint: 'Also the buds on the willow sprig',
        },
        {
          path: 'florals.heart',
          label: 'Blossom centers',
          hint: 'Also the lilac buds in the peony garland',
        },
        { path: 'florals.ghost', label: 'Faded leaves', hint: 'The pale leaves behind each spray' },
        { path: 'frames.peony', label: 'Peony petals' },
        { path: 'frames.peonyHeart', label: 'Peony centers' },
        {
          path: 'frames.anthurium',
          label: 'Lily petals',
          hint: 'Their stem follows a darker shade',
        },
        { path: 'wash.color', label: 'Watercolour wash' },
        { ...LOOK.ink, label: 'Main text', hint: 'Capitals, names and event names' },
        {
          ...LOOK.muted,
          label: 'Small print',
          hint: 'Event details, family lines and the arch curve',
        },
        { ...LOOK.accent, label: 'Script text' },
        { ...LOOK.background, label: 'Page center' },
        { ...LOOK.backgroundEdge, label: 'Page corners' },
        { path: 'frames.archFill', label: 'Wedding arch' },
        { path: 'frames.archBorder', label: 'Wedding arch border' },
      ],
    },
    {
      title: 'Verses',
      fields: [
        { path: 'verseOne', label: 'Opening verse', hint: ROWS },
        { path: 'verseTwo', label: 'Second verse', hint: ROWS },
        { path: 'closing', label: 'Closing note', hint: ROWS },
      ],
      more: [
        { path: 'lettering.capsSize', label: 'Capitals size', hint: 'In pixels' },
        { path: 'lettering.scriptSize', label: 'Script size', hint: 'In pixels' },
      ],
    },
    {
      title: 'Invitation',
      fields: [],
      more: [
        { path: 'inviteLine', label: 'Opening line', hint: 'Small capitals' },
        { path: 'inviteScript', label: 'Script line' },
        { path: 'partnerOneFamily', label: 'First family line', hint: 'Under the first name' },
        { path: 'partnerTwoFamily', label: 'Second family line', hint: 'Under the second name' },
      ],
    },
    {
      title: 'Mehendi frame',
      fields: [{ path: 'mehendi.details', label: 'Mehendi details', hint: DETAILS }],
      more: [
        { path: 'mehendi.title', label: 'Event name', hint: 'Revealed by a dark typing block' },
        { path: 'mehendi.note', label: 'Last line', hint: 'Leave empty to hide it' },
      ],
    },
    {
      title: 'Hexagon frame',
      fields: [{ path: 'ring.details', label: 'Ring ceremony details', hint: DETAILS }],
      more: [
        { path: 'ring.title', label: 'Event name', hint: 'Revealed by a dark typing block' },
        { path: 'ring.note', label: 'Last line', hint: 'Leave empty to hide it' },
        { path: 'frames.lineWidth', label: 'Gold line weight', hint: 'In pixels' },
      ],
    },
    {
      title: 'Wedding arch',
      fields: [{ path: 'wedding.details', label: 'Wedding details', hint: 'One line per row' }],
      more: [
        { path: 'wedding.arcText', label: 'Curved line', hint: 'Follows the top of the arch' },
        { path: 'wedding.title', label: 'Event name' },
        { path: 'wedding.subtitle', label: 'Line under the event name' },
        { path: 'wedding.date', label: 'Date' },
        { path: 'wedding.note', label: 'Script line', hint: 'Near the bottom of the arch' },
        { path: 'lettering.weddingSize', label: 'Event name size', hint: 'In pixels' },
      ],
    },
    {
      title: 'Flowers',
      fields: [],
      more: [
        {
          path: 'florals.size',
          label: 'Flower size',
          hint: 'Scales the sprays, the sprig and the tropical leaves',
        },
        { path: 'florals.goldLines', label: 'Gold line leaves and flecks' },
        {
          path: 'florals.slide',
          label: 'Slide distance',
          hint: 'In pixels the flowers travel as they slide in and away',
        },
        {
          path: 'florals.stagger',
          label: 'Spray stagger',
          hint: 'In frames the lower spray arrives after the upper one; the upper one leaves first',
        },
        { path: 'florals.sway', label: 'Sway', hint: 'In degrees. 0 holds them still' },
        { path: 'florals.swayPeriod', label: 'Sway cycle', hint: 'In frames for one full sway' },
        {
          path: 'florals.enterFrames',
          label: 'Arrival length',
          hint: 'In frames. Also how long each frame takes to fade in',
        },
        {
          path: 'florals.exitFrames',
          label: 'Leaving length',
          hint: 'In frames. Also how long each frame takes to fade out',
        },
        { path: 'wash.show', label: 'Watercolour wash', hint: 'Behind the two opening verses' },
        { path: 'wash.opacity', label: 'Wash strength' },
        { path: 'wash.drift', label: 'Wash drift', hint: 'In pixels it drifts over both verses' },
      ],
    },
    {
      title: 'Lettering',
      fields: [],
      more: [
        { path: 'serifFont', label: 'Capitals font' },
        {
          path: 'displayFont',
          label: 'Display font',
          hint: 'Save the Date, the names and Wedding',
        },
        { path: 'scriptFont', label: 'Script font' },
        {
          path: 'lettering.tracking',
          label: 'Capitals spacing',
          hint: 'Letter spacing in em for the verses and small capitals',
        },
        {
          path: 'lettering.titleSize',
          label: 'Event name size',
          hint: 'In pixels. The names on the invitation follow it',
        },
        {
          path: 'lettering.detailSize',
          label: 'Small print size',
          hint: 'In pixels. Event details, family lines and the arch lines',
        },
        { path: 'lettering.offsetY', label: 'Move text up or down', hint: 'In pixels' },
      ],
    },
    {
      title: 'Background',
      fields: [],
      more: [
        LOOK.showBackdrop,
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        { ...LOOK.paperLine, hint: 'Ruled and grid paper only' },
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'Drawn in the script text color' },
      ],
    },
    {
      title: 'Timing',
      fields: [],
      more: [
        { path: 'timing.verseTwoAt', label: 'Second verse at', hint: STARTS },
        { path: 'timing.saveAt', label: 'Save the Date at', hint: STARTS },
        { path: 'timing.coupleAt', label: 'Couple at', hint: STARTS },
        { path: 'timing.inviteAt', label: 'Invitation at', hint: STARTS },
        { path: 'timing.mehendiAt', label: 'Mehendi at', hint: STARTS },
        { path: 'timing.ringAt', label: 'Ring ceremony at', hint: STARTS },
        { path: 'timing.weddingAt', label: 'Wedding at', hint: STARTS },
        { path: 'timing.closingAt', label: 'Closing at', hint: STARTS },
        {
          path: 'timing.typeFrames',
          label: 'Typing length',
          hint: 'In frames each line takes to type in, however long it is',
        },
        { path: 'timing.lineStagger', label: 'Line stagger', hint: 'In frames between lines' },
        {
          path: 'timing.eraseFrames',
          label: 'Erase length',
          hint: 'In frames each line takes to erase',
        },
        MOTION.speed,
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['motion.float'],
});
