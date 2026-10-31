import * as THREE from 'three';

export const PREVIEW_SAMPLES = 3;

export const srgbVector = (hex: string): THREE.Vector3 => {
  const value = Number.parseInt(hex.slice(1, 7), 16);
  return new THREE.Vector3(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  );
};

export const setUniform = (material: THREE.ShaderMaterial, name: string, value: unknown): void => {
  const uniform = material.uniforms[name];
  if (uniform !== undefined) {
    uniform.value = value;
  }
};

export const POST_FRAGMENT = `
precision highp float;
uniform sampler2D scene;
uniform vec2 resolution;
uniform float distortion;
uniform float fringe;
uniform float shift;
uniform float grain;
uniform float showBackdrop;
uniform vec3 inner;
uniform vec3 outer;
uniform vec3 glow;
uniform float glowStrength;
uniform vec2 glowAt;
varying vec2 vUv;

vec2 lens(vec2 uv, float strength) {
  vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
  vec2 centered = (uv - 0.5) * aspect;
  vec2 corner = 0.5 * aspect;
  float scale = (1.0 + strength * dot(centered, centered)) / (1.0 + strength * dot(corner, corner));
  return 0.5 + (uv - 0.5) * scale;
}

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 base = lens(vUv, distortion);
  vec2 offset = base - 0.5;
  vec2 lateral = vec2(shift / resolution.x, 0.0);
  vec4 red = texture2D(scene, 0.5 + offset * (1.0 + fringe) + lateral);
  vec4 green = texture2D(scene, base);
  vec4 blue = texture2D(scene, 0.5 + offset * (1.0 - fringe) - lateral);
  vec3 ink = vec3(red.r, green.g, blue.b);
  vec3 cover = vec3(red.a, green.a, blue.a);
  vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
  float radius = length((vUv - 0.5) * aspect);
  vec3 paper = mix(inner, outer, smoothstep(0.0, 1.1, radius));
  float bloom = 1.0 - smoothstep(0.0, 1.35, length((vUv - glowAt) * aspect));
  paper = mix(paper, glow, glowStrength * bloom * bloom);
  float noise = (hash(gl_FragCoord.xy) - 0.5) * grain;
  if (showBackdrop > 0.5) {
    gl_FragColor = vec4(ink + paper * (1.0 - cover) + noise, 1.0);
  } else {
    gl_FragColor = vec4(ink, max(cover.r, max(cover.g, cover.b)));
  }
}
`;
