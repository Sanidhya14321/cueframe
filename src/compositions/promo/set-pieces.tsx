import { useMemo } from 'react';
import * as THREE from 'three';
import { roundedPlane } from './phone-geometry';
import {
  iconTileGeometry,
  pedestalGeometry,
  type ReliefLayout,
  reliefCoreGeometry,
  reliefRingGeometry,
  reliefRings,
  reliefTop,
  ribbonGeometry,
} from './set-geometry';
import { clayMaterial } from './set-materials';
import { useTexture } from './use-texture';

interface ClayProps {
  color: string;
  roughness: number;
  reflections: number;
}

export const ReliefWall = ({
  layout,
  bevel,
  color,
  roughness,
  reflections,
  showWall,
}: ClayProps & { layout: ReliefLayout; bevel: number; showWall: boolean }) => {
  const material = clayMaterial(color, roughness, reflections);
  const rings = reliefRings(layout);
  return (
    <group>
      {showWall ? (
        <mesh material={material} receiveShadow>
          <planeGeometry args={[900, 300]} />
        </mesh>
      ) : null}
      {layout.depthStep > 0 ? (
        <mesh
          position={[0, 0, reliefTop(layout) / 2]}
          geometry={reliefCoreGeometry(layout.core + bevel * 2, reliefTop(layout), bevel)}
          material={material}
          castShadow
          receiveShadow
        />
      ) : null}
      {rings.map((ring) => (
        <mesh
          key={`${ring.outer}:${ring.depth}`}
          geometry={reliefRingGeometry(ring, bevel)}
          material={material}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
};

export const Pedestal = ({
  size,
  bevel,
  color,
  roughness,
  reflections,
}: ClayProps & { size: number; bevel: number }) => (
  <mesh
    geometry={pedestalGeometry(size, bevel)}
    material={clayMaterial(color, roughness, reflections)}
    castShadow
    receiveShadow
  />
);

interface RibbonFieldProps extends ClayProps {
  count: number;
  width: number;
  length: number;
  thickness: number;
  step: number;
  amplitude: number;
  waves: number;
  curl: number;
}

export const RibbonField = ({
  count,
  width,
  length,
  thickness,
  step,
  amplitude,
  waves,
  curl,
  color,
  roughness,
  reflections,
}: RibbonFieldProps) => {
  const material = clayMaterial(color, roughness, reflections);
  return (
    <group>
      {Array.from({ length: count }, (_unused, index) => {
        const offset = index - (count - 1) / 2;
        const spec = {
          length,
          width,
          thickness: thickness + (index % 2) * step,
          amplitude,
          waves,
          phase: index * 0.9,
          curl,
        };
        return (
          <mesh
            key={offset}
            position={[0, offset * width, 0]}
            geometry={ribbonGeometry(spec)}
            material={material}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
};

export interface AppIconTileProps {
  size: number;
  depth: number;
  color: string;
  backColor: string;
  glyphColor: string;
  glyph: string;
  glyphScale: number;
  roughness: number;
  reflections: number;
}

const FACE_LIFT = 0.004;

export const AppIconTile = ({
  size,
  depth,
  color,
  backColor,
  glyphColor,
  glyph,
  glyphScale,
  roughness,
  reflections,
}: AppIconTileProps) => {
  const map = useTexture(glyph);
  const tint = useMemo(() => new THREE.Color(glyphColor), [glyphColor]);
  const face = size - depth * 0.6;
  const plate = roundedPlane(face, face, face * 0.23);
  return (
    <group>
      <mesh
        geometry={iconTileGeometry(size, depth)}
        material={clayMaterial(backColor, 0.82, reflections)}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, 0, depth / 2 + FACE_LIFT]}
        geometry={plate}
        material={clayMaterial(color, roughness, reflections)}
        receiveShadow
      />
      <mesh position={[0, 0, depth / 2 + FACE_LIFT * 2]} renderOrder={1}>
        <planeGeometry args={[size * glyphScale, size * glyphScale]} />
        <meshBasicMaterial
          map={map}
          color={tint}
          transparent
          toneMapped={false}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-4}
        />
      </mesh>
    </group>
  );
};
