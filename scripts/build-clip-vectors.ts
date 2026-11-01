import { pipeline } from '@huggingface/transformers';
import { EMBEDDING_MODEL } from '@/mcp/clip-embeddings';
import { CLIP_REGISTRY, clipLabel } from '@/schemas';

const extract = await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: 'q8' });
const vectors: Record<string, number[]> = {};
for (const meta of CLIP_REGISTRY) {
  const label = clipLabel(meta.id);
  const text = [
    meta.title,
    meta.description,
    label?.summary,
    label?.mood.join(', '),
    label?.useCases.join(', '),
    label?.keywords.join(', '),
  ]
    .filter(Boolean)
    .join('. ');
  // biome-ignore lint/performance/noAwaitInLoops: the local model runs one text at a time
  const output = await extract(text, { pooling: 'mean', normalize: true });
  vectors[meta.id] = Array.from(output.data as Float32Array, (value) => Number(value.toFixed(4)));
}
await Bun.write('src/mcp/clip-vectors.json', `${JSON.stringify(vectors)}\n`);
