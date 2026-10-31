import { statSync } from 'node:fs';
import { Glob } from 'bun';
import ts from 'typescript';

type CommentRange = {
  start: number;
  end: number;
  text: string;
  line: number;
};

const ALLOWED = [
  /^\/\/\s*biome-ignore\b/,
  /^\/\*\s*biome-ignore\b/,
  /^\/\/\s*@ts-(expect-error|ignore|nocheck|check)\b/,
  /^\/\/\s*eslint-(disable|enable)\b/,
  /^\/\/\/\s*<reference\b/,
  /^\/\/\s*prettier-ignore\b/,
  /^\/\*!\s/,
];

const isAllowed = (text: string): boolean => ALLOWED.some((pattern) => pattern.test(text));

const lineOf = (lineStarts: readonly number[], position: number): number => {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    const start = lineStarts[mid] ?? 0;
    if (start <= position) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return low + 1;
};

const collectComments = (source: string): CommentRange[] => {
  const sourceFile = ts.createSourceFile(
    'file.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const lineStarts = ts.computeLineStarts(source);
  const found = new Map<number, CommentRange>();

  const addRanges = (ranges: ts.CommentRange[] | undefined): void => {
    if (ranges === undefined) {
      return;
    }
    for (const range of ranges) {
      if (!found.has(range.pos)) {
        found.set(range.pos, {
          start: range.pos,
          end: range.end,
          text: source.slice(range.pos, range.end),
          line: lineOf(lineStarts, range.pos),
        });
      }
    }
  };

  const visit = (node: ts.Node): void => {
    addRanges(ts.getLeadingCommentRanges(source, node.getFullStart()));
    addRanges(ts.getTrailingCommentRanges(source, node.getEnd()));
    node.forEachChild(visit);
  };
  visit(sourceFile);

  return [...found.values()].sort((left, right) => left.start - right.start);
};

const stripFrom = (source: string, disallowed: CommentRange[]): string => {
  let output = source;
  for (const comment of [...disallowed].sort((a, b) => b.start - a.start)) {
    output = output.slice(0, comment.start) + output.slice(comment.end);
  }
  return output
    .split('\n')
    .filter((line, index, lines) => {
      const blank = line.trim().length === 0;
      const prevBlank = (lines[index - 1] ?? 'x').trim().length === 0;
      return !(blank && prevBlank);
    })
    .join('\n');
};

const isScannable = (file: string): boolean =>
  !(file.includes('node_modules') || file.endsWith('.gen.ts') || file.endsWith('.d.ts'));

const scanGlob = async (pattern: string): Promise<string[]> => {
  const glob = new Glob(pattern);
  const files: string[] = [];
  for await (const file of glob.scan({ dot: false })) {
    files.push(file);
  }
  return files;
};

const DEFAULT_PATTERNS = ['*.ts', '{src,tests,e2e,scripts}/**/*.{ts,tsx}'];

const resolveFiles = async (args: string[]): Promise<string[]> => {
  const explicit = args.filter((arg) => !arg.startsWith('--'));
  const resolved = await Promise.all(
    explicit.length === 0
      ? DEFAULT_PATTERNS.map(scanGlob)
      : explicit.map((entry) =>
          statSync(entry).isDirectory()
            ? scanGlob(`${entry}/**/*.{ts,tsx}`)
            : Promise.resolve([entry]),
        ),
  );
  return resolved.flat().filter(isScannable);
};

const main = async (): Promise<void> => {
  const args = Bun.argv.slice(2);
  const checkOnly = args.includes('--check');
  const files = await resolveFiles(args);
  const violations: string[] = [];
  const writes: Promise<unknown>[] = [];

  const scanned = await Promise.all(
    files.map(async (file) => {
      const source = await Bun.file(file).text();
      const disallowed = collectComments(source).filter((comment) => !isAllowed(comment.text));
      return { file, source, disallowed };
    }),
  );

  for (const { file, source, disallowed } of scanned) {
    if (disallowed.length === 0) {
      continue;
    }
    if (checkOnly) {
      for (const comment of disallowed) {
        violations.push(`${file}:${comment.line}  ${comment.text.split('\n')[0]?.trim() ?? ''}`);
      }
    } else {
      writes.push(Bun.write(file, stripFrom(source, disallowed)));
    }
  }
  await Promise.all(writes);

  if (checkOnly && violations.length > 0) {
    console.error(`Found ${violations.length} disallowed comment(s):`);
    for (const violation of violations) {
      console.error(`  ${violation}`);
    }
    process.exit(1);
  }
};

await main();
