import { beforeEach, describe, expect, it } from 'bun:test';
import { seedProjectForClip } from '@/core';
import {
  commitAction,
  createProject,
  openProject,
  readProject,
  undoProject,
} from '@/local/projects';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);
describe('revisioned projects', () => {
  it('opens one disk project for a gallery clip and rejects stale actions', async () => {
    const input = {
      title: 'Demo',
      sourceKey: 'clip:demo',
      project: seedProjectForClip('typewriter'),
    };
    const first = await openProject(input);
    expect((await openProject(input)).id).toBe(first.id);
    await commitAction(
      first.id,
      { type: 'patch', operations: [{ op: 'replace', path: '/background', value: '#fff' }] },
      { actor: 'browser:one', revision: 0 },
    );
    expect((await readProject(first.id)).revision).toBe(1);
    expect(
      commitAction(
        first.id,
        { type: 'replace-project', project: input.project },
        { actor: 'browser:two', revision: 0 },
      ),
    ).rejects.toThrow('changed');
  });
  it('groups a gesture and undoes an agent turn without reverting unrelated user edits', async () => {
    const created = await createProject({
      title: 'Undo',
      project: seedProjectForClip('typewriter'),
    });
    await commitAction(
      created.id,
      { type: 'patch', operations: [{ op: 'replace', path: '/background', value: '#fff' }] },
      { actor: 'agent:mcp', turnId: 'run' },
    );
    await commitAction(
      created.id,
      { type: 'patch', operations: [{ op: 'replace', path: '/width', value: 720 }] },
      { actor: 'browser:one', turnId: 'gesture' },
    );
    await commitAction(
      created.id,
      { type: 'patch', operations: [{ op: 'replace', path: '/width', value: 800 }] },
      { actor: 'browser:one', turnId: 'gesture' },
    );
    const undone = await undoProject(created.id, 'browser:one', false, true);
    expect(undone.project.background).toBe(created.project.background);
    expect(undone.project.width).toBe(800);
    expect(undone.history).toHaveLength(2);
    const redone = await undoProject(created.id, 'agent:mcp', true);
    expect(redone.project.background).toBe('#fff');
  });
});
