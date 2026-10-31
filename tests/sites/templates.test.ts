import { describe, expect, it } from 'bun:test';
import { auditClipControls, resolveClipControls } from '@/core/clip-controls';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';

describe('site templates', () => {
  it('has unique ids that match their meta', () => {
    const ids = SITE_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const template of SITE_TEMPLATES) {
      expect(template.meta.id).toBe(template.id);
      expect(findSiteTemplate(template.id)).toBe(template);
    }
  });

  it.each(SITE_TEMPLATES.map((template) => [template.id, template] as const))(
    '%s defaults satisfy its schema',
    (_id, template) => {
      expect(template.schema.safeParse(template.defaults).success).toBe(true);
    },
  );

  it.each(SITE_TEMPLATES.map((template) => [template.id, template] as const))(
    '%s places every content path exactly once',
    (_id, template) => {
      expect(auditClipControls(template.schema, template.controls)).toEqual({
        missing: [],
        repeated: [],
        unknown: [],
        repeatedTitles: [],
      });
      expect(
        resolveClipControls(template.schema, template.controls, template.defaults).length,
      ).toBeGreaterThan(0);
    },
  );
});
