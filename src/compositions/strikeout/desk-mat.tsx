import { useMemo } from 'react';
import * as THREE from 'three';
import { hash } from '../promo/ink-geometry';

const MAT_CANVAS = 512;

const matTexture = (color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = MAT_CANVAS;
  canvas.height = MAT_CANVAS;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = color;
    context.fillRect(0, 0, MAT_CANVAS, MAT_CANVAS);
    for (let index = 0; index < 2600; index++) {
      const light = hash(83, index) > 0.5;
      context.fillStyle = light
        ? `rgba(255,255,255,${0.004 + hash(89, index) * 0.008})`
        : `rgba(0,0,0,${0.006 + hash(97, index) * 0.012})`;
      context.beginPath();
      context.arc(
        hash(101, index) * MAT_CANVAS,
        hash(103, index) * MAT_CANVAS,
        2 + hash(107, index) * 14,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    for (let index = 0; index < 30000; index++) {
      context.fillStyle = `rgba(${hash(109, index) > 0.5 ? '255,255,255' : '0,0,0'},0.07)`;
      context.fillRect(hash(113, index) * MAT_CANVAS, hash(127, index) * MAT_CANVAS, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  texture.anisotropy = 8;
  return texture;
};

export const DeskMat = ({ color, roughness }: { color: string; roughness: number }) => {
  const map = useMemo(() => matTexture(color), [color]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshPhysicalMaterial
        map={map}
        roughness={roughness}
        sheen={0.4}
        sheenRoughness={0.7}
        sheenColor="#8a8f96"
      />
    </mesh>
  );
};
