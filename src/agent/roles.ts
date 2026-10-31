import { clipControlsFor } from '@/core';
import { recolor } from '@/design';
import { getAtPath, setAtPath } from '@/lib/value-path';
import type { Project } from '@/project';
import type { EditOperation } from './edits';

const PROP_PATH = /^\/tracks\/(\d+)\/elements\/(\d+)\/props\/(.+)$/;

const linkedShades = (clipId: string) =>
  clipControlsFor(clipId).flatMap((section) =>
    [...section.fields, ...section.more].flatMap((entry) => {
      const [base, ...rest] = entry.shades ?? [];
      const [lead, ...linked] = entry.targets;
      return base === undefined || lead === undefined
        ? []
        : [{ label: entry.descriptor.label, lead: lead.join('/'), base, linked, shades: rest }];
    }),
  );

export const recolorLinkedShades = (
  project: Project,
  operations: readonly EditOperation[],
): Project => {
  const written = new Set(operations.map((operation) => operation.path));
  return operations.reduce((current, operation) => {
    const match = PROP_PATH.exec(operation.path);
    const value = operation.value;
    if (operation.op !== 'replace' || typeof value !== 'string' || match === null) {
      return current;
    }
    const [, track, index, propPath] = match;
    const element = current.tracks[Number(track)]?.elements[Number(index)];
    if (element?.type !== 'composition') {
      return current;
    }
    const role = linkedShades(element.clipId).find((item) => item.lead === propPath);
    if (role === undefined) {
      return current;
    }
    const prefix = `/tracks/${track}/elements/${index}/props/`;
    const props = role.linked.reduce<unknown>(
      (accumulated, target, at) =>
        written.has(`${prefix}${target.join('/')}`) || getAtPath(accumulated, target) === undefined
          ? accumulated
          : setAtPath(accumulated, target, recolor(value, role.base, role.shades[at] ?? role.base)),
      element.props,
    );
    return setAtPath(
      current,
      ['tracks', track ?? '', 'elements', index ?? '', 'props'],
      props,
    ) as Project;
  }, project);
};
