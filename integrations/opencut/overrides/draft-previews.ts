/* biome-ignore-all lint/performance/noAwaitInLoops: full previews render one at a time */
const projectId = new URLSearchParams(location.search).get('project') ?? '';
export type PreviewFile = {
  url: string;
  width: number;
  height: number;
  duration: number;
  fps: number;
  hasAudio: boolean;
};
export const draftIds = new Set<string>();
const failedDrafts = new Set<string>();
const previewUrl = (id: string) =>
  `/api/projects/${projectId}/opencut/preview/${encodeURIComponent(id)}`;
export const cachedPreview = async (id: string): Promise<PreviewFile | undefined> => {
  const response = await fetch(`${previewUrl(id)}?cached=1`, { method: 'POST' });
  return response.status === 200 ? ((await response.json()) as PreviewFile) : undefined;
};
export const renderPreview = async (id: string): Promise<PreviewFile> => {
  const response = await fetch(previewUrl(id), { method: 'POST' });
  if (!response.ok) {
    throw new Error(
      'Could not prepare an animation layer. Open Animation workspace to inspect it.',
    );
  }
  return (await response.json()) as PreviewFile;
};
let upgrading = false;
export async function upgradeDrafts(report: (status: string) => void, apply: () => void) {
  if (upgrading) {
    return;
  }
  upgrading = true;
  try {
    for (const id of draftIds) {
      if (failedDrafts.has(id)) {
        continue;
      }
      report(`Rendering full preview, ${draftIds.size} left. Export after this finishes.`);
      try {
        await renderPreview(id);
        apply();
      } catch {
        failedDrafts.add(id);
      }
    }
    if (failedDrafts.size > 0) {
      report(
        `${failedDrafts.size} layer kept a draft preview. Use Local render for the final video.`,
      );
    }
  } finally {
    upgrading = false;
  }
}
