import type { z } from 'zod';
import { readControlMeta } from '@/schemas';
import type { ControlDescriptor, TextFormat } from './types';

type ZodCheckDef =
  | { check: 'greater_than'; value: number; inclusive: boolean }
  | { check: 'less_than'; value: number; inclusive: boolean }
  | { check: 'max_length'; maximum: number }
  | { check: 'min_length'; minimum: number }
  | { check: 'length_equals'; length: number }
  | { check: string };

interface ZodDef {
  type: string;
  shape?: Record<string, unknown>;
  checks?: { _zod: { def: ZodCheckDef } }[];
  entries?: Record<string, string>;
  element?: unknown;
  innerType?: unknown;
}

const defOf = (schema: unknown): ZodDef => (schema as { _zod: { def: ZodDef } })._zod.def;

const checksOf = (def: ZodDef): ZodCheckDef[] => (def.checks ?? []).map((check) => check._zod.def);

const WRAPPERS = new Set(['optional', 'default', 'nullable', 'readonly', 'nonoptional']);

const unwrap = (schema: unknown): unknown => {
  let current = schema;
  let def = defOf(current);
  while (WRAPPERS.has(def.type) && def.innerType !== undefined) {
    current = def.innerType;
    def = defOf(current);
  }
  return current;
};

type ControlMeta = ReturnType<typeof readControlMeta>;

const findCheck = <Kind extends ZodCheckDef['check']>(
  checks: ZodCheckDef[],
  kind: Kind,
): Extract<ZodCheckDef, { check: Kind }> | undefined =>
  checks.find((check): check is Extract<ZodCheckDef, { check: Kind }> => check.check === kind);

const textFormat = (meta: ControlMeta): TextFormat => {
  if (meta?.control === 'textarea') {
    return 'multiline';
  }
  return meta?.control === 'datetime' ? 'datetime' : 'line';
};

const describeString = (
  checks: ZodCheckDef[],
  meta: ControlMeta,
  path: string[],
  label: string,
): ControlDescriptor => {
  if (meta?.control === 'color') {
    return { kind: 'color', path, label };
  }
  if (meta?.control === 'image') {
    return { kind: 'image', path, label };
  }
  if (meta?.control === 'video') {
    return { kind: 'video', path, label };
  }
  const maxCheck = findCheck(checks, 'max_length');
  return {
    kind: 'text',
    path,
    label,
    format: textFormat(meta),
    maxLength: maxCheck?.maximum ?? null,
  };
};

const describeNumber = (
  checks: ZodCheckDef[],
  meta: ControlMeta,
  path: string[],
  label: string,
): ControlDescriptor => ({
  kind: 'number',
  path,
  label,
  min: findCheck(checks, 'greater_than')?.value ?? null,
  max: findCheck(checks, 'less_than')?.value ?? null,
  step: meta?.control === 'slider' ? meta.step : 1,
});

const describeArray = (
  def: ZodDef,
  checks: ZodCheckDef[],
  path: string[],
  label: string,
): ControlDescriptor => {
  const fixed = findCheck(checks, 'length_equals')?.length ?? null;
  const min = fixed ?? findCheck(checks, 'min_length')?.minimum ?? null;
  const max = fixed ?? findCheck(checks, 'max_length')?.maximum ?? null;
  const element = describeField(def.element, [], label);
  const item = element.kind === 'object' ? element.fields : [element];
  return { kind: 'array', path, label, min, max, item };
};

const describeField = (schema: unknown, path: string[], label: string): ControlDescriptor => {
  const inner = unwrap(schema);
  const def = defOf(inner);
  const meta = readControlMeta(inner as z.core.$ZodType);
  const checks = checksOf(def);

  switch (def.type) {
    case 'string':
      return describeString(checks, meta, path, label);
    case 'number':
      return describeNumber(checks, meta, path, label);
    case 'boolean':
      return { kind: 'boolean', path, label };
    case 'enum':
      return { kind: 'enum', path, label, options: Object.values(def.entries ?? {}) };
    case 'array':
      return describeArray(def, checks, path, label);
    case 'object':
      return {
        kind: 'object',
        path,
        label,
        fields: Object.entries(def.shape ?? {}).map(([key, child]) =>
          describeField(child, [...path, key], key),
        ),
      };
    default:
      return { kind: 'text', path, label, format: 'line', maxLength: null };
  }
};

export const describeSchema = (schema: z.ZodType): ControlDescriptor[] => {
  const root = describeField(schema, [], 'root');
  return root.kind === 'object' ? root.fields : [root];
};
