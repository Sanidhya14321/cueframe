import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { repoRoot } from '@/lib/repo-root';
export const nativeBrowserPath = async () => {
  const path = chromium.executablePath();
  if (existsSync(path)) {
    return path;
  }
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [join(repoRoot(), 'node_modules/playwright/cli.js'), 'install', 'chromium'],
      { stdio: 'ignore' },
    );
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Local Chrome setup timed out. Try again.'));
    }, 600000);
    child.on('error', () => {
      clearTimeout(timer);
      reject(new Error('Could not set up the local Chrome renderer.'));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Local Chrome setup failed. Check your network and try again.'));
      }
    });
  });
  return path;
};
