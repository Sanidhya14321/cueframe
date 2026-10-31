import type { z } from 'zod';
import type { ClipControls } from '@/schemas/control-layout';
import type { ClipTheme, SiteCategory, SiteTag } from '@/schemas/taxonomy';

export interface SiteMeta {
  id: string;
  title: string;
  description: string;
  category: SiteCategory;
  tags: readonly SiteTag[];
  theme: ClipTheme;
  updatedAt: string;
}

export interface SiteTemplate {
  id: string;
  meta: SiteMeta;
  schema: z.ZodType;
  defaults: Record<string, unknown>;
  controls: ClipControls;
  headline: (content: unknown) => string;
}
