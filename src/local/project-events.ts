import { join } from 'node:path';
import { publicProjectState } from './project-state';
import { projectDirectory, readProject } from './projects';
import { snapshotStream } from './snapshot-stream';

export const projectEvents = (id: string, signal: AbortSignal) =>
  snapshotStream(
    async () => [join(await projectDirectory(id), 'project.json')],
    async () => publicProjectState(await readProject(id)),
    signal,
  );
