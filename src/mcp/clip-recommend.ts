import type { ClipRole, ClipTheme } from '@/schemas';
import { type ClipSearchHit, type Orientation, searchClips } from './clip-search';

const DEFAULT_STORY: readonly ClipRole[] = ['opener', 'feature', 'proof', 'cta', 'closer'];

const ORIENTATION_WORDS: readonly (readonly [RegExp, Orientation])[] = [
  [/\b(portrait|vertical|reel|reels|tiktok|shorts|9:16)\b/i, 'portrait'],
  [/\b(square|1:1)\b/i, 'square'],
  [/\b(landscape|widescreen|youtube|16:9)\b/i, 'landscape'],
];

const THEME_WORDS: readonly (readonly [RegExp, ClipTheme])[] = [
  [/\bdark\b/i, 'dark'],
  [/\b(light|bright)\b/i, 'light'],
];

const matchWord = <T>(brief: string, words: readonly (readonly [RegExp, T])[]): T | undefined =>
  words.find(([pattern]) => pattern.test(brief))?.[1];

export interface ClipRecommendOptions {
  roles?: readonly ClipRole[] | undefined;
  orientation?: Orientation | undefined;
  theme?: ClipTheme | undefined;
}

export interface ClipRecommendation {
  role: ClipRole;
  clip: ClipSearchHit | null;
  alternatives: readonly string[];
}

export const recommendClips = (
  brief: string,
  options: ClipRecommendOptions = {},
): ClipRecommendation[] => {
  const orientation = options.orientation ?? matchWord(brief, ORIENTATION_WORDS);
  const theme = options.theme ?? matchWord(brief, THEME_WORDS);
  const used = new Set<string>();
  const categories = new Set<string>();
  return (options.roles ?? DEFAULT_STORY).map((role) => {
    const hits = searchClips(brief, { role, orientation, theme }, 500).filter(
      (hit) => !used.has(hit.id),
    );
    const clip = hits.find((hit) => !categories.has(hit.category)) ?? hits[0] ?? null;
    if (clip !== null) {
      used.add(clip.id);
      categories.add(clip.category);
    }
    return {
      role,
      clip,
      alternatives: hits
        .filter((hit) => hit.id !== clip?.id)
        .slice(0, 3)
        .map((hit) => hit.id),
    };
  });
};
