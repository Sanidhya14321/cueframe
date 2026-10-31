import vectors from './clip-vectors.json' with { type: 'json' };

export const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const CLIP_VECTORS: Readonly<Record<string, readonly number[]>> = vectors;

type Embedder = (text: string) => Promise<number[]>;
let embedder: Promise<Embedder | null> | null = null;

const loadEmbedder = async (): Promise<Embedder | null> => {
  try {
    const { pipeline } = await import('@huggingface/transformers');
    const extract = await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: 'q8' });
    return async (text) =>
      Array.from((await extract(text, { pooling: 'mean', normalize: true })).data as Float32Array);
  } catch {
    return null;
  }
};

export const embedQuery = async (text: string): Promise<readonly number[] | null> => {
  embedder ??= loadEmbedder();
  const embed = await embedder;
  return embed ? embed(text) : null;
};

const dot = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);

export const semanticOrder = (query: readonly number[]): string[] =>
  Object.entries(CLIP_VECTORS)
    .map(([id, vector]) => ({ id, score: dot(query, vector) }))
    .sort((a, b) => b.score - a.score)
    .map(({ id }) => id);
