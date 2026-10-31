import { useMemo } from 'react';
import * as THREE from 'three';
import { setUniform, srgbVector } from './post-shader';

const flatMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Vector3() }, opacity: { value: 1 } },
    vertexShader: `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 color; uniform float opacity; void main() { gl_FragColor = vec4(color * opacity, opacity); }`,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilZPass: THREE.ReplaceStencilOp,
  });

const SAMPLES = 72;

export interface WarpGridProps {
  width: number;
  height: number;
  spacing: number;
  bulge: number;
  lineWidth: number;
  color: string;
  opacity: number;
  z: number;
}

const lift = (x: number, y: number, width: number, height: number, bulge: number): number => {
  const u = x / (width * 0.42);
  const v = y / (height * 0.42);
  return bulge * Math.exp(-(u * u + v * v));
};

const gridGeometry = ({
  width,
  height,
  spacing,
  bulge,
  lineWidth,
}: Omit<WarpGridProps, 'color' | 'opacity' | 'z'>): THREE.BufferGeometry => {
  const positions: number[] = [];
  const indices: number[] = [];
  const half = lineWidth / 2;
  const addLine = (point: (t: number) => [number, number], normal: [number, number]) => {
    const base = positions.length / 3;
    for (let sample = 0; sample <= SAMPLES; sample++) {
      const [x, y] = point(sample / SAMPLES);
      for (const side of [-1, 1]) {
        const px = x + normal[0] * half * side;
        const py = y + normal[1] * half * side;
        positions.push(px, py, lift(px, py, width, height, bulge));
      }
      if (sample < SAMPLES) {
        const at = base + sample * 2;
        indices.push(at, at + 1, at + 2, at + 1, at + 3, at + 2);
      }
    }
  };
  const columns = Math.ceil(width / 2 / spacing);
  const rows = Math.ceil(height / 2 / spacing);
  for (let column = -columns; column <= columns; column++) {
    const x = column * spacing;
    addLine((t) => [x, (t - 0.5) * height], [1, 0]);
  }
  for (let row = -rows; row <= rows; row++) {
    const y = row * spacing;
    addLine((t) => [(t - 0.5) * width, y], [0, 1]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  return geometry;
};

export const WarpGrid = ({
  width,
  height,
  spacing,
  bulge,
  lineWidth,
  color,
  opacity,
  z,
}: WarpGridProps) => {
  const geometry = useMemo(
    () => gridGeometry({ width, height, spacing, bulge, lineWidth }),
    [width, height, spacing, bulge, lineWidth],
  );
  const material = useMemo(() => flatMaterial(), []);
  setUniform(material, 'color', srgbVector(color));
  setUniform(material, 'opacity', opacity);
  if (opacity <= 0) {
    return null;
  }
  return <mesh geometry={geometry} material={material} position={[0, 0, z]} renderOrder={-10} />;
};
