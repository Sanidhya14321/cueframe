import { ImageResponse } from 'next/og';
import { stillFileName } from '@/lib/preview-files';
import { POSTER_META } from '@/posters';
import { CLIP_REGISTRY, CLIP_UPDATED_AT } from '@/schemas';
import { SITE_TEMPLATES } from '@/sites/templates';
import { loadFonts, OG_HEIGHT, OG_WIDTH, publicJpeg, SANS, SERIF } from './assets';
import { withAlpha } from './palette';
import { Chips, Column, inkOn, Wordmark } from './parts';

const BASE = '#09090c';
const COLUMNS = 3;
const ROWS = 5;
const TILE = { width: 330, height: 186 };
const GAP = 18;

const plural = (count: number, noun: string): string =>
  `${String(count)} ${noun}${count === 1 ? '' : 's'}`;

const wallClips = () =>
  CLIP_REGISTRY.filter((meta) => meta.width / meta.height >= 1.7)
    .toSorted((left, right) =>
      (CLIP_UPDATED_AT[right.id] ?? '').localeCompare(CLIP_UPDATED_AT[left.id] ?? ''),
    )
    .slice(0, COLUMNS * ROWS);

export const brandImage = async (): Promise<ImageResponse> => {
  const [tiles, fonts] = await Promise.all([
    Promise.all(wallClips().map((meta) => publicJpeg(`previews/${stillFileName(meta.id)}`))),
    loadFonts(),
  ]);
  const ink = inkOn(BASE);
  const packs = new Set(POSTER_META.map((meta) => meta.packId)).size;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: BASE,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: -250,
          width: COLUMNS * TILE.width + (COLUMNS - 1) * GAP,
          display: 'flex',
          flexWrap: 'wrap',
          gap: GAP,
          transform: 'rotate(-14deg)',
        }}
      >
        {tiles.map((src, index) => (
          <img
            key={`tile-${String(index)}`}
            src={src}
            alt=""
            width={TILE.width}
            height={TILE.height}
            style={{
              borderRadius: 16,
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.14)',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage: `linear-gradient(90deg, ${BASE} 0%, ${withAlpha(BASE, 0.96)} 54%, ${withAlpha(BASE, 0.3)} 82%, ${withAlpha(BASE, 0.05)} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage: `radial-gradient(circle at 18% 110%, ${withAlpha('#8b5cf6', 0.38)} 0%, ${withAlpha('#ec4899', 0.12)} 30%, ${withAlpha(BASE, 0)} 55%)`,
        }}
      />
      <Column width={600}>
        <Wordmark ink={ink} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2.6,
              lineHeight: 1.02,
              color: ink.text,
            }}
          >
            <div style={{ display: 'flex' }}>Motion, posters</div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
              and sites,
              <div
                style={{
                  display: 'flex',
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 84,
                  letterSpacing: -1,
                  color: '#f0abfc',
                }}
              >
                editable.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 24, lineHeight: 1.4, color: ink.muted }}>
            Pick a template, change anything in the browser, export or publish.
          </div>
        </div>
        <Chips
          items={[
            plural(CLIP_REGISTRY.length, 'video clip'),
            plural(packs, 'poster pack'),
            plural(SITE_TEMPLATES.length, 'website'),
          ]}
          ink={ink}
        />
      </Column>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
};
