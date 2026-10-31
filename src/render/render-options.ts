const RENDER_CODECS = ['h264', 'h265', 'vp8', 'vp9', 'prores', 'gif'] as const;

export type RenderCodec = (typeof RENDER_CODECS)[number];

const PRORES_PROFILES = ['proxy', 'light', 'standard', 'hq', '4444', '4444-xq'] as const;

export type RenderProResProfile = (typeof PRORES_PROFILES)[number];

const PIXEL_FORMATS = [
  'yuv420p',
  'yuva420p',
  'yuv422p',
  'yuv444p',
  'yuv420p10le',
  'yuv422p10le',
  'yuv444p10le',
  'yuva444p10le',
] as const;

export type RenderPixelFormat = (typeof PIXEL_FORMATS)[number];

export interface RenderOptions {
  codec: RenderCodec;
  crf: number | null;
  scale: number;
  fps: number | null;
  pixelFormat: string | null;
  proResProfile: string | null;
  jpegQuality: number;
  everyNthFrame: number;
}

export interface RenderMediaOptionOverrides {
  codec: RenderCodec;
  scale: number;
  everyNthFrame: number;
  crf?: number;
  pixelFormat?: RenderPixelFormat;
  proResProfile?: RenderProResProfile;
}

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  codec: 'h264',
  crf: 18,
  scale: 1,
  fps: null,
  pixelFormat: null,
  proResProfile: null,
  jpegQuality: 82,
  everyNthFrame: 1,
};

export const outputExtension = (codec: RenderCodec): 'gif' | 'mp4' =>
  codec === 'gif' ? 'gif' : 'mp4';

export const buildRenderMediaOptions = (options: RenderOptions): RenderMediaOptionOverrides => ({
  codec: options.codec,
  scale: options.scale,
  everyNthFrame: options.everyNthFrame,
  ...(options.crf === null ? {} : { crf: options.crf }),
  ...(options.pixelFormat === null
    ? {}
    : { pixelFormat: options.pixelFormat as RenderPixelFormat }),
  ...(options.codec === 'prores' && options.proResProfile !== null
    ? { proResProfile: options.proResProfile as RenderProResProfile }
    : {}),
});

export const resolveRenderOptions = (
  partial: Partial<RenderOptions> | null | undefined,
): RenderOptions => ({
  ...DEFAULT_RENDER_OPTIONS,
  ...(partial ?? {}),
});

type GlRenderer = 'angle' | 'swangle';

export const glRendererFor = (platform: NodeJS.Platform): GlRenderer =>
  platform === 'darwin' || platform === 'win32' ? 'angle' : 'swangle';

export const BROWSER_RENDER_OPTIONS = {
  chromiumOptions: { gl: glRendererFor(process.platform) },
  timeoutInMilliseconds: 120_000,
};
