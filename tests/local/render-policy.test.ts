import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { join } from 'node:path';
import { writeJson } from '@/local/files';
import { createProject, projectDirectory } from '@/local/projects';
import { createCompositionElement, createTrack, type Project } from '@/project';
import { getClipDefaults } from '@/schemas';
import { resetTestHome } from './test-home';

const prepared: string[] = [];
const rendered: number[] = [];
let failPreview = false;
mock.module('@/local/opencut-preview', () => ({
  prepareOpenCutPreview: (_id: string, itemId: string) => {
    if (failPreview) {
      return Promise.reject(new Error('Could not render this source layer.'));
    }
    prepared.push(itemId);
    return Promise.resolve({ url: '/preview' });
  },
}));
mock.module('@/local/opencut-render', () => ({
  renderNativeProject: (_id: string, _origin: string, _update: unknown, revision: number) => {
    rendered.push(revision);
    return Promise.resolve({ url: '/native.mp4', fileName: 'native.mp4', bytes: 1 });
  },
}));
const { renderLocalProject } = await import('@/local/render');

const element = createCompositionElement('typewriter', getClipDefaults('typewriter'), {
  from: 0,
  durationInFrames: 24,
});
const nativeProject = (): Project => ({
  width: 320,
  height: 180,
  fps: 24,
  durationInFrames: 24,
  background: '#000000',
  tracks: [{ ...createTrack('Clips'), elements: [element] }],
  opencut: { version: 1, document: '{}', media: '[]', source: '{}' },
});

beforeEach(async () => {
  await resetTestHome();
  prepared.length = 0;
  rendered.length = 0;
  failPreview = false;
});

describe('renderLocalProject', () => {
  it('keeps native projects on the native renderer and prepares placed layers first', async () => {
    const state = await createProject({ title: 'Native', project: nativeProject() });
    await writeJson(join(await projectDirectory(state.id), 'opencut.json'), {
      version: 1,
      document: null,
      media: [
        {
          id: 'unused',
          name: 'unused.mp4',
          type: 'video',
          url: '/previews/typewriter.mp4',
          mime: 'video/mp4',
          lastModified: 0,
        },
      ],
    });
    const result = await renderLocalProject(state.id, () => Promise.resolve());
    expect(result.url).toBe('/native.mp4');
    expect(prepared).toEqual([element.id]);
    expect(rendered).toEqual([state.revision]);
  });

  it('fails the job when a placed layer cannot be prepared', async () => {
    const state = await createProject({ title: 'Native', project: nativeProject() });
    failPreview = true;
    await expect(renderLocalProject(state.id, () => Promise.resolve())).rejects.toThrow(
      'Could not render this source layer.',
    );
    expect(rendered).toEqual([]);
  });
});
