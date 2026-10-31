import type { ItineraryPageLook, WeddingItineraryPagesProps } from '@/schemas';

type Props = WeddingItineraryPagesProps;

type RowStyle = 'title' | 'names' | 'script' | 'joiner' | 'bold' | 'regular' | 'small';

export type Row = { text: string; style: RowStyle; block: number; accent: boolean };

export type TextPage = {
  key: string;
  start: number;
  end: number;
  typeStart: number;
  look: ItineraryPageLook;
  rows: Row[];
  cover: boolean;
  topAligned: boolean;
};

export type ScenePage = { key: string; start: number; end: number; look: ItineraryPageLook };

const OPEN_LIMIT = 1_000_000;

const splitLines = (text: string): string[] =>
  text.split('\n').filter((line) => line.trim().length > 0);

const SCRIPT_STYLES: readonly RowStyle[] = ['title', 'names', 'script', 'joiner'];

const rowsOf = (block: number, style: RowStyle, text: string, accent = false): Row[] =>
  splitLines(text).map((line) => ({
    text: line,
    style,
    block,
    accent: accent || SCRIPT_STYLES.includes(style),
  }));

const compact = (groups: Row[][]): Row[] => {
  let block = 0;
  return groups.flatMap((group) => {
    if (group.length === 0) {
      return [];
    }
    const placed = group.map((row) => ({ ...row, block }));
    block += 1;
    return placed;
  });
};

export const schedule = (props: Props): { scenes: ScenePage[]; texts: TextPage[] } => {
  const { cover, families, events, closing, timing } = props;
  const familyStart = timing.coverFrames;
  const firstEvent = familyStart + timing.familyFrames;
  const closingStart = firstEvent + events.length * timing.eventFrames;
  const scenes: ScenePage[] = [
    { key: 'cover', start: 0, end: firstEvent, look: cover },
    ...events.map((event, index) => ({
      key: `event-${index}`,
      start: firstEvent + index * timing.eventFrames,
      end: firstEvent + (index + 1) * timing.eventFrames,
      look: event,
    })),
    { key: 'closing', start: closingStart, end: OPEN_LIMIT, look: closing },
  ];
  const coverRows = compact([
    rowsOf(0, 'names', cover.names),
    rowsOf(0, 'regular', cover.dates),
    rowsOf(0, 'bold', cover.hashtag),
  ]);
  const familyRows = compact([
    rowsOf(0, 'bold', families.hosts),
    rowsOf(0, 'small', families.invite),
    [
      ...rowsOf(0, 'script', families.bride),
      ...rowsOf(0, 'bold', families.brideParents),
      ...rowsOf(0, 'joiner', families.joiner),
      ...rowsOf(0, 'script', families.groom),
      ...rowsOf(0, 'bold', families.groomParents),
    ],
  ]);
  const texts: TextPage[] = [
    {
      key: 'cover',
      start: 0,
      end: familyStart,
      typeStart: Math.round(timing.titleDelay * 0.4),
      look: cover,
      rows: coverRows,
      cover: true,
      topAligned: true,
    },
    {
      key: 'families',
      start: familyStart,
      end: firstEvent,
      typeStart: familyStart + 4,
      look: cover,
      rows: familyRows,
      cover: false,
      topAligned: true,
    },
    ...events.map((event, index) => {
      const start = firstEvent + index * timing.eventFrames;
      return {
        key: `event-${index}`,
        start,
        end: start + timing.eventFrames,
        typeStart: start + timing.typeDelay,
        look: event,
        rows: [
          ...rowsOf(-1, 'title', event.name),
          ...compact([
            rowsOf(0, 'bold', event.date),
            rowsOf(0, 'regular', event.venue),
            rowsOf(0, 'bold', event.schedule),
          ]),
        ],
        cover: false,
        topAligned: false,
      };
    }),
    {
      key: 'closing',
      start: closingStart,
      end: OPEN_LIMIT,
      typeStart: closingStart + timing.titleDelay,
      look: closing,
      rows: compact([
        rowsOf(0, 'bold', closing.message, true),
        rowsOf(0, 'regular', closing.visit),
        rowsOf(0, 'regular', closing.rsvp),
      ]),
      cover: false,
      topAligned: false,
    },
  ];
  return { scenes, texts };
};

export type RowTiming = { start: number; end: number };

export const rowTimings = (rows: readonly Row[], page: TextPage, timing: Props['timing']) => {
  const cursors = new Map<number, number>();
  return rows.map((row): RowTiming => {
    if (row.style === 'title') {
      const start = page.start + timing.titleDelay;
      return { start, end: start + timing.blockFrames };
    }
    const begin = cursors.get(row.block) ?? page.typeStart + row.block * timing.blockStagger;
    const end = begin + Math.max(0, Array.from(row.text).length - 1) * timing.charFrames;
    cursors.set(row.block, end + timing.charFrames + 3);
    return { start: begin, end };
  });
};

export const eraseStart = (page: TextPage, timing: Props['timing']): number =>
  page.end - timing.eraseFrames - 6;
