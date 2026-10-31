import { z } from 'zod';
import { type Design, designSchema, FONT_FAMILIES, isDesignIcon } from '@/design';
import { type Project, projectSchema } from '@/project';
import { CLIP_SCHEMAS, isClipId } from '@/schemas';
import { checkSiteDocument, type SiteDocument } from './site';

const MEDIA_KINDS = ['clip', 'poster', 'site'] as const;

export type MediaKind = (typeof MEDIA_KINDS)[number];

export type MediaDocument<K extends MediaKind> = K extends 'clip'
  ? Project
  : K extends 'poster'
    ? Design
    : SiteDocument;

export const agentRequestSchema = z.object({
  messages: z.array(z.unknown()),
  chatTitle: z.string().nullable(),
  media: z.object({
    kind: z.enum(MEDIA_KINDS),
    title: z.string(),
    focus: z.array(z.string()),
    document: z.unknown(),
  }),
});

export type MediaContext = z.infer<typeof agentRequestSchema>['media'];

export type MediaCheck<K extends MediaKind = MediaKind> =
  | { ok: true; document: MediaDocument<K> }
  | { ok: false; error: string };

const FONT_NAMES = new Set<string>(FONT_FAMILIES.map((font) => font.family));

const clipPropIssues = (project: Project): string[] =>
  project.tracks.flatMap((track, trackIndex) =>
    track.elements.flatMap((element, elementIndex) => {
      if (element.type !== 'composition') {
        return [];
      }
      const where = `/tracks/${trackIndex}/elements/${elementIndex}/props`;
      if (!isClipId(element.clipId)) {
        return [`${where}: unknown clipId "${element.clipId}"`];
      }
      const result = CLIP_SCHEMAS[element.clipId].safeParse(element.props);
      return result.success ? [] : [`${where}: ${z.prettifyError(result.error)}`];
    }),
  );

const designIssues = (design: Design): string[] =>
  design.elements.flatMap((element, index) => {
    if (element.type === 'text' && !FONT_NAMES.has(element.fontFamily)) {
      return [`/elements/${index}/fontFamily: "${element.fontFamily}" is not a bundled font`];
    }
    if (element.type === 'icon' && !isDesignIcon(element.icon)) {
      return [`/elements/${index}/icon: "${element.icon}" is not a bundled icon`];
    }
    return [];
  });

const duplicateIds = (ids: string[]): string[] =>
  [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))].map(
    (id) => `duplicate id "${id}"`,
  );

const failure = (issues: string[]): MediaCheck => ({ ok: false, error: issues.join('\n') });

const checkAny = (kind: MediaKind, value: unknown): MediaCheck => {
  if (kind === 'site') {
    return checkSiteDocument(value);
  }
  if (kind === 'clip') {
    const parsed = projectSchema.safeParse(value);
    if (!parsed.success) {
      return failure([z.prettifyError(parsed.error)]);
    }
    const ids = parsed.data.tracks.flatMap((track) => [
      track.id,
      ...track.elements.map((element) => element.id),
    ]);
    const issues = [...duplicateIds(ids), ...clipPropIssues(parsed.data)];
    return issues.length === 0 ? { ok: true, document: parsed.data } : failure(issues);
  }
  const parsed = designSchema.safeParse(value);
  if (!parsed.success) {
    return failure([z.prettifyError(parsed.error)]);
  }
  const issues = [
    ...duplicateIds(parsed.data.elements.map((element) => element.id)),
    ...designIssues(parsed.data),
  ];
  return issues.length === 0 ? { ok: true, document: parsed.data } : failure(issues);
};

export const checkMedia = <K extends MediaKind>(kind: K, value: unknown): MediaCheck<K> =>
  checkAny(kind, value) as MediaCheck<K>;
