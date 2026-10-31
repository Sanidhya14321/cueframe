import { defineControls } from '../../control-layout';
import { LOOK, MOTION, PLACEMENT } from '../../control-presets';
import type { ScribbleCaptionProps } from './scribble-caption';

export const scribbleCaptionControls = defineControls<ScribbleCaptionProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'text', label: 'Caption' },
        { path: 'size', label: 'Text size', hint: 'In pixels' },
      ],
      more: [
        { path: 'weight', label: 'Font weight' },
        { path: 'tracking', label: 'Letter spacing', hint: 'In em' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.ink', 'scribbleColor'],
          label: 'Primary color',
          hint: 'The caption, the scribble stroke and their glow',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners of the background together',
        },
      ],
      more: [
        { ...LOOK.ink, label: 'Caption color', hint: 'The letters and their glow only' },
        { path: 'scribbleColor', label: 'Scribble color', hint: 'The stroke and its glow only' },
        LOOK.background,
        LOOK.backgroundEdge,
        LOOK.paperLine,
        {
          path: 'look.accent',
          label: 'Margin line color',
          hint: 'Shows when the paper has a margin',
        },
      ],
    },
    {
      title: 'Scribble',
      fields: [
        { path: 'shape', label: 'Scribble shape' },
        {
          path: 'scribblePlace',
          label: 'Scribble position',
          hint: 'Through: across the caption. Under: below the line. Around: enlarged to frame the caption, best with the Circle shape',
        },
      ],
      more: [
        { path: 'scribbleWidth', label: 'Scribble width', hint: 'In pixels' },
        { path: 'strokeWidth', label: 'Line thickness', hint: 'In pixels' },
        {
          path: 'keepScribble',
          label: 'Keep scribble on screen',
          hint: 'When off, the stroke wipes away after it draws',
        },
      ],
    },
    {
      title: 'Reveal',
      fields: [
        {
          path: 'reveal',
          label: 'Caption reveal',
          hint: 'Spread: the letters fade in as they open out from the center. Type: the letters appear one by one while the extra spacing closes',
        },
        {
          path: 'scribbleAt',
          label: 'Scribble timing',
          hint: 'Start: the scribble draws first and the caption follows. End: it draws over the finished caption just before the exit and scatters the letters away',
        },
      ],
      more: [
        {
          path: 'spread',
          label: 'Spread amount',
          hint: 'Type: extra letter spacing, in em, that closes as the letters appear. Spread: how far the letters open out from the center. 0 keeps them still',
        },
        {
          path: 'glowOut',
          label: 'Glow-out',
          hint: 'A glow that builds, fades and blurs the caption as the scribble draws. 0 turns it off',
        },
        {
          path: 'typeFrames',
          label: 'Frames per letter',
          hint: 'Type reveal only. Lower types faster',
        },
        { path: 'spreadFrames', label: 'Spread length', hint: 'In frames, Spread reveal only' },
        {
          path: 'delay',
          label: 'Start delay',
          hint: 'In frames. With End timing it delays only the caption',
        },
        {
          path: 'drawFrames',
          label: 'Scribble draw length',
          hint: 'In frames. Higher draws the stroke more slowly and holds it longer before it wipes away',
        },
      ],
    },
    {
      title: 'Layout',
      fields: [PLACEMENT.horizontal, PLACEMENT.vertical],
      more: [
        {
          ...PLACEMENT.width,
          hint: 'The caption never wraps. Sets where left or right aligned text sits',
        },
        PLACEMENT.insetX,
        PLACEMENT.insetY,
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        LOOK.grain,
        LOOK.spotlight,
        LOOK.liveGrain,
        LOOK.paper,
        LOOK.paperSpacing,
        LOOK.paperMargin,
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        {
          ...MOTION.speed,
          hint: 'Scales the reveal and scribble timing. Entrance and exit keep their length',
        },
        MOTION.enterFrames,
        {
          ...MOTION.exitFrames,
          hint: 'In frames. An End scribble finishes just before the exit starts',
        },
      ],
    },
  ],
  hidden: ['look.muted', 'motion.float'],
});
