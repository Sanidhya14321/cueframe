import { useEffect, useMemo, useRef } from 'react';
import type * as THREE from 'three';
import { useDisposed, useFootageFrame, useStage } from './footage-stage';
import { createPrintMaterial } from './print-material';
import { gridGeometry, placeGrid } from './tracked-grid';

export type PrintKey = { chroma: readonly [number, number]; reach: number };

export const TrackedPrint = ({
  name,
  map,
  strength,
  shading,
  paperWhite = 0.74,
  colorKey,
}: {
  name: string;
  map: THREE.Texture;
  strength: number;
  shading: number;
  paperWhite?: number;
  colorKey?: PrintKey;
}) => {
  const { plateMap, planes, width, height, stampShare } = useStage();
  const geometry = useDisposed(useMemo(gridGeometry, []));
  const print = useMemo(
    () => createPrintMaterial({ planes, plate: plateMap, width, height, stampShare }),
    [planes, plateMap, width, height, stampShare],
  );
  useEffect(() => () => print.material.dispose(), [print]);
  if (print.material.map !== map) {
    print.material.map = map;
    print.material.needsUpdate = true;
  }
  print.material.opacity = strength;
  print.uniforms.shading.value = shading;
  print.uniforms.paperWhite.value = paperWhite;
  print.uniforms.keyReach.value = colorKey?.reach ?? 0;
  if (colorKey !== undefined) {
    print.uniforms.keyChroma.value.set(colorKey.chroma[0], colorKey.chroma[1]);
  }
  const mesh = useRef<THREE.Mesh>(null);
  useFootageFrame((tracked, index) => {
    print.uniforms.grainSeed.value = (index % 97) * 13.7;
    const quad = tracked.quads[name];
    if (mesh.current !== null) {
      mesh.current.visible = quad !== undefined;
    }
    if (quad !== undefined) {
      placeGrid(geometry, quad, width, height);
    }
  });
  return <mesh ref={mesh} geometry={geometry} material={print.material} renderOrder={1} />;
};
