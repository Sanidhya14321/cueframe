'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Design, DesignElement, Fill } from '@/design';

const fillColors = (fill: Fill): string[] =>
  typeof fill === 'string' ? [fill] : fill.stops.map((stop) => stop.color);

const elementColors = (element: DesignElement): string[] => {
  switch (element.type) {
    case 'icon':
      return [element.color];
    case 'image':
      return element.strokeWidth > 0 ? [element.stroke] : [];
    case 'line':
      return [element.stroke];
    default:
      return [
        ...fillColors(element.fill),
        ...(element.strokeWidth > 0 ? [element.stroke] : []),
        ...(element.type === 'text' && element.background !== undefined
          ? [element.background.fill]
          : []),
      ];
  }
};

const isSolid = (color: string): boolean => /^#[0-9a-f]{3,8}$/i.test(color);

const documentColors = (design: Design, limit = 20): string[] => {
  const counts = new Map<string, number>();
  for (const color of [
    ...fillColors(design.background),
    ...design.elements.flatMap(elementColors),
  ]) {
    const key = color.toLowerCase();
    if (isSolid(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([color]) => color);
};

const DocumentColorsContext = createContext<readonly string[]>([]);

export const DocumentColorsProvider = ({
  design,
  children,
}: {
  design: Design;
  children: ReactNode;
}) => {
  const colors = useMemo(() => documentColors(design), [design]);
  return <DocumentColorsContext.Provider value={colors}>{children}</DocumentColorsContext.Provider>;
};

export const useDocumentColors = (): readonly string[] => useContext(DocumentColorsContext);

interface EyeDropperInstance {
  open: () => Promise<{ sRGBHex: string }>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

const isEyeDropper = (value: unknown): value is EyeDropperConstructor =>
  typeof value === 'function';

export const eyeDropperSupported = (): boolean =>
  typeof window !== 'undefined' && isEyeDropper(Reflect.get(window, 'EyeDropper'));

export const pickScreenColor = async (): Promise<string | null> => {
  const EyeDropper = Reflect.get(window, 'EyeDropper');
  if (!isEyeDropper(EyeDropper)) {
    return null;
  }
  try {
    const result = await new EyeDropper().open();
    return result.sRGBHex;
  } catch {
    return null;
  }
};
