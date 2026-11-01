/* biome-ignore-all lint/style/noProcessEnv: render workers receive a minimal copy of the runtime environment */
const INHERITED = ['PATH', 'HOME', 'TMPDIR', 'LANG', 'USER', 'CUEFRAME_HOME'] as const;

export const workerEnvironment = (): NodeJS.ProcessEnv => ({
  NODE_ENV: 'production',
  ...Object.fromEntries(
    INHERITED.flatMap((name) => {
      const value = process.env[name];
      return value === undefined ? [] : [[name, value]];
    }),
  ),
});
