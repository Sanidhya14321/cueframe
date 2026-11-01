import { chromium } from 'playwright';
import { ROLE_COOKIE, SESSION_COOKIE } from '@/local/security';
import { nativeBrowserPath } from './native-browser';

const [origin, id, output] = process.argv.slice(2);
// biome-ignore lint/style/noProcessEnv: the render worker receives its session from the server
const { CUEFRAME_RENDER_ROLE: role = '' } = process.env;
// biome-ignore lint/style/noProcessEnv: native render worker receives runtime authentication through its private environment
const { CUEFRAME_RENDER_TOKEN: token } = process.env;
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
  await context.addCookies([
    { name: SESSION_COOKIE, value: token, url: origin },
    { name: ROLE_COOKIE, value: role, url: origin },
  ]);
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
  const opened = await page.goto(`${origin}/video/${id}?workspace=render`);
  if (!opened?.ok()) {
    throw new Error(`The render page answered ${opened?.status() ?? 'nothing'}.`);
  }
  const editor = page.frameLocator('iframe');
  const failed = Promise.any(
    [
      editor.getByText('Export failed', { exact: true }),
      editor.getByRole('button', { name: 'Retry opening', exact: true }),
      editor.getByRole('button', { name: 'Reload saved project', exact: true }),
    ].map((signal) => signal.waitFor()),
  ).then(() => {
    throw new Error('The video editor reported an export failure.');
  });
  failed.catch(() => undefined);
  const exported = async () => {
    await editor.getByRole('button', { name: 'Export', exact: true }).click();
    const downloading = page.waitForEvent('download');
    await editor.getByRole('button', { name: 'Export', exact: true }).last().click();
    const download = await downloading;
    await download.saveAs(output);
  };
  await Promise.race([exported(), failed]);
} finally {
  await browser.close();
}
