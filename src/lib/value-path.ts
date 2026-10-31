export const getAtPath = (root: unknown, path: string[]): unknown => {
  let current: unknown = root;
  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
};

export const setAtPath = (root: unknown, path: string[], value: unknown): unknown => {
  const [head, ...rest] = path;
  if (head === undefined) {
    return value;
  }
  if (Array.isArray(root)) {
    const index = Number(head);
    const copy = [...root];
    copy[index] = setAtPath(copy[index], rest, value);
    return copy;
  }
  const object = (root ?? {}) as Record<string, unknown>;
  return { ...object, [head]: setAtPath(object[head], rest, value) };
};
