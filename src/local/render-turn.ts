const shared = globalThis as typeof globalThis & { clipkitRenderTurn?: Promise<unknown> };

export const renderTurn = <T>(run: () => Promise<T>): Promise<T> => {
  const next = (shared.clipkitRenderTurn ?? Promise.resolve()).catch(() => undefined).then(run);
  shared.clipkitRenderTurn = next;
  return next;
};
