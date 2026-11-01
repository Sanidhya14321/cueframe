import { POSTER_META } from '@/posters';
import { CLIP_REGISTRY, clipLabel } from '@/schemas';
import { SITE_TEMPLATES } from '@/sites/templates';

export type LibraryKind = 'clip' | 'poster' | 'site';

export interface LibraryDocument {
  id: string;
  kind: LibraryKind;
  text: string;
  metadata: Record<string, unknown>;
}

export const libraryDocuments = (): LibraryDocument[] => [
  ...CLIP_REGISTRY.map((meta): LibraryDocument => {
    const label = clipLabel(meta.id);
    return {
      id: meta.id,
      kind: 'clip',
      text: [
        meta.title,
        meta.description,
        meta.category,
        meta.tags.join(', '),
        label?.summary,
        label?.visuals.join(', '),
        label?.motion.join(', '),
        label?.mood.join(', '),
        label?.roles.join(', '),
        label?.useCases.join(', '),
        label?.editable.join(', '),
        label?.keywords.join(', '),
      ]
        .filter(Boolean)
        .join('. '),
      metadata: { ...meta, label },
    };
  }),
  ...POSTER_META.map(
    (meta): LibraryDocument => ({
      id: meta.id,
      kind: 'poster',
      text: [meta.title, meta.description, meta.category, ...meta.tags, meta.theme].join('. '),
      metadata: { ...meta },
    }),
  ),
  ...SITE_TEMPLATES.map(
    ({ meta }): LibraryDocument => ({
      id: meta.id,
      kind: 'site',
      text: [meta.title, meta.description, meta.category, ...meta.tags, meta.theme].join('. '),
      metadata: { ...meta },
    }),
  ),
];
