import { writeFile } from 'node:fs/promises';
import { describeControlPaths } from '../src/core/clip-controls';
import { CLIP_REGISTRY, clipLabel, getClipSchema } from '../src/schemas';

const catalog = CLIP_REGISTRY.map((meta) => ({
  id: meta.id,
  category: meta.category,
  description: meta.description,
  theme: meta.theme,
  orientation:
    meta.width === meta.height ? 'square' : meta.width > meta.height ? 'landscape' : 'portrait',
  energy: meta.tags.some((tag) => ['3d', 'glitch', 'bounce', 'kinetic'].includes(tag))
    ? 5
    : meta.category === 'backgrounds'
      ? 2
      : 3,
  roles: clipLabel(meta.id)?.roles ?? ['feature'],
  textSlots: [...describeControlPaths(getClipSchema(meta.id)).values()]
    .filter((field) => field.kind === 'text' && !/font|date|url|src/i.test(field.path.join('.')))
    .map((field) => ({
      path: field.path.join('.'),
      maxLength: field.kind === 'text' ? (field.maxLength ?? 64) : 64,
    })),
  typicalDuration: meta.durationInFrames / meta.fps,
  aspectSupport:
    meta.category === 'imported'
      ? ['landscape', 'portrait', 'square']
      : [
          meta.width === meta.height
            ? 'square'
            : meta.width > meta.height
              ? 'landscape'
              : 'portrait',
        ],
  source: meta.attribution?.url ?? meta.source,
  license: meta.attribution?.license ?? 'Repository asset; upstream notices apply',
}));
await writeFile('catalog.json', `${JSON.stringify(catalog, null, 2)}\n`);
console.info(`Built ${catalog.length} catalog entries.`);
