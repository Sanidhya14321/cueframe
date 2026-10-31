import type { z } from 'zod';
import { getAtPath } from '@/lib/value-path';
import type { ClipControls, ControlField } from '@/schemas';
import { describeSchema } from './schema-introspect';
import type {
  AddressableDescriptor,
  ControlDescriptor,
  ControlEntry,
  ControlSectionView,
} from './types';

export const humanizeKey = (key: string): string => {
  const words = key
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const flatten = (descriptors: ControlDescriptor[]): AddressableDescriptor[] =>
  descriptors.flatMap((descriptor) =>
    descriptor.kind === 'object' ? flatten(descriptor.fields) : [descriptor],
  );

export const describeControlPaths = (schema: z.ZodType): Map<string, AddressableDescriptor> =>
  new Map(
    flatten(describeSchema(schema)).map((descriptor) => [descriptor.path.join('.'), descriptor]),
  );

const fieldPaths = (field: ControlField): string[] => {
  if (typeof field === 'string') {
    return [field];
  }
  return 'link' in field ? [...field.link] : [field.path];
};

const lastKey = (path: string[]): string => path.at(-1) ?? '';

const sameShape = (left: AddressableDescriptor, right: AddressableDescriptor): boolean => {
  if (left.kind === 'array' || right.kind === 'array') {
    return false;
  }
  if (left.kind === 'number' && right.kind === 'number') {
    return left.min === right.min && left.max === right.max && left.step === right.step;
  }
  if (left.kind === 'enum' && right.kind === 'enum') {
    return left.options.join('|') === right.options.join('|');
  }
  return left.kind === right.kind;
};

const relabelItems = (
  items: ControlDescriptor[],
  labels: Record<string, string>,
): ControlDescriptor[] =>
  items.map((item) => ({
    ...item,
    label: labels[lastKey(item.path)] ?? humanizeKey(lastKey(item.path)),
  }));

const withLabel = (
  descriptor: AddressableDescriptor,
  label: string,
  items: Record<string, string>,
): AddressableDescriptor =>
  descriptor.kind === 'array'
    ? { ...descriptor, label, item: relabelItems(descriptor.item, items) }
    : { ...descriptor, label };

const defaultShades = (
  descriptors: readonly AddressableDescriptor[],
  defaults: unknown,
): string[] | null => {
  if (descriptors.length < 2 || descriptors[0]?.kind !== 'color') {
    return null;
  }
  const shades = descriptors.map((descriptor) => getAtPath(defaults, descriptor.path));
  return shades.every((shade): shade is string => typeof shade === 'string') ? shades : null;
};

export const resolveClipControls = (
  schema: z.ZodType,
  controls: ClipControls,
  defaults?: unknown,
): ControlSectionView[] => {
  const byPath = describeControlPaths(schema);
  const lookup = (path: string): AddressableDescriptor => {
    const descriptor = byPath.get(path);
    if (descriptor === undefined) {
      throw new Error(`Unknown control path "${path}"`);
    }
    return descriptor;
  };

  const resolve = (field: ControlField): ControlEntry => {
    const paths = fieldPaths(field);
    const descriptors = paths.map(lookup);
    const [primary] = descriptors;
    if (primary === undefined) {
      throw new Error('A control field needs at least one path');
    }
    const mismatch = descriptors.find((descriptor) => !sameShape(primary, descriptor));
    if (descriptors.length > 1 && mismatch !== undefined) {
      throw new Error(`Cannot link "${paths[0]}" with "${mismatch.path.join('.')}"`);
    }
    const label =
      typeof field === 'string' || field.label === undefined
        ? humanizeKey(lastKey(primary.path))
        : field.label;
    const items = typeof field !== 'string' && 'items' in field ? (field.items ?? {}) : {};
    return {
      id: paths.join('+'),
      descriptor: withLabel(primary, label, items),
      hint: typeof field === 'string' ? null : (field.hint ?? null),
      targets: descriptors.map((descriptor) => descriptor.path),
      shades: defaultShades(descriptors, defaults),
    };
  };

  return controls.sections.map((section) => ({
    title: section.title,
    fields: section.fields.map(resolve),
    more: (section.more ?? []).map(resolve),
  }));
};

export type ControlCoverage = {
  missing: string[];
  repeated: string[];
  unknown: string[];
  repeatedTitles: string[];
};

const duplicates = (values: string[]): string[] =>
  values.filter((value, index) => values.indexOf(value) !== index);

export const auditClipControls = (schema: z.ZodType, controls: ClipControls): ControlCoverage => {
  const known = describeControlPaths(schema);
  const fields = controls.sections.flatMap((section) => [
    ...section.fields,
    ...(section.more ?? []),
  ]);
  const singles = [
    ...fields
      .filter((field) => typeof field === 'string' || !('link' in field))
      .flatMap(fieldPaths),
    ...(controls.hidden ?? []),
  ];
  const linked = fields
    .filter((field) => typeof field !== 'string' && 'link' in field)
    .flatMap(fieldPaths);
  const placed = new Set(singles);
  return {
    missing: [...known.keys()].filter((path) => !placed.has(path)),
    repeated: duplicates(singles),
    unknown: [...new Set([...singles, ...linked])].filter((path) => !known.has(path)),
    repeatedTitles: duplicates(controls.sections.map((section) => section.title)),
  };
};

export const CLIP_COLOR_ROLES = [
  'Primary color',
  'Secondary color',
  'Accent color',
  'Text color',
  'Background color',
  'Surface color',
] as const;

const MAX_FIRST_GLANCE = 14;
const MAX_ROLES = 5;

export const auditClipStandard = (schema: z.ZodType, controls: ClipControls): string[] => {
  const known = describeControlPaths(schema);
  const colorPaths = [...known.values()].filter((descriptor) => descriptor.kind === 'color');
  const problems: string[] = [];
  const firstGlance = controls.sections.reduce((sum, item) => sum + item.fields.length, 0);
  if (firstGlance > MAX_FIRST_GLANCE) {
    problems.push(`${firstGlance} controls at first glance; keep at most ${MAX_FIRST_GLANCE}`);
  }
  if (colorPaths.length === 0) {
    return problems;
  }
  const index = controls.sections.findIndex((item) => item.title === 'Colors');
  const section = controls.sections[index];
  if (section === undefined || index > 1) {
    return [...problems, 'needs a "Colors" section as the first or second section'];
  }
  const roles = section.fields.map((field) => (typeof field === 'string' ? field : field.label));
  const minimum = Math.min(2, colorPaths.length);
  if (roles.length < minimum || roles.length > MAX_ROLES) {
    problems.push(`Colors has ${roles.length} role controls; use ${minimum} to ${MAX_ROLES}`);
  }
  const allowed: readonly (string | undefined)[] = CLIP_COLOR_ROLES;
  for (const role of roles) {
    if (!allowed.includes(role)) {
      problems.push(`Colors role "${role}" is not one of ${CLIP_COLOR_ROLES.join(', ')}`);
    }
  }
  if (new Set(roles).size !== roles.length) {
    problems.push('Colors repeats a role');
  }
  if (!roles.includes('Primary color')) {
    problems.push('Colors needs a Primary color role');
  }
  for (const field of section.fields) {
    for (const path of fieldPaths(field)) {
      if (known.get(path)?.kind !== 'color') {
        problems.push(`Colors role field "${path}" is not a color`);
      }
    }
  }
  return problems;
};
