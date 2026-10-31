import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { MessageAriseProps } from './message-arise';

export const messageAriseControls = defineControls<MessageAriseProps>({
  sections: [
    {
      title: 'Messages',
      fields: [
        {
          path: 'messages',
          label: 'Notifications',
          hint: 'Each one rises out of the screen in order',
          items: { sender: 'Sender', text: 'Message', time: 'Time label' },
        },
      ],
      more: [
        { path: 'card.appName', label: 'App name' },
        {
          path: 'card.showHeader',
          label: 'Show app header',
          hint: 'App icon, app name and time label across the top of each card',
        },
        { path: 'card.showSender', label: 'Show sender name' },
        {
          path: 'card.maxLines',
          label: 'Max message lines',
          hint: 'Longer messages are cut off with an ellipsis',
        },
        { path: 'card.textAlign', label: 'Message alignment', hint: 'Sender name and message' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['look.accent', 'card.icon'],
          label: 'Primary color',
          hint: 'Highlighted headline words, the rule beside the eyebrow and the app icon on each card',
        },
        {
          link: ['look.ink', 'card.text'],
          label: 'Text color',
          hint: 'The headline and the sender and message text on the cards',
        },
        {
          link: ['look.muted', 'card.muted'],
          label: 'Secondary color',
          hint: 'The eyebrow label, the app name and time label, and the card outline',
        },
        { path: 'card.fill', label: 'Surface color', hint: 'The notification cards' },
        {
          link: ['surface.color', 'look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'The table, the haze it fades into and the backdrop behind it. A dark color also switches the studio lighting to its dark setup',
        },
      ],
      more: [
        {
          ...LOOK.accent,
          label: 'Highlight color',
          hint: 'Highlighted words, the rule beside the eyebrow and the paper margin line',
        },
        { path: 'card.icon', label: 'App icon color' },
        { ...LOOK.ink, label: 'Headline color' },
        { path: 'card.text', label: 'Card text color', hint: 'Sender name and message' },
        { ...LOOK.muted, label: 'Eyebrow color' },
        {
          path: 'card.muted',
          label: 'Card secondary text color',
          hint: 'App name, time label and card outline',
        },
        { path: 'surface.color', label: 'Table color' },
        {
          ...LOOK.background,
          hint: 'The far table fades into this color; it fills the frame when the table is hidden. A dark color also switches the studio lighting to its dark setup',
        },
        {
          ...LOOK.backgroundEdge,
          hint: 'Color the background fades to at the corners. Only visible when the table is hidden',
        },
        { ...LOOK.paperLine, hint: 'Only visible when the table is hidden' },
      ],
    },
    {
      title: 'Rise',
      fields: [
        { path: 'stack.stagger', label: 'Time between messages', hint: 'In frames' },
        {
          link: ['stack.riseFrames', 'stack.pushFrames'],
          label: 'Arrival length',
          hint: 'Frames each card takes to rise while the older cards push up',
        },
      ],
      more: [
        {
          path: 'stack.maxVisible',
          label: 'Cards kept on screen',
          hint: 'Older cards fade out once this many are stacked',
        },
        { path: 'stack.delay', label: 'First message at', hint: 'Frame number' },
        { path: 'stack.easing', label: 'Arrival easing' },
        { path: 'stack.riseFrames', label: 'Rise length', hint: 'In frames' },
        {
          path: 'stack.pushFrames',
          label: 'Push-up length',
          hint: 'Frames older cards take to make room for a new one',
        },
        {
          path: 'stack.lift',
          label: 'Height above the phone',
          hint: 'Gap between the screen and the newest card',
        },
        { path: 'stack.gap', label: 'Gap between cards' },
        {
          path: 'stack.growFrom',
          label: 'Start scale',
          hint: 'Cards grow from this size to full size as they rise',
        },
        {
          path: 'stack.fadeShare',
          label: 'Fade-in amount',
          hint: 'How much of a card must emerge before it is fully opaque; 0 shows it solid at once',
        },
        {
          path: 'stack.feather',
          label: 'Screen edge softness',
          hint: 'Softens the line where cards emerge from the screen',
        },
        { path: 'stack.sway', label: 'Card sway', hint: 'Gentle rocking of each card' },
        {
          path: 'stack.offsetX',
          label: 'Stack side offset',
          hint: 'Shifts the stack left or right of the phone',
        },
      ],
    },
    {
      title: 'Cards',
      fields: [],
      more: [
        { path: 'card.width', label: 'Card width' },
        {
          path: 'card.fontScale',
          label: 'Text size',
          hint: 'Scales the app header, sender and message together, so cards grow taller',
        },
        { path: 'card.fillOpacity', label: 'Card opacity' },
        { path: 'card.radius', label: 'Corner roundness' },
        { path: 'card.padding', label: 'Inner padding' },
        { path: 'card.border', label: 'Outline strength' },
        { path: 'card.shadow', label: 'Card shadow' },
        {
          path: 'card.facing',
          label: 'Turn toward camera',
          hint: 'At 1 cards face the camera, at 0 they stand straight up from the phone',
        },
      ],
    },
    {
      title: 'Headline',
      fields: [
        { path: 'headline.show', label: 'Show headline' },
        { path: 'headline.text', label: 'Headline' },
      ],
      more: [
        {
          path: 'headline.highlight',
          label: 'Highlighted words',
          hint: 'Words from the headline drawn in the highlight color',
        },
        {
          path: 'headline.eyebrow',
          label: 'Eyebrow label',
          hint: 'Small caps line above the headline; leave empty to hide it',
        },
        { path: 'headline.size', label: 'Headline size', hint: 'In pixels' },
        { path: 'headline.weight', label: 'Font weight' },
        { path: 'headline.textAlign', label: 'Text alignment' },
        { path: 'headline.start', label: 'Headline appears at', hint: 'Frame number' },
        { path: 'headline.placement.horizontal', label: 'Horizontal align' },
        { path: 'headline.placement.vertical', label: 'Vertical align' },
        { path: 'headline.placement.width', label: 'Text box width' },
        { path: 'headline.placement.insetX', label: 'Side margin' },
        { path: 'headline.placement.insetY', label: 'Top and bottom margin' },
      ],
    },
    {
      title: 'Phone',
      fields: [{ path: 'phone.screen', label: 'Screen' }],
      more: [
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the built-in screen when set',
        },
        { path: 'phone.finish', label: 'Phone color' },
        { path: 'device.scale', label: 'Phone size' },
        {
          path: 'device.x',
          label: 'Phone left or right',
          hint: 'The message stack follows the phone',
        },
        { path: 'device.z', label: 'Phone forward or back' },
        { path: 'device.turn', label: 'Phone rotation', hint: 'Spins the phone flat on the table' },
        {
          path: 'device.screenDim',
          label: 'Screen brightness',
          hint: 'Resting brightness of the screen between messages',
        },
        {
          path: 'device.screenPulse',
          label: 'Screen flash',
          hint: 'How much the screen lights up as each message arrives',
        },
        { path: 'device.pulseFrames', label: 'Screen flash fade', hint: 'In frames' },
        STAGE.reflections,
      ],
    },
    {
      title: 'Camera',
      fields: [],
      more: [
        {
          path: 'camera.elevationFrom',
          label: 'Start camera height',
          hint: 'Angle above the table; higher looks down from overhead',
        },
        { path: 'camera.elevationTo', label: 'End camera height' },
        STAGE.cameraDistance,
        {
          path: 'camera.orbitFrom',
          label: 'Start camera swing',
          hint: 'Swings the view around the phone to the left or right',
        },
        { path: 'camera.orbitTo', label: 'End camera swing' },
        { path: 'camera.frames', label: 'Camera move length', hint: 'In frames' },
        { path: 'camera.aimX', label: 'Aim left or right' },
        { path: 'camera.aimY', label: 'Aim height' },
        STAGE.fieldOfView,
        { ...STAGE.cameraDrift, hint: 'Slow handheld wander on top of the camera move' },
        STAGE.keyLight,
        { path: 'camera.lightX', label: 'Key light left or right' },
        { path: 'camera.lightY', label: 'Key light height' },
        { path: 'camera.lightZ', label: 'Key light front or back' },
      ],
    },
    {
      title: 'Table and background',
      fields: [{ path: 'surface.show', label: 'Show table' }],
      more: [
        {
          ...LOOK.showBackdrop,
          hint: 'Only visible when the table is hidden; off leaves the background transparent',
        },
        STAGE.shadow,
        STAGE.shadowSoftness,
        { path: 'surface.texture', label: 'Table texture', hint: 'Image tiled across the table' },
        { path: 'surface.textureRepeat', label: 'Texture tiling' },
        { path: 'surface.roughness', label: 'Table roughness', hint: 'Lower is glossier' },
        {
          path: 'surface.haze',
          label: 'Distance haze',
          hint: 'Fades the far table into the background color',
        },
        {
          path: 'surface.curve',
          label: 'Back wall curve',
          hint: 'Radius where the table bends up into the wall',
        },
        {
          path: 'surface.depth',
          label: 'Table depth',
          hint: 'Distance before the table curves up',
        },
        { ...LOOK.spotlight, hint: 'Only visible when the table is hidden' },
        { ...LOOK.grain, hint: 'Only visible when the table is hidden' },
        LOOK.liveGrain,
        { ...LOOK.paper, hint: 'Ruled or grid lines. Only visible when the table is hidden' },
        LOOK.paperSpacing,
        { ...LOOK.paperMargin, hint: 'Drawn in the highlight color' },
      ],
    },
    {
      title: 'Motion',
      fields: [MOTION.enter, MOTION.exit],
      more: [
        MOTION.speed,
        MOTION.enterFrames,
        MOTION.exitFrames,
        { ...MOTION.float, hint: 'Gentle bob of the message stack' },
      ],
    },
  ],
});
