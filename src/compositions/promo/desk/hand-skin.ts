import * as THREE from 'three';
import { memo, roundedShape } from '../phone-geometry';

export interface NailSpec {
  width: number;
  length: number;
  lift: number;
  center: number;
}

export const FINGER_NAILS: Record<'index' | 'middle' | 'ring' | 'pinky', NailSpec> = {
  index: { width: 0.0108, length: 0.0105, lift: 0.006, center: -0.0082 },
  middle: { width: 0.0112, length: 0.011, lift: 0.006, center: -0.0086 },
  ring: { width: 0.0102, length: 0.0102, lift: 0.0055, center: -0.0082 },
  pinky: { width: 0.0092, length: 0.0092, lift: 0.0051, center: -0.008 },
};

export const THUMB_NAIL: NailSpec = {
  width: 0.0135,
  length: 0.0125,
  lift: 0.0056,
  center: -0.0105,
};

export const nailGeometry = (spec: NailSpec) =>
  memo(`nail:${JSON.stringify(spec)}`, () => {
    const geometry = new THREE.ShapeGeometry(
      roundedShape(spec.width, spec.length, spec.width * 0.42),
      10,
    );
    const position = geometry.getAttribute('position');
    const colors: number[] = [];
    const bed = new THREE.Color('#d99c8c');
    const edge = new THREE.Color('#f1e2d6');
    const moon = new THREE.Color('#ecc9bd');
    for (let index = 0; index < position.count; index++) {
      const x = position.getX(index);
      const along = position.getY(index) / spec.length + 0.5;
      const across = x / (spec.width / 2);
      const z = -along * spec.length + spec.length / 2;
      const y = -(across * across) * spec.width * 0.18 - along * along * spec.length * 0.12;
      position.setXYZ(index, x, y, z);
      const tone = bed
        .clone()
        .lerp(edge, THREE.MathUtils.smoothstep(along, 0.78, 0.9))
        .lerp(moon, (1 - THREE.MathUtils.smoothstep(along, 0.05, 0.22)) * 0.6);
      colors.push(tone.r, tone.g, tone.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return geometry;
  });

export const nailMaterial = new THREE.MeshPhysicalMaterial({
  vertexColors: true,
  roughness: 0.32,
  clearcoat: 0.7,
  clearcoatRoughness: 0.28,
  sheen: 0.3,
  sheenColor: new THREE.Color('#ffd9cc'),
});

const TIP_BONE = /(distal|tip)$/;
const KNUCKLE_BONE = /(proximal|intermediate)$/;

export const paintSkin = (mesh: THREE.SkinnedMesh): void => {
  const geometry = mesh.geometry;
  if (geometry.getAttribute('color') !== undefined) {
    return;
  }
  const names = mesh.skeleton.bones.map((bone) => bone.name);
  const joints = geometry.getAttribute('skinIndex');
  const weights = geometry.getAttribute('skinWeight');
  const normals = geometry.getAttribute('normal');
  const colors: number[] = [];
  const base = new THREE.Color(1, 1, 1);
  const flush = new THREE.Color(1.04, 0.86, 0.84);
  const crease = new THREE.Color(0.9, 0.78, 0.74);
  const palm = new THREE.Color(1.06, 1, 0.94);
  for (let index = 0; index < joints.count; index++) {
    let tip = 0;
    let knuckle = 0;
    let strongest = 0;
    for (let slot = 0; slot < 4; slot++) {
      const name = names[joints.getComponent(index, slot)] ?? '';
      const weight = weights.getComponent(index, slot);
      strongest = Math.max(strongest, weight);
      if (TIP_BONE.test(name)) {
        tip += weight;
      }
      if (KNUCKLE_BONE.test(name)) {
        knuckle += weight;
      }
    }
    const dorsal = THREE.MathUtils.clamp(normals.getX(index) * 1.4, 0, 1);
    const palmar = THREE.MathUtils.clamp(-normals.getX(index) * 1.4, 0, 1);
    const blend = THREE.MathUtils.clamp((1 - strongest) * 2, 0, 1);
    const color = base
      .clone()
      .lerp(flush, Math.min(1, tip * 0.8 + knuckle * blend * dorsal * 0.9))
      .lerp(crease, blend * dorsal * knuckle * 0.6)
      .lerp(palm, palmar * (1 - tip) * 0.7);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
};

const SKIN_NOISE = `
float skinHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float skinNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(skinHash(i), skinHash(i + vec3(1, 0, 0)), f.x),
                 mix(skinHash(i + vec3(0, 1, 0)), skinHash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(skinHash(i + vec3(0, 0, 1)), skinHash(i + vec3(1, 0, 1)), f.x),
                 mix(skinHash(i + vec3(0, 1, 1)), skinHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
`;

export const applySkinDetail = (
  material: THREE.MeshPhysicalMaterial,
  detail: number,
  skinned: boolean,
): void => {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uSkinDetail: { value: detail } });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vSkinPosition;')
      .replace(
        skinned ? '#include <skinning_vertex>' : '#include <begin_vertex>',
        `${skinned ? '#include <skinning_vertex>' : '#include <begin_vertex>'}\nvSkinPosition = transformed;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying vec3 vSkinPosition;\nuniform float uSkinDetail;\n${SKIN_NOISE}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float skinMottle = skinNoise(vSkinPosition * 90.0) * 0.6 + skinNoise(vSkinPosition * 260.0) * 0.4;
diffuseColor.rgb *= mix(1.0, 0.93 + skinMottle * 0.12, uSkinDetail);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.03, 0.95, 0.94), smoothstep(0.55, 0.8, skinNoise(vSkinPosition * 45.0)) * uSkinDetail * 0.6);`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor *= mix(1.0, 0.82 + skinNoise(vSkinPosition * 700.0) * 0.36, uSkinDetail);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
float skinFacing = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
float skinRim = pow(1.0 - skinFacing, 2.5);
totalEmissiveRadiance += vec3(0.62, 0.16, 0.08) * skinRim * uSkinDetail * 0.22 * diffuseColor.rgb;`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
float skinHeight = skinNoise(vSkinPosition * 1400.0) * 0.55 + skinNoise(vSkinPosition * 420.0) * 0.45;
vec3 skinDx = dFdx(-vViewPosition);
vec3 skinDy = dFdy(-vViewPosition);
vec3 skinR1 = cross(skinDy, normal);
vec3 skinR2 = cross(normal, skinDx);
float skinDet = dot(skinDx, skinR1);
vec3 skinGrad = sign(skinDet) * (dFdx(skinHeight) * skinR1 + dFdy(skinHeight) * skinR2);
normal = normalize(abs(skinDet) * normal - skinGrad * 0.004 * uSkinDetail);`,
      );
  };
  material.customProgramCacheKey = () => `skin-detail-${detail}-${skinned}`;
};
