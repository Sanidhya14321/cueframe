import 'server-only';
import postgres from 'postgres';
import { readSettings } from '../settings';

type Database = ReturnType<typeof postgres>;
let cached: { url: string; sql: Database } | undefined;

export const libraryDatabase = async (): Promise<Database | null> => {
  const { yugabyteUrl } = await readSettings();
  if (cached?.url !== yugabyteUrl) {
    await cached?.sql.end({ timeout: 1 });
    cached = undefined;
  }
  if (!yugabyteUrl) {
    return null;
  }
  cached ??= {
    url: yugabyteUrl,
    sql: postgres(yugabyteUrl, {
      max: 4,
      connect_timeout: 10,
      idle_timeout: 20,
      connection: { statement_timeout: 15000 },
      onnotice: () => undefined,
    }),
  };
  return cached.sql;
};

export const closeLibraryDatabase = async (): Promise<void> => {
  await cached?.sql.end({ timeout: 1 });
  cached = undefined;
};
