import { applyPatch, type Operation } from 'fast-json-patch';
import { z } from 'zod';
import { checkMedia, type MediaCheck, type MediaKind } from './media';
import { recolorLinkedShades } from './roles';
import { applyThemeControls, isControlOperation, themeViolations } from './theme';

export const editOperationSchema = z.object({
  op: z.enum(['add', 'remove', 'replace', 'move', 'copy']),
  path: z.string().describe('JSON pointer into the document, for example /elements/2/fill'),
  from: z.string().optional().describe('Source JSON pointer, only for move and copy'),
  value: z.unknown().optional().describe('New value, only for add and replace'),
});

export type EditOperation = z.infer<typeof editOperationSchema>;

const toPatch = (operation: EditOperation): Operation => {
  if (operation.op === 'remove') {
    return { op: 'remove', path: operation.path };
  }
  if (operation.op === 'move' || operation.op === 'copy') {
    return { op: operation.op, path: operation.path, from: operation.from ?? '' };
  }
  return { op: operation.op, path: operation.path, value: operation.value };
};

type Patched = { ok: true; document: unknown } | { ok: false; error: string };

const patchDocument = (document: unknown, operations: readonly EditOperation[]): Patched => {
  try {
    return {
      ok: true,
      document: applyPatch(structuredClone(document), operations.map(toPatch), true, false)
        .newDocument,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};

const editClip = (document: unknown, operations: readonly EditOperation[]): MediaCheck<'clip'> => {
  const patched = patchDocument(document, operations);
  if (!patched.ok) {
    return patched;
  }
  const checked = checkMedia('clip', patched.document);
  return checked.ok
    ? checkMedia('clip', recolorLinkedShades(checked.document, operations))
    : checked;
};

const editPoster = (
  document: unknown,
  operations: readonly EditOperation[],
): MediaCheck<'poster'> => {
  const source = checkMedia('poster', document);
  if (!source.ok) {
    return source;
  }
  const themed = applyThemeControls(source.document, operations.filter(isControlOperation));
  if (!themed.ok) {
    return themed;
  }
  const patched = patchDocument(
    themed.design,
    operations.filter((operation) => !isControlOperation(operation)),
  );
  if (!patched.ok) {
    return patched;
  }
  const checked = checkMedia('poster', patched.document);
  if (!checked.ok) {
    return checked;
  }
  const issues = themeViolations(themed.design, checked.document);
  return issues.length === 0 ? checked : { ok: false, error: issues.join('\n') };
};

const editSite = (document: unknown, operations: readonly EditOperation[]): MediaCheck<'site'> => {
  if (operations.some((operation) => !operation.path.startsWith('/content/'))) {
    return { ok: false, error: 'Only paths under /content can change; the template stays fixed.' };
  }
  const patched = patchDocument(document, operations);
  return patched.ok ? checkMedia('site', patched.document) : patched;
};

const EDITORS: {
  [K in MediaKind]: (document: unknown, operations: readonly EditOperation[]) => MediaCheck<K>;
} = {
  clip: editClip,
  poster: editPoster,
  site: editSite,
};

export const applyEdits = <K extends MediaKind>(
  kind: K,
  document: unknown,
  operations: readonly EditOperation[],
): MediaCheck<K> => EDITORS[kind](document, operations);
