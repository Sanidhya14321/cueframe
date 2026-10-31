let current: (() => Promise<void>) | null = null;
export const registerEditorNavigation = (save: () => Promise<void>) => {
  current = save;
  return () => {
    if (current === save) {
      current = null;
    }
  };
};
export const prepareEditorNavigation = () => current?.() ?? Promise.resolve();
