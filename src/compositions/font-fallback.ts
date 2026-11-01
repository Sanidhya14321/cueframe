import { staticFile } from 'remotion';

const FONT_TIMEOUT_MS = 4000;
let fontsReachable = true;
const nativeFetch = window.fetch.bind(window);

const fontSafeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input instanceof Request ? input.url : String(input);
  if (!url.startsWith('https://fonts.gstatic.com/')) {
    return nativeFetch(input, init);
  }
  const response = fontsReachable
    ? await nativeFetch(input, { ...init, signal: AbortSignal.timeout(FONT_TIMEOUT_MS) }).catch(
        () => null,
      )
    : null;
  if (response?.ok) {
    return response;
  }
  fontsReachable = false;
  return nativeFetch(staticFile('fallback-font.woff2'));
};

window.fetch = Object.assign(fontSafeFetch, window.fetch);
