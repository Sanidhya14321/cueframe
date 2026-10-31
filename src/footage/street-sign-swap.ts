import type { FootageSpec } from './footage-spec';

const IMAGE_MODEL = 'google/gemini-3-pro-image';
const VIDEO_MODEL = 'kwaivgi/kling-v3.0-pro';

const STREET =
  'a rainy Paris street corner on an overcast day: a pale Haussmann stone building with tall columns and a glowing shop front, wet dark asphalt with a white zebra crosswalk, black street bollards, a few pedestrians with umbrellas and green trees further down the street. ' +
  'There are no readable signs, no shop names, no logos and no text anywhere.';

const BLANK =
  'The board stays completely blank with no text, letters or print appearing on it at any time.';

const AVOID =
  'text on the board, letters, printing, logos, signs with text, face covered, dropping the board, bending the board';

const BOARD: { rgb: [number, number, number]; reach: number } = {
  rgb: [138, 136, 94],
  reach: 0.045,
};

const kling = (negativePrompt: string) => ({
  'atlas-cloud': { parameters: { negative_prompt: negativePrompt, cfg_scale: 0.6 } },
});

export const streetSignSwapFootage: FootageSpec = {
  id: 'street-sign-swap',
  aspectRatio: '9:16',
  resolution: '1080p',
  width: 1080,
  height: 1920,
  fps: 24,
  stills: [
    {
      name: 'question',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      prompt:
        `Photorealistic vertical smartphone street photo, handheld at eye level, of ${STREET} ` +
        'A young woman with long blonde hair, an olive camouflage trucker cap, an oversized black t-shirt, baggy camouflage cargo trousers and white sneakers walks across the crosswalk from left to right. ' +
        'She holds a large stiff blank white poster board, portrait, about half her height, in front of her chest with both hands, the board facing the camera at a slight angle. ' +
        'The board is completely blank matte white with crisp straight edges. Natural overcast light, wet reflections, subtle film grain.',
    },
    {
      name: 'answer',
      model: IMAGE_MODEL,
      aspectRatio: '9:16',
      from: 'question',
      prompt:
        'Edit this photo: keep the same rainy Paris street, crosswalk, building, light and camera height, but replace the woman with a different young woman with long straight black hair, a bright kelly-green oversized football jersey, a bright green baseball cap, gold necklaces and wide grey jeans. ' +
        'She stands on the crosswalk facing the camera, holding a large stiff blank matte olive-green poster board with a thin white border around its edge, portrait, in front of her chest with both hands, the board facing the camera squarely. ' +
        'The board is completely blank apart from its thin white border, with crisp straight edges. No text, no logos anywhere.',
    },
  ],
  shots: [
    {
      name: 'handoff',
      model: VIDEO_MODEL,
      seconds: 5,
      firstFrame: 'question',
      lastFrame: 'answer',
      prompt:
        'Photorealistic vertical smartphone video, one continuous handheld shot from the same spot, the camera barely moves and never cuts. ' +
        'The blonde woman keeps walking across the wet crosswalk from left to right, holding the blank white board in front of her, and walks out of frame on the right. ' +
        'Right behind her, a second woman in a bright green football jersey and green cap walks into the frame from the right edge, fully solid and real from her first step, already holding the blank olive-green board upright in front of her chest with both hands, its face turned toward the camera the whole time. She walks to the middle of the crosswalk and stops, keeping the board flat and facing the camera; the board never tilts, swings or turns sideways. ' +
        `Pedestrians with umbrellas pass in the background. Both boards stay completely blank with no text, letters or print at any time.`,
      providerOptions: kling(
        `${AVOID}, camera cut, scene change, zoom, fading in, appearing out of thin air, ghost, transparent person, board tilted, board swinging, carrying the board at the hip`,
      ),
      tracking: {
        anchors: [
          {
            frame: 0,
            range: [0, 52],
            quads: {
              question: [
                [630.75, 823.75],
                [778.75, 863],
                [761, 1250],
                [611.5, 1247.5],
              ],
            },
          },
          {
            frame: 120,
            range: [54, 120],
            color: BOARD,
            quads: {
              answer: [
                [519, 960],
                [801, 961],
                [791, 1377],
                [515, 1378],
              ],
            },
          },
        ],
      },
    },
    {
      name: 'answer',
      model: VIDEO_MODEL,
      seconds: 5,
      firstFrame: 'answer',
      prompt:
        'Photorealistic vertical smartphone video, the camera is held perfectly steady with no shake, no jitter and no movement at all. ' +
        'The woman stands still on the crosswalk holding the blank olive-green board flat in front of her chest, facing the camera, for the whole shot; she breathes gently and glances to the side once. ' +
        `Pedestrians with umbrellas pass in the background. ${BLANK}`,
      providerOptions: kling(
        `${AVOID}, camera shake, handheld jitter, walking away, turning the board`,
      ),
      tracking: {
        anchors: [
          {
            frame: 20,
            color: BOARD,
            quads: {
              answer: [
                [519, 960],
                [801, 961],
                [791, 1377],
                [515, 1378],
              ],
            },
          },
        ],
      },
    },
  ],
  plate: [
    { shot: 'handoff', from: 0, to: 120 },
    { shot: 'answer', from: 1, to: 58, blend: 8 },
  ],
};
