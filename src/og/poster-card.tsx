import { ImageResponse } from 'next/og';
import { POSTER_META, type Poster, type PosterMeta, posterPreviewPath } from '@/posters';
import { POSTER_CATEGORIES } from '@/schemas';
import { loadFonts, OG_HEIGHT, OG_WIDTH, publicJpeg, SANS, SERIF } from './assets';
import {
  BACKDROP_ROLES,
  designSwatches,
  isLight,
  pickRole,
  vividAccent,
  withAlpha,
} from './palette';
import { Chips, Clamp, Column, Eyebrow, inkOn, Swatches, Wordmark } from './parts';

const LIGHT_PAPER = '#f2eee7';
const DARK_PAPER = '#0e0e11';
const FAN_OFFSET = 118;
const FAN_TILT = 7;
const PAGE_NUMBER = /\s+\d+$/;

interface Page {
  src: string;
  width: number;
  height: number;
}

const fanPages = (meta: PosterMeta): PosterMeta[] => {
  const pack = POSTER_META.filter((entry) => entry.packId === meta.packId);
  const index = pack.findIndex((entry) => entry.id === meta.id);
  const left = pack[index - 1] ?? pack[index + 2];
  const right = pack[index + 1] ?? pack[index - 2];
  return [left, right, meta].filter((entry): entry is PosterMeta => entry !== undefined);
};

const pageSize = (meta: PosterMeta): { width: number; height: number } => {
  const landscape = meta.width > meta.height;
  const scale = Math.min((landscape ? 300 : 470) / meta.height, 470 / meta.width);
  return { width: Math.round(meta.width * scale), height: Math.round(meta.height * scale) };
};

const Sheet = ({
  page,
  centerX,
  shift,
  tilt,
  shadow,
}: {
  page: Page;
  centerX: number;
  shift: number;
  tilt: number;
  shadow: string;
}) => (
  <img
    src={page.src}
    alt=""
    width={page.width}
    height={page.height}
    style={{
      position: 'absolute',
      left: centerX - page.width / 2 + shift,
      top: (OG_HEIGHT - page.height) / 2,
      borderRadius: 6,
      transform: `rotate(${String(tilt)}deg) scale(${tilt === 0 ? '1' : '0.9'})`,
      boxShadow: shadow,
    }}
  />
);

export const posterImage = async (poster: Poster): Promise<ImageResponse> => {
  const { meta } = poster;
  const swatches = designSwatches(poster.build());
  const backdrop = pickRole(
    swatches,
    BACKDROP_ROLES,
    meta.theme === 'dark' ? '#111111' : '#ffffff',
  );
  const paper = isLight(backdrop) ? LIGHT_PAPER : DARK_PAPER;
  const ink = inkOn(paper);
  const accent = vividAccent(swatches, isLight(paper) ? '#c2410c' : '#f59e0b');
  const pack = POSTER_META.filter((entry) => entry.packId === meta.packId);
  const category = POSTER_CATEGORIES.find((entry) => entry.id === meta.category)?.label ?? 'Poster';
  const size = pageSize(meta);
  const [pages, fonts] = await Promise.all([
    Promise.all(
      fanPages(meta).map(async (entry) => ({
        src: await publicJpeg(posterPreviewPath(entry).slice(1)),
        ...pageSize(entry),
      })),
    ),
    loadFonts(),
  ]);
  const centerX = OG_WIDTH - 84 - FAN_OFFSET * 0.7 - size.width / 2;
  const columnWidth = Math.min(centerX - size.width / 2 - FAN_OFFSET - 72 - 24, 560);
  const shadow = `0 30px 60px ${withAlpha('#000000', isLight(paper) ? 0.22 : 0.6)}, 0 0 0 1px ${ink.hairline}`;
  const [left, right, front] = pages.length === 3 ? pages : [undefined, undefined, pages.at(-1)];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: paper,
        backgroundImage: `radial-gradient(circle at ${String(Math.round((centerX / OG_WIDTH) * 100))}% 50%, ${withAlpha(accent, 0.34)} 0%, ${withAlpha(accent, 0)} 58%)`,
        fontFamily: SANS,
      }}
    >
      {left === undefined ? null : (
        <Sheet page={left} centerX={centerX} shift={-FAN_OFFSET} tilt={-FAN_TILT} shadow={shadow} />
      )}
      {right === undefined ? null : (
        <Sheet page={right} centerX={centerX} shift={FAN_OFFSET} tilt={FAN_TILT} shadow={shadow} />
      )}
      {front === undefined ? null : (
        <Sheet page={front} centerX={centerX} shift={0} tilt={0} shadow={shadow} />
      )}
      <Column width={columnWidth}>
        <Wordmark ink={ink} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Eyebrow
            parts={[category, `${String(pack.indexOf(meta) + 1)} of ${String(pack.length)}`]}
            accent={accent}
            ink={ink}
          />
          <Clamp
            lines={3}
            style={{
              fontFamily: SERIF,
              fontSize: columnWidth > 440 ? 88 : 70,
              letterSpacing: -1.2,
              lineHeight: 0.98,
              color: ink.text,
            }}
          >
            {meta.title.replace(PAGE_NUMBER, '')}
          </Clamp>
          <Clamp lines={2} style={{ fontSize: 22, lineHeight: 1.42, color: ink.muted }}>
            {meta.description}
          </Clamp>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Swatches colors={swatches.map((swatch) => swatch.value)} ink={ink} />
          <Chips
            items={[`${String(meta.width)} × ${String(meta.height)}`, 'PNG · PDF']}
            ink={ink}
          />
        </div>
      </Column>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
};
