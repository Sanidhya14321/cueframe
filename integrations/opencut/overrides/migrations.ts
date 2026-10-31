export const CURRENT_PROJECT_VERSION = 31;
export const migrations: never[] = [];
export type MigrationProgress = {
  isMigrating: boolean;
  fromVersion: number | null;
  toVersion: number | null;
  projectName: string | null;
};
export function runStorageMigrations() {
  return Promise.resolve();
}
