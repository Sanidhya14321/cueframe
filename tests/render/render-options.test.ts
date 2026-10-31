import { describe, expect, it } from 'bun:test';
import {
  BROWSER_RENDER_OPTIONS,
  buildRenderMediaOptions,
  DEFAULT_RENDER_OPTIONS,
  glRendererFor,
  outputExtension,
  type RenderOptions,
  resolveRenderOptions,
} from '@/render/render-options';

const base: RenderOptions = {
  codec: 'h264',
  crf: 18,
  scale: 1,
  fps: null,
  pixelFormat: null,
  proResProfile: null,
  jpegQuality: 82,
  everyNthFrame: 1,
};

describe('buildRenderMediaOptions', () => {
  it('carries codec, scale and everyNthFrame through', () => {
    const result = buildRenderMediaOptions({ ...base, scale: 0.5, everyNthFrame: 2 });
    expect(result.codec).toBe('h264');
    expect(result.scale).toBe(0.5);
    expect(result.everyNthFrame).toBe(2);
  });

  it('includes crf only when it is not null', () => {
    expect(buildRenderMediaOptions({ ...base, crf: 23 }).crf).toBe(23);
    expect('crf' in buildRenderMediaOptions({ ...base, crf: null })).toBe(false);
  });

  it('includes pixelFormat only when set', () => {
    expect(buildRenderMediaOptions({ ...base, pixelFormat: 'yuv444p' }).pixelFormat).toBe(
      'yuv444p',
    );
    expect('pixelFormat' in buildRenderMediaOptions({ ...base, pixelFormat: null })).toBe(false);
  });

  it('includes proResProfile only when codec is prores and a profile is set', () => {
    expect(
      buildRenderMediaOptions({ ...base, codec: 'prores', proResProfile: 'hq' }).proResProfile,
    ).toBe('hq');
    expect(
      'proResProfile' in buildRenderMediaOptions({ ...base, codec: 'h264', proResProfile: 'hq' }),
    ).toBe(false);
    expect(
      'proResProfile' in buildRenderMediaOptions({ ...base, codec: 'prores', proResProfile: null }),
    ).toBe(false);
  });
});

describe('outputExtension', () => {
  it('maps gif to gif and everything else to mp4', () => {
    expect(outputExtension('gif')).toBe('gif');
    expect(outputExtension('h264')).toBe('mp4');
    expect(outputExtension('prores')).toBe('mp4');
  });
});

describe('resolveRenderOptions', () => {
  it('returns defaults when nothing is passed', () => {
    expect(resolveRenderOptions(null)).toEqual(DEFAULT_RENDER_OPTIONS);
    expect(resolveRenderOptions(undefined)).toEqual(DEFAULT_RENDER_OPTIONS);
  });

  it('merges a partial over the defaults', () => {
    const merged = resolveRenderOptions({ codec: 'vp9', crf: 30 });
    expect(merged.codec).toBe('vp9');
    expect(merged.crf).toBe(30);
    expect(merged.scale).toBe(DEFAULT_RENDER_OPTIONS.scale);
  });
});

describe('browser render options', () => {
  it('uses the GPU renderer on macOS and Windows and software rendering elsewhere', () => {
    expect(glRendererFor('darwin')).toBe('angle');
    expect(glRendererFor('win32')).toBe('angle');
    expect(glRendererFor('linux')).toBe('swangle');
  });

  it('gives each frame enough time for the 3D clips to render', () => {
    expect(BROWSER_RENDER_OPTIONS.timeoutInMilliseconds).toBeGreaterThanOrEqual(120_000);
    expect(BROWSER_RENDER_OPTIONS.chromiumOptions.gl).toBe(glRendererFor(process.platform));
  });
});
