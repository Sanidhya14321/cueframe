import './tests/server-http';
import { afterEach, expect, mock } from 'bun:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({ url: 'http://localhost:3000' });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: mock(),
    removeEventListener: mock(),
    addListener: mock(),
    removeListener: mock(),
    dispatchEvent: mock(),
  }),
});

if (typeof Element.prototype.scrollIntoView !== 'function') {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { writable: true, value: mock() });
}

if (!('ResizeObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: class {
      observe = mock();
      unobserve = mock();
      disconnect = mock();
    },
  });
}

const matchers = await import('@testing-library/jest-dom/matchers');
expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

const { cleanup } = await import('@testing-library/react');
afterEach(() => {
  cleanup();
});

mock.module('server-only', () => ({}));

// biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
Object.assign(process.env, { CUEFRAME_HOME: mkdtempSync(join(tmpdir(), 'cueframe-tests-')) });
