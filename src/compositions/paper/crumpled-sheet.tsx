import { useMemo } from 'react';
import * as THREE from 'three';
import { useCanvasFont, useCanvasTexture } from '../promo/desk/canvas-texture';
import { bodyFont, bodyFontReady, didoneFont, didoneFontReady } from '../promo/fonts';
import {
  type CrumpleShape,
  type CrumpleState,
  deformSheet,
  SEGMENTS_X,
  SEGMENTS_Y,
} from './crumple';
import { drawPaperPrint, type PaperPrint, PRINT_WIDTH, printHeight } from './paper-print';
import { reliefMap } from './relief-map';

export interface SheetLook {
  roughness: number;
  sheen: number;
  crinkle: number;
}

const useSheetGeometry = (width: number, height: number) =>
  useMemo(() => {
    const geometry = new THREE.PlaneGeometry(width, height, SEGMENTS_X, SEGMENTS_Y);
    const rest = Float32Array.from(geometry.getAttribute('position').array);
    return { geometry, rest };
  }, [width, height]);

const usePrintTexture = (print: PaperPrint, width: number, height: number) => {
  useCanvasFont(`400 ${print.size}px "${didoneFont}"`, didoneFontReady);
  useCanvasFont(`500 ${Math.round(print.size * print.footerSize)}px "${bodyFont}"`, bodyFontReady);
  const canvasHeight = printHeight(width, height);
  return useCanvasTexture(
    PRINT_WIDTH,
    canvasHeight,
    (context) => drawPaperPrint(context, canvasHeight, print, didoneFont, bodyFont),
    JSON.stringify(print),
  );
};

export const CrumpledSheet = ({
  shape,
  state,
  print,
  look,
}: {
  shape: CrumpleShape;
  state: CrumpleState;
  print: PaperPrint;
  look: SheetLook;
}) => {
  const { geometry, rest } = useSheetGeometry(shape.width, shape.height);
  const map = usePrintTexture(print, shape.width, shape.height);
  const normalMap = reliefMap(shape);
  const front = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map,
        normalMap,
        roughness: look.roughness,
        sheen: look.sheen,
        sheenRoughness: 0.8,
        sheenColor: new THREE.Color('#ffffff'),
        side: THREE.FrontSide,
      }),
    [map, normalMap, look.roughness, look.sheen],
  );
  const back = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: print.paper,
        normalMap,
        roughness: look.roughness,
        sheen: look.sheen,
        sheenRoughness: 0.8,
        side: THREE.BackSide,
      }),
    [print.paper, normalMap, look.roughness, look.sheen],
  );
  deformSheet(geometry, rest, shape, state);
  front.normalScale.set(look.crinkle, look.crinkle);
  back.normalScale.set(look.crinkle, look.crinkle);
  return (
    <group>
      <mesh geometry={geometry} material={front} castShadow receiveShadow />
      <mesh geometry={geometry} material={back} castShadow receiveShadow />
    </group>
  );
};
