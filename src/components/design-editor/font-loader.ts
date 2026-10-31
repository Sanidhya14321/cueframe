'use client';

import { useEffect, useState } from 'react';
import type { FontFamilyName } from '@/design';
import { isKnownFont } from '@/design';

const FONT_MODULES: Record<FontFamilyName, () => Promise<unknown>> = {
  Inter: () =>
    import('@remotion/google-fonts/Inter').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Poppins: () =>
    import('@remotion/google-fonts/Poppins').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Montserrat: () =>
    import('@remotion/google-fonts/Montserrat').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'DM Sans': () =>
    import('@remotion/google-fonts/DMSans').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Plus Jakarta Sans': () =>
    import('@remotion/google-fonts/PlusJakartaSans').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Manrope: () =>
    import('@remotion/google-fonts/Manrope').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Outfit: () =>
    import('@remotion/google-fonts/Outfit').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Sora: () =>
    import('@remotion/google-fonts/Sora').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Space Grotesk': () =>
    import('@remotion/google-fonts/SpaceGrotesk').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Raleway: () =>
    import('@remotion/google-fonts/Raleway').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Work Sans': () =>
    import('@remotion/google-fonts/WorkSans').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Lexend: () =>
    import('@remotion/google-fonts/Lexend').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Urbanist: () =>
    import('@remotion/google-fonts/Urbanist').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Figtree: () =>
    import('@remotion/google-fonts/Figtree').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Rubik: () =>
    import('@remotion/google-fonts/Rubik').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Nunito: () =>
    import('@remotion/google-fonts/Nunito').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Quicksand: () =>
    import('@remotion/google-fonts/Quicksand').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Barlow: () =>
    import('@remotion/google-fonts/Barlow').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Barlow Condensed': () =>
    import('@remotion/google-fonts/BarlowCondensed').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Bricolage Grotesque': () =>
    import('@remotion/google-fonts/BricolageGrotesque').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Syne: () =>
    import('@remotion/google-fonts/Syne').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Unbounded: () =>
    import('@remotion/google-fonts/Unbounded').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Archivo Black': () =>
    import('@remotion/google-fonts/ArchivoBlack').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Anton: () =>
    import('@remotion/google-fonts/Anton').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Bebas Neue': () =>
    import('@remotion/google-fonts/BebasNeue').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Oswald: () =>
    import('@remotion/google-fonts/Oswald').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Bungee: () =>
    import('@remotion/google-fonts/Bungee').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Teko: () =>
    import('@remotion/google-fonts/Teko').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Kanit: () =>
    import('@remotion/google-fonts/Kanit').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Righteous: () =>
    import('@remotion/google-fonts/Righteous').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Creepster: () =>
    import('@remotion/google-fonts/Creepster').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Press Start 2P': () =>
    import('@remotion/google-fonts/PressStart2P').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Silkscreen: () =>
    import('@remotion/google-fonts/Silkscreen').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Playfair Display': () =>
    import('@remotion/google-fonts/PlayfairDisplay').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'DM Serif Display': () =>
    import('@remotion/google-fonts/DMSerifDisplay').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Instrument Serif': () =>
    import('@remotion/google-fonts/InstrumentSerif').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Lora: () =>
    import('@remotion/google-fonts/Lora').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Fraunces: () =>
    import('@remotion/google-fonts/Fraunces').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Abril Fatface': () =>
    import('@remotion/google-fonts/AbrilFatface').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Cormorant Garamond': () =>
    import('@remotion/google-fonts/CormorantGaramond').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Libre Baskerville': () =>
    import('@remotion/google-fonts/LibreBaskerville').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Caveat: () =>
    import('@remotion/google-fonts/Caveat').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Pacifico: () =>
    import('@remotion/google-fonts/Pacifico').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Dancing Script': () =>
    import('@remotion/google-fonts/DancingScript').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Permanent Marker': () =>
    import('@remotion/google-fonts/PermanentMarker').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  Satisfy: () =>
    import('@remotion/google-fonts/Satisfy').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Shadows Into Light': () =>
    import('@remotion/google-fonts/ShadowsIntoLight').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  'Space Mono': () =>
    import('@remotion/google-fonts/SpaceMono').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
  VT323: () =>
    import('@remotion/google-fonts/VT323').then((font) =>
      font.loadFont('normal', { subsets: ['latin'] }).waitUntilDone(),
    ),
};

const loads = new Map<string, Promise<void>>();

export const loadFontFamily = (family: string): Promise<void> => {
  if (!isKnownFont(family)) {
    return Promise.resolve();
  }
  const existing = loads.get(family);
  if (existing !== undefined) {
    return existing;
  }
  const promise = FONT_MODULES[family]()
    .then(() => undefined)
    .catch(() => undefined);
  loads.set(family, promise);
  return promise;
};

export const loadFontFamilies = (families: Iterable<string>): Promise<void> =>
  Promise.all([...new Set(families)].map(loadFontFamily)).then(() => undefined);

export const useFontsVersion = (families: readonly string[]): number => {
  const [version, setVersion] = useState(0);
  const key = [...new Set(families)].sort().join('|');

  useEffect(() => {
    let active = true;
    loadFontFamilies(key.split('|').filter(Boolean))
      .then(() => {
        if (active) {
          setVersion((current) => current + 1);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [key]);

  return version;
};
