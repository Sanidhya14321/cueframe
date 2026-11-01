import { beforeEach, describe, expect, it } from 'bun:test';
import { libraryDocuments } from '@/local/library/documents';
import { syncLibraryVectors } from '@/local/library/indexer';
import { searchClipsByMeaning } from '@/local/library/search';
import { searchLibraryVectors, vectorLiteral } from '@/local/library/vectors';
import { settingsSchema } from '@/local/settings-schema';
import { searchClips } from '@/mcp/clip-search';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);

describe('library vector retrieval', () => {
  it('indexes all library kinds with unique keys and descriptive metadata', () => {
    const documents = libraryDocuments();
    expect(new Set(documents.map((document) => document.kind))).toEqual(
      new Set(['clip', 'poster', 'site']),
    );
    expect(new Set(documents.map((document) => `${document.kind}:${document.id}`)).size).toBe(
      documents.length,
    );
    expect(
      documents.every(
        (document) => document.text.length > 20 && Object.hasOwn(document.metadata, 'title'),
      ),
    ).toBe(true);
  });

  it('rejects malformed embeddings before sending SQL', () => {
    expect(() => vectorLiteral([1])).toThrow();
    expect(() => vectorLiteral(new Array(384).fill(0))).toThrow();
    expect(() => vectorLiteral(new Array(384).fill(Number.NaN))).toThrow();
    expect(() => vectorLiteral(new Array(384).fill(Number.POSITIVE_INFINITY))).toThrow();
    expect(vectorLiteral(new Array(384).fill(0.1))).toStartWith('[0.1,');
  });

  it('keeps unconfigured search local without loading a model or connecting to a database', async () => {
    expect(await searchLibraryVectors([1])).toBeNull();
    expect(await searchClipsByMeaning('phone', {}, 3)).toEqual(searchClips('phone', {}, 3));
    await expect(syncLibraryVectors()).rejects.toThrow('Save a Yugabyte');
  });

  it('limits database URLs to the PostgreSQL protocol and migrates older settings', () => {
    const previous = {
      dataFolder: '/tmp/example',
      providerType: 'openai-compatible',
      baseUrl: 'https://example.com/v1',
      model: '',
      apiKey: '',
      fishAudioKey: '',
    };
    expect(settingsSchema.parse(previous).yugabyteUrl).toBe('');
    expect(
      settingsSchema.safeParse({ ...previous, yugabyteUrl: 'https://example.com' }).success,
    ).toBe(false);
  });
});
