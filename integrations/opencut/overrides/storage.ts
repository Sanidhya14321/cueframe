/* biome-ignore-all lint/performance/noAwaitInLoops: source previews and media imports execute sequentially */
/* biome-ignore-all lint/complexity/useLiteralKeys: native records require indexed access under strict TypeScript */
import type { Project } from '@cueframe/project/project';

type PublicProjectState = {
  project: Project;
  revision: number;
  agent: { status: string; itemIds: string[] } | null;
};

import { EditorCore } from '@/core';
import { processMediaAssets } from '@/media/processing';
import type { MediaAsset } from '@/media/types';
import type { TProject } from '@/project/types';
import { TICKS_PER_SECOND } from '@/wasm';
import * as drafts from './draft-previews';
import { setNativeLocks } from './locks';
import { nativeToProject, needsSourcePreview, projectToNative } from './project-bridge';

const projectId = new URLSearchParams(location.search).get('project') ?? '';
const endpoint = `/api/projects/${projectId}/opencut`;
type StoredAsset = Omit<MediaAsset, 'file'> & {
  url: string;
  mime: string;
  lastModified: number;
  canonicalSrc?: string;
};
let version = 0;
let media: StoredAsset[] = [];
let source: PublicProjectState;
let linked = false;
const mediaFiles = new Map<string, File>();
let savedSignature = '';
const clientId = crypto.randomUUID();
let chain: Promise<unknown> = Promise.resolve();
export const report = (status: string) =>
  window.dispatchEvent(new CustomEvent('cueframe-save', { detail: status }));
