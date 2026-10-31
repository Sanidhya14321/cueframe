import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { AnniversaryKineticProps } from './anniversary-kinetic';

export const anniversaryKineticControls = defineControls<AnniversaryKineticProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'beats',
          label: 'Words',
          hint: 'Each word holds from its start frame until the next word starts. Delays and lengths count frames from the word start. Effect timing is frames per letter for typing, sweeps and track-ins, and the frame a flash cut or drop lands. Triple stack words take the chrome colors instead of the word color',
          items: {
            text: 'Word',
            start: 'Starts at frame',
            effect: 'Animation',
            backdrop: 'Background',
            color: 'Word color',
            size: 'Text size',
            weight: 'Font weight',
            tracking: 'Letter spacing',
            spread: 'Opening spread',
            zoom: 'Zoom amount',
            rate: 'Effect timing',
            ghost: 'Untyped letter opacity',
            glitch: 'Glitch length',
            glitchAt: 'Glitch delay',
            pulseAt: 'Blur pulse delay',
            pulseBlur: 'Blur pulse strength',
            decor: 'Giant outline letters',
            decorText: 'Outline text',
            decorSize: 'Outline size',
            decorX: 'Outline horizontal offset',
            decorY: 'Outline vertical offset',
            decorFillAt: 'Outline fill flash delay',
            decorFill: 'Outline fill flash length',
          },
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['logo.numberColor', 'logo.initialColor', 'look.flash'],
          label: 'Primary color',
          hint: 'Seal number, dashed ring, divider lines, first letter of the name and the flash cut fill',
        },
        {
          link: ['look.gradientFrom', 'look.gradientMid', 'look.gradientTo'],
          label: 'Secondary color',
          hint: 'Gradient words, the band edges and every third sparkle, set to one flat color',
        },
        {
          link: ['logo.ringColor', 'logo.nameColor', 'logo.taglineColor'],
          label: 'Text color',
          hint: 'Logo seal ring, suffix, caption, name, founded line and tagline',
        },
        {
          link: ['look.paper', 'logo.background'],
          label: 'Surface color',
          hint: 'Paper word backgrounds and the logo ending',
        },
        {
          link: ['look.ink', 'look.night', 'look.dusk', 'look.textureShade'],
          label: 'Background color',
          hint: 'Ink, night and dusk word backgrounds and the texture shadow together. Ink also fills around the band and after a flash cut',
        },
      ],
      more: [
        {
          path: 'logo.numberColor',
          label: 'Seal number color',
          hint: 'Also the dashed ring and divider lines',
        },
        { path: 'logo.initialColor', label: 'Name first letter color' },
        {
          path: 'look.flash',
          label: 'Flash cut color',
          hint: 'Fills the first frame of a flash cut word',
        },
        {
          path: 'look.gradientFrom',
          label: 'Gradient start',
          hint: 'Also the band top edge and every third sparkle',
        },
        { path: 'look.gradientMid', label: 'Gradient middle' },
        { path: 'look.gradientTo', label: 'Gradient end', hint: 'Also the band bottom edge' },
        { path: 'logo.ringColor', label: 'Seal ring, suffix and caption color' },
        { path: 'logo.nameColor', label: 'Name and founded line color' },
        { path: 'logo.taglineColor', label: 'Tagline color' },
        { path: 'look.paper', label: 'Paper background for words' },
        { path: 'logo.background', label: 'Logo background' },
        {
          path: 'look.ink',
          label: 'Ink background',
          hint: 'Also around the band, after a flash cut, and the sparkles on paper',
        },
        { path: 'look.night', label: 'Night background' },
        { path: 'look.dusk', label: 'Dusk background' },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'logo.number',
          label: 'Anniversary number',
          hint: 'The seal number. The matching words in the sequence are edited under Words',
        },
        { path: 'logo.name', label: 'Brand name' },
      ],
      more: [
        { path: 'logo.ordinal', label: 'Number suffix', hint: 'For example th, st or nd' },
        { path: 'logo.since', label: 'Founded line' },
        { path: 'logo.tagline', label: 'Tagline' },
        { path: 'logo.caption', label: 'Seal caption' },
        {
          path: 'logo.start',
          label: 'Logo appears at',
          hint: 'Frame number. Words starting after it never show',
        },
        { path: 'logo.size', label: 'Logo size' },
        { path: 'logo.blur', label: 'Blur-in strength', hint: 'In pixels' },
        { path: 'logo.blurFrames', label: 'Blur-in length', hint: 'In frames' },
      ],
    },
    {
      title: 'Backgrounds and band',
      fields: [
        { ...LOOK.showBackdrop, label: 'Show backgrounds' },
        {
          path: 'look.bandHeight',
          label: 'Band height',
          hint: 'Share of the frame height covered by the slanted band',
        },
      ],
      more: [
        { path: 'band.tilt', label: 'Band tilt', hint: 'In degrees' },
        { path: 'band.edge', label: 'Band edge thickness', hint: 'In pixels' },
        { path: 'look.texture', label: 'Texture highlight' },
        {
          path: 'look.textureShade',
          label: 'Texture shadow',
          hint: 'Dark base of the grain texture backgrounds and the band',
        },
        { path: 'look.textureContrast', label: 'Texture contrast' },
        {
          path: 'look.textureDrift',
          label: 'Texture drift speed',
          hint: 'How fast the grain slides across the frame',
        },
      ],
    },
    {
      title: 'Word effects',
      fields: [
        {
          path: 'look.glitchAmount',
          label: 'Glitch strength',
          hint: 'Scales every word glitch; 0 turns glitches off',
        },
      ],
      more: [
        {
          path: 'look.muted',
          label: 'Unlit letter color',
          hint: 'Letters fade from this color as they type, sweep or fill in',
        },
        {
          path: 'look.stroke',
          label: 'Giant outline color',
          hint: 'On paper backgrounds the outline uses the word color instead',
        },
        { path: 'look.strokeWidth', label: 'Giant outline width', hint: 'In pixels' },
        { path: 'look.shape', label: 'Giant outline fill flash color' },
        { path: 'look.slant', label: 'Slanted repeat color' },
        { path: 'look.dim', label: 'Word color before the cut' },
        { path: 'chrome.topStart', label: 'Chrome top line, upper color' },
        { path: 'chrome.topEnd', label: 'Chrome top line, lower color' },
        { path: 'chrome.middleStart', label: 'Chrome middle line, upper color' },
        { path: 'chrome.middleEnd', label: 'Chrome middle line, lower color' },
        { path: 'chrome.bottomStart', label: 'Chrome bottom line, upper color' },
        { path: 'chrome.bottomEnd', label: 'Chrome bottom line, lower color' },
        {
          path: 'look.drift',
          label: 'Word drift',
          hint: 'How much each word and its giant outline slowly shrink while on screen',
        },
        {
          path: 'look.glitchSeed',
          label: 'Random seed',
          hint: 'Reshuffles the glitch pattern, texture grain and sparkle positions',
        },
      ],
    },
    {
      title: 'Sparkles',
      fields: [{ path: 'look.dustCount', label: 'Sparkle count' }],
      more: [
        {
          path: 'look.dust',
          label: 'Sparkle color',
          hint: 'Every third sparkle uses the gradient start, and all of them turn ink on paper',
        },
        {
          path: 'sparkles.size',
          label: 'Sparkle size',
          hint: 'Smallest sparkle in pixels; the largest are twice this',
        },
        { path: 'sparkles.opacity', label: 'Sparkle opacity' },
        {
          path: 'sparkles.speed',
          label: 'Sparkle float speed',
          hint: 'How fast the sparkles rise and sway. 0 holds them still',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [
        {
          ...MOTION.speed,
          hint: 'Higher plays the words and logo faster; the clip length, entrance and exit stay the same',
        },
        MOTION.enter,
      ],
      more: [MOTION.exit, MOTION.enterFrames, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float'],
});
