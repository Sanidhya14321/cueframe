import { z } from 'zod';
import type { PublishedSite } from '@/sites/published-site';

const problemSchema = z.object({ problem: z.string() });

export type ApiResult<T> = { ok: true; value: T } | { ok: false; problem: string };

const call = async <T>(request: Promise<Response>, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  try {
    const response = await request;
    const body: unknown = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const parsed = problemSchema.safeParse(body);
      return {
        ok: false,
        problem: parsed.success ? parsed.data.problem : `Request failed with ${response.status}.`,
      };
    }
    const parsed = schema.safeParse(body);
    return parsed.success
      ? { ok: true, value: parsed.data }
      : { ok: false, problem: 'Unexpected response.' };
  } catch {
    return { ok: false, problem: 'Could not reach the server.' };
  }
};

const send = (method: 'POST' | 'PUT' | 'PATCH', url: string, body: unknown) =>
  fetch(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const post = (url: string, body: unknown) => send('POST', url, body);

const savedSiteSchema = z.object({
  site: z.object({ id: z.string(), slug: z.string(), updatedAt: z.string() }),
});

export type SavedSite = z.infer<typeof savedSiteSchema>['site'];

export const publishSite = (site: PublishedSite) => call(post('/api/sites', site), savedSiteSchema);

export const publishSiteChanges = (id: string, change: Pick<PublishedSite, 'slug' | 'content'>) =>
  call(send('PUT', `/api/sites/${id}`, change), savedSiteSchema);

export const saveSiteDraft = (id: string, content: Record<string, unknown>) =>
  call(send('PATCH', `/api/sites/${id}`, { content }), z.null());

export const deleteSite = (id: string) =>
  call(fetch(`/api/sites/${id}`, { method: 'DELETE' }), z.null());
