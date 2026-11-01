import { closeLibraryDatabase } from '@/local/library/database';
import { syncLibraryVectors } from '@/local/library/indexer';

try {
  const changed = await syncLibraryVectors();
  console.info(`Library index ready: ${changed} documents updated.`);
} catch {
  console.error(
    'Indexing failed. Check the saved Yugabyte URL, vector extension permissions and model download access.',
  );
  process.exitCode = 1;
} finally {
  await closeLibraryDatabase();
}
