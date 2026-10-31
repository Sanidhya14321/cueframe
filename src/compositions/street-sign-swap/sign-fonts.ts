import { loadFont as loadArimo } from '@remotion/google-fonts/Arimo';
import { loadFont as loadTinos } from '@remotion/google-fonts/Tinos';

const tinos = loadTinos('normal', { weights: ['400'], subsets: ['latin'] });
const arimo = loadArimo('normal', { weights: ['700'], subsets: ['latin'] });

export const serifFont = tinos.fontFamily;
export const sansFont = arimo.fontFamily;

let ready = false;
let loading: Promise<void> | undefined;

const loadSignFonts = (): Promise<void> => {
  loading ??= Promise.all([tinos.waitUntilDone(), arimo.waitUntilDone()])
    .then(() =>
      Promise.all([
        document.fonts.load(`400 60px "${serifFont}"`),
        document.fonts.load(`700 60px "${sansFont}"`),
      ]),
    )
    .catch(() => undefined)
    .then(() => {
      ready = true;
    });
  return loading;
};

export const useSignFonts = (): void => {
  if (!ready) {
    throw loadSignFonts();
  }
};
