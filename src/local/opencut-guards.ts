/* biome-ignore-all lint/complexity/useLiteralKeys: untrusted native records require indexed access */
import type { ProjectState } from './project-state';
import { ProjectProblem } from './projects';

const object = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
const nativeRows = (tracks: Record<string, unknown>) => [
  ...(Array.isArray(tracks['overlay']) ? tracks['overlay'] : []),
  tracks['main'],
  ...(Array.isArray(tracks['audio']) ? tracks['audio'] : []),
];
const elements = (document: unknown): Map<string, string> => {
  const result = new Map<string, string>();
  const scenes = object(document)?.['scenes'];
  if (!Array.isArray(scenes)) {
    return result;
  }
  for (const scene of scenes) {
    const tracks = object(object(scene)?.['tracks']);
    if (!tracks) {
      continue;
    }
    const rows = nativeRows(tracks);
    for (const [index, row] of rows.entries()) {
      const items = object(row)?.['elements'];
      if (!Array.isArray(items)) {
        continue;
      }
      for (const item of items) {
        const id = object(item)?.['id'];
        if (typeof id === 'string') {
          result.set(
            id,
            JSON.stringify({
              item,
              track: object(row)?.['id'],
              hidden: object(row)?.['hidden'] ?? false,
              muted: object(row)?.['muted'] ?? false,
              index,
            }),
          );
        }
      }
    }
  }
  return result;
};
export const hasNativeElements = (document: unknown) => elements(document).size > 0;
export const assertNativeEditable = (state: ProjectState, next: unknown) => {
  const agent = state.agent;
  if (agent?.status !== 'working') {
    return;
  }
  const previous = state.project.opencut
    ? elements(JSON.parse(state.project.opencut.document))
    : new Map<string, string>();
  const after = elements(next);
  if (agent.itemIds.some((id) => previous.get(id) !== after.get(id))) {
    throw new ProjectProblem('This layer is locked while the agent edits it.', 423);
  }
};
