import type { Element } from './element';
import type { Project } from './project';
import type { Track } from './track';

export interface ElementLocation {
  trackId: string;
  element: Element;
}

export const findElement = (project: Project, elementId: string): ElementLocation | null => {
  for (const track of project.tracks) {
    const element = track.elements.find((candidate) => candidate.id === elementId);
    if (element !== undefined) {
      return { trackId: track.id, element };
    }
  }
  return null;
};

export const listElements = (project: Project): Element[] =>
  project.tracks.flatMap((track) => track.elements);

const mapTrackElements = (
  project: Project,
  trackId: string,
  map: (elements: Element[]) => Element[],
): Project => ({
  ...project,
  tracks: project.tracks.map((track) =>
    track.id === trackId ? { ...track, elements: map(track.elements) } : track,
  ),
});

export const addElement = (project: Project, trackId: string, element: Element): Project => {
  if (!project.tracks.some((track) => track.id === trackId)) {
    return project;
  }
  return mapTrackElements(project, trackId, (elements) => [...elements, element]);
};

export const removeElement = (project: Project, elementId: string): Project => ({
  ...project,
  tracks: project.tracks.map((track) => ({
    ...track,
    elements: track.elements.filter((element) => element.id !== elementId),
  })),
});

export const replaceElement = (project: Project, next: Element): Project => ({
  ...project,
  tracks: project.tracks.map((track) => ({
    ...track,
    elements: track.elements.map((element) => (element.id === next.id ? next : element)),
  })),
});

export const moveElement = (project: Project, elementId: string, from: number): Project => {
  const found = findElement(project, elementId);
  if (found === null) {
    return project;
  }
  const clamped = Math.max(0, Math.round(from));
  return replaceElement(project, { ...found.element, from: clamped });
};

export const resizeElement = (
  project: Project,
  elementId: string,
  durationInFrames: number,
): Project => {
  const found = findElement(project, elementId);
  if (found === null) {
    return project;
  }
  const clamped = Math.max(1, Math.round(durationInFrames));
  return replaceElement(project, { ...found.element, durationInFrames: clamped });
};

export const trimElementStart = (
  project: Project,
  elementId: string,
  nextFrom: number,
): Project => {
  const found = findElement(project, elementId);
  if (found === null) {
    return project;
  }
  const rightEdge = found.element.from + found.element.durationInFrames;
  const clampedFrom = Math.min(Math.max(0, Math.round(nextFrom)), rightEdge - 1);
  return replaceElement(project, {
    ...found.element,
    from: clampedFrom,
    durationInFrames: rightEdge - clampedFrom,
  });
};

export const moveElementToTrack = (
  project: Project,
  elementId: string,
  trackId: string,
  from?: number,
): Project => {
  const found = findElement(project, elementId);
  if (found === null || !project.tracks.some((track) => track.id === trackId)) {
    return project;
  }
  if (found.trackId === trackId && from === undefined) {
    return project;
  }
  const moved: Element =
    from === undefined ? found.element : { ...found.element, from: Math.max(0, Math.round(from)) };
  return {
    ...project,
    tracks: project.tracks.map((track) => {
      if (track.id === found.trackId && track.id === trackId) {
        return {
          ...track,
          elements: track.elements.map((element) => (element.id === elementId ? moved : element)),
        };
      }
      if (track.id === found.trackId) {
        return { ...track, elements: track.elements.filter((element) => element.id !== elementId) };
      }
      if (track.id === trackId) {
        return { ...track, elements: [...track.elements, moved] };
      }
      return track;
    }),
  };
};

export const moveTrack = (project: Project, trackId: string, direction: 'up' | 'down'): Project => {
  const index = project.tracks.findIndex((track) => track.id === trackId);
  if (index === -1) {
    return project;
  }
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= project.tracks.length) {
    return project;
  }
  const next = [...project.tracks];
  const current = next[index];
  const swap = next[target];
  if (current === undefined || swap === undefined) {
    return project;
  }
  next[index] = swap;
  next[target] = current;
  return { ...project, tracks: next };
};

export const addTrack = (project: Project, track: Track): Project => ({
  ...project,
  tracks: [...project.tracks, track],
});

export const removeTrack = (project: Project, trackId: string): Project => {
  if (project.tracks.length <= 1) {
    return {
      ...project,
      tracks: project.tracks.map((track) =>
        track.id === trackId ? { ...track, elements: [] } : track,
      ),
    };
  }
  return { ...project, tracks: project.tracks.filter((track) => track.id !== trackId) };
};

export const projectContentEnd = (project: Project): number =>
  listElements(project).reduce((max, element) => {
    const end = element.from + element.durationInFrames;
    return end > max ? end : max;
  }, 0);