async function request(method: string, data?: unknown) {
  const response = await fetch(endpoint, {
    method,
    headers: { 'content-type': 'application/json' },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  const result = await response.json();
  if (!response.ok) {
    report(result.problem ?? 'Save failed');
    throw new Error(result.problem ?? 'OpenCut storage request failed');
  }
  version = result.version;
  source = result.source;
  if (method === 'GET') {
    media = result.media;
  }
  return result;
}
function save(data: Record<string, unknown>) {
  const next = chain
    .catch(() => undefined)
    .then(async () => {
      report('Saving locally');
      const result = await request('PUT', { ...data, version });
      report('Saved locally');
      return result;
    });
  chain = next;
  return next;
}
export const storageService = {
  async loadProject(_input: { id: string }) {
    const state = await request('GET');
    media = state.media;
    const project = state.document as TProject | null;
    if (!project) {
      return null;
    }
    project.metadata.createdAt = new Date(project.metadata.createdAt);
    project.metadata.updatedAt = new Date(project.metadata.updatedAt);
    for (const scene of project.scenes) {
      scene.createdAt = new Date(scene.createdAt);
      scene.updatedAt = new Date(scene.updatedAt);
    }
    return { project };
  },
  async saveProject({ project }: { project: TProject }) {
    const document = { ...project, metadata: { ...project.metadata, id: projectId } };
    const signature = JSON.stringify({
      scenes: document.scenes,
      settings: document.settings,
      name: document.metadata.name,
    });
    if (linked && signature === savedSignature) {
      return;
    }
    const summary = {
      revision: version,
      duration: document.metadata.duration / TICKS_PER_SECOND,
      width: document.settings.canvasSize.width,
      height: document.settings.canvasSize.height,
      fps: document.settings.fps.numerator / document.settings.fps.denominator,
      tracks: document.scenes.reduce(
        (count, scene) => count + scene.tracks.overlay.length + scene.tracks.audio.length + 1,
        0,
      ),
    };
    const projectSource = linked
      ? nativeToProject(
          document,
          source.project,
          media.map((asset) => ({ ...asset, file: new File([], asset.name) })),
        )
      : undefined;
    await save({
      document,
      media,
      summary,
      ...(projectSource
        ? { project: projectSource, canonicalRevision: source.revision, clientId }
        : {}),
    });
    savedSignature = signature;
  },
  async saveMediaAsset({ mediaAsset }: { projectId: string; mediaAsset: MediaAsset }) {
    const response = await fetch(`/api/projects/${projectId}/media`, {
      method: 'POST',
      headers: { 'content-type': mediaAsset.file.type },
      body: mediaAsset.file,
    });
    if (!response.ok) {
      throw new Error('Could not save media locally');
    }
    const { url } = await response.json();
    const { file, ...metadata } = mediaAsset;
    const stored = { ...metadata, url, mime: file.type, lastModified: file.lastModified };
    media = [...media.filter((item) => item.id !== metadata.id), stored];
    await save({ media });
  },
  loadAllMediaAssets(): Promise<MediaAsset[]> {
    return Promise.all(
      media.map(async (asset) => {
        let file = mediaFiles.get(asset.url);
        if (!file) {
          const response = await fetch(asset.url);
          if (!response.ok) {
            throw new Error(`Cannot load ${asset.name}`);
          }
          file = new File([await response.blob()], asset.name, {
            type: asset.mime,
            lastModified: asset.lastModified,
          });
          mediaFiles.set(asset.url, file);
        }
        return { ...asset, file, url: URL.createObjectURL(file) };
      }),
    );
  },
  async deleteMediaAsset({ id }: { projectId: string; id: string }) {
    media = media.filter((item) => item.id !== id);
    await save({ media });
  },
  async loadMediaAsset({ id }: { projectId: string; id: string }) {
    return (await this.loadAllMediaAssets()).find((item) => item.id === id) ?? null;
  },
  canStoreFile({ size }: { size: number }) {
    return Promise.resolve({
      canStore: size > 0 && size <= 256 * 1024 * 1024,
      availableBytes: 256 * 1024 * 1024,
    });
  },
  isQuotaExceededError() {
    return false;
  },
  loadAllProjectsMetadata() {
    return Promise.resolve([]);
  },
  deleteProjectMedia() {
    throw new Error('Manage projects from cueframe Projects');
  },
  deleteProject() {
    throw new Error('Manage projects from cueframe Projects');
  },
  loadSavedSounds() {
    return Promise.resolve([]);
  },
  saveSavedSounds() {
    return Promise.resolve();
  },
};

export const canonicalSource = () => source;
const setHydrating = (active: boolean) => {
  const root = document.getElementById('root');
  if (root) {
    root.inert = active;
    root.dataset['hydratedRevision'] = active ? '' : String(source.revision);
  }
  if (active) {
    report('Applying project changes');
  }
};
export async function connectCanonical() {
  const editor = EditorCore.getInstance();
  await hydrateCanonical(editor);
  linked = true;
  setHydrating(false);
  updateLocks();
  if (source.agent?.status !== 'working') {
    await editor.save.flush();
  }
  new MutationObserver(updateLocks).observe(document.getElementById('root') ?? document.body, {
    childList: true,
    subtree: true,
  });
  const events = new EventSource(`/api/projects/${projectId}/events`);
  let loading = false;
  let queued: PublicProjectState | null = null;
  const timer = setInterval(() => {
    if (queued && !loading && !editor.save.getIsDirty()) {
      const value = queued;
      queued = null;
      accept(value);
    }
  }, 250);
  const accept = (latest: PublicProjectState, force = false) => {
    source.agent = latest.agent;
    updateLocks();
    if (latest.revision === source.revision && !force) {
      return;
    }
    if (loading || editor.save.getIsDirty()) {
      queued = latest;
      return;
    }
    loading = true;
    setHydrating(true);
    editor.save.pause();
    request('GET')
      .then(() => hydrateCanonical(editor))
      .then(() => {
        updateLocks();
        editor.command.clear();
        editor.save.resume();
        report('Saved locally');
        upgrade();
      })
      .catch((error) =>
        report(error instanceof Error ? error.message : 'Could not receive agent changes'),
      )
      .finally(() => {
        loading = false;
        setHydrating(false);
        editor.save.resume();
      });
  };
  const upgrade = () => {
    drafts.upgradeDrafts(report, () => accept(source, true)).catch(() => undefined);
  };
  upgrade();
  events.onmessage = (event: MessageEvent<string>) =>
    accept(JSON.parse(event.data) as PublicProjectState);
  return () => {
    clearInterval(timer);
    events.close();
  };
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: source media variants share one ordered hydration transaction
export async function hydrateCanonical(editor: EditorCore) {
  editor.save.pause();
  const items = source.project.tracks.flatMap((track) => track.elements);
  const previewCount = items.filter(needsSourcePreview).length;
  let previewNumber = 0;
  for (const item of items) {
    const id = `source-${item.id}`;
    if (
      media.some(
        (asset) => asset.id === id && ('src' in item ? asset.canonicalSrc === item.src : false),
      ) &&
      !needsSourcePreview(item)
    ) {
      continue;
    }
    let preview: Awaited<ReturnType<typeof drafts.renderPreview>> | undefined;
    let url: string;
    if (needsSourcePreview(item)) {
      previewNumber += 1;
      report(
        `Preparing ${item.type === 'composition' ? item.clipId : item.type} (${previewNumber} of ${previewCount})`,
      );
      preview = item.type === 'composition' ? await drafts.cachedPreview(item.id) : undefined;
      if (item.type === 'composition' && !preview) {
        drafts.draftIds.add(item.id);
        preview = {
          url: `/previews/${item.clipId}.mp4`,
          width: source.project.width,
          height: source.project.height,
          duration: item.durationInFrames / source.project.fps,
          fps: source.project.fps,
          hasAudio: false,
        };
      } else {
        drafts.draftIds.delete(item.id);
        preview ??= await drafts.renderPreview(item.id);
      }
      url = preview.url;
    } else if (item.type === 'video' || item.type === 'audio' || item.type === 'image') {
      url = item.src;
    } else {
      continue;
    }
    const existing = media.find((asset) => asset.id === id && asset.url === url);
    if (existing) {
      continue;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not load media for ${item.id}`);
    }
    const mime = response.headers.get('content-type') ?? 'video/webm';
    const file = new File(
      [await response.blob()],
      `${item.type === 'composition' ? item.clipId : item.type}.${mime.split('/')[1] ?? 'webm'}`,
      { type: mime },
    );
    const processed = preview
      ? {
          file,
          name: file.name,
          type: 'video' as const,
          width: preview.width,
          height: preview.height,
          duration: preview.duration,
          fps: preview.fps,
          hasAudio: preview.hasAudio,
        }
      : (await processMediaAssets({ files: [file] }))[0];
    if (!processed) {
      throw new Error('Unsupported source media');
    }
    if (!(url.startsWith(`/api/projects/${projectId}/media/`) || drafts.draftIds.has(item.id))) {
      const upload = await fetch(`/api/projects/${projectId}/media`, {
        method: 'POST',
        headers: { 'content-type': mime },
        body: file,
      });
      if (!upload.ok) {
        throw new Error('Could not persist source media');
      }
      url = (await upload.json()).url as string;
    }
    const { file: _file, ...metadata } = processed;
    media = [
      ...media.filter((asset) => asset.id !== id),
      {
        ...metadata,
        id,
        url,
        mime,
        lastModified: file.lastModified,
        canonicalSrc: 'src' in item ? item.src : url,
      },
    ];
  }
  const assets = await storageService.loadAllMediaAssets();
  const active = editor.project.getActive();
  const native = source.project.opencut
    ? (JSON.parse(source.project.opencut.document) as TProject)
    : undefined;
  const template = native ?? active;
  const project = projectToNative(source.project, template, assets);
  editor.media.clearAllAssets();
  editor.media.setAssets({ assets });
  editor.project.setActiveProject({ project });
  editor.scenes.initializeScenes({
    scenes: project.scenes,
    currentSceneId: project.currentSceneId,
  });
  savedSignature = source.project.opencut
    ? JSON.stringify({
        scenes: project.scenes,
        settings: project.settings,
        name: project.metadata.name,
      })
    : '';
  editor.save.resume();
}

function updateLocks() {
  const locked = source.agent?.status === 'working' ? source.agent.itemIds : [];
  const tracks = EditorCore.getInstance().scenes.getActiveSceneOrNull()?.tracks;
  if (tracks) {
    setNativeLocks(locked, tracks);
  }
  drafts.paintThumbnails(source.project);
  for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-element-id]')) {
    const active = locked.includes(button.dataset['elementId'] ?? '');
    button.dataset['agentLocked'] = String(active);
    button.title = active ? 'Agent is editing this layer' : '';
  }
}
