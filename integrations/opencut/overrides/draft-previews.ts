/* biome-ignore-all lint/complexity/useLiteralKeys: native records require indexed access under strict TypeScript */
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

export const paintThumbnails = (project: {
  tracks: { elements: { id: string; type: string; clipId?: string }[] }[];
}) => {
  const items = new Map(
    project.tracks.flatMap((track) => track.elements).map((item) => [item.id, item]),
  );
  for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-element-id]')) {
    const item = items.get(button.dataset['elementId'] ?? '');
    if (item?.clipId) {
      button.style.background = `linear-gradient(#0009, #0009), url(/previews/${item.clipId}.still.jpg) left / auto 100% repeat-x`;
    }
  }
};
