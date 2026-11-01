import 'server-only';
import { createHash } from 'node:crypto';
import { EMBEDDING_MODEL, embedQuery } from '@/mcp/clip-embeddings';
import { libraryDatabase } from './database';
import { libraryDocuments } from './documents';
import { vectorLiteral } from './vectors';

export const syncLibraryVectors = async (): Promise<number> => {
  const sql = await libraryDatabase();
  if (!sql) {
    throw new Error('Save a Yugabyte YSQL URL before indexing the library.');
  }
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`CREATE TABLE IF NOT EXISTS cueframe_library_vectors (
    kind TEXT NOT NULL,
    id TEXT NOT NULL,
    model TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    document TEXT NOT NULL,
    metadata JSONB NOT NULL,
    embedding vector(384) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (kind, id, model)
  )`;
  const documents = libraryDocuments();
  const existing = await sql<{ kind: string; id: string; content_hash: string }[]>`
    SELECT kind, id, content_hash FROM cueframe_library_vectors WHERE model = ${EMBEDDING_MODEL}`;
  const hashes = new Map(existing.map((row) => [`${row.kind}:${row.id}`, row.content_hash]));
  const records: {
    kind: string;
    id: string;
    model: string;
    content_hash: string;
    document: string;
    metadata: string;
    embedding: string;
  }[] = [];
  for (const document of documents) {
    const hash = createHash('sha256').update(JSON.stringify(document)).digest('hex');
    if (hashes.get(`${document.kind}:${document.id}`) === hash) {
      continue;
    }
    // biome-ignore lint/performance/noAwaitInLoops: the local embedding model processes one document at a time
    const embedding = await embedQuery(document.text);
    if (!embedding) {
      throw new Error('Could not load the local embedding model. Retry indexing.');
    }
    records.push({
      kind: document.kind,
      id: document.id,
      model: EMBEDDING_MODEL,
      content_hash: hash,
      document: document.text,
      metadata: JSON.stringify(document.metadata),
      embedding: vectorLiteral(embedding),
    });
  }
  await sql.begin(async (transaction) => {
    for (const row of records) {
      // biome-ignore lint/performance/noAwaitInLoops: publish the complete catalog in one transaction
      await transaction`INSERT INTO cueframe_library_vectors
        (kind, id, model, content_hash, document, metadata, embedding)
        VALUES (${row.kind}, ${row.id}, ${row.model}, ${row.content_hash}, ${row.document},
          ${transaction.json(JSON.parse(row.metadata))}, ${row.embedding}::vector)
        ON CONFLICT (kind, id, model) DO UPDATE SET
          content_hash = EXCLUDED.content_hash, document = EXCLUDED.document,
          metadata = EXCLUDED.metadata, embedding = EXCLUDED.embedding, updated_at = now()`;
    }
    const keys = documents.map((document) => `${document.kind}:${document.id}`);
    await transaction`DELETE FROM cueframe_library_vectors
      WHERE model = ${EMBEDDING_MODEL} AND NOT ((kind || ':' || id) = ANY(${keys}::text[]))`;
  });
  return records.length;
};
