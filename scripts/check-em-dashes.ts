import { $ } from 'bun';

const EM_DASH = String.fromCodePoint(0x2014);

const BINARY_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'avif',
  'ico',
  'mp4',
  'mov',
  'webm',
  'mp3',
  'wav',
  'woff',
  'woff2',
  'ttf',
  'otf',
  'eot',
  'pdf',
  'zip',
  'gz',
  'tgz',
  'wasm',
]);

const extensionOf = (file: string): string => {
  const base = file.slice(file.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  return dot === -1 ? '' : base.slice(dot + 1).toLowerCase();
};

const trackedFiles = async (): Promise<string[]> => {
  const output = await $`git ls-files`.text();
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const lineNumbersWith = (source: string, needle: string): number[] => {
  const lines = source.split('\n');
  const hits: number[] = [];
  for (const [index, line] of lines.entries()) {
    if (line.includes(needle)) {
      hits.push(index + 1);
    }
  }
  return hits;
};

const main = async (): Promise<void> => {
  const files = await trackedFiles();
  const violations: string[] = [];

  for (const file of files) {
    if (file.includes(EM_DASH)) {
      violations.push(`${file}:filename  em-dash in path`);
    }
  }

  const contentChecks = files.filter(
    (file) =>
      !(BINARY_EXTENSIONS.has(extensionOf(file)) || file.startsWith('.agents/skills/impeccable/')),
  );
  const scanned = await Promise.all(
    contentChecks.map(async (file) => {
      const source = await Bun.file(file).text();
      return { file, lines: source.includes(EM_DASH) ? lineNumbersWith(source, EM_DASH) : [] };
    }),
  );

  for (const { file, lines } of scanned) {
    for (const line of lines) {
      violations.push(`${file}:${line}  em-dash (U+2014) in content`);
    }
  }

  if (violations.length > 0) {
    console.error(`Found ${violations.length} em-dash violation(s):`);
    for (const violation of violations) {
      console.error(`  ${violation}`);
    }
    process.exit(1);
  }

  console.info(`check:em-dashes ok (${files.length} tracked files, 0 em-dashes)`);
};

await main();
