import { z } from 'zod';
import type { ClipId } from './clip-props';
import updatedAt from './clip-updated-at.json';

export const clipUpdatedAtSchema = z.record(z.string(), z.iso.datetime());

export const CLIP_UPDATED_AT = clipUpdatedAtSchema.parse(updatedAt);

export const clipUpdatedAt = (id: ClipId): string => CLIP_UPDATED_AT[id] ?? '';
