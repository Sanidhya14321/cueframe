import { ImageResponse } from 'next/og';
import { clipControlsFor } from '@/core';
import { firstFrameFileName, stillFileName } from '@/lib/preview-files';
import { CLIP_CATEGORIES, type ClipId, getClipDefaults, getClipMeta } from '@/schemas';
import { loadFonts, OG_HEIGHT, OG_WIDTH, publicJpeg, SANS } from './assets';
import { controlSwatches, vividAccent, withAlpha } from './palette';
import { Chips, Clamp, Column, Eyebrow, inkOn, Swatches, Wordmark } from './parts';

const BASE = '#07070a';
const BRAND_ACCENT = '#a78bfa';

interface Frame {
  left: number;
  top: number;
  width: number;
  height: number;
}

const frameFor = (width: number, height: number): Frame => {
  const ratio = width / height;
  if (ratio >= 1.2) {
    const frameWidth = 680;
    const frameHeight = Math.round(frameWidth / ratio);
    return {
      left: OG_WIDTH + BLEED - frameWidth,
      top: (OG_HEIGHT - frameHeight) / 2,
      width: frameWidth,
      height: frameHeight,
    };
  }
  const frameHeight = ratio > 0.85 ? 470 : 530;
  const frameWidth = Math.round(frameHeight * ratio);
  return {
    left: OG_WIDTH - 96 - frameWidth,
    top: (OG_HEIGHT - frameHeight) / 2,
    width: frameWidth,
    height: frameHeight,
  };
};

const timecode = (frames: number, fps: number): string => {
  const seconds = Math.round(frames / fps);
  return `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, '0')}`;
};

const BLEED = 40;

const PlayButton = () => (
  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: 19,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
    }}
  >
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
      <path d="M2 1.2v13.6L13 8z" fill="#0b0b0f" />
    </svg>
  </div>
);

const Scrubber = ({
  progress,
  accent,
  elapsed,
  total,
  inset,
  compact,
}: {
  progress: number;
  accent: string;
  elapsed: string;
  total: string;
  inset: number;
  compact: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: `56px ${String(inset + 20)}px 18px 18px`,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.62) 100%)',
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 600,
    }}
  >
    <PlayButton />
    {compact ? null : <div style={{ display: 'flex' }}>{elapsed}</div>}
    <div
      style={{
        flex: 1,
        height: 5,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.28)',
      }}
    >
      <div
        style={{
          width: `${String(Math.round(progress * 100))}%`,
          height: 5,
          borderRadius: 3,
          background: accent,
        }}
      />
      <div
        style={{
          width: 15,
          height: 15,
          marginLeft: -8,
          borderRadius: 8,
          background: '#ffffff',
          boxShadow: `0 0 0 4px ${withAlpha(accent, 0.45)}`,
        }}
      />
    </div>
    <div style={{ display: 'flex', color: 'rgba(255, 255, 255, 0.72)' }}>{total}</div>
  </div>
);

export const clipImage = async (id: ClipId): Promise<ImageResponse> => {
  const meta = getClipMeta(id);
  const swatches = controlSwatches(clipControlsFor(id), getClipDefaults(id));
  const accent = vividAccent(swatches, BRAND_ACCENT);
  const category = CLIP_CATEGORIES.find((entry) => entry.id === meta.category)?.label ?? 'Clip';
  const [still, ambient, fonts] = await Promise.all([
    publicJpeg(`previews/${stillFileName(id)}`),
    publicJpeg(`previews/${firstFrameFileName(id)}`),
    loadFonts(),
  ]);
  const frame = frameFor(meta.width, meta.height);
  const columnWidth = Math.min(frame.left - 72 - 56, 640);
  const ink = inkOn(BASE);
  const posterFrame = Math.min(meta.posterFrame, meta.durationInFrames);

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
      <img
        src={ambient}
        alt=""
        width={OG_WIDTH + 400}
        height={OG_HEIGHT + 400}
        style={{
          position: 'absolute',
          left: -200,
          top: -200,
          objectFit: 'cover',
          opacity: 0.85,
          filter: 'blur(48px) saturate(1.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage: `linear-gradient(90deg, ${withAlpha(BASE, 0.97)} 0%, ${withAlpha(BASE, 0.88)} 38%, ${withAlpha(BASE, 0.4)} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: frame.left,
          top: frame.top,
          width: frame.width,
          height: frame.height,
          display: 'flex',
          borderRadius: 22,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `0 40px 90px rgba(0, 0, 0, 0.6), 0 0 120px ${withAlpha(accent, 0.22)}`,
        }}
      >
        <img
          src={still}
          alt=""
          width={frame.width}
          height={frame.height}
          style={{ position: 'absolute', left: 0, top: 0, objectFit: 'cover' }}
        />
        <Scrubber
          inset={frame.left + frame.width > OG_WIDTH ? BLEED : 0}
          compact={frame.width < 420}
          progress={posterFrame / meta.durationInFrames}
          accent={accent}
          elapsed={timecode(posterFrame, meta.fps)}
          total={timecode(meta.durationInFrames, meta.fps)}
        />
      </div>
      <Column width={columnWidth}>
        <Wordmark ink={ink} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Eyebrow parts={['Video clip', category]} accent={accent} ink={ink} />
          <Clamp
            lines={3}
            style={{
              fontSize: columnWidth > 560 ? 76 : 60,
              fontWeight: 700,
              letterSpacing: -2.4,
              lineHeight: 1.02,
              color: ink.text,
            }}
          >
            {meta.title}
          </Clamp>
          <Clamp lines={2} style={{ fontSize: 23, lineHeight: 1.4, color: ink.muted }}>
            {meta.description}
          </Clamp>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Swatches colors={swatches.map((swatch) => swatch.value)} ink={ink} />
          <Chips
            items={[`${String(meta.width)} × ${String(meta.height)}`, `${String(meta.fps)} fps`]}
            ink={ink}
          />
        </div>
      </Column>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
};
