import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { MailinfraInboxWebProps } from './mailinfra-inbox-web';

const FRAMES =
  'In frames, at normal animation speed. Long settings are squeezed so the end card always holds';
const HIDE_EMPTY = 'Leave empty to hide it';

export const mailinfraInboxWebControls = defineControls<MailinfraInboxWebProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'Shown at the top while the envelopes land. Leave empty to hide it',
        },
        {
          path: 'counterTarget',
          label: 'Counter ends at',
          hint: 'The pill counts up to this number as the envelopes land',
        },
        { path: 'wordmark.text', label: 'Wordmark', hint: 'The gold 3D word on the end card' },
        { path: 'wordmark.tagline', label: 'Tagline', hint: `Under the wordmark. ${HIDE_EMPTY}` },
      ],
      more: [
        {
          path: 'highlight',
          label: 'Highlighted words',
          hint: 'Words from the headline shown in the accent color',
        },
        { path: 'counterSuffix', label: 'Counter label', hint: `After the number. ${HIDE_EMPTY}` },
        { path: 'counterFrom', label: 'Counter starts at' },
        { path: 'wordmark.url', label: 'Website pill', hint: `Under the tagline. ${HIDE_EMPTY}` },
        { path: 'headlineSize', label: 'Headline size', hint: 'In pixels' },
        { path: 'headlineTop', label: 'Headline from top', hint: 'In pixels' },
        { path: 'counterBottom', label: 'Counter from bottom', hint: 'In pixels' },
        { path: 'counterSize', label: 'Counter size', hint: 'In pixels; the pill grows with it' },
        { path: 'wordmark.taglineSize', label: 'Tagline size', hint: 'In pixels' },
        { path: 'wordmark.urlSize', label: 'Website pill size', hint: 'In pixels' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['inboxes.nodeColor', 'bokeh.color'],
          label: 'Primary color',
          hint: 'Inbox badges, pill outlines and the blue bokeh',
        },
        {
          link: ['inboxes.junctionColor', 'envelopes.lineColor', 'bokeh.colorAlt'],
          label: 'Secondary color',
          hint: 'Glowing web junctions, envelope outlines and the second bokeh tone',
        },
        {
          link: [
            'wordmark.face',
            'wordmark.faceTop',
            'wordmark.side',
            'spider.markColor',
            'look.accent',
          ],
          label: 'Accent color',
          hint: 'The whole 3D wordmark (face, top light and depth keep their shading), the highlighted headline words and the mark on the spider',
        },
        {
          link: ['look.ink', 'web.silkColor'],
          label: 'Text color',
          hint: 'Headline, counter, tagline and website, plus the silk threads',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Recolors the center and corners together, keeping the darker corners',
        },
      ],
      more: [
        { path: 'inboxes.nodeColor', label: 'Inbox badge color', hint: 'Also the pill outlines' },
        { ...LOOK.accent, label: 'Highlight color', hint: 'Highlighted headline words' },
        { path: 'inboxes.junctionColor', label: 'Junction glow color' },
        { path: 'inboxes.checkColor', label: 'Check mark color' },
        {
          path: 'envelopes.paperColor',
          label: 'Envelope paper color',
          hint: 'Also the fly-in streak',
        },
        { path: 'envelopes.lineColor', label: 'Envelope outline color' },
        { path: 'web.silkColor', label: 'Silk color', hint: 'Also the rim light on the spider' },
        { path: 'web.dewColor', label: 'Dew glint color' },
        { ...LOOK.ink, hint: 'Headline, counter number, tagline and website' },
        { ...LOOK.muted, label: 'Counter label color' },
        { path: 'pillColor', label: 'Pill fill color', hint: 'Counter pill and website pill' },
        { path: 'wordmark.faceTop', label: 'Wordmark top light', hint: 'Top of the gold face' },
        { path: 'wordmark.face', label: 'Wordmark gold' },
        { path: 'wordmark.side', label: 'Wordmark side color', hint: 'The extruded depth' },
        { path: 'spider.color', label: 'Spider body color' },
        { path: 'spider.markColor', label: 'Spider mark color' },
        { path: 'bokeh.color', label: 'Bokeh color' },
        { path: 'bokeh.colorAlt', label: 'Second bokeh color' },
        { ...LOOK.background, label: 'Background center' },
        { ...LOOK.backgroundEdge, label: 'Background corners' },
      ],
    },
    {
      title: 'Web and spider',
      fields: [
        { path: 'web.radials', label: 'Spokes', hint: 'Threads running out from the center' },
        {
          path: 'spider.show',
          label: 'Show spider',
          hint: 'Off also hides the thread it drops on; the web still weaves itself',
        },
      ],
      more: [
        {
          path: 'web.spiralTurns',
          label: 'Spiral turns',
          hint: 'Rings of the capture spiral. Every crossing glows; only the envelopes get inbox badges',
        },
        { path: 'web.size', label: 'Web size', hint: 'Radius in pixels at normal zoom' },
        { path: 'web.frameSides', label: 'Frame corners', hint: 'Corners of the outer frame' },
        { path: 'web.wobble', label: 'Irregularity', hint: '0 makes a perfectly even web' },
        {
          path: 'web.seed',
          label: 'Web shape',
          hint: 'Pick another number for a new layout. Also reshuffles the bokeh and envelope spots',
        },
        {
          path: 'web.silkWidth',
          label: 'Silk thickness',
          hint: 'In pixels at normal zoom; threads thicken a little as the camera zooms in',
        },
        { path: 'web.dew', label: 'Dew glints', hint: '0 turns the glints off' },
        { path: 'spider.size', label: 'Spider size', hint: 'Leg span in pixels at normal zoom' },
      ],
    },
    {
      title: 'Envelopes and inboxes',
      fields: [
        {
          path: 'envelopes.count',
          label: 'Envelopes',
          hint: 'Each one sticks to a junction and gets a checked inbox badge. 0 turns them off',
        },
      ],
      more: [
        { path: 'envelopes.size', label: 'Envelope size', hint: 'In pixels at normal zoom' },
        { path: 'envelopes.stagger', label: 'Gap between envelopes', hint: FRAMES },
        { path: 'envelopes.flightFrames', label: 'Fly-in length', hint: FRAMES },
        { path: 'envelopes.streak', label: 'Speed streak', hint: '0 turns the streak off' },
        { path: 'inboxes.nodeSize', label: 'Inbox badge size', hint: 'Also the junction glows' },
        { path: 'inboxes.glow', label: 'Glow strength', hint: 'Badges, junctions and pills' },
      ],
    },
    {
      title: 'Gold wordmark',
      fields: [{ path: 'wordmark.size', label: 'Wordmark size', hint: 'In pixels' }],
      more: [
        { path: 'wordmark.depth', label: '3D depth', hint: 'In pixels. 0 makes it flat' },
        { path: 'wordmark.swing', label: 'Swing', hint: 'In degrees; it settles to still' },
        {
          path: 'wordmark.swingPeriod',
          label: 'Swing period',
          hint: 'Frames for one back-and-forth swing',
        },
        {
          path: 'wordmark.swingSettle',
          label: 'Swing settle',
          hint: 'Frames until the swing comes to rest',
        },
        {
          path: 'wordmark.shine',
          label: 'Shine',
          hint: 'A glint that sweeps across the gold face. 0 turns it off',
        },
        {
          path: 'wordmark.threadLength',
          label: 'Thread length',
          hint: 'In pixels from the web center to the wordmark',
        },
        {
          path: 'wordmark.hubY',
          label: 'Web center height',
          hint: 'Pixels from the top where the camera parks the web center on the end card',
        },
        {
          path: 'wordmark.taglineGap',
          label: 'Space under the wordmark',
          hint: 'In pixels, above the tagline',
        },
        {
          path: 'wordmark.urlGap',
          label: 'Space above the website',
          hint: 'In pixels, between the tagline and the website pill',
        },
      ],
    },
    {
      title: 'Camera and timing',
      fields: [],
      more: [
        { path: 'camera.startZoom', label: 'Zoom on the drop', hint: 'While the spider drops in' },
        { path: 'camera.webZoom', label: 'Zoom on the web', hint: 'Where the pull back ends' },
        {
          path: 'camera.endZoom',
          label: 'Zoom on the end card',
          hint: 'Where the whip zoom lands',
        },
        {
          path: 'camera.follow',
          label: 'Follow the spider',
          hint: 'How much the camera follows the spider as it runs down to the frame',
        },
        {
          path: 'camera.drift',
          label: 'Camera drift',
          hint: 'Slow sway while the web is on screen; it stops for the end card. 0 turns it off',
        },
        { path: 'camera.motionBlur', label: 'Motion blur', hint: '0 turns it off' },
        {
          path: 'camera.endDim',
          label: 'Web fade on the end card',
          hint: 'Dims and softens the web behind the wordmark',
        },
        { path: 'timing.dropFrames', label: 'Drop length', hint: FRAMES },
        {
          path: 'timing.weaveFrames',
          label: 'Weaving length',
          hint: `${FRAMES}. The envelopes start near its end`,
        },
        {
          path: 'timing.holdFrames',
          label: 'Hold before the zoom',
          hint: `${FRAMES}, after the last check mark`,
        },
        { path: 'timing.zoomFrames', label: 'Whip zoom length', hint: FRAMES },
      ],
    },
    {
      title: 'Background',
      fields: [{ ...LOOK.showBackdrop, hint: 'Turn off to layer the web over another clip' }],
      more: [
        { path: 'bokeh.count', label: 'Bokeh lights', hint: '0 turns them off' },
        { path: 'bokeh.opacity', label: 'Bokeh strength' },
        LOOK.spotlight,
        LOOK.grain,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperLine,
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'Drawn in the highlight color' },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
        {
          ...MOTION.speed,
          hint: 'Speeds up the whole video; the entrance and exit keep their length',
        },
      ],
    },
  ],
  hidden: ['motion.float'],
});
