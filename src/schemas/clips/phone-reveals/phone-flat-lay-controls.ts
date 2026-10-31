import { defineControls } from '../../control-layout';
import { LOOK, MOTION, STAGE } from '../../control-presets';
import type { PhoneFlatLayProps } from './phone-flat-lay';

export const phoneFlatLayControls = defineControls<PhoneFlatLayProps>({
  sections: [
    {
      title: 'Phone',
      fields: [
        { path: 'phone.screen', label: 'Screen' },
        { path: 'phone.finish', label: 'Phone finish' },
        { path: 'scale', label: 'Phone size' },
      ],
      more: [
        {
          path: 'phone.customScreen',
          label: 'Custom screen image',
          hint: 'Replaces the built-in screen; leave empty to use the screen above',
        },
        {
          path: 'phoneTurn',
          label: 'Phone rotation',
          hint: 'Spins the phone flat on the ribbons, in radians',
        },
        { path: 'position.x', label: 'Phone left and right', hint: 'Along the ribbons' },
        { path: 'position.y', label: 'Phone up and down', hint: 'Across the ribbons' },
        {
          path: 'position.z',
          label: 'Phone lift',
          hint: 'Raises the phone off the ribbons; negative sinks it into them',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'surface.color',
          label: 'Primary color',
          hint: 'The wavy clay ribbons under the phone',
        },
        {
          link: ['look.background', 'look.backgroundEdge'],
          label: 'Background color',
          hint: 'Center and corners together, seen where the ribbons leave gaps or are hidden. A dark color also switches to darker studio lighting',
        },
        {
          link: ['look.paperLine', 'look.accent'],
          label: 'Accent color',
          hint: 'Paper pattern lines and the paper margin line, seen where the ribbons leave gaps. Shows only when the paper pattern or margin line is on',
        },
      ],
      more: [
        {
          ...LOOK.background,
          label: 'Background center',
          hint: 'A dark color also switches to darker studio lighting',
        },
        LOOK.backgroundEdge,
        LOOK.paperLine,
        { ...LOOK.accent, label: 'Margin line color', hint: 'Shows when Paper margin line is on' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.tiltFrom',
          label: 'Starting tilt',
          hint: 'How oblique the view starts, in radians; 0 is straight top-down',
        },
        {
          path: 'camera.tiltTo',
          label: 'Ending tilt',
          hint: 'Where the tilt lands, in radians; 0 is straight top-down',
        },
      ],
      more: [
        {
          path: 'camera.turnFrom',
          label: 'Starting turn',
          hint: 'Spins the phone and ribbons flat in the frame at the start, in radians',
        },
        { path: 'camera.turnTo', label: 'Ending turn', hint: 'Where the spin lands, in radians' },
        {
          path: 'camera.frames',
          label: 'Camera move length',
          hint: 'In frames. Longer than the clip leaves the move still settling at the end',
        },
        {
          path: 'camera.delay',
          label: 'Camera move starts at',
          hint: 'Frame number at normal speed; holds the starting angle until then',
        },
        {
          path: 'camera.ease',
          label: 'Camera move easing',
          hint: 'Settle starts fast and lands softly, Smooth eases in and out, Linear keeps a constant speed',
        },
        STAGE.cameraDistance,
        STAGE.fieldOfView,
        { ...STAGE.cameraDrift, hint: 'Slow handheld-style wander' },
      ],
    },
    {
      title: 'Ribbons',
      fields: [
        {
          path: 'surface.show',
          label: 'Show ribbons',
          hint: 'Off leaves the phone floating over the background',
        },
        { path: 'surface.amplitude', label: 'Wave height' },
      ],
      more: [
        { path: 'surface.count', label: 'Number of ribbons' },
        { path: 'surface.waves', label: 'Waves per ribbon', hint: 'Wave cycles along each ribbon' },
        {
          path: 'surface.curl',
          label: 'Side curl',
          hint: 'How far each ribbon sways side to side along its length',
        },
        {
          path: 'surface.angle',
          label: 'Ribbon angle',
          hint: 'Rotates the ribbon field under the phone, in radians',
        },
        {
          path: 'surface.width',
          label: 'Ribbon width',
          hint: 'Also sets the spacing between ribbons',
        },
        { path: 'surface.length', label: 'Ribbon length' },
        { path: 'surface.thickness', label: 'Ribbon thickness' },
        {
          path: 'surface.step',
          label: 'Alternate ribbon height',
          hint: 'Extra thickness on every other ribbon, which staggers the field',
        },
        { path: 'surface.roughness', label: 'Ribbon finish', hint: 'Higher is more matte' },
      ],
    },
    {
      title: 'Lighting',
      fields: [STAGE.keyLight],
      more: [
        { ...STAGE.reflections, hint: 'Studio reflections on the phone and ribbons' },
        { ...STAGE.shadowSoftness, hint: 'Blur of the shadows the phone and ribbons cast' },
        { path: 'camera.lightX', label: 'Key light left to right' },
        { path: 'camera.lightY', label: 'Key light height' },
        {
          path: 'camera.lightZ',
          label: 'Key light distance',
          hint: 'Higher sits nearer the camera',
        },
      ],
    },
    {
      title: 'Background',
      fields: [LOOK.showBackdrop],
      more: [
        { ...LOOK.grain, hint: 'Sits behind the ribbons, so it shows only where they leave gaps' },
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
          hint: 'Scales the camera move and its start frame. Camera drift, entrance and exit keep their pace',
        },
        MOTION.enterFrames,
        MOTION.exitFrames,
      ],
    },
  ],
  hidden: ['look.ink', 'look.muted', 'motion.float', 'stage.shadow'],
});
