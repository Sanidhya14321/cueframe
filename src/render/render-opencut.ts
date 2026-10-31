import { chromium } from 'playwright';
import { nativeBrowserPath } from './native-browser';

const [origin, id, output] = process.argv.slice(2);
// biome-ignore lint/style/noProcessEnv: native render worker receives runtime authentication through its private environment
const { CLIPKIT_RENDER_TOKEN: token } = process.env;
if (!(origin && id && output && token)) {
  throw new Error('Native render arguments are missing.');
}
const browser = await chromium.launch({
  headless: true,
  executablePath: await nativeBrowserPath(),
});
try {
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 1000 },
  });
  await context.route('**/*', async (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin) {
      await route.abort();
      return;
    }
    await route.continue({ headers: { ...request.headers(), authorization: `Bearer ${token}` } });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(600000);
  await page.goto(`${origin}/video/${id}?workspace=render`);
  const editor = page.frameLocator('iframe');
  await editor.getByRole('button', { name: 'Export', exact: true }).click();
  const downloading = page.waitForEvent('download');
  await editor.getByRole('button', { name: 'Export', exact: true }).last().click();
  const download = await downloading;
  await download.saveAs(output);
} finally {
  await browser.close();
}
