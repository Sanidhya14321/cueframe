import { type ReactNode, useMemo, useRef } from 'react';
import type * as THREE from 'three';
import { bentPlane } from './bent-plane';
import { useAnimator } from './frame-composer';
import { useInkMaterial } from './ink-material';
import { setUniform } from './post-shader';
import type { Vec3 } from './type-canvas';
import type { WordArt } from './word-art';
import { useWordTexture } from './word-art';

export interface Pose {
  position: Vec3;
  rotation: Vec3;
  scale: number;
  opacity: number;
}

export const AnimatedWord = ({
  art,
  height,
  bend = 0,
  pose,
  renderOrder = 0,
}: {
  art: WordArt;
  height: number;
  bend?: number;
  pose: (time: number) => Pose;
  renderOrder?: number;
}) => {
  const { texture, aspect, frameX, frameY } = useWordTexture(art);
  const material = useInkMaterial(texture, 1);
  const roundedBend = Math.round(bend * 1000) / 1000;
  const geometry = useMemo(
    () => bentPlane(aspect * frameX, frameY, roundedBend * frameX),
    [aspect, frameX, frameY, roundedBend],
  );
  const mesh = useRef<THREE.Mesh>(null);
  useAnimator((time) => {
    const target = mesh.current;
    if (target === null) {
      return;
    }
    const state = pose(time);
    target.position.set(...state.position);
    target.rotation.set(...state.rotation);
    target.scale.setScalar(Math.max(1e-4, state.scale * height));
    target.visible = state.opacity > 0.002;
    setUniform(material, 'opacity', state.opacity);
  });
  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={renderOrder} />;
};

export const AnimatedGroup = ({
  pose,
  children,
}: {
  pose: (time: number) => Omit<Pose, 'opacity'>;
  children: ReactNode;
}) => {
  const group = useRef<THREE.Group>(null);
  useAnimator((time) => {
    const target = group.current;
    if (target === null) {
      return;
    }
    const state = pose(time);
    target.position.set(...state.position);
    target.rotation.set(...state.rotation);
    target.scale.setScalar(state.scale);
  });
  return <group ref={group}>{children}</group>;
};
