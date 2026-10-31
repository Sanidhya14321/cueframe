import { between, circlePath, f, leafPath, type Random } from './paint';

const BUSH_KINDS = ['rosette', 'scales', 'cone', 'leafy'] as const;

export type BushKind = (typeof BUSH_KINDS)[number];

export type BushTexture = {
  shade: string;
  middle: string;
  lit: string;
  spots: string;
  lines: string;
  darkBase: boolean;
  stroked: boolean;
};

type Box = { x: number; y: number; w: number; h: number; rand: Random };

const halfWidth = ({ w, h, y }: Box, py: number): number => {
  const height = Math.min(1, Math.max(0, (y - py) / h));
  return (w / 2) * Math.sqrt(Math.max(0, 1 - height ** 2));
};

const rosettes = (box: Box): BushTexture => {
  const { x, y, h, rand } = box;
  const radius = Math.min(34, Math.max(13, h / 5.5));
  let middle = '';
  let lit = '';
  let spots = '';
  let row = 0;
  for (let py = y - h * 0.92; py < y + radius; py += radius * 1.05) {
    const reach = halfWidth(box, py) - radius * 0.3;
    const offset = row % 2 === 0 ? 0 : radius * 0.75;
    for (let px = x - reach + offset; px <= x + reach; px += radius * 1.5) {
      const turn = rand() * Math.PI;
      const upper = (y - py) / h > 0.45 + between(rand, -0.15, 0.15);
      let rosette = '';
      for (let leaf = 0; leaf < 9; leaf++) {
        const angle = turn + (leaf / 9) * Math.PI * 2;
        rosette += leafPath(px, py, radius * between(rand, 0.85, 1.05), radius * 0.26, angle);
      }
      if (upper) {
        lit += rosette;
      } else {
        middle += rosette;
      }
      spots += circlePath(px, py, radius * 0.12);
    }
    row += 1;
  }
  return { shade: '', middle, lit, spots, lines: '', darkBase: true, stroked: false };
};

const scales = (box: Box): BushTexture => {
  const { x, y, h } = box;
  const size = Math.min(26, Math.max(10, h / 7));
  let middle = '';
  let lit = '';
  let lines = '';
  let row = 0;
  for (let py = y - h * 0.97; py < y + size * 0.5; py += size * 0.62) {
    const reach = halfWidth(box, py + size * 0.5) - size * 0.2;
    const offset = row % 2 === 0 ? 0 : size * 0.5;
    let band = '';
    for (let px = x - reach + offset; px <= x + reach; px += size) {
      band += leafPath(px, py, size * 1.2, size * 0.48, Math.PI / 2);
      lines += `M${f(px)} ${f(py + size * 0.15)}l0 ${f(size * 0.8)}`;
    }
    if (row % 2 === 0) {
      lit += band;
    } else {
      middle += band;
    }
    row += 1;
  }
  return { shade: '', middle, lit, spots: '', lines, darkBase: true, stroked: false };
};

const cone = (box: Box): BushTexture => {
  const { x, y, h } = box;
  const step = Math.min(18, Math.max(8, h / 10));
  let lit = '';
  let middle = '';
  let row = 0;
  for (let py = y - h * 0.94; py < y; py += step * 0.8) {
    const reach = halfWidth(box, py) - step * 0.4;
    let zig = `M${f(x - reach)} ${f(py + step * 0.5)}`;
    for (let px = x - reach; px <= x + reach; px += step) {
      zig += `L${f(px + step / 2)} ${f(py)}L${f(px + step)} ${f(py + step * 0.5)}`;
    }
    if (row % 2 === 0) {
      lit += zig;
    } else {
      middle += zig;
    }
    row += 1;
  }
  return { shade: '', middle, lit, spots: '', lines: '', darkBase: true, stroked: true };
};

const leafy = (box: Box): BushTexture => {
  const { x, y, w, h, rand } = box;
  const size = Math.min(1.6, Math.max(0.6, h / 120));
  const count = Math.min(520, Math.max(30, Math.round((w * h) / 120)));
  let shade = '';
  let lit = '';
  let middle = '';
  let spots = '';
  for (let index = 0; index < count; index++) {
    const across = between(rand, -0.47, 0.47);
    const reach = h * Math.sqrt(Math.max(0, 1 - (across * 2) ** 2));
    const up = rand();
    const px = x + across * w;
    const py = y - up * reach * 0.92 - 4;
    const length = between(rand, 8, 15) * size;
    const leaf = leafPath(px, py, length, length * 0.36, between(rand, 0, Math.PI * 2));
    const band = up + between(rand, -0.25, 0.25);
    if (band > 0.62) {
      lit += leaf;
    } else if (band > 0.3) {
      middle += leaf;
    } else {
      shade += leaf;
    }
    if (index % 9 === 0) {
      spots += circlePath(px + 3, py - 2, 1.6 * size);
    }
  }
  return { shade, middle, lit, spots, lines: '', darkBase: false, stroked: false };
};

export const bushTexture = (kind: BushKind, box: Box): BushTexture => {
  switch (kind) {
    case 'rosette':
      return rosettes(box);
    case 'scales':
      return scales(box);
    case 'cone':
      return cone(box);
    default:
      return leafy(box);
  }
};
