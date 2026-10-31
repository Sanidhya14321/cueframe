import { beforeEach, describe, expect, it } from 'bun:test';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { projectTools } from '@/agent/project-tools';
import { POST } from '@/app/mcp/route';
import { findSiteBySlug, saveSiteDraft } from '@/local/sites';
import { findVideo } from '@/local/videos';
import { createMcpServer } from '@/mcp/server';
import { resetTestHome } from '../local/test-home';

const handler = async (request: Request): Promise<Response> => {
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await createMcpServer('https://clips.test').connect(transport);
  return transport.handleRequest(request);
};

beforeEach(async () => {
  await resetTestHome();
});

let requestId = 0;

const rpc = async <T>(method: string, params: Record<string, unknown>): Promise<T> => {
  requestId += 1;
  const response = await handler(
    new Request('https://clips.test/mcp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params }),
    }),
  );
  return ((await response.json()) as { result: T }).result;
};

const call = (name: string, args: Record<string, unknown>) =>
  rpc<CallToolResult>('tools/call', { name, arguments: args });

const textOf = (result: CallToolResult): string =>
  result.content.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('');

const jsonOf = <T>(result: CallToolResult): T => JSON.parse(textOf(result)) as T;

interface VideoResult {
  videoId: string;
  editorUrl: string;
  timeline: { elements: { clip: string; from: number }[] }[];
}

interface SiteResult {
  siteId: string;
  siteUrl: string;
  editorUrl: string;
  title: string;
  content: Record<string, unknown>;
}

