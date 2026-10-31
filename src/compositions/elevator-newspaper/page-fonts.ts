import { loadFont as loadBodoniModa } from '@remotion/google-fonts/BodoniModa';

const upright = loadBodoniModa('normal', {
  weights: ['500', '700', '800', '900'],
  subsets: ['latin'],
});
const italic = loadBodoniModa('italic', { weights: ['500'], subsets: ['latin'] });

export const serifFont = upright.fontFamily;

let ready = false;
let loading: Promise<void> | undefined;

const loadPageFonts = (): Promise<void> => {
  loading ??= Promise.all([upright.waitUntilDone(), italic.waitUntilDone()])
    .then(() =>
      Promise.all([
        document.fonts.load(`900 200px "${serifFont}"`),
        document.fonts.load(`800 80px "${serifFont}"`),
        document.fonts.load(`700 40px "${serifFont}"`),
        document.fonts.load(`500 40px "${serifFont}"`),
        document.fonts.load(`italic 500 30px "${serifFont}"`),
      ]),
    )
    .catch(() => undefined)
    .then(() => {
      ready = true;
    });
  return loading;
};

export const usePageFonts = (): void => {
  if (!ready) {
    throw loadPageFonts();
  }
};
