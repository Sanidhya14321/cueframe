import { useMemo } from 'react';
import * as THREE from 'three';

const GHOSTS = 5;
const SWEEP = 0.16;

const discTexture = (): THREE.CanvasTexture => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (context !== null) {
    const center = size / 2;
    const gradient = context.createRadialGradient(center, center, 6, center, center, center);
    gradient.addColorStop(0, 'rgba(30,32,36,0.0)');
    gradient.addColorStop(0.2, 'rgba(30,32,36,0.1)');
    gradient.addColorStop(0.82, 'rgba(30,32,36,0.06)');
    gradient.addColorStop(0.95, 'rgba(30,32,36,0.16)');
    gradient.addColorStop(1, 'rgba(30,32,36,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = 'destination-out';
    for (let ring = 0; ring < 9; ring++) {
      context.strokeStyle = `rgba(0,0,0,${0.12 + (ring % 3) * 0.05})`;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(center, center, 30 + ring * 11, 0, Math.PI * 2);
      context.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const RotorDisc = ({
  spin,
  radius,
  tint,
  blades,
}: {
  spin: number;
  radius: number;
  tint: string;
  blades: number;
}) => {
  const texture = useMemo(discTexture, []);
  const bladeMaterials = useMemo(
    () =>
      Array.from(
        { length: GHOSTS },
        (_, ghost) =>
          new THREE.MeshStandardMaterial({
            color: '#1d2024',
            roughness: 0.5,
            metalness: 0.4,
            transparent: true,
            depthWrite: false,
            opacity: 0.45 * (1 - ghost / GHOSTS),
          }),
      ),
    [],
  );
  return (
    <group>
      {bladeMaterials.map((material, ghost) => (
        <group key={material.uuid} rotation={[0, spin - (ghost / GHOSTS) * SWEEP, 0]}>
          {Array.from({ length: blades }, (_, blade) => (
            <mesh
              key={blade}
              material={material}
              rotation={[0.04, (blade * Math.PI * 2) / blades, 0]}
              position={[0, 0.08, 0]}
            >
              <boxGeometry args={[radius * 2, 0.035, radius * 0.055]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, spin]} position={[0, 0.09, 0]}>
        <circleGeometry args={[radius * 1.02, 64]} />
        <meshBasicMaterial
          map={texture}
          color={tint}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
