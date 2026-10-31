import type { Project } from '@/project';
import type { ProjectState } from './project-state';
import { commitAction, createProject, listProjects, ProjectProblem, readProject } from './projects';

export type VideoRow = ProjectState;
export const createVideo = (video: { title: string; project: Project }): Promise<VideoRow> =>
  createProject(video);
export const findVideo = async (id: string): Promise<VideoRow | null> => {
  try {
    return await readProject(id);
  } catch (error) {
    if (error instanceof ProjectProblem && error.status === 404) {
      return null;
    }
    throw error;
  }
};
export const updateVideo = async (
  id: string,
  change: { title?: string | undefined; project: Project },
): Promise<VideoRow | null> => {
  try {
    return await commitAction(
      id,
      { type: 'replace-project', project: change.project },
      { actor: 'agent:legacy', label: change.title ?? 'Edit video', title: change.title },
    );
  } catch (error) {
    if (error instanceof ProjectProblem && error.status === 404) {
      return null;
    }
    throw error;
  }
};
export const listVideos = listProjects;
