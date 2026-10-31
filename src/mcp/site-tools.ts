import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { jsonSchema } from '@/agent/instructions';
import { siteFieldGuide } from '@/agent/site';
import {
  createSite,
  editingContent,
  findSite,
  listSites,
  type SiteRow,
  type SiteWrite,
  SLUG_TAKEN,
  updateSite,
} from '@/local/sites';
import { checkPublishedSite, publicSitePath, siteEditorPath } from '@/sites/published-site';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';
import { failure, json } from './results';
import { mergeProps } from './video-builder';

const siteIdInput = z.string().describe('The siteId that create_site or list_sites returned');

const NOT_FOUND = 'No website with that siteId. Use list_sites.';

export const registerSiteTools = (server: McpServer, origin: string) => {
  const describe = (site: SiteRow, withContent = false) => ({
    siteId: site.id,
    slug: site.slug,
    title: findSiteTemplate(site.templateId)?.headline(site.content) ?? site.slug,
    templateId: site.templateId,
    siteUrl: `${origin}${publicSitePath(site.slug)}`,
    editorUrl: `${origin}${siteEditorPath(site.id)}`,
    updatedAt: site.updatedAt.toISOString(),
    hasUnsavedChanges: site.draft !== null,
    ...(withContent ? { content: editingContent(site) } : {}),
  });

  const written = (write: SiteWrite): CallToolResult =>
    write.ok
      ? json(describe(write.site))
      : failure(write.reason === 'taken' ? SLUG_TAKEN : NOT_FOUND);

  server.registerTool(
    'list_site_templates',
    {
      title: 'List website templates',
      description:
        'List the website templates people can save locally, such as wedding invitation sites with a countdown, venue map and RSVP button. Each has a demo and a gallery preview.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    () =>
      json({
        templates: SITE_TEMPLATES.map(({ meta }) => ({
          id: meta.id,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          tags: meta.tags,
          preview: `${origin}/site-previews/${meta.id}.jpg`,
          demo: `${origin}/preview/${meta.id}`,
        })),
      }),
  );

  server.registerTool(
    'get_site_template',
    {
      title: 'Get website template details',
      description:
        'Everything needed to fill one website template: its field guide (what each /content path controls), default content and the content JSON schema. Call this before create_site.',
      inputSchema: { templateId: z.string() },
      annotations: { readOnlyHint: true },
    },
    ({ templateId }) => {
      const template = findSiteTemplate(templateId);
      if (template === undefined) {
        return failure(`Unknown template "${templateId}". Use list_site_templates.`);
      }
      return json({
        id: template.id,
        title: template.meta.title,
        description: template.meta.description,
        fieldGuide: siteFieldGuide(template),
        defaultContent: template.defaults,
        contentSchema: JSON.parse(jsonSchema(template.schema)) as unknown,
      });
    },
  );

  server.registerTool(
    'create_site',
    {
      title: 'Save a local website',
      description:
        "Save a local website from a template and save it locally on this machine. content is merged deeply over the template's default content (lists replace), then operations, if any, are applied as RFC 6902 JSON Patch against { templateId, content }. Returns its siteId, a siteUrl for local viewing and an editorUrl for editing; both stay the same through later edits. Photos must be https image links.",
      inputSchema: {
        templateId: z.string(),
        slug: z.string().describe('Lowercase words joined by hyphens, for example maya-and-daniel'),
        content: z
          .record(z.string(), z.unknown())
          .optional()
          .describe('Content overrides, see get_site_template'),
        operations: z.array(editOperationSchema).optional(),
      },
      annotations: { destructiveHint: false },
    },
    async ({ templateId, slug, content, operations }) => {
      const template = findSiteTemplate(templateId);
      if (template === undefined) {
        return failure(`Unknown template "${templateId}". Use list_site_templates.`);
      }
      const draft = { templateId, content: mergeProps(template.defaults, content ?? {}) };
      const edited =
        operations === undefined || operations.length === 0
          ? ({ ok: true, document: draft } as const)
          : applyEdits('site', draft, operations);
      if (!edited.ok) {
        return failure(edited.error);
      }
      const checked = checkPublishedSite({ slug, ...edited.document });
      return checked.ok ? written(await createSite(checked.site)) : failure(checked.error);
    },
  );

  server.registerTool(
    'edit_site',
    {
      title: 'Edit a website',
      description:
        'Change a website with RFC 6902 JSON Patch operations against { templateId, content } (paths start with /content/, see get_site and get_site_template) and save it locally. The edits apply on top of any unsaved changes the user made in the browser, and the local preview shows the result at the same siteUrl right away. Batch related changes in one call. Set slug to move it to a new address.',
      inputSchema: {
        siteId: siteIdInput,
        operations: z.array(editOperationSchema).optional(),
        slug: z.string().optional().describe('A new address for the website'),
      },
      annotations: { destructiveHint: false },
    },
    async ({ siteId, operations = [], slug }) => {
      const site = await findSite(siteId);
      if (site === null) {
        return failure(NOT_FOUND);
      }
      const edited = applyEdits(
        'site',
        { templateId: site.templateId, content: editingContent(site) },
        operations,
      );
      if (!edited.ok) {
        return failure(edited.error);
      }
      const checked = checkPublishedSite({ slug: slug ?? site.slug, ...edited.document });
      return checked.ok ? written(await updateSite(siteId, checked.site)) : failure(checked.error);
    },
  );

  server.registerTool(
    'get_site',
    {
      title: 'Get a website',
      description:
        'The current content of a website as the user is editing it, including unsaved changes from the browser editor (hasUnsavedChanges).',
      inputSchema: { siteId: siteIdInput },
      annotations: { readOnlyHint: true },
    },
    async ({ siteId }) => {
      const site = await findSite(siteId);
      return site === null ? failure(NOT_FOUND) : json(describe(site, true));
    },
  );

  server.registerTool(
    'list_sites',
    {
      title: 'List websites',
      description: 'The websites this machine has saved, most recently changed first.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => json({ sites: (await listSites()).map((site) => describe(site)) }),
  );
};
