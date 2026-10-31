import { linear } from '@/design';
import { POST_SIZE, photo, rect, STORY_SIZE, type ThemeSpec, text, themed } from '../../../kit';
import { BRAND, CO, centeredMark, HEADING, SCRIPT } from './palette';

const { width: W, height: H } = POST_SIZE;

const lettersSpec = {
  colors: {
    background: { value: CO.cobalt, hint: 'Page gradient; its darker shade ends it' },
    accent: { value: CO.lilac, hint: 'Find your flow' },
    text: { value: CO.white, hint: 'Big YO GA letters and the brand mark' },
  },
  fonts: { heading: HEADING, script: SCRIPT },
  copy: {
    letters: { label: 'Big letters', value: ['YO', 'GA'] },
    tagline: { label: 'Tagline', value: 'Find your flow' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const yogaLetters = (height: number) =>
  themed(W, height, lettersSpec, (t) => {
    const mid = height / 2;
    const [top = '', bottom = ''] = t.list('letters');
    const letters = (content: string, y: number) =>
      text(content, 0, y, W, {
        fontFamily: t.font('heading'),
        fontSize: 380,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
        letterSpacing: 140,
      });
    return [
      rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', CO.deep)), {
        name: 'Background',
      }),
      letters(top, mid - 520),
      letters(bottom, mid - 120),
      photo('woman-portrait-3', 400, mid - 440, 280, 760, { cornerRadius: 140 }),
      text(t.copy('tagline'), 650, mid - 560, 380, {
        fontFamily: t.font('script'),
        fontSize: 54,
        fontWeight: 500,
        italic: true,
        fill: t.color('accent'),
        rotation: 12,
      }),
      centeredMark(540, mid + 400, t.color('text'), t.copy('brand'), t.font('heading')),
    ];
  });

export const yogaLettersPost = yogaLetters(H);
export const yogaLettersStory = yogaLetters(STORY_SIZE.height);
