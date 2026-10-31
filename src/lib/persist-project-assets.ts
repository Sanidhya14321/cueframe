export const persistProjectAssets = async (
  value: unknown,
  projectId: string,
  cache: Map<string, string>,
): Promise<unknown> => {
  if (typeof value === 'string' && (value.startsWith('blob:') || value.startsWith('data:'))) {
    const known = cache.get(value);
    if (known) {
      return known;
    }
    const blob = await (await fetch(value)).blob();
    const response = await fetch(`/api/projects/${projectId}/media`, {
      method: 'POST',
      headers: { 'content-type': blob.type },
      body: blob,
    });
    if (!response.ok) {
      throw new Error('Could not save the selected media file.');
    }
    const saved = (await response.json()) as { url: string };
    cache.set(value, saved.url);
    return saved.url;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((entry) => persistProjectAssets(entry, projectId, cache)));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(value).map(async ([key, entry]) => [
          key,
          await persistProjectAssets(entry, projectId, cache),
        ]),
      ),
    );
  }
  return value;
};
