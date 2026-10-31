import { useMemo } from 'react';
import * as THREE from 'three';
import type { ProblemStrikeoutProps } from '@/schemas';
import { useCanvasFont, useCanvasTexture } from '../promo/desk/canvas-texture';
import { handFontReady, handFonts } from '../promo/fonts';
import { memo } from '../promo/phone-geometry';
import { NOTEBOOK_TOP, notebookMatrix, type StrikeWindow, strikeProgress } from './choreography';
import {
  drawPageBase,
  drawStrike,
  holeCenters,
  PAGE,
  PAGE_CANVAS,
  type StrikePath,
} from './page-art';

const COVER = 0.014;
const BLOCK_TOP = NOTEBOOK_TOP - 0.002;
const COIL_RADIUS = 0.047;
const COIL_TUBE = 0.0062;
const HOLE_Z = -PAGE.depth / 2 + (46 / PAGE_CANVAS.height) * PAGE.depth;

type Look = Pick<ProblemStrikeoutProps, 'page' | 'notebook'>;

const pageGeometry = (curl: number) =>
  memo(`strikeout-page:${curl}`, () => {
    const geometry = new THREE.PlaneGeometry(PAGE.width, PAGE.depth, 48, 64);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.getAttribute('position');
    if (position !== undefined) {
      for (let index = 0; index < position.count; index++) {
        const u = position.getX(index) / PAGE.width + 0.5;
        const v = position.getZ(index) / PAGE.depth + 0.5;
        const corner = THREE.MathUtils.smoothstep(u + v, 1.62, 2);
        const edge = THREE.MathUtils.smoothstep(v, 0.9, 1) * 0.25;
        position.setY(index, (corner * corner * 0.07 + edge * 0.01) * curl);
      }
    }
    geometry.computeVertexNormals();
    return geometry;
  });

const edgeTexture = (color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 3) {
      context.fillStyle = `rgba(70,55,35,${0.08 + ((y * 37) % 11) / 90})`;
      context.fillRect(0, y, canvas.width, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const PageSurface = ({
  page,
  paths,
  coils,
  curl,
  frame,
  schedule,
}: {
  page: Look['page'];
  paths: StrikePath[];
  coils: number;
  curl: number;
  frame: number;
  schedule: StrikeWindow[];
}) => {
  const font = handFonts[page.font];
  useCanvasFont(`700 ${page.size}px "${font}"`, () => handFontReady(page.font));
  const base = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE_CANVAS.width;
    canvas.height = PAGE_CANVAS.height;
    const context = canvas.getContext('2d');
    if (context !== null) {
      drawPageBase(context, page, coils, font);
    }
    return canvas;
  }, [page, coils, font]);
  const progress = paths.map((_, index) => strikeProgress(schedule, index, frame));
  const texture = useCanvasTexture(
    PAGE_CANVAS.width,
    PAGE_CANVAS.height,
    (context) => {
      context.drawImage(base, 0, 0);
      paths.forEach((path, index) => {
        drawStrike(context, path, progress[index] ?? 0, page);
      });
    },
    `${progress.map((value) => value.toFixed(4)).join(',')}:${base.width}:${JSON.stringify(page)}:${coils}`,
  );
  return (
    <mesh geometry={pageGeometry(curl)} position={[0, NOTEBOOK_TOP - 0.0005, 0]} receiveShadow>
      <meshPhysicalMaterial
        map={texture}
        roughness={0.86}
        sheen={0.25}
        sheenRoughness={0.8}
        sheenColor="#ffffff"
      />
    </mesh>
  );
};

const Coils = ({ coils, color }: { coils: number; color: string }) => {
  const geometry = memo('strikeout-coil', () => {
    const torus = new THREE.TorusGeometry(COIL_RADIUS, COIL_TUBE, 14, 48);
    torus.rotateY(Math.PI / 2);
    return torus;
  });
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, metalness: 0.85, roughness: 0.32 }),
    [color],
  );
  return (
    <group>
      {holeCenters(coils).map((center) => (
        <mesh
          key={center}
          geometry={geometry}
          material={material}
          position={[(center - 0.5) * PAGE.width, NOTEBOOK_TOP / 2 + 0.006, HOLE_Z - 0.03]}
          rotation={[0, 0.09, 0]}
          castShadow
        />
      ))}
    </group>
  );
};

export const Notebook = ({
  page,
  notebook,
  schedule,
  paths,
  frame,
}: Look & { schedule: StrikeWindow[]; paths: StrikePath[]; frame: number }) => {
  const edge = useMemo(() => edgeTexture(notebook.pageEdge), [notebook.pageEdge]);
  const blockHeight = BLOCK_TOP - COVER;
  return (
    <group matrixAutoUpdate={false} matrix={notebookMatrix(notebook)}>
      <mesh position={[0.008, COVER / 2, 0.006]} castShadow receiveShadow>
        <boxGeometry args={[PAGE.width + 0.03, COVER, PAGE.depth + 0.018]} />
        <meshPhysicalMaterial color={notebook.cover} roughness={0.62} clearcoat={0.15} />
      </mesh>
      <mesh position={[0, COVER + blockHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PAGE.width - 0.004, blockHeight, PAGE.depth - 0.004]} />
        <meshStandardMaterial map={edge} roughness={0.9} />
      </mesh>
      <PageSurface
        page={page}
        paths={paths}
        coils={notebook.coils}
        curl={notebook.curl}
        frame={frame}
        schedule={schedule}
      />
      <Coils coils={notebook.coils} color={notebook.coil} />
    </group>
  );
};
