import type { FootageSpec } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const ELEVATOR =
  'a modern elevator car with dark graphite brushed-steel wall panels, a dark ceiling with small round recessed downlights, a polished steel handrail at hip height across the back wall, small glowing red LED floor displays on a dark panel on the left wall and a pale grey marble floor. ' +
  'Every wall, including the back wall behind her head and shoulders, is matte dark graphite, with no mirrors, windows or light panels, so the white paper stands out clearly against dark walls.';

const NEWSPAPER =
  'She holds a large open tabloid newspaper up in front of her face with both hands, at chest and face height, hiding her face completely; only the top of her cap shows above the paper. ' +
  'The newspaper is big: the open two-page spread is roughly square, about as tall as it is wide, and covers her from the top of her head down to her waist. ' +
  'Each page is a tall upright rectangle, much taller than it is wide. The left page is swung toward the camera and the right page faces the camera, so the two pages meet in a clear V at the vertical centre fold. ' +
  'It is one single large folded sheet with exactly two pages: no extra sheets, no loose inner pages, no folded-back or dog-eared corners, and every edge of the spread is one clean, crisp straight line. ' +
  'The paper is held taut and flat with no curl. ' +
  'Both pages are completely blank: plain matte white paper with no text, no print, no photos, no lines and no markings at all. ' +
  'Her fingertips grip the outer side edges of the pages.';

const PERSON =
  'A slim young woman in a fitted white t-shirt, black straight-leg jeans and a plain light denim-blue baseball cap with no logo stands centred inside the elevator, facing the camera.';

const BLANK =
  'The newspaper pages stay completely blank, plain matte white, with no text or print appearing on them at any time.';

const AVOID =
  'camera movement, zoom, text on the newspaper, printed pages, headlines, letters, logos, people walking, face visible, eyes visible, lowering the newspaper, raising the newspaper, turning the newspaper';

const FOLD: [string, number, string, number][] = [
  ['left', 1, 'right', 0],
  ['left', 2, 'right', 3],
];

const kling = (negativePrompt: string) => ({
  'atlas-cloud': { parameters: { negative_prompt: negativePrompt, cfg_scale: 0.7 } },
});

export const elevatorNewspaperFootage: FootageSpec = {
  id: 'elevator-newspaper',
  aspectRatio: '9:16',
  resolution: '1080p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'wide-open',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt: `Photorealistic vertical smartphone photo shot straight on from the landing outside ${ELEVATOR} The brushed stainless steel elevator doors are fully open and frame the car on both sides. ${PERSON} ${NEWSPAPER} The newspaper spread is about sixty percent of the frame wide. Her whole body is visible from cap to shoes. Soft natural light, subtle film grain, no text or logos anywhere.`,
    },
    {
      name: 'cover-photo',
      model: IMAGE_MODEL,
      aspectRatio: '3:4',
      publishWidth: 900,
      prompt:
        'Editorial jewelry campaign photograph, vertical, extreme close-up: a woman’s hand in a loose fist, knuckles toward the camera, large in the frame and filling the upper middle third, wearing a chunky wide silver pavé diamond wrap ring on the middle finger. ' +
        'A glossy dark red cherry hangs from the bottom of the fist on its stem down into the lower third. ' +
        'A deep burgundy knit sweater sleeve covers the left edge and the lower part of the frame; the rest of the background is a soft pale lilac-white wall in diffused daylight. ' +
        'Soft film tones. No text, no logos.',
    },
    {
      name: 'store-photo',
      model: IMAGE_MODEL,
      aspectRatio: '4:3',
      publishWidth: 700,
      prompt:
        'Full-bleed grainy black and white photograph, filling the whole frame edge to edge with no border, no frame and no margin: the front of a minimal new jewelry boutique, a plain white wall, a white door with a slim vertical handle on the left and a small blank white plaque on the wall to the right. ' +
        'Flat soft daylight, low contrast. No people, no text, no logos.',
    },
  ],
  shots: [
    {
      name: 'hold',
      model: VIDEO_MODEL,
      seconds: 5,
      firstFrame: 'wide-open',
      prompt:
        'Photorealistic vertical smartphone video, static locked-off tripod shot, no camera movement. ' +
        'For the first three seconds the elevator stays open and the woman stands perfectly still at the back of the car, holding the open blank newspaper up in front of her face; the paper sways very gently with her breathing. ' +
        'Then the brushed steel elevator doors slide closed from both sides at a steady pace while she keeps standing in exactly the same spot. ' +
        `She does not walk or step. She never lowers, raises or turns the paper and her face is never visible. ${BLANK}`,
      providerOptions: kling(
        `${AVOID}, walking, stepping, moving toward the camera, folded corner`,
      ),
      tracking: {
        anchors: [
          {
            frame: 0,
            quads: {
              left: [
                [303.5, 776.5],
                [542, 793],
                [542, 1162],
                [302.5, 1144.5],
              ],
              right: [
                [542, 793],
                [783, 774.5],
                [785.5, 1148.8],
                [542, 1162],
              ],
            },
          },
        ],
        shared: FOLD,
        doors: { band: [395, 425], doorway: [120, 960] },
      },
    },
  ],
  plate: [
    { shot: 'hold', from: 120, to: 66, step: 2 },
    { shot: 'hold', from: 64, to: 1 },
    { shot: 'hold', from: 0, to: 64 },
    { shot: 'hold', from: 66, to: 120, step: 2 },
  ],
};
