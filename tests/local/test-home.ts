import { rm } from 'node:fs/promises';
import { basename } from 'node:path';
import { configFolder } from '@/local/settings';

export const resetTestHome = async (): Promise<void> => {
  const folder = configFolder();
  if (!basename(folder).startsWith('cueframe-tests-')) {
    throw new Error('Tests require an isolated data folder.');
  }
  await rm(folder, { recursive: true, force: true });
};
