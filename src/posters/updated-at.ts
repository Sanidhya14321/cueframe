import { z } from 'zod';
import updatedAt from './poster-updated-at.json';

export const posterUpdatedAtSchema = z.record(z.string(), z.iso.datetime());

export const POSTER_UPDATED_AT = posterUpdatedAtSchema.parse(updatedAt);

export const posterUpdatedAt = (id: string): string => POSTER_UPDATED_AT[id] ?? '';
