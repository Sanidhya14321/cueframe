import { existsSync } from 'node:fs';
import { cp, mkdir, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { ensureBrowser } from '@remotion/renderer';

const SHELL = 'chrome-headless-shell';
const SHELL_FOLDER = `chrome-headless-shell-mac-${process.arch}`;

export const renderBrowserOptions = async (): Promise<{ browserExecutable?: string }> => {
  const browser = await ensureBrowser();
  if (process.platform !== 'darwin' || browser.type !== 'local-puppeteer-browser') {
    return {};
  }
  const cache = join(homedir(), 'Library/Caches/clipkit', SHELL_FOLDER);
  const executable = join(cache, SHELL);
  if (!existsSync(executable)) {
    const temporary = `${cache}.${process.pid}`;
    await mkdir(dirname(cache), { recursive: true });
    await cp(dirname(browser.path), temporary, { recursive: true });
    await rm(cache, { recursive: true, force: true });
    await rename(temporary, cache);
  }
  return { browserExecutable: executable };
};
