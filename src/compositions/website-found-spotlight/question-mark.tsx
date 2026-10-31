import { useMemo } from 'react';
import * as THREE from 'three';
import { useCanvasFont, useCanvasTexture } from '../promo/desk/canvas-texture';
import { didoneFont, didoneFontReady } from '../promo/fonts';

const SIZE = 512;

const drawQuestion = (context: CanvasRenderingContext2D): void => {
  context.font = `500 ${SIZE * 0.86}px "${didoneFont}"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.shadowColor = 'rgba(255,255,255,0.55)';
  context.shadowBlur = SIZE * 0.06;
  context.fillText('?', SIZE / 2, SIZE * 0.53);
  context.shadowBlur = 0;
  context.filter = `blur(${SIZE * 0.008}px)`;
  context.globalAlpha = 0.6;
  context.fillText('?', SIZE / 2, SIZE * 0.53);
};

const placement = new THREE.Object3D();

export const QuestionMark = ({
  position,
  eye,
  size,
  opacity,
  color,
}: {
  position: THREE.Vector3;
  eye: THREE.Vector3;
  size: number;
  opacity: number;
  color: string;
}) => {
  useCanvasFont(`500 ${SIZE * 0.86}px "${didoneFont}"`, didoneFontReady);
  const map = useCanvasTexture(SIZE, SIZE, drawQuestion, 'question');
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [map],
  );
  material.color.set(color);
  material.opacity = opacity;
  placement.position.copy(position);
  placement.lookAt(eye);
  return (
    <mesh
      material={material}
      position={position}
      quaternion={placement.quaternion.clone()}
      scale={size}
      renderOrder={3}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};
