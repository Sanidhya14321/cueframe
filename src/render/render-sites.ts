import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { SITE_PREVIEW_SIZE, sitePreviewPath } from '@/lib/sites';
import { SITE_TEMPLATES } from '@/sites/templates';
import { publicDir } from './paths';

const SCALE = 1.2;
const INTRO_TIMEOUT_MS = 15_000;
const SETTLE_MS = 1200;

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex === -1 ? 'http://localhost:3201' : (args[baseIndex + 1] ?? '');
const ids = args.filter((arg, index) => !arg.startsWith('-') && index !== baseIndex + 1);
const templates = SITE_TEMPLATES.filter(
  (template) => ids.length === 0 || ids.includes(template.id),
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: SITE_PREVIEW_SIZE, deviceScaleFactor: SCALE });
await mkdir(join(publicDir, 'site-previews'), { recursive: true });
for (const template of templates) {
  await page.goto(`${base}/preview/${template.id}`, { waitUntil: 'networkidle' });
  const intro = page.locator('[data-site-intro] button').first();
  if ((await intro.count()) > 0) {
    await intro.click();
    await page
      .locator('[data-site-intro]')
      .waitFor({ state: 'detached', timeout: INTRO_TIMEOUT_MS });
  }
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  await page.waitForTimeout(SETTLE_MS);
  const out = join(publicDir, sitePreviewPath(template.id));
  await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
  console.info(`rendered ${template.id} -> ${out}`);
}
await browser.close();
