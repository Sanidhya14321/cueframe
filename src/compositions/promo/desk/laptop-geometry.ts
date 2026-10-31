import * as THREE from 'three';
import { memo, roundedShape } from '../phone-geometry';

export const LAPTOP = {
  width: 3.2,
  depth: 2.2,
  baseThickness: 0.15,
  radius: 0.14,
  lidThickness: 0.065,
  lidHeight: 2.08,
  screenWidth: 2.98,
  screenHeight: 2.98 / 1.6,
  screenBottom: 0.15,
  keyPitch: 0.19,
  keyGap: 0.03,
  keyHeight: 0.022,
  keyboardBack: -0.92,
  trackpadWidth: 1.12,
  trackpadDepth: 0.68,
  trackpadCenter: 0.62,
} as const;

export const SCREEN_FACE = LAPTOP.lidThickness / 2 + 0.002;

export interface KeySpec {
  x: number;
  z: number;
  width: number;
  depth: number;
  label: string;
}

const ROWS: { height: number; keys: [string, number][] }[] = [
  {
    height: 0.55,
    keys: [
      ['esc', 1],
      ['F1', 1],
      ['F2', 1],
      ['F3', 1],
      ['F4', 1],
      ['F5', 1],
      ['F6', 1],
      ['F7', 1],
      ['F8', 1],
      ['F9', 1],
      ['F10', 1],
      ['F11', 1],
      ['F12', 1],
      ['del', 2],
    ],
  },
  {
    height: 1,
    keys: [...'`1234567890-='].map((label): [string, number] => [label, 1]).concat([['⌫', 2]]),
  },
  {
    height: 1,
    keys: [['tab', 1.5] as [string, number]]
      .concat([...'QWERTYUIOP[]'].map((label): [string, number] => [label, 1]))
      .concat([['\\', 1.5]]),
  },
  {
    height: 1,
    keys: [['caps', 1.75] as [string, number]]
      .concat([...`ASDFGHJKL;'`].map((label): [string, number] => [label, 1]))
      .concat([['enter', 2.25]]),
  },
  {
    height: 1,
    keys: [['shift', 2.25] as [string, number]]
      .concat([...'ZXCVBNM,./'].map((label): [string, number] => [label, 1]))
      .concat([['shift', 2.75]]),
  },
  {
    height: 1,
    keys: [
      ['ctrl', 1.25],
      ['fn', 1],
      ['opt', 1.25],
      ['cmd', 1.5],
      ['', 5.5],
      ['cmd', 1.25],
      ['opt', 1.25],
      ['◀', 1],
      ['▼', 1],
      ['▶', 1],
    ],
  },
];

const ROW_UNITS = 15;

export const KEYBOARD_WIDTH = ROW_UNITS * LAPTOP.keyPitch;

export const keyboardLayout = (): KeySpec[] => {
  const pitch = LAPTOP.keyPitch;
  const keys: KeySpec[] = [];
  let rowTop = LAPTOP.keyboardBack;
  for (const row of ROWS) {
    const rowDepth = row.height * pitch;
    const units = row.keys.reduce((sum, [, width]) => sum + width, 0);
    const scale = ROW_UNITS / units;
    let cursor = -KEYBOARD_WIDTH / 2;
    for (const [label, width] of row.keys) {
      const span = width * scale * pitch;
      keys.push({
        x: cursor + span / 2,
        z: rowTop + rowDepth / 2,
        width: span - LAPTOP.keyGap,
        depth: rowDepth - LAPTOP.keyGap,
        label,
      });
      cursor += span;
    }
    rowTop += rowDepth;
  }
  return keys;
};

export const keyboardDepth = (): number =>
  ROWS.reduce((sum, row) => sum + row.height * LAPTOP.keyPitch, 0);

export const flatRoundedSlab = (width: number, depth: number, radius: number, height: number) =>
  memo(`laptop-slab:${width}:${depth}:${radius}:${height}`, () => {
    const bevel = Math.min(0.02, height / 3);
    const geometry = new THREE.ExtrudeGeometry(
      roundedShape(width - bevel * 2, depth - bevel * 2, Math.max(0.001, radius - bevel)),
      {
        depth: height - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 4,
        curveSegments: 16,
      },
    );
    geometry.translate(0, 0, -(height - bevel * 2) / 2);
    geometry.computeVertexNormals();
    return geometry;
  });
