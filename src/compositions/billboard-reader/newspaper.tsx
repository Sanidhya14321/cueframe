import { useMemo } from 'react';
import * as THREE from 'three';
import type { ReaderHero } from '@/schemas';
import { condensedFont } from './board-art';
import type { HeroPose } from './hero-pose';
import { PAGE } from './hero-pose';

const SEGMENTS = 18;
const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 724;

const drawColumns = (context: CanvasRenderingContext2D, top: number, ink: string) => {
  context.fillStyle = ink;
  const columns = 4;
  const gap = 14;
  const width = (TEXTURE_WIDTH - 48 - gap * (columns - 1)) / columns;
  for (let column = 0; column < columns; column++) {
    const x = 24 + column * (width + gap);
    for (let y = top; y < TEXTURE_HEIGHT - 26; y += 11) {
      const shorten = (column * 7 + y) % 9 === 0 ? width * 0.4 : 0;
      context.globalAlpha = 0.55;
      context.fillRect(x, y, width - shorten, 4);
    }
  }
  context.globalAlpha = 1;
};

type PageKind = 'front' | 'inside' | 'plain';

const drawFront = (context: CanvasRenderingContext2D, hero: ReaderHero) => {
  context.font = `700 54px "${condensedFont}"`;
  context.textAlign = 'center';
  context.fillText(hero.masthead.toUpperCase(), TEXTURE_WIDTH / 2, 70, TEXTURE_WIDTH - 40);
  context.fillRect(24, 88, TEXTURE_WIDTH - 48, 4);
  context.font = `600 40px "${condensedFont}"`;
  context.textAlign = 'left';
  hero.frontHeadline
    .split('\n')
    .filter((line) => line.length > 0)
    .slice(0, 2)
    .forEach((line, index) => {
      context.fillText(line, 24, 142 + index * 44, TEXTURE_WIDTH - 48);
    });
  const photo = context.createLinearGradient(0, 210, 0, 400);
  photo.addColorStop(0, '#8a8680');
  photo.addColorStop(1, '#4a4743');
  context.fillStyle = photo;
  context.fillRect(24, 206, 290, 196);
  drawColumns(context, 420, hero.newsInk);
};

const PHOTO_BLOCKS = {
  inside: { bar: 300, photo: [270, 96, 218, 150] },
  plain: { bar: 220, photo: [24, 380, 300, 190] },
} as const;

const drawInside = (
  context: CanvasRenderingContext2D,
  hero: ReaderHero,
  kind: keyof typeof PHOTO_BLOCKS,
) => {
  const layout = PHOTO_BLOCKS[kind];
  context.fillRect(24, 30, TEXTURE_WIDTH - 48, 3);
  context.fillRect(24, 50, layout.bar, 26);
  drawColumns(context, 96, hero.newsInk);
  context.fillStyle = '#7d7973';
  const [x, y, width, height] = layout.photo;
  context.fillRect(x, y, width, height);
};

const drawPage = (hero: ReaderHero, kind: PageKind): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = hero.newsprint;
    context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
    context.fillStyle = hero.newsInk;
    if (kind === 'front') {
      drawFront(context, hero);
    } else {
      drawInside(context, hero, kind);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const pageGeometry = (side: number, angle: number, bend: number): THREE.BufferGeometry => {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let step = 0; step <= SEGMENTS; step++) {
    const u = (step / SEGMENTS) * PAGE.width;
    const k = bend / PAGE.width;
    const reach =
      Math.abs(k) < 1e-4 ? u * Math.cos(angle) : (Math.sin(angle) - Math.sin(angle - k * u)) / k;
    const depth =
      Math.abs(k) < 1e-4 ? u * Math.sin(angle) : (Math.cos(angle - k * u) - Math.cos(angle)) / k;
    const across = step / SEGMENTS;
    for (const row of [0, 1]) {
      positions.push(side * reach, (row - 0.5) * PAGE.height, depth);
      uvs.push(side > 0 ? across : 1 - across, row);
    }
  }
  for (let step = 0; step < SEGMENTS; step++) {
    const a = step * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const Page = ({
  side,
  angle,
  bend,
  map,
  lift = 0,
}: {
  side: number;
  angle: number;
  bend: number;
  map: THREE.Texture;
  lift?: number;
}) => {
  const geometry = useMemo(() => pageGeometry(side, angle, bend), [side, angle, bend]);
  return (
    <mesh geometry={geometry} position={[0, 0, lift]} castShadow receiveShadow>
      <meshStandardMaterial map={map} side={THREE.DoubleSide} roughness={0.92} />
    </mesh>
  );
};

export const Newspaper = ({ hero, pose }: { hero: ReaderHero; pose: HeroPose }) => {
  const front = useMemo(() => drawPage(hero, 'front'), [hero]);
  const inside = useMemo(() => drawPage(hero, 'inside'), [hero]);
  const plain = useMemo(() => drawPage(hero, 'plain'), [hero]);
  const flipAngle = -pose.vee + pose.flip * (Math.PI + pose.vee * 2);
  const turned = pose.flip > 0;
  return (
    <group position={pose.paperCenter} rotation={pose.paperRotation}>
      <Page side={1} angle={-pose.vee} bend={0} map={front} />
      <Page side={-1} angle={-pose.vee} bend={0} map={turned ? plain : inside} />
      {turned ? (
        <Page side={-1} angle={flipAngle} bend={pose.curl * 0.9} map={inside} lift={0.004} />
      ) : null}
    </group>
  );
};
