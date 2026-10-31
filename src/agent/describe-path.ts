import { clipControlsFor, humanizeKey } from '@/core';
import type { Design, DesignControl } from '@/design';
import type { Project } from '@/project';
import { getClipMeta, isClipId } from '@/schemas';
import type { MediaKind } from './media';
import { checkSiteDocument, describeSitePath } from './site';

export interface PathTarget {
  scope: string;
  section: string | null;
  field: string;
}

const CLIP_ELEMENT = /^\/tracks\/(\d+)\/elements\/(\d+)(?:\/(.*))?$/;
const POSTER_ELEMENT = /^\/elements\/(\d+|-)(?:\/(.*))?$/;
const POSTER_CONTROL = /^\/controls\/(\d+)\/values?(?:\/(\d+))?$/;

const CONTROL_SECTIONS: Record<DesignControl['kind'], string> = {
  color: 'Colors',
  font: 'Fonts',
  text: 'Copy',
  list: 'Copy',
};

const fieldName = (rest: string | undefined): string =>
  rest === undefined || rest === ''
    ? 'Whole element'
    : rest
        .split('/')
        .filter((key) => !/^\d+$/.test(key))
        .map(humanizeKey)
        .join(' › ');

const matchesTarget = (propPath: string, target: readonly string[]): boolean => {
  const joined = target.join('/');
  return propPath === joined || propPath.startsWith(`${joined}/`);
};

const describeClipProp = (clipId: string, propPath: string): Omit<PathTarget, 'scope'> => {
  const entries = clipControlsFor(clipId).flatMap((section) =>
    [...section.fields, ...section.more].map((entry) => ({ section: section.title, entry })),
  );
  const found =
    entries.find(
      ({ entry }) => entry.shades !== null && entry.targets[0]?.join('/') === propPath,
    ) ??
    entries.find(
      ({ entry }) =>
        entry.targets.length === 1 &&
        entry.targets.some((target) => matchesTarget(propPath, target)),
    ) ??
    entries.find(({ entry }) => entry.targets.some((target) => matchesTarget(propPath, target)));
  return found === undefined
    ? { section: null, field: fieldName(propPath) }
    : { section: found.section, field: found.entry.descriptor.label };
};

const describeClipPath = (project: Project, path: string): PathTarget => {
  const match = CLIP_ELEMENT.exec(path);
  if (match === null) {
    return { scope: 'Project', section: null, field: fieldName(path.slice(1)) };
  }
  const element = project.tracks[Number(match[1])]?.elements[Number(match[2])];
  if (element === undefined) {
    return { scope: 'New element', section: null, field: fieldName(match[3]) };
  }
  const rest = match[3];
  if (element.type === 'composition' && isClipId(element.clipId) && rest?.startsWith('props/')) {
    return {
      scope: getClipMeta(element.clipId).title,
      ...describeClipProp(element.clipId, rest.slice('props/'.length)),
    };
  }
  return { scope: `${humanizeKey(element.type)} element`, section: null, field: fieldName(rest) };
};

const describePosterPath = (design: Design, path: string): PathTarget => {
  if (path === '/title') {
    return { scope: 'Design', section: null, field: 'Title' };
  }
  if (path.startsWith('/background')) {
    const rest = path.slice('/background/'.length);
    return {
      scope: 'Page',
      section: null,
      field: path === '/background' ? 'Background' : `Background › ${fieldName(rest)}`,
    };
  }
  const control = POSTER_CONTROL.exec(path);
  const owner = design.controls[Number(control?.[1] ?? -1)];
  if (owner !== undefined) {
    const item = control?.[2];
    return {
      scope: 'Theme',
      section: CONTROL_SECTIONS[owner.kind],
      field: item === undefined ? owner.label : `${owner.label} ${Number(item) + 1}`,
    };
  }
  const match = POSTER_ELEMENT.exec(path);
  if (match === null) {
    return { scope: 'Design', section: null, field: fieldName(path.slice(1)) };
  }
  const element = match[1] === '-' ? undefined : design.elements[Number(match[1])];
  return {
    scope: element === undefined ? 'New element' : element.name || humanizeKey(element.type),
    section: element === undefined ? null : humanizeKey(element.type),
    field: fieldName(match[2]),
  };
};

const describeWebsitePath = (document: unknown, path: string): PathTarget => {
  const checked = checkSiteDocument(document);
  const templateId = checked.ok ? checked.document.templateId : '';
  return { scope: 'Website', ...describeSitePath(templateId, path) };
};

export const describePath = (kind: MediaKind, document: unknown, path: string): PathTarget => {
  const target =
    kind === 'site'
      ? describeWebsitePath(document, path)
      : kind === 'clip'
        ? describeClipPath(document as Project, path)
        : describePosterPath(document as Design, path);
  return target.section?.toLowerCase() === target.scope.toLowerCase()
    ? { ...target, section: null }
    : target;
};

export const selectionNames = (
  kind: MediaKind,
  document: unknown,
  focus: readonly string[],
): string[] => {
  if (kind === 'site') {
    return [];
  }
  if (kind === 'poster') {
    return (document as Design).elements
      .filter((element) => focus.includes(element.id))
      .map((element) => element.name || humanizeKey(element.type));
  }
  return (document as Project).tracks
    .flatMap((track) => track.elements)
    .filter((element) => focus.includes(element.id))
    .map((element) =>
      element.type === 'composition' && isClipId(element.clipId)
        ? getClipMeta(element.clipId).title
        : `${humanizeKey(element.type)} element`,
    );
};
