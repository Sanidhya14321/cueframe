/* biome-ignore-all lint/style/noProcessEnv: startup checks read the operator's hosted configuration */
export const register = async (): Promise<void> => {
  // biome-ignore lint/complexity/useLiteralKeys: Next must statically evaluate the runtime guard
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    const { hostedStartupProblems } = await import('@/local/security');
    const { errors, warnings } = hostedStartupProblems();
    for (const warning of warnings) {
      console.warn(`[cueframe] ${warning}`);
    }
    if (errors.length > 0) {
      throw new Error(`[cueframe] ${errors.join(' ')}`);
    }
  }
};
