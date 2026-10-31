import catalog from '../../catalog.json' with { type: 'json' };
export const searchCatalog = (query: string, category?: string, limit = 5) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return catalog
    .filter((clip) => !category || clip.category === category)
    .map((clip) => ({
      clip,
      score: words.reduce(
        (sum, word) =>
          sum +
          (`${clip.id} ${clip.description} ${clip.roles.join(' ')} ${clip.category}`
            .toLowerCase()
            .includes(word)
            ? 1
            : 0),
        0,
      ),
    }))
    .filter(({ score }) => words.length === 0 || score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ clip }) => clip);
};
export const clipCatalog = catalog;
