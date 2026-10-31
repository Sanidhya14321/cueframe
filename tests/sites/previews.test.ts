import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { sitePreviewPath } from '@/lib/sites';
import { SITE_TEMPLATES } from '@/sites/templates';

describe('website template previews', () => {
  it.each(SITE_TEMPLATES.map((template) => [template.id] as const))(
    '%s has a committed gallery preview',
    (id) => {
      expect(existsSync(join(process.cwd(), 'public', sitePreviewPath(id)))).toBe(true);
    },
  );
});
