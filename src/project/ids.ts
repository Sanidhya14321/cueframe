import { randomHex } from '@/lib/random-hex';

export const createId = (prefix: string): string => `${prefix}-${randomHex(32)}`;
