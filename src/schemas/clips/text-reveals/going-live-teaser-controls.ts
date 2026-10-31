import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { GoingLiveTeaserProps } from './going-live-teaser';

const FRAME = 'Frame number';
const ORIGIN_X = 'Where in the word the zoom comes from: 0 is its left edge, 1 its right edge';
const ORIGIN_Y = 'Where in the word the zoom comes from: 0 is its top, 1 its bottom';
const CURVE = 'Higher values shrink fast at first, then glide in';
const GLITCH_COLOR = 'The glitch line flickers between these three and the highlight color';

export const goingLiveTeaserControls = defineControls<GoingLiveTeaserProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        {
          path: 'copy.opener',
          label: 'Opening word',
          hint: 'Zooms out of its own letters at the start',
        },
        {
          path: 'copy.glitch',
          label: 'Glitch line',
          hint: 'Flickers over the website wall, one glitch per line',
        },
        { path: 'copy.live', label: 'Light up line', hint: 'Zooms in over the rolling smoke' },
        {
          path: 'copy.stay',
          label: 'First echo title',
          hint: 'Flashes, grows, then stacks into colored echoes',
        },
        { path: 'copy.launch', label: 'Second echo title', hint: 'Same echo effect, second time' },
      ],
      more: [
        {
          path: 'copy.liveAccent',
          label: 'Highlighted word',
          hint: 'One word of the light up line, spelled exactly as written there, drawn in the highlight color',
        },
        { path: 'copy.bridge', label: 'Bridge word', hint: 'Shown after the glitch line' },
        { path: 'copy.approach', label: 'Approach line', hint: 'Shown over the stats wall' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.accent', 'wall.bokeh'],
          label: 'Primary color',
          hint: 'Highlighted words, tagline highlight, echo titles, glitch, wall ribbons, stat numbers and the bokeh lights',
        },
        {
          link: ['look.echoTint', 'look.flash', 'look.underline', 'wall.rim'],
          label: 'Secondary color',
          hint: 'Alternate echo layers, the flash behind the echo titles, the tagline underline and the lines and edge glow on both walls',
        },
        {
          link: ['look.ink', 'look.logo', 'wall.ink', 'look.muted'],
          label: 'Text color',
          hint: 'Headline words, URL, tagline, the front echo layer, the logo, the wall copy and the contact rows',
        },
        {
          link: ['wall.panel', 'look.glow', 'look.smoke'],
          label: 'Surface color',
          hint: 'The top of the website and stats walls, the background glow and the smoke under the light up line',
        },
        {
          link: ['look.background', 'wall.panelEdge', 'look.shadow', 'look.flashInk'],
          label: 'Background color',
          hint: 'The background, the bottom of both walls, the echo shadow and the text on the flash',
        },
      ],
      more: [
        LOOK.showBackdrop,
        { ...LOOK.accent, label: 'Highlight color' },
        { path: 'wall.bokeh', label: 'Bokeh color' },
        { path: 'look.echoTint', label: 'Echo layer tint' },
        { path: 'look.flash', label: 'Flash color' },
        { path: 'look.underline', label: 'Tagline underline color' },
        { path: 'wall.rim', label: 'Wall line and glow color' },
        { ...LOOK.ink, label: 'Headline color' },
        { path: 'look.logo', label: 'Logo color' },
        { path: 'wall.ink', label: 'Wall text color' },
        { path: 'look.muted', label: 'Contact text color' },
        { path: 'wall.panel', label: 'Wall top color', hint: 'Both walls fade from this color' },
        { path: 'look.glow', label: 'Background glow' },
        { path: 'look.smoke', label: 'Smoke color' },
        { ...LOOK.background, hint: 'Shown when the background is on' },
        { path: 'wall.panelEdge', label: 'Wall bottom color' },
        { path: 'look.shadow', label: 'Echo shadow color' },
        { path: 'look.flashInk', label: 'Text color on flash' },
        {
          path: 'wall.beam',
          label: 'Light sweep color',
          hint: 'The bright bands of light that sweep across the website wall',
        },
        { path: 'look.glowStrength', label: 'Glow strength' },
        { path: 'glitch.colorA', label: 'Glitch color 1', hint: GLITCH_COLOR },
        { path: 'glitch.colorB', label: 'Glitch color 2', hint: GLITCH_COLOR },
        { path: 'glitch.colorC', label: 'Glitch color 3', hint: GLITCH_COLOR },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          link: ['copy.url', 'copy.website'],
          label: 'Website address',
          hint: 'The blurred-in URL and the website contact row',
        },
        { path: 'copy.tagline', label: 'Tagline' },
      ],
      more: [
        {
          path: 'copy.taglineAccent',
          label: 'Tagline highlight',
          hint: 'Follows the tagline in the highlight color, then gets underlined',
        },
        { path: 'copy.phone', label: 'Phone' },
        { path: 'copy.email', label: 'Email' },
        {
          path: 'logo.show',
          label: 'Show logo',
          hint: 'The arched monogram that draws itself above the tagline',
        },
        { path: 'copy.url', label: 'URL reveal text' },
        { path: 'copy.website', label: 'Website contact row' },
        {
          path: 'copy.showContacts',
          label: 'Show contact rows',
          hint: 'The website, phone and email rows under the tagline',
        },
        {
          path: 'endCard.taglineY',
          label: 'Tagline position',
          hint: 'Vertical center, in pixels from the top',
        },
        {
          path: 'endCard.contactsY',
          label: 'Contact rows position',
          hint: 'Vertical center of the website row in pixels from the top; phone and email sit below it',
        },
        { path: 'logo.scale', label: 'Logo size' },
        { path: 'logo.y', label: 'Logo position', hint: 'Vertical center, in pixels from the top' },
        { path: 'logo.stroke', label: 'Logo stroke width', hint: 'In pixels' },
        { path: 'type.urlSize', label: 'URL size' },
        { path: 'type.taglineSize', label: 'Tagline size' },
        { path: 'type.taglineTracking', label: 'Tagline letter spacing' },
        { path: 'type.contactSize', label: 'Contact text size' },
      ],
    },
    {
      title: 'Walls',
      fields: [],
      more: [
        {
          path: 'wall.headline',
          label: 'Wall headline',
          hint: 'Website copy the light sweeps across behind the glitch line; the second line uses the highlight color',
        },
        {
          path: 'wall.stats',
          label: 'Stat numbers',
          hint: 'Comma separated, shown on the stats wall behind the approach line',
        },
        { path: 'wall.statLabels', label: 'Stat labels', hint: 'Comma separated, one per stat' },
        {
          path: 'wall.body',
          label: 'Wall body text',
          hint: 'Small copy on both walls; on the stats wall its first line uses the highlight color',
        },
        { path: 'wall.coneSize', label: 'Light cone size' },
        { path: 'wall.beamBrightness', label: 'Light band brightness' },
        {
          path: 'wall.scroll',
          label: 'Stats wall drift',
          hint: 'How far the stats wall scrolls, in pixels',
        },
      ],
    },
    {
      title: 'Effects',
      fields: [],
      more: [
        {
          path: 'zoom.fromScale',
          label: 'Zoom depth',
          hint: 'How many times larger the opening word and light up line start before they settle',
        },
        {
          path: 'echo.layers',
          label: 'Echo layers',
          hint: 'Copies stacked in the echo titles, rounded to an even number',
        },
        { path: 'smoke.puffs', label: 'Smoke puffs', hint: '0 turns the smoke off' },
        { path: 'zoom.openerCurve', label: 'Opening zoom curve', hint: CURVE },
        { path: 'zoom.liveCurve', label: 'Light up zoom curve', hint: CURVE },
        { path: 'zoom.openerOriginX', label: 'Opening zoom point across', hint: ORIGIN_X },
        { path: 'zoom.openerOriginY', label: 'Opening zoom point down', hint: ORIGIN_Y },
        { path: 'zoom.liveOriginX', label: 'Light up zoom point across', hint: ORIGIN_X },
        { path: 'zoom.liveOriginY', label: 'Light up zoom point down', hint: ORIGIN_Y },
        {
          path: 'glitch.stepFrames',
          label: 'Glitch flicker length',
          hint: 'Frames per glitch change, lower flickers faster',
        },
        { path: 'glitch.opacity', label: 'Glitch opacity' },
        {
          path: 'glitch.slice',
          label: 'Glitch slice shift',
          hint: 'Largest sideways jump of the cut halves, in pixels',
        },
        { path: 'glitch.scanlines', label: 'Scanline spacing', hint: 'In pixels' },
        {
          path: 'echo.frontScale',
          label: 'Front echo size',
          hint: 'Scale of the front copy once the stack is built',
        },
        {
          path: 'echo.steps',
          label: 'Echo build steps',
          hint: 'How many jumps the stack takes to reach its full depth',
        },
        { path: 'echo.stepFrames', label: 'Frames per echo step', hint: 'Lower builds faster' },
        { path: 'echo.shadow', label: 'Echo shadow offset', hint: 'In em' },
        {
          path: 'smoke.spread',
          label: 'Smoke spread',
          hint: 'How far the smoke rolls out to each side, in pixels',
        },
        { path: 'smoke.height', label: 'Smoke height', hint: 'Also makes the puffs larger' },
        { path: 'smoke.opacity', label: 'Smoke opacity' },
      ],
    },
    {
      title: 'Type',
      fields: [],
      more: [
        {
          path: 'type.weight',
          label: 'Font weight',
          hint: 'Headline words, echo titles and the URL; the tagline keeps its own weight',
        },
        {
          path: 'type.wordSize',
          label: 'Word size',
          hint: 'Opening word, bridge word, approach line and light up line',
        },
        { path: 'type.stayBigSize', label: 'First echo title size' },
        { path: 'type.launchBigSize', label: 'Second echo title size' },
        {
          path: 'type.stackSize',
          label: 'Echo title intro size',
          hint: 'Size of both echo titles before they grow, including during the flash',
        },
        { path: 'type.glitchSize', label: 'Glitch line size' },
        { path: 'type.tracking', label: 'Letter spacing' },
        {
          path: 'type.lineHeight',
          label: 'Line height',
          hint: 'Spacing of the multi-line glitch and echo titles',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          ...MOTION.speed,
          hint: 'Plays every beat faster or slower. Cue frames below are at speed 1; above 1 the end card holds longer, below 1 the ending is cut off',
        },
        MOTION.enter,
      ],
      more: [
        { path: 'timing.openerStart', label: 'Opening word starts', hint: FRAME },
        { path: 'timing.openerLand', label: 'Opening word lands', hint: FRAME },
        { path: 'timing.openerFadeStart', label: 'Opening word fade starts', hint: FRAME },
        { path: 'timing.openerFadeEnd', label: 'Opening word fade ends', hint: FRAME },
        { path: 'timing.wallStart', label: 'Light sweep starts', hint: FRAME },
        { path: 'timing.wallEnd', label: 'Light sweep ends', hint: FRAME },
        { path: 'timing.glitchStart', label: 'Glitch line starts', hint: FRAME },
        { path: 'timing.glitchEnd', label: 'Glitch line ends', hint: FRAME },
        { path: 'timing.bridgeAt', label: 'Bridge word appears', hint: FRAME },
        { path: 'timing.statsIn', label: 'Stats wall fades in', hint: FRAME },
        {
          path: 'timing.approachAt',
          label: 'Approach line appears',
          hint: 'Frame number, also hides the bridge word',
        },
        { path: 'timing.approachFadeStart', label: 'Approach fade starts', hint: FRAME },
        { path: 'timing.approachFadeEnd', label: 'Approach fade ends', hint: FRAME },
        { path: 'timing.liveStart', label: 'Light up line starts', hint: FRAME },
        {
          path: 'timing.liveLand',
          label: 'Light up line lands',
          hint: 'Frame number, the smoke starts here',
        },
        { path: 'timing.smokeEnd', label: 'Smoke clears', hint: FRAME },
        { path: 'timing.liveEnd', label: 'Light up line ends', hint: FRAME },
        { path: 'timing.stayAt', label: 'First echo title starts', hint: FRAME },
        { path: 'timing.stayFlash', label: 'First title flash', hint: FRAME },
        { path: 'timing.stayBig', label: 'First title grows', hint: FRAME },
        { path: 'timing.stayEcho', label: 'First title echoes', hint: FRAME },
        {
          path: 'timing.launchAt',
          label: 'Second echo title starts',
          hint: 'Frame number, also ends the first title',
        },
        { path: 'timing.launchFlash', label: 'Second title flash', hint: FRAME },
        { path: 'timing.launchBig', label: 'Second title grows', hint: FRAME },
        { path: 'timing.launchEcho', label: 'Second title echoes', hint: FRAME },
        { path: 'timing.launchEnd', label: 'Second title ends', hint: FRAME },
        { path: 'timing.urlStart', label: 'URL starts', hint: FRAME },
        {
          path: 'timing.urlCharFrames',
          label: 'URL frames per letter',
          hint: 'Lower reveals faster',
        },
        { path: 'timing.urlFadeStart', label: 'URL fade starts', hint: FRAME },
        { path: 'timing.urlFadeEnd', label: 'URL fade ends', hint: FRAME },
        { path: 'timing.logoStart', label: 'Logo starts', hint: FRAME },
        {
          path: 'timing.logoSquare',
          label: 'Logo starts drawing',
          hint: 'Frame number, the bar is fully grown and the arch begins',
        },
        { path: 'timing.logoDrawn', label: 'Logo finished', hint: FRAME },
        { path: 'timing.taglineStart', label: 'Tagline starts', hint: FRAME },
        {
          path: 'timing.taglineCharFrames',
          label: 'Tagline frames per letter',
          hint: 'Lower reveals faster',
        },
        { path: 'timing.contactsAt', label: 'Contacts appear', hint: FRAME },
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['motion.float'],
});
