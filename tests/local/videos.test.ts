import { beforeEach, describe, expect, it } from 'bun:test';
import { readdir, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { seedProjectForClip } from '@/core';
import { configFolder } from '@/local/settings';
import { createVideo, findVideo, listVideos, updateVideo } from '@/local/videos';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);

describe('disk video store', () => {
  it('round-trips projects with media and output folders and durable edits', async () => {
    const project = seedProjectForClip('brand-reveal');
    const video = await createVideo({ title: 'Local demo', project });
    expect((await readdir(join(configFolder(), 'projects', video.id))).sort()).toEqual([
      'media',
      'out',
      'project.json',
    ]);
    expect((await findVideo(video.id))?.project).toEqual(project);
    await updateVideo(video.id, { project: { ...project, background: '#ffffff' } });
    expect((await findVideo(video.id))?.project.background).toBe('#ffffff');
    expect((await listVideos()).map((row) => row.id)).toEqual([video.id]);
  });
  it('rejects traversal IDs and symlinked project directories', async () => {
    expect(await findVideo('../settings')).toBeNull();
    const video = await createVideo({ title: 'A', project: seedProjectForClip('brand-reveal') });
    const linkId = 'abcdefghijkl';
    await symlink(
      join(configFolder(), 'projects', video.id),
      join(configFolder(), 'projects', linkId),
    );
    expect(findVideo(linkId)).rejects.toThrow('symlinks');
  });
});
