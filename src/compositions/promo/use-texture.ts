import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const configured = new WeakSet<THREE.Texture>();

const configure = (texture: THREE.Texture): THREE.Texture => {
  if (configured.has(texture)) {
    return texture;
  }
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  configured.add(texture);
  return texture;
};

export const useTexture = (url: string): THREE.Texture =>
  configure(useLoader(THREE.TextureLoader, url));
