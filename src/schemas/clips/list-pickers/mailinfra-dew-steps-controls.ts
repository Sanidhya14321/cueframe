import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { MailinfraDewStepsProps } from './mailinfra-dew-steps';

const PIXELS = 'In pixels';
const FRAMES = 'In frames';

export const mailinfraDewStepsControls = defineControls<MailinfraDewStepsProps>({
  sections: [
    {
      title: 'Steps',
      fields: [
        {
          path: 'steps',
          label: 'Steps',
          hint: 'One dew drop and one camera stop per step, up to 4. Stops shorten on their own so the end card still fits',
          items: {
            number: 'Number in the drop',
            title: 'Title',
            description: 'Description',
            icon: 'Icon under the number',
            extra: 'Extra detail at this stop',
            textSide: 'Text side',
          },
        },
        {
          path: 'intro.title',
          label: 'Opening title',
          hint: 'Shown under the strand while the spider walks in. Use a new line to break it',
        },
      ],
      more: [
        {
          path: 'intro.highlight',
          label: 'Highlighted title word',
          hint: 'Words from the opening title painted in the primary color. Leave empty for none',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['number.gold', 'look.accent'],
          label: 'Primary color',
          hint: 'The gold step numbers, their darker extruded sides, and the highlighted words in the title and tagline',
        },
        {
          link: ['drop.tint', 'bokeh.blue', 'endCard.markFrom'],
          label: 'Secondary color',
          hint: 'The blue tint of the dew drops, the blue background lights and the start of the logo gradient',
        },
        {
          link: ['bokeh.violet', 'endCard.markTo'],
          label: 'Accent color',
          hint: 'The violet background lights and the end of the logo gradient',
        },
        {
          link: ['look.ink', 'silk.color', 'number.iconColor'],
          label: 'Text color',
          hint: 'Titles, the wordmark, the silk strand and webs, and the icons inside the drops',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Middle and top and bottom edges of the background together',
        },
      ],
      more: [
        {
          path: 'number.gold',
          label: 'Number gold',
          hint: 'Front face of the step numbers. The extruded sides follow as a darker shade',
        },
        { ...LOOK.accent, label: 'Highlighted word color' },
        { path: 'drop.tint', label: 'Drop tint' },
        {
          path: 'drop.shine',
          label: 'Drop highlight color',
          hint: 'Highlights, sparkles and the glints on the drops and beads',
        },
        { path: 'bokeh.blue', label: 'Blue lights' },
        {
          path: 'bokeh.violet',
          label: 'Violet lights',
          hint: 'Also tints the soft glow in the middle',
        },
        { path: 'endCard.markFrom', label: 'Logo gradient start' },
        { path: 'endCard.markTo', label: 'Logo gradient end' },
        { path: 'endCard.markGlyph', label: 'Logo envelope color' },
        { ...LOOK.ink, label: 'Text color', hint: 'Titles, the wordmark and the web address' },
        {
          ...LOOK.muted,
          label: 'Description color',
          hint: 'Step descriptions and the tagline',
        },
        { path: 'silk.color', label: 'Silk color', hint: 'The strand, its beads and the webs' },
        { path: 'number.iconColor', label: 'Icon color' },
        { path: 'spider.color', label: 'Spider color' },
        { path: 'spider.sheen', label: 'Spider sheen', hint: 'The soft highlight on its back' },
        { ...LOOK.background, label: 'Background middle' },
        {
          ...LOOK.backgroundEdge,
          hint: 'Color the background fades to at the top and bottom',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        { path: 'endCard.brand', label: 'Brand name' },
        { path: 'endCard.tagline', label: 'Tagline', hint: 'Leave empty to hide it' },
        { path: 'endCard.url', label: 'Web address', hint: 'Shown in the pill at the bottom' },
      ],
      more: [
        {
          path: 'endCard.highlight',
          label: 'Highlighted tagline words',
          hint: 'Words from the tagline painted in the primary color',
        },
        { path: 'endCard.showMark', label: 'Show envelope logo' },
        { path: 'endCard.showUrl', label: 'Show web address' },
        {
          path: 'type.brandSize',
          label: 'Brand name size',
          hint: `${PIXELS}. The logo scales with it`,
        },
        { path: 'type.taglineSize', label: 'Tagline size', hint: PIXELS },
        { path: 'type.urlSize', label: 'Web address size', hint: PIXELS },
      ],
    },
    {
      title: 'Dew drops',
      fields: [
        { path: 'drop.size', label: 'Drop size', hint: 'Radius of the big drops, in pixels' },
        {
          path: 'drop.swing',
          label: 'Swing',
          hint: 'How far each drop swings, in degrees, as the camera lands on it. 0 keeps it still',
        },
      ],
      more: [
        {
          path: 'drop.clarity',
          label: 'Tint strength',
          hint: 'Higher fills the drops with more color, lower keeps them glassy',
        },
        { path: 'drop.glow', label: 'Glow around drops', hint: '0 turns the glow off' },
        {
          path: 'drop.magnify',
          label: 'Lens magnification',
          hint: 'How much the drop enlarges the number inside it',
        },
        {
          path: 'drop.neck',
          label: 'Neck length',
          hint: 'Pixels between the strand and the round part of the drop',
        },
        {
          path: 'number.size',
          label: 'Number size',
          hint: 'Height of the number as a share of the drop radius',
        },
        {
          path: 'number.depth',
          label: 'Number depth',
          hint: 'Thickness of the extruded gold, in pixels. 0 makes it flat',
        },
      ],
    },
    {
      title: 'Silk and spider',
      fields: [],
      more: [
        { path: 'intro.showSpider', label: 'Show spider' },
        {
          path: 'intro.showWeb',
          label: 'Show corner web',
          hint: 'The web in the top left of the opening',
        },
        { path: 'silk.width', label: 'Strand thickness', hint: PIXELS },
        {
          path: 'silk.height',
          label: 'Strand height',
          hint: 'Pixels from the top of the frame. The drops and step text follow it',
        },
        {
          path: 'silk.sag',
          label: 'Sag under the drops',
          hint: 'How far each drop pulls the strand down, in pixels',
        },
        {
          path: 'silk.beads',
          label: 'Dew beads',
          hint: 'How many small beads sit on the strand. 0 hides them',
        },
        {
          path: 'silk.webOpacity',
          label: 'Web visibility',
          hint: '0 hides the corner and side webs',
        },
        { path: 'silk.webSize', label: 'Web size', hint: PIXELS },
        { path: 'spider.size', label: 'Spider size' },
        {
          path: 'spider.walkTo',
          label: 'Spider stops at',
          hint: 'Where the spider ends its walk, in pixels from the left of the opening',
        },
      ],
    },
    {
      title: 'Timing and camera',
      fields: [
        {
          path: 'timing.stopFrames',
          label: 'Time at each drop',
          hint: `${FRAMES}, after the camera lands`,
        },
      ],
      more: [
        {
          path: 'timing.introFrames',
          label: 'Opening length',
          hint: `${FRAMES}, before the first whip`,
        },
        {
          path: 'timing.whipFrames',
          label: 'Whip length',
          hint: `${FRAMES}, for an average move. Longer moves get more frames so every whip runs at the same speed`,
        },
        {
          path: 'timing.pullBackFrames',
          label: 'Pull-back length',
          hint: `${FRAMES}. The end card starts about halfway through`,
        },
        {
          path: 'timing.motionBlur',
          label: 'Motion blur',
          hint: 'Sideways blur while the camera whips. 0 turns it off',
        },
        {
          path: 'timing.cameraDrift',
          label: 'Camera drift',
          hint: 'Slow, subtle wander of the camera while it rests. 0 holds it still',
        },
        {
          path: 'layout.whipDistance',
          label: 'Distance between drops',
          hint: 'Along the strand, in pixels. Every whip keeps the same speed; wider spacing makes all of them faster',
        },
        {
          ...MOTION.speed,
          hint: 'Speeds up the whole journey; the entrance and exit keep their own length',
        },
        {
          ...MOTION.float,
          label: 'Idle sway',
          hint: 'Gentle swaying of the drops while they rest',
        },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
    {
      title: 'Text layout',
      fields: [],
      more: [
        { path: 'type.titleSize', label: 'Opening title size', hint: PIXELS },
        { path: 'type.stepTitleSize', label: 'Step title size', hint: PIXELS },
        { path: 'type.descriptionSize', label: 'Description size', hint: PIXELS },
        { path: 'layout.textWidth', label: 'Step text width', hint: PIXELS },
        {
          path: 'layout.textGap',
          label: 'Gap from drop to text',
          hint: PIXELS,
        },
        {
          path: 'layout.dropInset',
          label: 'Drop distance from the edge',
          hint: 'Pixels from the frame edge to the drop center, on the side away from the text',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        { path: 'bokeh.count', label: 'Number of lights', hint: '0 hides the blurred lights' },
        { path: 'bokeh.size', label: 'Light size' },
        { path: 'bokeh.softness', label: 'Light blur', hint: PIXELS },
        { path: 'bokeh.strength', label: 'Light brightness' },
        {
          path: 'bokeh.parallax',
          label: 'Light parallax',
          hint: 'How much the lights slide with the camera. 0 stops them sliding with the camera; they still drift slowly',
        },
        { ...LOOK.spotlight, label: 'Center glow' },
        LOOK.grain,
        LOOK.liveGrain,
      ],
    },
  ],
  hidden: ['look.paper', 'look.paperLine', 'look.paperSpacing', 'look.paperMargin'],
});
