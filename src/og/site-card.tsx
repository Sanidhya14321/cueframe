import { ImageResponse } from 'next/og';
import { resolveClipControls } from '@/core';
import { SITE_URL } from '@/lib/site-url';
import { SITE_PREVIEW_SIZE, sitePreviewPath } from '@/lib/sites';
import { SITE_CATEGORIES } from '@/schemas';
import { publicSitePath } from '@/sites/published-site';
import { slugify } from '@/sites/slug';
import type { SiteTemplate } from '@/sites/types';
import { loadFonts, OG_HEIGHT, OG_WIDTH, publicJpeg, SANS, SERIF } from './assets';
import { controlSwatches, pickRole, vividAccent, withAlpha } from './palette';
import { Chips, Clamp, Column, Eyebrow, inkOn, Swatches, Wordmark } from './parts';

const SCREEN_HEIGHT = 470;
const BEZEL = 11;

const LockIcon = ({ color }: { color: string }) => (
  <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden>
    <rect x="1.5" y="7.5" width="13" height="9.5" rx="2.5" fill={color} />
    <path d="M4.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

export const siteImage = async (template: SiteTemplate): Promise<ImageResponse> => {
  const { meta } = template;
  const swatches = controlSwatches(
    resolveClipControls(template.schema, template.controls, template.defaults),
    template.defaults,
  );
  const hero = pickRole(swatches, ['Primary color', 'Secondary color'], '#1e1b4b');
  const accent = vividAccent(
    swatches.filter((swatch) => swatch.value !== hero),
    '#f0abfc',
  );
  const ink = inkOn(hero);
  const category = SITE_CATEGORIES.find((entry) => entry.id === meta.category)?.label ?? 'Website';
  const screen = {
    width: Math.round((SCREEN_HEIGHT * SITE_PREVIEW_SIZE.width) / SITE_PREVIEW_SIZE.height),
    height: SCREEN_HEIGHT,
  };
  const phone = { width: screen.width + BEZEL * 2, height: screen.height + BEZEL * 2 };
  const phoneLeft = OG_WIDTH - 150 - phone.width;
  const phoneTop = (OG_HEIGHT - phone.height) / 2;
  const address = `${SITE_URL.host}${publicSitePath(slugify(template.headline(template.defaults)))}`;
  const [preview, fonts] = await Promise.all([
    publicJpeg(sitePreviewPath(meta.id).slice(1)),
    loadFonts(),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: hero,
        backgroundImage: `radial-gradient(circle at 76% 46%, ${withAlpha(accent, 0.42)} 0%, ${withAlpha(accent, 0)} 52%), linear-gradient(120deg, ${withAlpha('#000000', 0.35)} 0%, ${withAlpha('#000000', 0)} 70%)`,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: phoneLeft,
          top: phoneTop,
          width: phone.width,
          height: phone.height,
          display: 'flex',
          padding: BEZEL,
          borderRadius: 48,
          background: '#0b0b0d',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: `0 50px 90px ${withAlpha('#000000', 0.5)}`,
        }}
      >
        <img
          src={preview}
          alt=""
          width={screen.width}
          height={screen.height}
          style={{ borderRadius: 38, objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: phoneLeft - 96,
          top: phoneTop + phone.height - 92,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 22px',
          borderRadius: 999,
          background: '#ffffff',
          boxShadow: `0 24px 50px ${withAlpha('#000000', 0.35)}`,
          fontSize: 19,
          fontWeight: 600,
          color: '#16161a',
        }}
      >
        <LockIcon color={accent} />
        {address}
      </div>
      <Column width={phoneLeft - 96 - 72 - 48}>
        <Wordmark ink={ink} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Eyebrow parts={['Website', category]} accent={accent} ink={ink} />
          <Clamp
            lines={3}
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 84,
              letterSpacing: -1.2,
              lineHeight: 0.98,
              color: ink.text,
            }}
          >
            {meta.title}
          </Clamp>
          <Clamp lines={2} style={{ fontSize: 22, lineHeight: 1.42, color: ink.muted }}>
            {meta.description}
          </Clamp>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Swatches colors={swatches.map((swatch) => swatch.value)} ink={ink} />
          <Chips items={['Edit in the browser', 'Your own link']} ink={ink} />
        </div>
      </Column>
    </div>,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );
};
