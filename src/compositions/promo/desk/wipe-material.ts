import * as THREE from 'three';

export const WIPE_POINTS = 96;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
#define POINTS ${WIPE_POINTS}
uniform sampler2D uContent;
uniform vec3 uCover;
uniform vec3 uSmudge;
uniform float uHaze;
uniform vec2 uPoints[POINTS];
uniform float uCount;
uniform float uRadius;
uniform float uSoftness;
uniform float uStreaks;
uniform float uReveal;
uniform float uBrightness;
uniform float uAspect;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 5; octave++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float d = 1e3;
  for (int i = 0; i < POINTS - 1; i++) {
    if (float(i) >= uCount) {
      break;
    }
    vec2 a = uPoints[i];
    vec2 b = uPoints[i + 1];
    if (float(i + 1) > uCount) {
      b = mix(a, b, uCount - float(i));
    }
    d = min(d, segment(p, a, b));
  }
  float ragged = (fbm(p * 26.0) - 0.5) * uSoftness * 1.6;
  float streak = smoothstep(0.35, 0.75, fbm(vec2(p.x * 2.5, p.y * 90.0))) * uStreaks;
  float wiped = 1.0 - smoothstep(uRadius - uSoftness, uRadius + uSoftness, d + ragged);
  wiped = clamp(wiped - streak * (1.0 - wiped) * 0.6, 0.0, 1.0);
  float shown = max(wiped, smoothstep(0.0, 1.0, uReveal));
  vec3 content = texture2D(uContent, vUv).rgb;
  float haze = fbm(p * 4.0 + 3.7);
  float blotch = smoothstep(0.35, 0.85, fbm(p * 11.0 - 1.3));
  vec3 cover = mix(uCover, uSmudge, clamp(haze * uHaze + blotch * uHaze * 0.5, 0.0, 1.0));
  vec3 color = mix(cover, content, shown);
  float vignette = 1.0 - smoothstep(0.55, 1.15, length((vUv - 0.5) * vec2(1.0, 0.9)) * 1.25) * 0.12;
  gl_FragColor = vec4(color * uBrightness * vignette, 1.0);
  #include <colorspace_fragment>
}
`;

const wipeUniforms = (content: THREE.Texture) => ({
  uContent: { value: content },
  uCover: { value: new THREE.Color('#ffffff') },
  uSmudge: { value: new THREE.Color('#d8d8d8') },
  uHaze: { value: 0.5 },
  uPoints: { value: Array.from({ length: WIPE_POINTS }, () => new THREE.Vector2()) },
  uCount: { value: 0 },
  uRadius: { value: 0.1 },
  uSoftness: { value: 0.02 },
  uStreaks: { value: 0.3 },
  uReveal: { value: 0 },
  uBrightness: { value: 1 },
  uAspect: { value: 1.6 },
});

export interface WipeMaterial {
  material: THREE.ShaderMaterial;
  uniforms: ReturnType<typeof wipeUniforms>;
}

export const createWipeMaterial = (content: THREE.Texture): WipeMaterial => {
  const uniforms = wipeUniforms(content);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
    uniforms,
  });
  return { material, uniforms };
};

export interface WipeValues {
  cover: string;
  smudge: string;
  haze: number;
  points: THREE.Vector2[];
  count: number;
  radius: number;
  softness: number;
  streaks: number;
  reveal: number;
  brightness: number;
  aspect: number;
}

export const updateWipeMaterial = ({ uniforms }: WipeMaterial, values: WipeValues) => {
  uniforms.uCover.value.set(values.cover);
  uniforms.uSmudge.value.set(values.smudge);
  values.points.forEach((point, index) => {
    uniforms.uPoints.value[index]?.copy(point);
  });
  uniforms.uHaze.value = values.haze;
  uniforms.uCount.value = values.count;
  uniforms.uRadius.value = values.radius;
  uniforms.uSoftness.value = values.softness;
  uniforms.uStreaks.value = values.streaks;
  uniforms.uReveal.value = values.reveal;
  uniforms.uBrightness.value = values.brightness;
  uniforms.uAspect.value = values.aspect;
};
