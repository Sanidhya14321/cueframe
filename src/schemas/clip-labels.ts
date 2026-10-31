import { z } from 'zod';
import labels from './clip-labels.json';
import type { ClipId } from './clip-props';

export const CLIP_ROLES = [
  'opener',
  'feature',
  'proof',
  'cta',
  'closer',
  'transition',
  'background',
  'overlay',
] as const;

export type ClipRole = (typeof CLIP_ROLES)[number];

const HEX = /^#[0-9a-f]{6}$/;

export const clipLabelSchema = z.object({
  summary: z.string().min(20),
  beats: z.array(z.object({ at: z.number().min(0), what: z.string().min(3) })).min(2),
  visuals: z.array(z.string().min(2)).min(2),
  motion: z.array(z.string().min(2)).min(1),
  mood: z.array(z.string().min(2)).min(1),
  roles: z.array(z.enum(CLIP_ROLES)).min(1),
  useCases: z.array(z.string().min(3)).min(2),
  editable: z.array(z.string().min(3)).min(2),
  palette: z.array(z.string().regex(HEX)).min(2).max(6),
  keywords: z.array(z.string().min(2)).min(5),
});

export type ClipLabel = z.infer<typeof clipLabelSchema>;

export const clipLabelsSchema = z.record(z.string(), clipLabelSchema);

export const CLIP_LABELS = clipLabelsSchema.parse(labels);

export const clipLabel = (id: ClipId): ClipLabel | null => CLIP_LABELS[id] ?? null;
