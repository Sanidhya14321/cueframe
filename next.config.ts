import { randomBytes } from 'node:crypto';
import type { NextConfig } from 'next';

const { CLIPKIT_DIST_DIR: clipkitDistDir } = process.env;

const { HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN: htmlInCanvasTrialToken } = process.env;

const { CLIPKIT_SESSION_TOKEN: existingSessionToken } = process.env;
Object.assign(process.env, {
  CLIPKIT_SESSION_TOKEN: existingSessionToken ?? randomBytes(32).toString('hex'),
});

const config: NextConfig = {
  reactStrictMode: true,
  distDir: clipkitDistDir ?? '.next',
  serverExternalPackages: ['@remotion/renderer', '@remotion/bundler'],
  agentRules: false,
  transpilePackages: ['remotion', '@remotion/player', '@remotion/google-fonts', '@remotion/three'],
  headers: () =>
    Promise.resolve(
      htmlInCanvasTrialToken
        ? [
            {
              source: '/:path*',
              headers: [{ key: 'Origin-Trial', value: htmlInCanvasTrialToken }],
            },
          ]
        : [],
    ),
};

export default config;
