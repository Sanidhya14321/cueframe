import { defineControls } from '../../control-layout';
import { LOOK, MOTION } from '../../control-presets';
import type { KeyboardTypingCtaProps } from './keyboard-typing-cta';

export const keyboardTypingCtaControls = defineControls<KeyboardTypingCtaProps>({
  sections: [
    {
      title: 'Text',
      fields: [
        { path: 'copy.typed', label: 'Typed message' },
        { path: 'copy.headline', label: 'End card headline' },
        { path: 'copy.button', label: 'Button text' },
      ],
      more: [
        { path: 'copy.brand', label: 'Brand name' },
        {
          path: 'copy.watermark',
          label: 'Watermark',
          hint: 'Small line near the bottom of the typing scene; leave empty to hide it',
        },
        {
          path: 'copy.placeholder',
          label: 'Empty field placeholder',
          hint: 'Shown in the message bar before the first key press; leave empty to hide it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: [
            'keyboard.accent',
            'keyboard.enter',
            'endCard.accent',
            'endCard.button',
            'endCard.mark',
          ],
          label: 'Primary color',
          hint: 'Send button, Enter key, caret, key press glow, the end card button, logo tile and headline caret',
        },
        {
          link: ['endCard.background', 'endCard.buttonInk'],
          label: 'Secondary color',
          hint: 'End card backdrop and the button text and arrow',
        },
        {
          link: ['keyboard.ink', 'keyboard.fieldColor'],
          label: 'Text color',
          hint: 'Key labels, keyboard icons and the typed message',
        },
        {
          link: ['keyboard.panel', 'keyboard.key', 'keyboard.popup', 'keyboard.pill'],
          label: 'Surface color',
          hint: 'Keyboard panel, keys, key popups and message bar',
        },
        {
          link: ['wall.color', 'wall.edge'],
          label: 'Background color',
          hint: 'The wall behind the hands, light and edge together',
        },
      ],
      more: [
        {
          path: 'keyboard.accent',
          label: 'Highlight color',
          hint: 'Send button, caret, active shift, key popup underline and key press glow',
        },
        { path: 'keyboard.enter', label: 'Enter key color' },
        { path: 'endCard.button', label: 'Button color' },
        { path: 'endCard.mark', label: 'Logo tile color' },
        { path: 'endCard.accent', label: 'Headline caret color' },
        { path: 'endCard.background', label: 'End card background' },
        {
          path: 'endCard.buttonInk',
          label: 'Button text color',
          hint: 'Also the button arrow',
        },
        { path: 'keyboard.ink', label: 'Key label color', hint: 'Also the keyboard icons' },
        { path: 'keyboard.fieldColor', label: 'Message text color' },
        { path: 'keyboard.panel', label: 'Panel color' },
        { path: 'keyboard.key', label: 'Key color' },
        { path: 'keyboard.popup', label: 'Key popup color' },
        { path: 'keyboard.pill', label: 'Message bar color' },
        { path: 'wall.color', label: 'Wall color' },
        {
          path: 'wall.edge',
          label: 'Wall edge color',
          hint: 'Color the wall darkens to away from the top right',
        },
      ],
    },
    {
      title: 'Typing',
      fields: [
        {
          path: 'timing.typeEnd',
          label: 'Typing ends by',
          hint: 'Frame number; longer messages type faster to fit',
        },
      ],
      more: [
        { path: 'timing.typeStart', label: 'Typing starts at', hint: 'Frame number' },
        {
          path: 'timing.maxKeyFrames',
          label: 'Max frames per key',
          hint: 'Caps the gap between key presses, so short messages finish early instead of stretching to the end frame',
        },
        {
          path: 'timing.submit',
          label: 'Tap send at the end',
          hint: 'Presses Enter after the message, which sends it off the bar',
        },
        {
          path: 'timing.rhythm',
          label: 'Rhythm variation',
          hint: 'Randomness in the gap between key presses',
        },
        {
          path: 'timing.wordPause',
          label: 'Pause between words',
          hint: 'Stretches the gap around each space',
        },
        {
          path: 'timing.switchPause',
          label: 'Pause after shift or symbols',
          hint: 'Stretches the gap after switching layers',
        },
        {
          path: 'timing.cursorAt',
          label: 'Message bar appears at',
          hint: 'Frame number; the bar slides in just before and the caret starts blinking here',
        },
        {
          path: 'keyboard.popupFrames',
          label: 'Key glow length',
          hint: 'Frames the key popup and glow take to fade after each press',
        },
        {
          path: 'keyboard.swapFrames',
          label: 'Layer switch length',
          hint: 'Frames to crossfade between letters, symbols and capitals',
        },
      ],
    },
    {
      title: 'Keyboard',
      fields: [{ path: 'keyboard.scale', label: 'Keyboard size' }],
      more: [
        { path: 'keyboard.panelOpacity', label: 'Panel opacity' },
        { path: 'keyboard.keyOpacity', label: 'Key opacity' },
        {
          path: 'keyboard.hint',
          label: 'Muted color',
          hint: 'Placeholder, bottom row icons, key edges and dividers',
        },
        {
          path: 'keyboard.iconInk',
          label: 'Arrow icon color',
          hint: 'Arrows on the send button and the Enter key',
        },
        { path: 'keyboard.labelSize', label: 'Key label size' },
        {
          path: 'keyboard.softness',
          label: 'Keyboard blur',
          hint: 'Softens the whole keyboard; 0 is sharp',
        },
        { path: 'keyboard.x', label: 'Horizontal offset', hint: 'In pixels' },
        {
          path: 'keyboard.y',
          label: 'Vertical position',
          hint: 'Top edge of the keyboard, in pixels',
        },
        {
          path: 'keyboard.rise',
          label: 'Rise distance',
          hint: 'Pixels the keyboard slides up while it fades in',
        },
        { path: 'keyboard.pillOpacity', label: 'Message bar opacity' },
        { path: 'keyboard.fieldSize', label: 'Message text size' },
        {
          path: 'keyboard.fieldY',
          label: 'Message bar position',
          hint: 'Vertical center, in pixels',
        },
      ],
    },
    {
      title: 'Hands',
      fields: [{ path: 'hand.show', label: 'Show hands' }],
      more: [
        {
          path: 'hand.twoHands',
          label: 'Use two hands',
          hint: 'Off types everything with the right hand',
        },
        { path: 'hand.skin', label: 'Skin tone' },
        { path: 'hand.size', label: 'Hand size' },
        {
          path: 'hand.bracelet',
          label: 'Bracelet color',
          hint: 'Beaded bracelet on the right wrist',
        },
        {
          path: 'hand.depth',
          label: 'Distance from the screen',
          hint: 'Higher brings the hands toward the camera, so they look larger and their shadow falls farther away',
        },
        {
          path: 'hand.reach',
          label: 'Reach into the screen',
          hint: 'Higher points the fingers further into the screen',
        },
        { path: 'hand.lean', label: 'Tilt', hint: 'Rotates each hand around its fingertip' },
        {
          path: 'hand.follow',
          label: 'Lean toward keys',
          hint: 'How much the hand tilts as it reaches across the keyboard',
        },
        {
          path: 'hand.press',
          label: 'Press depth',
          hint: 'How far the hand dips on each key press',
        },
        {
          path: 'hand.tap',
          label: 'Finger tap',
          hint: 'How much the finger curls on each key press',
        },
        {
          path: 'hand.lift',
          label: 'Lift on enter and exit',
          hint: 'Extra height while the hands arrive and leave',
        },
        { path: 'hand.shadow', label: 'Shadow strength' },
        { path: 'hand.shadowSoftness', label: 'Shadow softness' },
        {
          path: 'hand.lightX',
          label: 'Light left or right',
          hint: 'Moves the key light sideways, which shifts the hand shadows',
        },
        {
          path: 'hand.lightY',
          label: 'Light up or down',
          hint: 'Moves the key light vertically, which shifts the hand shadows',
        },
      ],
    },
    {
      title: 'End card',
      fields: [
        {
          path: 'timing.cut',
          label: 'End card starts at',
          hint: 'Frame number where the iris opens from the Enter key',
        },
      ],
      more: [
        { path: 'endCard.ink', label: 'Headline color', hint: 'Headline and brand name' },
        { path: 'endCard.buttonArrow', label: 'Show button arrow' },
        { path: 'endCard.markLeaf', label: 'Logo leaf color' },
        { path: 'endCard.pattern', label: 'Leaf pattern color' },
        { path: 'endCard.patternOpacity', label: 'Leaf pattern opacity' },
        {
          path: 'endCard.patternDrift',
          label: 'Leaf pattern drift',
          hint: 'How fast the background leaves float and turn',
        },
        {
          path: 'endCard.fadeFrom',
          label: 'Final fade color',
          hint: 'The end card fades out to this color',
        },
        { path: 'endCard.logoSize', label: 'Logo size' },
        { path: 'endCard.logoY', label: 'Logo position', hint: 'Vertical center, in pixels' },
        { path: 'endCard.headlineSize', label: 'Headline size' },
        {
          path: 'endCard.headlineY',
          label: 'Headline position',
          hint: 'Vertical center, in pixels',
        },
        { path: 'endCard.buttonWidth', label: 'Button width' },
        { path: 'endCard.buttonHeight', label: 'Button height' },
        { path: 'endCard.buttonY', label: 'Button position', hint: 'Vertical center, in pixels' },
        { path: 'endCard.buttonTextSize', label: 'Button text size' },
      ],
    },
    {
      title: 'Background',
      fields: [
        {
          ...LOOK.showBackdrop,
          hint: 'Off leaves the wall, end card fill and film grain transparent',
        },
      ],
      more: [
        { path: 'wall.showPlant', label: 'Show plant' },
        {
          path: 'wall.shadow',
          label: 'Wall shadow color',
          hint: 'Soft vertical shadow on the right of the wall',
        },
        { path: 'wall.shadowOpacity', label: 'Wall shadow strength' },
        { path: 'wall.leaf', label: 'Leaf color' },
        { path: 'wall.leafStripe', label: 'Leaf stripe color' },
        { path: 'wall.pot', label: 'Pot color' },
        { path: 'wall.plantBlur', label: 'Plant blur' },
        { path: 'wall.watermarkColor', label: 'Watermark color' },
        { path: 'wall.watermarkSize', label: 'Watermark size' },
        {
          path: 'wall.watermarkY',
          label: 'Watermark position',
          hint: 'Vertical position, in pixels',
        },
        LOOK.grain,
        LOOK.liveGrain,
      ],
    },
    {
      title: 'Timing',
      fields: [{ link: ['motion.enter', 'motion.exit'], label: 'Entrance and exit' }],
      more: [
        {
          path: 'timing.fadeOut',
          label: 'Final fade starts at',
          hint: 'Frame number',
        },
        {
          ...MOTION.speed,
          hint: 'Scales all scene timing; the clip length, entrance and exit stay the same',
        },
        { path: 'timing.keyboardIn', label: 'Keyboard appears at', hint: 'Frame number' },
        { path: 'timing.keyboardFrames', label: 'Keyboard fade-in length', hint: 'In frames' },
        { path: 'timing.handIn', label: 'Hands enter at', hint: 'Frame number' },
        {
          path: 'timing.handExit',
          label: 'Hands leave at',
          hint: 'Frame number; the watermark fades out with them',
        },
        {
          path: 'timing.irisFrames',
          label: 'Iris length',
          hint: 'Frames the circle takes to open from the Enter key',
        },
        { path: 'timing.headlineStart', label: 'Headline starts typing at', hint: 'Frame number' },
        {
          path: 'timing.headlineFramesPerChar',
          label: 'Headline frames per letter',
          hint: 'Lower types faster',
        },
        {
          path: 'timing.headlineLinePause',
          label: 'Pause between headline lines',
          hint: 'In frames',
        },
        { path: 'timing.buttonStart', label: 'Button text starts at', hint: 'Frame number' },
        {
          path: 'timing.buttonStagger',
          label: 'Button letter stagger',
          hint: 'Frames between each letter rising in',
        },
        { path: 'timing.buttonFlyFrames', label: 'Button letter rise length', hint: 'In frames' },
        { path: 'timing.fadeOutFrames', label: 'Final fade length', hint: 'In frames' },
        MOTION.enter,
        MOTION.enterFrames,
        MOTION.exit,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: [
    'look.background',
    'look.backgroundEdge',
    'look.ink',
    'look.muted',
    'look.accent',
    'look.spotlight',
    'look.paper',
    'look.paperLine',
    'look.paperSpacing',
    'look.paperMargin',
    'motion.float',
  ],
});
