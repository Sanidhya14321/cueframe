/* biome-ignore-all lint/style/noProcessEnv: startup checks read the operator's hosted configuration */
export const register = async (): Promise<void> => {
  const { NEXT_RUNTIME: runtime } = process.env;
  if (runtime !== 'nodejs') {
    return;
  }
  const { hostedStartupProblems } = await import('@/local/security');
  const { errors, warnings } = hostedStartupProblems();
  for (const warning of warnings) {
    console.warn(`[cueframe] ${warning}`);
  }
  if (errors.length > 0) {
    throw new Error(`[cueframe] ${errors.join(' ')}`);
  }
};
