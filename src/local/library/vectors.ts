import 'server-only';
import { EMBEDDING_MODEL } from '@/mcp/clip-embeddings';
import { libraryDatabase } from './database';
import type { LibraryKind } from './documents';

const DIMENSIONS = 384;

export const vectorLiteral = (values: readonly number[]): string => {
  if (
    values.length !== DIMENSIONS ||
    values.some((value) => !Number.isFinite(value)) ||
    values.every((value) => value === 0)
  ) {
    throw new Error('Expected a nonzero 384-dimensional finite embedding.');
  }
  return `[${values.join(',')}]`;
};

export const searchLibraryVectors = async (
  vector: readonly number[],
  kind?: LibraryKind,
  limit = 40,
) => {
  const sql = await libraryDatabase();
  if (!sql) {
    return null;
  }
  try {
    return await sql<
      { id: string; kind: LibraryKind; metadata: Record<string, unknown>; score: number }[]
    >`
      SELECT id, kind, metadata, 1 - (embedding <=> ${vectorLiteral(vector)}::vector) AS score
      FROM cueframe_library_vectors
      WHERE model = ${EMBEDDING_MODEL} AND (${kind ?? null}::text IS NULL OR kind = ${kind ?? null})
      ORDER BY embedding <=> ${vectorLiteral(vector)}::vector, kind, id
      LIMIT ${Math.max(1, Math.min(5000, Math.floor(limit)))}`;
  } catch {
    throw new Error(
      'Library vector search failed. Check the Yugabyte connection and run bun run library:index.',
    );
  }
};
