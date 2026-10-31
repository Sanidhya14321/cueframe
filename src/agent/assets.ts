const ASSET_PATTERN = /^asset:\/\/(\d+)$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isHeavyString = (value: string): boolean =>
  value.startsWith('data:') || value.startsWith('blob:') || value.length > 2000;

const mapStrings = (value: unknown, map: (text: string) => string): unknown => {
  if (typeof value === 'string') {
    return map(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapStrings(item, map));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, mapStrings(item, map)]),
    );
  }
  return value;
};

export const maskAssets = (value: unknown): { masked: unknown; assets: string[] } => {
  const assets: string[] = [];
  const masked = mapStrings(value, (text) => {
    if (!isHeavyString(text)) {
      return text;
    }
    const known = assets.indexOf(text);
    if (known !== -1) {
      return `asset://${known}`;
    }
    assets.push(text);
    return `asset://${assets.length - 1}`;
  });
  return { masked, assets };
};

export const restoreAssets = (value: unknown, assets: readonly string[]): unknown =>
  mapStrings(value, (text) => {
    const match = ASSET_PATTERN.exec(text);
    const index = match?.[1] === undefined ? -1 : Number(match[1]);
    return assets[index] ?? text;
  });

export const dropObjectUrls = (value: unknown): unknown =>
  mapStrings(value, (text) => (text.startsWith('blob:') ? '' : text));
