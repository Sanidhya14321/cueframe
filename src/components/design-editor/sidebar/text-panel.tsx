'use client';

import { useEffect } from 'react';
import { createText, cssFontFamily, type DesignElement, type TextElement } from '@/design';
import { loadFontFamilies, loadFontFamily } from '../font-loader';

interface TextPreset {
  label: string;
  element: () => TextElement;
}

const BASIC: TextPreset[] = [
  {
    label: 'Add a heading',
    element: () =>
      createText({
        name: 'Heading',
        text: 'Add a heading',
        fontSize: 96,
        fontWeight: 800,
        width: 800,
      }),
  },
  {
    label: 'Add a subheading',
    element: () =>
      createText({
        name: 'Subheading',
        text: 'Add a subheading',
        fontSize: 56,
        fontWeight: 600,
        width: 700,
      }),
  },
  {
    label: 'Add a little bit of body text',
    element: () =>
      createText({
        name: 'Body',
        text: 'Add a little bit of body text',
        fontSize: 32,
        fontWeight: 400,
        width: 600,
        lineHeight: 1.4,
      }),
  },
];

const COMBOS: (TextPreset & { fontFamily: string; style: string })[] = [
  {
    label: 'SALE',
    fontFamily: 'Anton',
    style: 'text-3xl tracking-wide',
    element: () =>
      createText({
        name: 'Sale',
        text: 'BIG SALE',
        fontFamily: 'Anton',
        fontWeight: 400,
        fontSize: 160,
        width: 760,
        align: 'center',
        fill: '#ef4444',
      }),
  },
  {
    label: 'Elegant',
    fontFamily: 'Playfair Display',
    style: 'text-2xl italic',
    element: () =>
      createText({
        name: 'Elegant',
        text: 'Elegant Moments',
        fontFamily: 'Playfair Display',
        italic: true,
        fontWeight: 600,
        fontSize: 96,
        width: 820,
        align: 'center',
      }),
  },
  {
    label: 'Hello',
    fontFamily: 'Pacifico',
    style: 'text-2xl',
    element: () =>
      createText({
        name: 'Script',
        text: 'Hello there',
        fontFamily: 'Pacifico',
        fontWeight: 400,
        fontSize: 110,
        width: 760,
        align: 'center',
        fill: '#ec4899',
      }),
  },
  {
    label: 'LAUNCH',
    fontFamily: 'Unbounded',
    style: 'text-xl font-bold',
    element: () =>
      createText({
        name: 'Launch',
        text: 'LAUNCH DAY',
        fontFamily: 'Unbounded',
        fontWeight: 800,
        fontSize: 110,
        width: 900,
        align: 'center',
        fill: '#4f46e5',
      }),
  },
  {
    label: 'GAME DAY',
    fontFamily: 'Bebas Neue',
    style: 'text-3xl',
    element: () =>
      createText({
        name: 'Game day',
        text: 'GAME DAY',
        fontFamily: 'Bebas Neue',
        fontWeight: 400,
        fontSize: 200,
        width: 800,
        align: 'center',
        letterSpacing: 6,
      }),
  },
  {
    label: 'Grotesk',
    fontFamily: 'Space Grotesk',
    style: 'text-xl font-bold',
    element: () =>
      createText({
        name: 'Grotesk',
        text: 'Build faster',
        fontFamily: 'Space Grotesk',
        fontWeight: 700,
        fontSize: 110,
        width: 800,
        letterSpacing: -3,
      }),
  },
  {
    label: 'PIXEL',
    fontFamily: 'Press Start 2P',
    style: 'text-sm',
    element: () =>
      createText({
        name: 'Pixel',
        text: 'PLAYER ONE',
        fontFamily: 'Press Start 2P',
        fontWeight: 400,
        fontSize: 64,
        width: 800,
        align: 'center',
        fill: '#22c55e',
      }),
  },
  {
    label: 'Serif',
    fontFamily: 'DM Serif Display',
    style: 'text-2xl',
    element: () =>
      createText({
        name: 'Serif',
        text: 'Slow mornings',
        fontFamily: 'DM Serif Display',
        fontWeight: 400,
        fontSize: 104,
        width: 820,
        align: 'center',
        fill: '#7c4a2d',
      }),
  },
];

export const TextPanel = ({ onAdd }: { onAdd: (element: DesignElement) => void }) => {
  useEffect(() => {
    loadFontFamilies(COMBOS.map((combo) => combo.fontFamily)).catch(() => undefined);
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {BASIC.map((preset, index) => (
          <button
            type="button"
            key={preset.label}
            onClick={() => onAdd(preset.element())}
            className={[
              'rounded-lg bg-muted/70 px-3 py-3 text-left transition-colors hover:bg-accent',
              index === 0
                ? 'font-extrabold text-xl'
                : index === 1
                  ? 'font-semibold text-base'
                  : 'text-sm',
            ].join(' ')}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
          Font combinations
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {COMBOS.map((combo) => (
            <button
              type="button"
              key={combo.label}
              onMouseEnter={() => loadFontFamily(combo.fontFamily).catch(() => undefined)}
              onClick={() => {
                loadFontFamily(combo.fontFamily).catch(() => undefined);
                onAdd(combo.element());
              }}
              className={`flex aspect-[4/3] items-center justify-center rounded-lg bg-muted/70 px-2 text-center transition-colors hover:bg-accent ${combo.style}`}
              style={{ fontFamily: cssFontFamily(combo.fontFamily) }}
            >
              {combo.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
