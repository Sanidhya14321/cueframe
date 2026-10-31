import type { Poster, PosterMeta } from './pack';
import { POSTERS } from './packs';

export * from './pack';
export * from './photos';
export * from './preview-path';
export * from './updated-at';
export { POSTERS };

export const POSTER_META: readonly PosterMeta[] = POSTERS.map((poster) => poster.meta);

export const findPoster = (id: string): Poster | undefined =>
  POSTERS.find((poster) => poster.meta.id === id);
export * from './audit';
