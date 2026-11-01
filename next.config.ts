import { randomBytes } from 'node:crypto';
import type { NextConfig } from 'next';

const { CUEFRAME_DIST_DIR: cueframeDistDir } = process.env;

const { HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN: htmlInCanvasTrialToken } = process.env;

const { CUEFRAME_SESSION_TOKEN: existingSessionToken } = process.env;
Object.assign(process.env, {
  CUEFRAME_SESSION_TOKEN: existingSessionToken ?? randomBytes(32).toString('hex'),
});

const config: NextConfig = {
  reactStrictMode: true,
  distDir: cueframeDistDir ?? '.next',
  serverExternalPackages: ['@remotion/renderer', '@remotion/bundler', '@huggingface/transformers'],
  agentRules: false,
  transpilePackages: ['remotion', '@remotion/player', '@remotion/google-fonts', '@remotion/three'],
  headers: () =>
    Promise.resolve([
      {
        source: '/opencut/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      ...(htmlInCanvasTrialToken
        ? [
            {
              source: '/:path*',
              headers: [{ key: 'Origin-Trial', value: htmlInCanvasTrialToken }],
            },
          ]
        : []),
    ]),
};

export default config;
