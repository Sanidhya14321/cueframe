type Identified = { id: string };
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const identifiedArray = (value: unknown): value is Identified[] =>
  Array.isArray(value) &&
  value.every((entry) => {
    if (!object(entry)) {
      return false;
    }
    const { id } = entry;
    return typeof id === 'string';
  });
const undoArray = (current: Identified[], before: Identified[], after: Identified[]): unknown[] => {
  const previous = new Map(before.map((value) => [value.id, value]));
  const changed = new Map(after.map((value) => [value.id, value]));
  const result = current.flatMap((value) => {
    const old = previous.get(value.id);
    const edited = changed.get(value.id);
    if (old === undefined && edited !== undefined && same(value, edited)) {
      return [];
    }
    return [
      old !== undefined && edited !== undefined ? undoContribution(value, old, edited) : value,
    ];
  });
  for (const value of before) {
    if (!(changed.has(value.id) || current.some((candidate) => candidate.id === value.id))) {
      result.push(value);
    }
  }
  return result;
};
const undoObject = (
  current: Record<string, unknown>,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): unknown => {
  const result = { ...current };
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (same(before[key], after[key])) {
      continue;
    }
    const next = undoContribution(current[key], before[key], after[key]);
    if (next === undefined) {
      delete result[key];
    } else {
      result[key] = next;
    }
  }
  return result;
};
export const undoContribution = (current: unknown, before: unknown, after: unknown): unknown => {
  if (same(before, after)) {
    return current;
  }
  if (same(current, after)) {
    return before;
  }
  if (identifiedArray(current) && identifiedArray(before) && identifiedArray(after)) {
    return undoArray(current, before, after);
  }
  if (object(current) && object(before) && object(after)) {
    return undoObject(current, before, after);
  }
  return current;
};
