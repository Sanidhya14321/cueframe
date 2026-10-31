import { useFrame, useThree } from '@react-three/fiber';
import { createContext, type ReactNode, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { getRemotionEnvironment } from 'remotion';
import * as THREE from 'three';
import type { TypeLens } from '@/schemas';
import { POST_FRAGMENT, PREVIEW_SAMPLES, setUniform, srgbVector } from './post-shader';

type Animator = (time: number) => void;

interface Registry {
  add: (animator: Animator) => () => void;
}

const ComposerContext = createContext<Registry | null>(null);

export const useAnimator = (animate: Animator): void => {
  const registry = useContext(ComposerContext);
  const latest = useRef(animate);
  latest.current = animate;
  useLayoutEffect(() => registry?.add((time) => latest.current(time)), [registry]);
};

const QUAD_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const COPY_FRAGMENT = `
uniform sampler2D map;
uniform float weight;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(map, vUv) * weight;
}
`;

const quadScene = (material: THREE.Material): THREE.Scene => {
  const scene = new THREE.Scene();
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  scene.add(mesh);
  return scene;
};

const usePipeline = () =>
  useMemo(() => {
    const copy = new THREE.ShaderMaterial({
      uniforms: { map: { value: null }, weight: { value: 1 } },
      vertexShader: QUAD_VERTEX,
      fragmentShader: COPY_FRAGMENT,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    });
    const post = new THREE.ShaderMaterial({
      uniforms: {
        scene: { value: null },
        resolution: { value: new THREE.Vector2(1, 1) },
        distortion: { value: 0 },
        fringe: { value: 0 },
        shift: { value: 0 },
        grain: { value: 0 },
        showBackdrop: { value: 1 },
        inner: { value: new THREE.Vector3() },
        outer: { value: new THREE.Vector3() },
        glow: { value: new THREE.Vector3() },
        glowStrength: { value: 0 },
        glowAt: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: QUAD_VERTEX,
      fragmentShader: POST_FRAGMENT,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      blending: THREE.NoBlending,
    });
    return {
      copy,
      post,
      copyScene: quadScene(copy),
      postScene: quadScene(post),
      quadCamera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      sample: new THREE.WebGLRenderTarget(1, 1, { samples: 4 }),
      accumulate: new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
      size: new THREE.Vector2(),
    };
  }, []);

export interface ComposerBackdrop {
  show: boolean;
  inner: string;
  outer: string;
  glow: string;
}

export const FrameComposer = ({
  frame,
  lens,
  backdrop,
  children,
}: {
  frame: number;
  lens: TypeLens;
  backdrop: ComposerBackdrop;
  children: ReactNode;
}) => {
  const animators = useMemo(() => new Set<Animator>(), []);
  const registry = useMemo<Registry>(
    () => ({
      add: (animator) => {
        animators.add(animator);
        return () => {
          animators.delete(animator);
        };
      },
    }),
    [animators],
  );
  const pipeline = usePipeline();
  const settings = useRef({ frame, lens, backdrop });
  settings.current = { frame, lens, backdrop };
  const rendering = getRemotionEnvironment().isRendering;
  const gl = useThree((state) => state.gl);
  useLayoutEffect(() => {
    gl.autoClear = false;
  }, [gl]);
  useFrame(({ scene, camera }) => {
    const current = settings.current;
    const { sample, accumulate, copy, post, size } = pipeline;
    gl.getDrawingBufferSize(size);
    if (sample.width !== size.x || sample.height !== size.y) {
      sample.setSize(size.x, size.y);
      accumulate.setSize(size.x, size.y);
    }
    const count = Math.max(
      1,
      Math.round(
        rendering ? current.lens.samples : Math.min(current.lens.samples, PREVIEW_SAMPLES),
      ),
    );
    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(accumulate);
    gl.clear();
    for (let index = 0; index < count; index++) {
      const offset = count === 1 ? 0 : index / (count - 1) - 0.5;
      for (const animate of animators) {
        animate(current.frame + offset * current.lens.shutter);
      }
      gl.setRenderTarget(sample);
      gl.clear();
      gl.render(scene, camera);
      setUniform(copy, 'map', sample.texture);
      setUniform(copy, 'weight', 1 / count);
      gl.setRenderTarget(accumulate);
      gl.render(pipeline.copyScene, pipeline.quadCamera);
    }
    for (const animate of animators) {
      animate(current.frame);
    }
    setUniform(post, 'scene', accumulate.texture);
    setUniform(post, 'resolution', new THREE.Vector2(size.x, size.y));
    setUniform(post, 'distortion', current.lens.distortion);
    setUniform(post, 'fringe', current.lens.fringe);
    setUniform(post, 'shift', current.lens.shift * (size.x / 1920));
    setUniform(post, 'grain', current.lens.grain);
    setUniform(post, 'showBackdrop', current.backdrop.show ? 1 : 0);
    setUniform(post, 'inner', srgbVector(current.backdrop.inner));
    setUniform(post, 'outer', srgbVector(current.backdrop.outer));
    setUniform(post, 'glow', srgbVector(current.backdrop.glow));
    setUniform(post, 'glowStrength', current.lens.glow);
    setUniform(post, 'glowAt', new THREE.Vector2(current.lens.glowX, current.lens.glowY));
    gl.setRenderTarget(null);
    gl.clear();
    gl.render(pipeline.postScene, pipeline.quadCamera);
  }, 1);
  return <ComposerContext.Provider value={registry}>{children}</ComposerContext.Provider>;
};
