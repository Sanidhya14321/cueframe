import { staticFile } from 'remotion';

const nativeFetch = window.fetch.bind(window);

const fontSafeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input instanceof Request ? input.url : String(input);
  if (!url.startsWith('https://fonts.gstatic.com/')) {
    return nativeFetch(input, init);
  }
  const response = await nativeFetch(input, init).catch(() => null);
  if (response?.ok) {
    return response;
  }
  return nativeFetch(staticFile('fallback-font.woff2'));
};

window.fetch = Object.assign(fontSafeFetch, window.fetch);
