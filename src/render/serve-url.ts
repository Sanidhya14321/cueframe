import { bundle } from '@remotion/bundler';
import { ensureBrowser } from '@remotion/renderer';
import { compositionsEntry, srcDir } from './paths';

let serveUrlPromise: Promise<string> | null = null;

export const getServeUrl = (): Promise<string> => {
  if (serveUrlPromise === null) {
    serveUrlPromise = (async (): Promise<string> => {
      await ensureBrowser();
      return bundle({
        entryPoint: compositionsEntry,
        webpackOverride: (config) => ({
          ...config,
          resolve: {
            ...config.resolve,
            alias: { ...config.resolve?.alias, '@': srcDir },
          },
        }),
      });
    })();
  }
  return serveUrlPromise;
};
