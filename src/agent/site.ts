import { z } from 'zod';
import { humanizeKey } from '@/core';
import { resolveClipControls } from '@/core/clip-controls';
import type { ControlEntry, ControlSectionView } from '@/core/types';
import { findSiteTemplate } from '@/sites/templates';
import type { SiteTemplate } from '@/sites/types';

export interface SiteDocument {
  templateId: string;
  content: Record<string, unknown>;
}

const siteDocumentSchema = z.object({
  templateId: z.string(),
  content: z.record(z.string(), z.unknown()),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export type SiteCheck = { ok: true; document: SiteDocument } | { ok: false; error: string };

export const checkSiteDocument = (value: unknown): SiteCheck => {
  const shape = siteDocumentSchema.safeParse(value);
  if (!shape.success) {
    return { ok: false, error: 'A website document is { templateId, content }.' };
  }
  const template = findSiteTemplate(shape.data.templateId);
  if (template === undefined) {
    return { ok: false, error: `Unknown website template "${shape.data.templateId}".` };
  }
  const content = template.schema.safeParse(shape.data.content);
  if (!content.success) {
    return { ok: false, error: z.prettifyError(content.error) };
  }
  return isRecord(content.data)
    ? { ok: true, document: { templateId: template.id, content: content.data } }
    : { ok: false, error: 'Website content must be an object.' };
};

const sectionsCache = new Map<string, ControlSectionView[]>();

const siteSections = (template: SiteTemplate): ControlSectionView[] => {
  const cached = sectionsCache.get(template.id);
  if (cached !== undefined) {
    return cached;
  }
  const sections = resolveClipControls(template.schema, template.controls, template.defaults);
  sectionsCache.set(template.id, sections);
  return sections;
};

const entryPaths = (entry: ControlEntry): string[] =>
  entry.targets.map((target) => `/content/${target.join('/')}`);

const fieldLine = (entry: ControlEntry): string => {
  const hint = entry.hint === null ? '' : ` (${entry.hint})`;
  const items =
    entry.descriptor.kind === 'array'
      ? `, a list of { ${entry.descriptor.item
          .map((item) => `${item.path.join('/')}: ${item.label}`)
          .join(', ')} }`
      : '';
  return `  - ${entry.descriptor.label}: ${entryPaths(entry).join(', ')}${items}${hint}`;
};

export const siteFieldGuide = (template: SiteTemplate): string =>
  siteSections(template)
    .map((section) =>
      [`${section.title}:`, ...[...section.fields, ...section.more].map(fieldLine)].join('\n'),
    )
    .join('\n');

const itemLabel = (entry: ControlEntry, key: string): string =>
  entry.descriptor.kind === 'array'
    ? (entry.descriptor.item.find((item) => item.path[0] === key)?.label ?? humanizeKey(key))
    : humanizeKey(key);

export interface SitePathTarget {
  section: string | null;
  field: string;
}

export const describeSitePath = (templateId: string, path: string): SitePathTarget => {
  const template = findSiteTemplate(templateId);
  const keys = path.replace(/^\/content\/?/, '').split('/');
  const entries =
    template === undefined
      ? []
      : siteSections(template).flatMap((section) =>
          [...section.fields, ...section.more].map((entry) => ({ section: section.title, entry })),
        );
  const found = entries.find(({ entry }) =>
    entry.targets.some((target) => target.every((segment, position) => keys[position] === segment)),
  );
  if (found === undefined) {
    return {
      section: null,
      field: keys
        .filter((key) => !/^\d+$/.test(key))
        .map(humanizeKey)
        .join(' › '),
    };
  }
  const depth = found.entry.targets[0]?.length ?? 0;
  const [index, ...rest] = keys.slice(depth);
  const item =
    index === undefined || !/^\d+$/.test(index)
      ? ''
      : ` ${Number(index) + 1}${rest.length > 0 ? ` › ${rest.map((key) => itemLabel(found.entry, key)).join(' › ')}` : ''}`;
  return { section: found.section, field: `${found.entry.descriptor.label}${item}` };
};
