import { useMemo } from 'react';
import * as THREE from 'three';
import type { HandFont } from '@/schemas';
import { handFontReady, handFonts } from '../fonts';
import { useCanvasFont, useCanvasTexture } from './canvas-texture';
import { CLOTH_CANVAS, drawClothNote, drawClothWeave } from './desk-textures';
import { LAPTOP } from './laptop-geometry';
import { type Capsule, resolveContact, restOnFloor } from './towel-contact';
import type { PalmFrame } from './wipe-choreography';

export interface ClothLook {
  size: number;
  paper: string;
  ink: string;
  note: string;
  font: HandFont;
  noteSize: number;
  noteTilt: number;
  bleed: number;
  offsetX: number;
  offsetY: number;
  holdOffsetY: number;
  holdOffsetX: number;
  wrinkles: number;
  creases: number;
  curl: number;
  droop: number;
  bend: number;
  emboss: number;
}

const SEGMENTS = 44;
const PALM_RADIUS = 0.4;
const FINGER_REACH = 0.85;
const HELD_CLEARANCE = 0.09;
const CREASE_WIDTH = 0.045;
const CONTACT_CLEARANCE = 0.014;
const DRAPE_PASSES = 3;
const FLOOR_CLEARANCE = 0.012;

const laptopFloor = {
  height: (x: number, z: number) =>
    Math.abs(x) < LAPTOP.width / 2 && Math.abs(z) < LAPTOP.depth / 2
      ? LAPTOP.baseThickness + LAPTOP.keyHeight + FLOOR_CLEARANCE
      : FLOOR_CLEARANCE,
};

const WAVES = Array.from({ length: 7 }, (_unused, index) => {
  const angle = index * 2.39996;
  const frequency = 3.2 + index * 1.7;
  return {
    kx: Math.cos(angle) * frequency,
    ky: Math.sin(angle) * frequency,
    phase: index * 1.37,
    amplitude: 1 / (1 + index * 0.55),
  };
});

const wrinkle = (x: number, y: number): number =>
  WAVES.reduce(
    (sum, wave) => sum + Math.sin(x * wave.kx + y * wave.ky + wave.phase) * wave.amplitude,
    0,
  ) / 3.2;

const footprintDistance = (x: number, y: number): number => {
  const clamped = Math.max(0, Math.min(FINGER_REACH, y));
  return Math.max(0, Math.hypot(x, y - clamped) - PALM_RADIUS);
};

export const clothPlacement = (
  palm: PalmFrame,
  offsetX: number,
  offsetY: number,
  gap: number,
): THREE.Matrix4 =>
  new THREE.Matrix4()
    .compose(palm.position, palm.quaternion, new THREE.Vector3(1, 1, 1))
    .multiply(new THREE.Matrix4().makeRotationY(Math.PI))
    .multiply(new THREE.Matrix4().makeTranslation(offsetX, offsetY, -gap));

export interface ClothProps {
  palm: PalmFrame;
  look: ClothLook;
  press: number;
  held: number;
  gap: number;
  shiftX: number;
  capsules: (placement: THREE.Matrix4) => Capsule[];
}

export const Cloth = ({ palm, look, press, held, gap, shiftX, capsules }: ClothProps) => {
  useCanvasFont(`64px "${handFonts[look.font]}"`, () => handFontReady(look.font));
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(look.size, look.size, SEGMENTS, SEGMENTS),
    [look.size],
  );
  const flat = useMemo(
    () => Float32Array.from(geometry.getAttribute('position').array),
    [geometry],
  );
  const note = useCanvasTexture(
    CLOTH_CANVAS.width,
    CLOTH_CANVAS.height,
    (context) =>
      drawClothNote(context, look.paper, {
        text: look.note,
        ink: look.ink,
        font: handFonts[look.font],
        size: look.noteSize,
        tilt: look.noteTilt,
        bleed: look.bleed,
      }),
    `${look.paper}:${look.note}:${look.ink}:${look.font}:${look.noteSize}:${look.noteTilt}:${look.bleed}`,
  );
  note.wrapS = THREE.RepeatWrapping;
  note.repeat.set(-1, 1);
  note.offset.set(1, 0);
  const weave = useCanvasTexture(
    CLOTH_CANVAS.width,
    CLOTH_CANVAS.height,
    (context) => drawClothWeave(context, look.paper),
    look.paper,
  );
  const offsetX =
    look.offsetX + (look.holdOffsetX + shiftX) * THREE.MathUtils.smoothstep(held, 0, 0.55);
  const offsetY = look.offsetY + look.holdOffsetY * held;
  const position = geometry.getAttribute('position');
  for (let index = 0; index < position.count; index++) {
    const x = flat[index * 3] ?? 0;
    const y = flat[index * 3 + 1] ?? 0;
    const px = x + offsetX;
    const py = y + offsetY;
    const outside = footprintDistance(px, py);
    const pressedLift = look.curl * Math.min(1, outside / 0.7) ** 2 * 0.22;
    const fingerTop = FINGER_REACH + PALM_RADIUS * 0.6;
    const beyondHand = Math.max(0, Math.abs(px) - PALM_RADIUS * 1.1);
    const heldShape =
      look.bend * beyondHand ** 2 * 0.3 + look.droop * Math.max(0, py - fingerTop) ** 2 * 0.9;
    const looseLift = 0.12 + outside * 0.35;
    const shape = (pressedLift * press + looseLift * (1 - press)) * (1 - held) + heldShape * held;
    const crumple = wrinkle(px, py) * look.wrinkles * (0.018 + outside * 0.05) * (1 - press * 0.6);
    const fold =
      look.creases *
      (0.6 - press * 0.45) *
      (Math.exp(-((y / CREASE_WIDTH) ** 2)) * 0.03 - Math.exp(-((x / CREASE_WIDTH) ** 2)) * 0.022);
    position.setZ(index, shape + crumple + fold - Math.min(1, held * 1.8) * HELD_CLEARANCE);
  }
  const placement = clothPlacement(palm, offsetX, offsetY, gap);
  resolveContact({
    position: position as THREE.BufferAttribute,
    side: SEGMENTS + 1,
    capsules: capsules(placement),
    clearance: CONTACT_CLEARANCE,
    drape: DRAPE_PASSES,
    strength: THREE.MathUtils.smoothstep(held, 0.05, 0.4),
  });
  restOnFloor(position as THREE.BufferAttribute, placement, laptopFloor);
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return (
    <group matrixAutoUpdate={false} matrix={placement}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={weave}
          bumpMap={weave}
          bumpScale={look.emboss}
          roughness={0.95}
          sheen={0.4}
          sheenRoughness={0.8}
          side={THREE.FrontSide}
        />
      </mesh>
      <mesh geometry={geometry} receiveShadow>
        <meshPhysicalMaterial
          map={note}
          bumpMap={note}
          bumpScale={look.emboss}
          roughness={0.95}
          sheen={0.4}
          sheenRoughness={0.8}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
