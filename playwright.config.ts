import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const { E2E_BASE_URL, CI } = process.env;
const external = E2E_BASE_URL;
const baseURL = external ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 45_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  ...(external
    ? {}
    : {
        webServer: {
          env: { CLIPKIT_HOME: mkdtempSync(join(tmpdir(), 'clipkit-e2e-')) },
          command: `bunx next start --hostname 127.0.0.1 --port ${PORT}`,
          url: baseURL,
          timeout: 180_000,
          reuseExistingServer: !CI,
        },
      }),
});
