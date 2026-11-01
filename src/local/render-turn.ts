const shared = globalThis as typeof globalThis & { cueframeRenderTurn?: Promise<unknown> };

export const renderTurn = <T>(run: () => Promise<T>): Promise<T> => {
  const next = (shared.cueframeRenderTurn ?? Promise.resolve()).catch(() => undefined).then(run);
  shared.cueframeRenderTurn = next;
  return next;
};
