import { lstatSync, type Stats } from 'node:fs';
import { $ } from 'bun';

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_SOURCE_LINES = 400;

const SIZE_EXEMPT_PREFIXES = ['public/'];

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
  'glb',
]);

const KEBAB_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const NEXT_DYNAMIC_SEGMENT = /^\[\[?\.{0,3}[a-zA-Z0-9]+\]?\]$/;
const NEXT_GROUP_SEGMENT = /^\([a-z0-9-]+\)$/;
const WELL_KNOWN_SEGMENT = '.well-known';

type Report = { name: string; scope: string; violations: string[] };

const REPORTS: Report[] = [
  {
    name: 'max-file-size',
    scope: `tracked files <= 2 MB (exempt: ${SIZE_EXEMPT_PREFIXES.join(', ')})`,
    violations: [],
  },
  { name: 'source-line-count', scope: `.ts/.tsx <= ${MAX_SOURCE_LINES} lines`, violations: [] },
  { name: 'crlf-line-endings', scope: 'text files use lf only', violations: [] },
  { name: 'trailing-newline', scope: 'non-empty text files end with a newline', violations: [] },
  { name: 'symlinks', scope: 'no tracked symlinks', violations: [] },
  { name: 'ds-store', scope: 'no .DS_Store files', violations: [] },
  {
    name: 'kebab-case-paths',
    scope:
      'segments under src/ are kebab-case (exempt: Next.js [dynamic], (group) and .well-known segments)',
    violations: [],
  },
];

const BY_NAME = new Map(REPORTS.map((report) => [report.name, report]));

const push = (name: string, entry: string): void => {
  BY_NAME.get(name)?.violations.push(entry);
};

const extensionOf = (file: string): string => {
  const base = file.slice(file.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  return dot === -1 ? '' : base.slice(dot + 1).toLowerCase();
};

const isSizeExempt = (file: string): boolean =>
  SIZE_EXEMPT_PREFIXES.some((prefix) => file.startsWith(prefix));

const isSegmentAllowed = (segment: string): boolean =>
  KEBAB_SEGMENT.test(segment) ||
  NEXT_DYNAMIC_SEGMENT.test(segment) ||
  NEXT_GROUP_SEGMENT.test(segment) ||
  segment === WELL_KNOWN_SEGMENT;

const trackedFiles = async (): Promise<string[]> => {
  const output = await $`git ls-files`.text();
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const countLines = (source: string): number =>
  source.endsWith('\n') ? source.split('\n').length - 1 : source.split('\n').length;

const checkKebab = (file: string): void => {
  const segments = file.split('/');
  const srcIndex = segments.indexOf('src');
  if (srcIndex === -1) {
    return;
  }
  for (const segment of segments.slice(srcIndex + 1)) {
    if (!isSegmentAllowed(segment)) {
      push('kebab-case-paths', `${file} (segment: ${segment})`);
    }
  }
};

const checkMetadata = (file: string, stats: Stats): void => {
  if (!(isSizeExempt(file) || stats.size <= MAX_FILE_BYTES)) {
    push('max-file-size', `${file} (${stats.size} bytes)`);
  }
  if (file.endsWith('.DS_Store') || file.includes('/.DS_Store')) {
    push('ds-store', file);
  }
  checkKebab(file);
};

const checkContent = (file: string, source: string): void => {
  if (source.includes('\r\n')) {
    push('crlf-line-endings', file);
  }
  const extension = extensionOf(file);
  if ((extension === 'ts' || extension === 'tsx') && countLines(source) > MAX_SOURCE_LINES) {
    push('source-line-count', `${file} (${countLines(source)} lines)`);
  }
  if (source.length > 0 && !source.endsWith('\n')) {
    push('trailing-newline', file);
  }
};

const main = async (): Promise<void> => {
  const files = await trackedFiles();
  const contentTargets: string[] = [];

  for (const file of files) {
    const stats = lstatSync(file);
    if (stats.isSymbolicLink()) {
      push('symlinks', file);
      continue;
    }
    checkMetadata(file, stats);
    if (!BINARY_EXTENSIONS.has(extensionOf(file))) {
      contentTargets.push(file);
    }
  }

  const sources = await Promise.all(
    contentTargets.map(async (file) => ({ file, source: await Bun.file(file).text() })),
  );
  for (const { file, source } of sources) {
    checkContent(file, source);
  }

  console.info('check:repository report');
  for (const report of REPORTS) {
    const status = report.violations.length === 0 ? 'ok' : `FAIL (${report.violations.length})`;
    console.info(`  [${status}] ${report.name}: ${report.scope}`);
    for (const violation of report.violations) {
      console.info(`      - ${violation}`);
    }
  }

  const failing = REPORTS.filter((report) => report.violations.length > 0);
  if (failing.length > 0) {
    console.error(`check:repository failed: ${failing.map((report) => report.name).join(', ')}`);
    process.exit(1);
  }
  console.info(`check:repository ok (${files.length} tracked files)`);
};

await main();
