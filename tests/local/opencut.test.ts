import { beforeEach, expect, it } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { seedProjectForClip } from '@/core';
import { readOpenCut, saveOpenCut } from '@/local/opencut';
import { createProject, projectDirectory, readProject } from '@/local/projects';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);
it('persists native projects without modifying or losing their animation source', async () => {
  const source = seedProjectForClip('typewriter');
  const project = await createProject({ title: 'Source', project: source });
  expect((await readOpenCut(project.id)).document).toBeNull();
  const document = {
    metadata: { id: project.id, name: 'Native video' },
    scenes: [{ id: 'main', tracks: { overlay: [], main: { elements: [] }, audio: [] } }],
    currentSceneId: 'main',
    settings: { fps: { numerator: 30, denominator: 1 } },
    version: 31,
  };
  const saved = await saveOpenCut(project.id, { version: 0, document });
  expect(saved.version).toBe(1);
  expect((await readOpenCut(project.id)).document).toEqual(document);
  expect((await readProject(project.id)).project).toEqual(source);
  expect(
    JSON.parse(await readFile(join(await projectDirectory(project.id), 'opencut.json'), 'utf8'))
      .document,
  ).toEqual(document);
  expect(saveOpenCut(project.id, { version: 0, document })).rejects.toThrow('another tab');
});
it('rejects foreign project IDs and media references', async () => {
  const project = await createProject({
    title: 'Source',
    project: seedProjectForClip('typewriter'),
  });
  expect(
    saveOpenCut(project.id, {
      version: 0,
      media: [
        {
          id: 'bad',
          name: 'bad',
          type: 'video',
          url: 'https://example.com/x.mp4',
          mime: 'video/mp4',
          lastModified: 0,
        },
      ],
    }),
  ).rejects.toThrow('this project');
  expect(readOpenCut('../outside')).rejects.toThrow('Unknown project');
});

it('routes native edits through revisioned actions and enforces locks', async () => {
  const original = seedProjectForClip('typewriter');
  const state = await createProject({ title: 'Bridge', project: original });
  const document = {
    metadata: { id: state.id, name: 'Bridge' },
    scenes: [{ id: 'main', tracks: { main: { elements: [] } } }],
    currentSceneId: 'main',
    settings: {},
    version: 31,
  };
  const project = { ...original, background: '#123456' };
  const saved = await saveOpenCut(state.id, {
    version: 0,
    canonicalRevision: 0,
    clientId: 'native-test',
    project,
    document,
  });
  expect(saved.source.revision).toBe(1);
  expect(saved.source.project.background).toBe('#123456');
  expect(saved.source.activity.at(-1)?.label).toBe('Edit in video editor');
  expect(saved.source.project.opencut).toBeDefined();
  expect(saveOpenCut(state.id, { version: 1, document })).rejects.toThrow('revisioned');
  expect(
    saveOpenCut(state.id, { version: 1, canonicalRevision: 0, project, document }),
  ).rejects.toThrow('changed');
  const { setAgentStatus } = await import('@/local/projects');
  const itemId = original.tracks[0]?.elements[0]?.id ?? '';
  const locked = await setAgentStatus(state.id, 'agent:test', {
    status: 'working',
    label: 'Working',
    itemIds: [itemId],
    name: 'Test agent',
  });
  expect(
    saveOpenCut(state.id, {
      version: 1,
      canonicalRevision: locked.revision,
      project: { ...project, background: '#999999' },
      document,
    }),
  ).rejects.toThrow('locked');
});
