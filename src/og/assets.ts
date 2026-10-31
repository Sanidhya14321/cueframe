import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { repoRoot } from '@/lib/repo-root';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const publicJpeg = async (publicPath: string): Promise<string> => {
  const bytes = await readFile(join(repoRoot(), 'public', publicPath));
  return `data:image/jpeg;base64,${bytes.toString('base64')}`;
};

const fontsource = (family: string, file: string): Promise<Buffer> =>
  readFile(join(repoRoot(), 'node_modules', '@fontsource', family, 'files', file));

export const SANS = 'Inter';
export const SERIF = 'Instrument Serif';

export const loadFonts = async () => {
  const [medium, semibold, bold, serif, serifItalic] = await Promise.all([
    fontsource('inter', 'inter-latin-500-normal.woff'),
    fontsource('inter', 'inter-latin-600-normal.woff'),
    fontsource('inter', 'inter-latin-700-normal.woff'),
    fontsource('instrument-serif', 'instrument-serif-latin-400-normal.woff'),
    fontsource('instrument-serif', 'instrument-serif-latin-400-italic.woff'),
  ]);
  return [
    { name: SANS, data: medium, weight: 500 as const, style: 'normal' as const },
    { name: SANS, data: semibold, weight: 600 as const, style: 'normal' as const },
    { name: SANS, data: bold, weight: 700 as const, style: 'normal' as const },
    { name: SERIF, data: serif, weight: 400 as const, style: 'normal' as const },
    { name: SERIF, data: serifItalic, weight: 400 as const, style: 'italic' as const },
  ];
};
