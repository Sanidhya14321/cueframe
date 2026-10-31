import { useMemo } from 'react';
import * as THREE from 'three';
import { roundedFont, roundedFontReady } from './fonts';

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = 256;
const FONT_PX = 150;

let fontLoaded = false;
let fontLoading: Promise<void> | undefined;

const loadRoundedFont = (): Promise<void> => {
  fontLoading ??= roundedFontReady()
    .then(() => document.fonts.load(`600 ${FONT_PX}px "${roundedFont}"`))
    .then(() => {
      fontLoaded = true;
    });
  return fontLoading;
};

const useRoundedFont = (): void => {
  if (!fontLoaded) {
    throw loadRoundedFont();
  }
};

export interface TypedLabelProps {
  text: string;
  shown: (index: number) => number;
  color: string;
  weight: number;
  tracking: number;
  height: number;
}

export const TypedLabel = ({ text, shown, color, weight, tracking, height }: TypedLabelProps) => {
  useRoundedFont();
  const canvas = useMemo(() => {
    const element = document.createElement('canvas');
    element.width = CANVAS_WIDTH;
    element.height = CANVAS_HEIGHT;
    return element;
  }, []);
  const texture = useMemo(() => {
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 16;
    return map;
  }, [canvas]);
  const alphas = text.split('').map((_letter, index) => shown(index));
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    {
      context.font = `${weight} ${FONT_PX}px "${roundedFont}"`;
      context.textBaseline = 'middle';
      context.fillStyle = color;
      const spacing = tracking * FONT_PX;
      const widths = text.split('').map((letter) => context.measureText(letter).width + spacing);
      const total = widths.reduce((sum, value) => sum + value, 0) - spacing;
      let x = (CANVAS_WIDTH - total) / 2;
      text.split('').forEach((letter, index) => {
        context.globalAlpha = alphas[index] ?? 0;
        context.fillText(letter, x, CANVAS_HEIGHT / 2);
        x += widths[index] ?? 0;
      });
      context.globalAlpha = 1;
    }
    texture.needsUpdate = true;
  }
  const width = height * (CANVAS_WIDTH / CANVAS_HEIGHT);
  return (
    <mesh renderOrder={2}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
};
