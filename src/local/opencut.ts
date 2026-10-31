/* biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: native and canonical revisions are validated before either representation is written */
import 'server-only';
import { join } from 'node:path';
import { z } from 'zod';
import { projectSchema } from '@/project';
import { serialDisk } from './file-lock';
import { readJson, writeJson } from './files';
import { assertNativeEditable, hasNativeElements } from './opencut-guards';
import { projectStateSchema, publicProjectState } from './project-state';
import {
  commitAction,
  mutateProject,
  ProjectProblem,
  projectDirectory,
  readProject,
} from './projects';

const documentSchema = z
  .object({
    metadata: z.object({ id: z.string(), name: z.string().max(200) }).passthrough(),
    scenes: z.array(z.record(z.string(), z.json())).max(100),
    currentSceneId: z.string(),
    settings: z.record(z.string(), z.json()),
    version: z.number().int(),
  })
  .passthrough();
const assetSchema = z
  .object({
    id: z.string().max(100),
    name: z.string().max(500),
    type: z.enum(['video', 'image', 'audio']),
    url: z.string().max(300),
    mime: z.string().max(100),
    lastModified: z.number(),
  })
  .passthrough();
const stateSchema = z.object({
  version: z.number().int().min(0),
  document: documentSchema.nullable(),
  media: z.array(assetSchema).max(2000),
  summary: projectStateSchema.shape.nativeVideo.optional(),
});
const openCutChangeSchema = z.object({
  canonicalRevision: z.number().int().optional(),
  project: projectSchema.optional(),
  clientId: z.string().max(100).optional(),
  version: z.number().int().min(0),
  document: documentSchema.optional(),
  media: z.array(assetSchema).max(2000).optional(),
  summary: projectStateSchema.shape.nativeVideo.optional(),
});
export const readOpenCut = async (id: string) => {
  const source = await readProject(id);
  const value = await readJson(join(await projectDirectory(id), 'opencut.json'));
  const stored = stateSchema.parse(value ?? { version: 0, document: null, media: [] });
  const native = source.project.opencut;
  return {
    ...stored,
    version: Math.max(
      stored.version,
      source.project.opencut?.version ?? 0,
      source.nativeVideo?.revision ?? 0,
    ),
    document: native ? documentSchema.parse(JSON.parse(native.document)) : stored.document,
    media:
      (value === null || (native?.version ?? 0) > stored.version) && native
        ? z.array(assetSchema).parse(JSON.parse(native.media))
        : stored.media,
    source: publicProjectState(source),
  };
};
export const saveOpenCut = async (id: string, input: unknown) => {
  const change = openCutChangeSchema.parse(input);
  const path = join(await projectDirectory(id), 'opencut.json');
  return serialDisk(path, async () => {
    const current = await readOpenCut(id);
    if (current.version !== change.version) {
      throw new ProjectProblem(
        'This video changed in another tab. Reload before editing again.',
        409,
      );
    }
    if (change.document && change.document.metadata.id !== id) {
      throw new ProjectProblem('Video project ID does not match.');
    }
    if (
      change.media?.some(
        (asset) =>
          !(
            asset.url.startsWith(`/api/projects/${id}/media/`) ||
            /^\/previews\/[a-z0-9-]+\.mp4$/.test(asset.url)
          ),
      )
    ) {
      throw new ProjectProblem('Video media must be stored in this project.');
    }
    if (change.document && !change.project) {
      const existing = await readProject(id);
      if (existing.project.opencut || hasNativeElements(change.document)) {
        throw new ProjectProblem('Native document changes require a revisioned project action.');
      }
    }
    if (change.document && change.document.scenes.length !== 1) {
      throw new ProjectProblem(
        'ClipKit shares one main timeline. Use tracks within the main scene.',
      );
    }
    if (change.document) {
      assertNativeEditable(await readProject(id), change.document);
    }
    if (change.project && change.document) {
      if (change.canonicalRevision === undefined) {
        throw new ProjectProblem('Project revision is required.');
      }
      const project = {
        ...change.project,
        opencut: {
          version: current.version + 1,
          document: JSON.stringify(change.document),
          media: JSON.stringify(change.media ?? current.media),
          source: JSON.stringify(change.project),
        },
      };
      await commitAction(
        id,
        { type: 'replace-project', project },
        {
          actor: `browser:${change.clientId ?? 'opencut'}`,
          revision: change.canonicalRevision,
          label: 'Edit in OpenCut',
          title: change.document.metadata.name,
          ...(change.summary
            ? { nativeVideo: { ...change.summary, revision: current.version + 1 } }
            : {}),
        },
      );
    }
    const next = stateSchema.parse({ ...current, ...change, version: current.version + 1 });
    await writeJson(path, next);
    if (change.summary && !change.project && change.document) {
      const nativeVideo = { ...change.summary, revision: next.version };
      await mutateProject(id, (state) => ({
        ...state,
        nativeVideo,
        title: next.document?.metadata.name ?? state.title,
      }));
    }
    return { ...next, source: publicProjectState(await readProject(id)) };
  });
};
