import { useMemo } from 'react';
import * as THREE from 'three';
import type { TypeFace } from '@/schemas';
import { typeFaces } from './type-faces';

const FONT_PX = 200;

type WordShape = 'none' | 'pill' | 'circle';

export interface WordArt {
  text: string;
  color: string;
  weight: number;
  face?: TypeFace;
  shape?: WordShape;
  fill?: string;
  stroke?: string;
  shadow?: number;
}

export interface WordTexture {
  texture: THREE.CanvasTexture;
  aspect: number;
  frameX: number;
  frameY: number;
}

const loadedFonts = new Set<string>();
const pendingFonts = new Map<string, Promise<void>>();

const fontOf = (weight: number, face: TypeFace = 'montserrat', px = FONT_PX) =>
  `${weight} ${px}px "${typeFaces[face].family}"`;

const useTypeFace = (weight: number, face: TypeFace = 'montserrat'): void => {
  const key = `${face}:${weight}`;
  if (loadedFonts.has(key)) {
    return;
  }
  const pending =
    pendingFonts.get(key) ??
    typeFaces[face]
      .ready()
      .then(() => document.fonts.load(fontOf(weight, face)))
      .then(() => {
        loadedFonts.add(key);
      });
  pendingFonts.set(key, pending);
  throw pending;
};
let sharedContext: CanvasRenderingContext2D | null = null;

const measureContext = (): CanvasRenderingContext2D => {
  sharedContext ??= document.createElement('canvas').getContext('2d');
  if (sharedContext === null) {
    throw new Error('2d canvas unavailable');
  }
  return sharedContext;
};

const textMetrics = (weight: number, face: TypeFace = 'montserrat') => {
  const context = measureContext();
  context.font = fontOf(weight, face);
  const ascent = context.measureText('H').actualBoundingBoxAscent;
  const descent = context.measureText('gy').actualBoundingBoxDescent;
  return { ascent, descent, measure: (text: string) => context.measureText(text).width };
};

const configureTexture = <T extends THREE.Texture>(texture: T): T => {
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.premultiplyAlpha = true;
  texture.needsUpdate = true;
  return texture;
};

const ARROW = '->';
const SPARK = '*';

const drawGlyph = (
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baseline: number,
  middle: number,
  size: number,
) => {
  if (text === ARROW) {
    const arm = size * 0.26;
    context.lineWidth = size * 0.075;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(centerX - arm, middle + arm);
    context.lineTo(centerX + arm, middle - arm);
    context.moveTo(centerX - arm * 0.35, middle - arm);
    context.lineTo(centerX + arm, middle - arm);
    context.lineTo(centerX + arm, middle + arm * 0.35);
    context.stroke();
    return;
  }
  if (text === SPARK) {
    context.lineWidth = size * 0.045;
    context.lineCap = 'round';
    context.beginPath();
    for (let ray = 0; ray < 12; ray++) {
      const angle = (ray / 12) * Math.PI * 2;
      context.moveTo(
        centerX + Math.cos(angle) * size * 0.06,
        middle + Math.sin(angle) * size * 0.06,
      );
      context.lineTo(centerX + Math.cos(angle) * size * 0.3, middle + Math.sin(angle) * size * 0.3);
    }
    context.stroke();
    return;
  }
  context.fillText(text, centerX, baseline);
};

const measureWord = (art: WordArt) => {
  const shape = art.shape ?? 'none';
  const { ascent, descent, measure } = textMetrics(art.weight, art.face);
  const isGlyph = art.text === ARROW || art.text === SPARK;
  const textWidth = isGlyph ? FONT_PX * 0.7 : measure(art.text);
  const boxHeight = shape === 'none' ? ascent + descent : FONT_PX * 1.32;
  const contentWidth =
    shape === 'pill'
      ? textWidth + FONT_PX * 0.84
      : shape === 'circle'
        ? Math.max(boxHeight, textWidth + FONT_PX * 0.5)
        : textWidth;
  const contentHeight = shape === 'circle' ? contentWidth : boxHeight;
  const margin = (art.shadow ?? 0) > 0 ? FONT_PX * 0.4 : FONT_PX * 0.08;
  return { shape, ascent, descent, contentWidth, contentHeight, margin };
};

const paintWord = (art: WordArt): Omit<WordTexture, 'texture'> & { canvas: HTMLCanvasElement } => {
  const { shape, ascent, descent, contentWidth, contentHeight, margin } = measureWord(art);
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(contentWidth + margin * 2);
  canvas.height = Math.ceil(contentHeight + margin * 2);
  const context = canvas.getContext('2d');
  if (context !== null) {
    const left = (canvas.width - contentWidth) / 2;
    const top = (canvas.height - contentHeight) / 2;
    if (shape !== 'none') {
      const radius = contentHeight / 2;
      context.beginPath();
      context.roundRect(left, top, contentWidth, contentHeight, radius);
      if (art.fill !== undefined) {
        context.save();
        context.shadowColor = `rgba(0, 0, 0, ${art.shadow ?? 0})`;
        context.shadowBlur = FONT_PX * 0.22;
        context.shadowOffsetY = FONT_PX * 0.08;
        context.fillStyle = art.fill;
        context.fill();
        context.restore();
      }
      if (art.stroke !== undefined) {
        const line = FONT_PX * 0.035;
        context.beginPath();
        context.roundRect(
          left + line / 2,
          top + line / 2,
          contentWidth - line,
          contentHeight - line,
          radius - line / 2,
        );
        context.lineWidth = line;
        context.strokeStyle = art.stroke;
        context.stroke();
      }
    }
    context.font = fontOf(art.weight, art.face);
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = art.color;
    context.strokeStyle = art.color;
    const middle = top + contentHeight / 2;
    const glyph = context.measureText(art.text);
    const baseline =
      shape === 'circle'
        ? middle + (glyph.actualBoundingBoxAscent - glyph.actualBoundingBoxDescent) / 2
        : middle + (ascent - descent) / 2 + (shape === 'none' ? 0 : descent * 0.18);
    drawGlyph(context, art.text, left + contentWidth / 2, baseline, middle, FONT_PX);
  }
  return {
    canvas,
    aspect: contentWidth / contentHeight,
    frameX: canvas.width / contentWidth,
    frameY: canvas.height / contentHeight,
  };
};

export const useWordTexture = (art: WordArt): WordTexture => {
  useTypeFace(art.weight, art.face);
  const key = JSON.stringify(art);
  return useMemo(() => {
    const painted = paintWord(JSON.parse(key) as WordArt);
    return {
      texture: configureTexture(new THREE.CanvasTexture(painted.canvas)),
      aspect: painted.aspect,
      frameX: painted.frameX,
      frameY: painted.frameY,
    };
  }, [key]);
};

export const wordAspect = (art: WordArt): number => {
  useTypeFace(art.weight, art.face);
  const { contentWidth, contentHeight } = measureWord(art);
  return contentWidth / contentHeight;
};