describe('/mcp', () => {
  it('lists the tools', async () => {
    const { tools } = await rpc<{ tools: { name: string }[] }>('tools/list', {});
    expect(tools.map((tool) => tool.name).sort()).toEqual(
      [
        'add_clip',
        'create_site',
        'create_video',
        'edit_site',
        'edit_video',
        'get_clip',
        'get_site',
        'get_site_template',
        'get_video',
        'list_site_templates',
        'list_sites',
        'list_videos',
        'search_clips',
        'recommend_clips',
        ...Object.keys(projectTools),
      ].sort(),
    );
  });

  it('requires a local session before serving anything', async () => {
    const response = await POST(
      new Request('http://127.0.0.1:3000/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
      }),
    );
    expect(response.status).toBe(401);
  });

  it('publishes a website and edits it in place', async () => {
    const { templates } = jsonOf<{ templates: { id: string; demo: string }[] }>(
      await call('list_site_templates', {}),
    );
    expect(templates[0]).toMatchObject({
      id: 'emerald-rose',
      demo: 'https://clips.test/preview/emerald-rose',
    });
    const template = jsonOf<{ fieldGuide: string }>(
      await call('get_site_template', { templateId: 'emerald-rose' }),
    );
    expect(template.fieldGuide).toContain('/content/couple/firstName');
    const created = jsonOf<SiteResult>(
      await call('create_site', {
        templateId: 'emerald-rose',
        slug: 'maya-and-daniel',
        content: { couple: { firstName: 'Maya', secondName: 'Daniel', monogram: 'M & D' } },
        operations: [{ op: 'replace', path: '/content/event/venue', value: 'Villa Cimbrone' }],
      }),
    );
    expect(created.title).toBe('Maya & Daniel');
    expect(created.siteUrl).toBe('https://clips.test/s/maya-and-daniel');
    expect(created.editorUrl).toBe(`https://clips.test/websites/${created.siteId}`);
    const edited = jsonOf<SiteResult>(
      await call('edit_site', {
        siteId: created.siteId,
        slug: 'maya-daniel-2027',
        operations: [{ op: 'replace', path: '/content/event/startsAt', value: '2027-06-12T16:00' }],
      }),
    );
    expect(edited.siteUrl).toBe('https://clips.test/s/maya-daniel-2027');
    expect(edited.editorUrl).toBe(created.editorUrl);
    expect((await findSiteBySlug('maya-daniel-2027'))?.content).toMatchObject({
      event: { venue: 'Villa Cimbrone', startsAt: '2027-06-12T16:00' },
    });
    const { couple, ...live } = (await findSiteBySlug('maya-daniel-2027'))?.content ?? {};
    await saveSiteDraft(created.siteId, {
      ...live,
      couple: { ...(couple as object), greeting: 'Join us' },
    });
    expect(jsonOf<SiteResult>(await call('get_site', { siteId: created.siteId }))).toMatchObject({
      hasUnsavedChanges: true,
      content: { couple: { greeting: 'Join us' } },
    });
    await call('edit_site', {
      siteId: created.siteId,
      operations: [{ op: 'replace', path: '/content/event/venue', value: 'Ravello' }],
    });
    expect(await findSiteBySlug('maya-daniel-2027')).toMatchObject({
      draft: null,
      content: { couple: { greeting: 'Join us' }, event: { venue: 'Ravello' } },
    });
    expect(
      jsonOf<{ sites: SiteResult[] }>(await call('list_sites', {})).sites.map(
        (site) => site.siteId,
      ),
    ).toEqual([created.siteId]);
    expect(
      (
        await call('edit_site', {
          siteId: created.siteId,
          operations: [{ op: 'replace', path: '/templateId', value: 'other' }],
        })
      ).isError,
    ).toBe(true);
    expect(
      (await call('create_site', { templateId: 'emerald-rose', slug: 'Bad Slug' })).isError,
    ).toBe(true);
    const taken = await call('create_site', {
      templateId: 'emerald-rose',
      slug: 'maya-daniel-2027',
    });
    expect(textOf(taken)).toContain('already taken');
  });

  it('searches clips and describes one', async () => {
    const { results } = jsonOf<{ results: { id: string; preview: string }[] }>(
      await call('search_clips', { query: 'brand reveal', limit: 3 }),
    );
    expect(results[0]).toMatchObject({
      id: 'brand-reveal',
      preview: 'https://clips.test/previews/brand-reveal.mp4',
    });
    const clip = jsonOf<{ fieldGuide: string; defaultProps: { brandName: string } }>(
      await call('get_clip', { clipId: 'brand-reveal' }),
    );
    expect(clip.defaultProps.brandName).toBe('Halo');
    expect(clip.fieldGuide).toContain('props/brandName');
    expect((await call('get_clip', { clipId: 'nope' })).isError).toBe(true);
  });

  it('builds a saved video across calls at one editor link', async () => {
    const created = jsonOf<VideoResult>(
      await call('create_video', {
        title: 'Acme launch',
        clips: [{ clipId: 'brand-reveal', props: { brandName: 'Acme' } }],
      }),
    );
    expect(created.editorUrl).toBe(`https://clips.test/video/${created.videoId}`);

    const added = jsonOf<VideoResult>(
      await call('add_clip', { videoId: created.videoId, clipId: 'cta-end-card' }),
    );
    expect(added.timeline[0]?.elements.map((element) => element.clip)).toEqual([
      'brand-reveal (Brand Reveal)',
      'cta-end-card (CTA End Card)',
    ]);

    const edited = jsonOf<VideoResult>(
      await call('edit_video', {
        videoId: created.videoId,
        title: 'Acme is here',
        operations: [
          { op: 'replace', path: '/tracks/0/elements/0/props/tagline', value: 'Ship faster.' },
        ],
      }),
    );
    expect(edited.editorUrl).toBe(created.editorUrl);
    const saved = await findVideo(created.videoId);
    expect(saved?.title).toBe('Acme is here');
    expect(saved?.project.tracks[0]?.elements[0]).toMatchObject({
      props: { brandName: 'Acme', tagline: 'Ship faster.' },
    });
    const current = jsonOf<{ project: { tracks: unknown[] } }>(
      await call('get_video', { videoId: created.videoId }),
    );
    expect(current.project.tracks).toHaveLength(1);
    expect(
      jsonOf<{ videos: { videoId: string }[] }>(await call('list_videos', {})).videos,
    ).toMatchObject([{ videoId: created.videoId }]);
  });

  it('explains invalid input instead of changing anything', async () => {
    const { videoId } = jsonOf<VideoResult>(
      await call('create_video', { title: 'x', clips: [{ clipId: 'brand-reveal' }] }),
    );
    const broken = await call('edit_video', {
      videoId,
      operations: [{ op: 'replace', path: '/tracks/0/elements/0/props/markColor', value: 42 }],
    });
    expect(broken.isError).toBe(true);
    expect(textOf(broken)).toContain('markColor');
    expect((await call('create_video', { title: 'x', clips: [{ clipId: 'nope' }] })).isError).toBe(
      true,
    );
    expect((await call('add_clip', { videoId: 'missing', clipId: 'word-build' })).isError).toBe(
      true,
    );
  });
});
