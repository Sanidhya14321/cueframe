import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { BurningPaperRevealProps } from '@/schemas';
import { type BurnCues, paperToScreen } from './burn-cues';
import { EDGE_SAMPLES, FIRE_FRAGMENT, FIRE_VERTEX, MAX_EMBERS } from './fire-shader';

const rgb = (hex: string): THREE.Vector3 =>
  new THREE.Vector3(
    Number.parseInt(hex.slice(1, 3), 16) / 255,
    Number.parseInt(hex.slice(3, 5), 16) / 255,
    Number.parseInt(hex.slice(5, 7), 16) / 255,
  );

const createUniforms = (): Record<string, THREE.IUniform> => ({
  uCanvas: { value: new THREE.Vector2(1, 1) },
  uFrame: { value: new THREE.Vector2(1, 1) },
  uOrigin: { value: new THREE.Vector2() },
  uInvX: { value: new THREE.Vector2(1, 0) },
  uInvY: { value: new THREE.Vector2(0, 1) },
  uZoom: { value: 1 },
  uPaper: { value: new THREE.Vector2(1, 1) },
  uEdge: { value: new Array<number>(EDGE_SAMPLES).fill(0) },
  uBounds: { value: new THREE.Vector4() },
  uTime: { value: 0 },
  uStrength: { value: 0 },
  uHeight: { value: 1 },
  uWidth: { value: 1 },
  uTurbulence: { value: 0 },
  uIntensity: { value: 1 },
  uGlow: { value: 1 },
  uEmbers: { value: 0 },
  uSmoke: { value: 0 },
  uSeed: { value: 1 },
  uSpread: { value: 0.5 },
  uCore: { value: new THREE.Vector3() },
  uMid: { value: new THREE.Vector3() },
  uOuter: { value: new THREE.Vector3() },
  uTip: { value: new THREE.Vector3() },
  uEmber: { value: new THREE.Vector3() },
  uSmokeColor: { value: new THREE.Vector3() },
});

const set = (uniforms: Record<string, THREE.IUniform>, name: string, value: unknown) => {
  const slot = uniforms[name];
  if (slot !== undefined) {
    slot.value = value;
  }
};

const FireQuad = ({ props, cues }: { props: BurningPaperRevealProps; cues: BurnCues }) => {
  const { width, height } = useVideoConfig();
  const gl = useThree((state) => state.gl);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FIRE_VERTEX,
        fragmentShader: FIRE_FRAGMENT,
        uniforms: createUniforms(),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        premultipliedAlpha: true,
      }),
    [],
  );
  const { flame, paper, burn } = props;
  const origin = paperToScreen(props, cues, 0, 0);
  const alongX = paperToScreen(props, cues, 1, 0);
  const alongY = paperToScreen(props, cues, 0, 1);
  const ax = alongX.x - origin.x;
  const ay = alongX.y - origin.y;
  const bx = alongY.x - origin.x;
  const by = alongY.y - origin.y;
  const det = ax * by - bx * ay || 1;
  const xs = cues.edge.map((point) => Math.min(paper.width + 80, Math.max(-12, point.x)));
  const buffer = gl.getDrawingBufferSize(new THREE.Vector2());
  const u = material.uniforms;
  set(u, 'uCanvas', buffer);
  set(u, 'uFrame', new THREE.Vector2(width, height));
  set(u, 'uOrigin', new THREE.Vector2(origin.x, origin.y));
  set(u, 'uInvX', new THREE.Vector2(by / det, -bx / det));
  set(u, 'uInvY', new THREE.Vector2(-ay / det, ax / det));
  set(u, 'uZoom', cues.zoom);
  set(u, 'uPaper', new THREE.Vector2(paper.width, paper.height));
  set(u, 'uEdge', xs);
  set(
    u,
    'uBounds',
    new THREE.Vector4(
      Math.min(...xs) - flame.width * 3 - 160,
      -flame.height * 3.4 - 260,
      Math.max(...xs) + flame.width * 4 + 460,
      paper.height + 60,
    ),
  );
  set(u, 'uTime', (cues.frame / 30) * flame.speed);
  set(u, 'uStrength', cues.strength);
  set(u, 'uHeight', flame.height * (0.35 + 0.65 * cues.strength));
  set(u, 'uWidth', flame.width);
  set(u, 'uTurbulence', flame.turbulence);
  set(u, 'uIntensity', flame.intensity * cues.flicker);
  set(u, 'uGlow', flame.glow);
  set(u, 'uEmbers', Math.min(MAX_EMBERS, flame.embers));
  set(u, 'uSmoke', flame.smoke);
  set(u, 'uSeed', burn.seed);
  set(u, 'uSpread', flame.spread);
  set(u, 'uCore', rgb(flame.core));
  set(u, 'uMid', rgb(flame.mid));
  set(u, 'uOuter', rgb(flame.outer));
  set(u, 'uTip', rgb(flame.tip));
  set(u, 'uEmber', rgb(burn.ember));
  set(u, 'uSmokeColor', rgb(flame.smokeColor));
  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

export const FireLayer = ({ props, cues }: { props: BurningPaperRevealProps; cues: BurnCues }) => {
  const { width, height } = useVideoConfig();
  if (cues.strength <= 0) {
    return null;
  }
  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      dpr={1}
      gl={{ antialias: false, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true }}
      camera={{ zoom: 1, position: [0, 0, 10], near: 1, far: 100 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <FireQuad props={props} cues={cues} />
    </ThreeCanvas>
  );
};
