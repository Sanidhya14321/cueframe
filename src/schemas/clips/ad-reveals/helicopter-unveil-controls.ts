import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { HelicopterUnveilProps } from './helicopter-unveil';

const BEHIND_IMAGE = 'Unused when a poster image is set';

export const helicopterUnveilControls = defineControls<HelicopterUnveilProps>({
  sections: [
    {
      title: 'Poster',
      fields: [
        {
          path: 'poster.image',
          label: 'Poster image',
          hint: 'Replaces the designed poster on the billboard and the final card. Leave empty to use the poster text',
        },
        {
          path: 'poster.headline',
          label: 'Headline',
          hint: 'With two or more lines, the last line uses the accent color. Three or more lines set smaller',
        },
      ],
      more: [
        { path: 'poster.eyebrow', label: 'Top line', hint: 'Shown in capitals at the top' },
        { path: 'poster.subline', label: 'Subtitle' },
        {
          path: 'poster.details',
          label: 'Details',
          hint: 'One item per line, up to four, shown side by side with dots',
        },
        { path: 'poster.footer', label: 'Footer', hint: 'Text in the dark strip along the bottom' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['cloth.color', 'helicopter.stripe'],
          label: 'Primary color',
          hint: 'The cloth and the helicopter stripe together',
        },
        {
          path: 'poster.accent',
          label: 'Accent color',
          hint: `Sun motif, last headline line and detail dots. ${BEHIND_IMAGE}`,
        },
        {
          path: 'poster.ink',
          label: 'Text color',
          hint: `Poster text, rules and the footer strip. ${BEHIND_IMAGE}`,
        },
        {
          path: 'poster.paper',
          label: 'Surface color',
          hint: `The poster paper, the inner sun bands and the footer text. ${BEHIND_IMAGE}`,
        },
        {
          link: ['sky.horizon', 'sky.haze'],
          label: 'Background color',
          hint: 'The sky near the horizon and the distant haze together',
        },
      ],
      more: [
        { path: 'cloth.color', label: 'Cloth color' },
        { path: 'helicopter.stripe', label: 'Helicopter stripe' },
        { path: 'sky.horizon', label: 'Sky horizon color' },
        {
          path: 'sky.haze',
          label: 'Haze color',
          hint: 'Distant fog and the band along the horizon',
        },
        { path: 'sky.zenith', label: 'Sky top color' },
        { path: 'poster.accentSoft', label: 'Sun outer band', hint: BEHIND_IMAGE },
        { path: 'cloth.sheen', label: 'Cloth sheen', hint: 'Soft satin highlight on the fabric' },
        { path: 'helicopter.body', label: 'Helicopter body' },
        {
          path: 'helicopter.trim',
          label: 'Helicopter underside',
          hint: 'Also tints the spinning rotors',
        },
        { path: 'helicopter.glass', label: 'Cockpit glass' },
        {
          path: 'helicopter.cables',
          label: 'Cables and lifting bar',
          hint: 'The rigging between the helicopter and the cloth',
        },
      ],
    },
    {
      title: 'Lift-off',
      fields: [
        {
          path: 'timing.liftStart',
          label: 'Lift-off frame',
          hint: 'Frame number where the helicopter starts to climb. The cables tighten 30 frames earlier',
        },
      ],
      more: [
        {
          path: 'timing.climb',
          label: 'Climb length',
          hint: 'In frames. Lower climbs away faster',
        },
        { path: 'cloth.wind', label: 'Wind strength' },
        {
          path: 'cloth.downwash',
          label: 'Rotor downwash',
          hint: 'How hard the rotor blast pushes the cloth down and outward',
        },
        { path: 'cloth.gusts', label: 'Gusts', hint: 'How much the wind varies and swirls' },
        {
          path: 'cloth.flutter',
          label: 'Flutter',
          hint: 'Ripples running through the flying cloth',
        },
        {
          path: 'cloth.weight',
          label: 'Cloth weight',
          hint: 'Heavier cloth is pushed around less by the air',
        },
        {
          path: 'cloth.softness',
          label: 'Cloth softness',
          hint: 'Higher lets the cloth bunch and crease more',
        },
        { path: 'helicopter.scale', label: 'Helicopter size' },
        { path: 'helicopter.rotorSpeed', label: 'Rotor speed' },
      ],
    },
    {
      title: 'Final card',
      fields: [
        {
          path: 'outro.showCard',
          label: 'Show final card',
          hint: 'The poster lands full screen over a blurred view of the scene',
        },
      ],
      more: [
        {
          path: 'timing.cardStart',
          label: 'Card lands at',
          hint: 'Frame number. The scene starts blurring 24 frames earlier',
        },
        { path: 'outro.cardWidth', label: 'Card width', hint: 'Share of the frame width' },
        {
          path: 'timing.cardFrames',
          label: 'Card landing length',
          hint: 'In frames. Longer makes the card fade in and settle more slowly',
        },
        { path: 'outro.blur', label: 'Background blur', hint: 'In pixels' },
        { path: 'outro.dim', label: 'Background dimming' },
        { path: 'outro.shadow', label: 'Card shadow' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.boardAngle',
          label: 'Billboard angle',
          hint: 'Turns the billboard, cloth and helicopter relative to the camera',
        },
      ],
      more: [
        { path: 'camera.distance', label: 'Camera distance' },
        {
          path: 'camera.pushIn',
          label: 'Push-in',
          hint: 'How far the camera moves in over the clip',
        },
        { path: 'camera.height', label: 'Camera height' },
        { path: 'camera.fieldOfView', label: 'Field of view', hint: 'In degrees' },
        { path: 'camera.drift', label: 'Camera drift', hint: 'Slow floating sway of the camera' },
      ],
    },
    {
      title: 'Sky and light',
      fields: [{ path: 'sky.clouds', label: 'Cloud cover' }],
      more: [
        {
          path: 'sky.sun',
          label: 'Sunlight strength',
          hint: 'Brighter sunlit surfaces and more contrast against the shade',
        },
        {
          path: 'sky.sunColor',
          label: 'Sunlight color',
          hint: 'Tints everything the sun lights directly. Shaded areas keep the ambient sky light',
        },
        {
          path: 'sky.sunSide',
          label: 'Sun side',
          hint: 'Swings the sunlight and shadows left or right. Negative lights from the left',
        },
        {
          path: 'sky.sunHeight',
          label: 'Sun height',
          hint: 'Lower casts longer, more raking shadows',
        },
        {
          path: 'sky.fog',
          label: 'Haze density',
          hint: 'Higher fades distant scenery into the haze sooner',
        },
        {
          path: 'sky.exposure',
          label: 'Exposure',
          hint: 'Brightness of the lit scene and clouds, not the sky gradient',
        },
        { path: 'sky.cloudShade', label: 'Cloud shadow color' },
        { path: 'sky.cloudDrift', label: 'Cloud drift speed' },
        {
          path: 'sky.turbidity',
          label: 'Reflected sky haziness',
          hint: 'Shapes the ambient light and reflections, not the visible sky',
        },
        {
          path: 'sky.rayleigh',
          label: 'Reflected sky blueness',
          hint: 'Shapes the ambient light and reflections, not the visible sky',
        },
      ],
    },
    {
      title: 'Surroundings',
      fields: [
        {
          path: 'ground.showRoad',
          label: 'Show highway',
          hint: 'The road, barriers, lamps and sign gantry',
        },
      ],
      more: [
        { path: 'ground.traffic', label: 'Show traffic', hint: 'Only when the highway is shown' },
        { path: 'ground.verge', label: 'Grass color' },
        { path: 'ground.road', label: 'Asphalt color' },
        {
          path: 'ground.trees',
          label: 'Tree tint',
          hint: 'Multiplies the natural leaf colors. White keeps them as they are',
        },
        { path: 'ground.skyline', label: 'City skyline color' },
        { path: 'ground.frame', label: 'Billboard frame color' },
        { path: 'ground.pole', label: 'Billboard pole color' },
      ],
    },
    {
      title: 'Motion',
      fields: [
        MOTION.enter,
        { ...MOTION.exit, hint: 'Needs an exit length above 0, which starts at 0 for this clip' },
      ],
      more: [
        MOTION.exitFrames,
        MOTION.enterFrames,
        {
          ...MOTION.speed,
          label: 'Scene speed',
          hint: 'Speeds up the lift-off, cloth and card timing. The entrance and exit keep their length',
        },
      ],
    },
  ],
  hidden: ['motion.float'],
});
