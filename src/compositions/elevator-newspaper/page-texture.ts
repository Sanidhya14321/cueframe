import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ElevatorNewspaperProps } from '@/schemas';
import { usePageFonts } from './page-fonts';
import { drawPage, type PageSide } from './page-layout';

export const usePageTexture = (
  side: PageSide,
  props: ElevatorNewspaperProps,
  photo: HTMLImageElement | null,
): THREE.Texture => {
  usePageFonts();
  const { masthead, cover, story, ink, print } = props;
  const { softness, paperTint } = print;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    drawPage(canvas, side, { masthead, cover, story, ink, print: { softness, paperTint } }, photo);
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [side, masthead, cover, story, ink, softness, paperTint, photo]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};
