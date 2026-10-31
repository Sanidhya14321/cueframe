import * as THREE from 'three';
import type { SpillRevealProps } from '@/schemas';
import { useCanvasFont, useCanvasTexture } from '../promo/desk/canvas-texture';
import { roundedFont, roundedFontReady } from '../promo/fonts';

export const CUP = {
  height: 0.78,
  bottomRadius: 0.27,
  topRadius: 0.38,
  wall: 0.008,
  rim: 0.017,
  base: 0.06,
} as const;

export const cupRadiusAt = (height: number): number =>
  CUP.bottomRadius + ((CUP.topRadius - CUP.bottomRadius) * height) / CUP.height;

export const CUP_SIDE_ANGLE = Math.atan((CUP.topRadius - CUP.bottomRadius) / CUP.height);

const LABEL = { width: 1024, height: 256 } as const;

type CupLook = SpillRevealProps['cup'];

const drawLabel = (context: CanvasRenderingContext2D, look: CupLook, mirror: boolean): void => {
  const { width, height } = LABEL;
  context.fillStyle = look.color;
  context.fillRect(0, 0, width, height);
  context.fillStyle = look.band;
  context.fillRect(0, height - 13, width, 13);
  context.fillRect(0, 0, width, 7);
  const radius = height * 0.3;
  for (const center of [0.25, 0.75]) {
    const x = center * width;
    const y = height * 0.5;
    context.fillStyle = look.badge;
    context.beginPath();
    context.ellipse(x, y, radius * 1.05, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.save();
    context.translate(x, y);
    context.scale(mirror ? -1 : 1, 1);
    context.fillStyle = look.markColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `800 ${radius * 0.62}px "${roundedFont}"`;
    context.fillText(look.mark, 0, radius * 0.05, radius * 1.8);
    context.fillRect(-radius * 0.42, radius * 0.42, radius * 0.84, radius * 0.06);
    context.restore();
  }
  for (let fleck = 0; fleck < 700; fleck++) {
    const x = (Math.sin(fleck * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(fleck * 78.233) * 12543.123) % 1;
    context.fillStyle = `rgba(0,0,0,${0.025 + (fleck % 5) * 0.006})`;
    context.fillRect(Math.abs(x) * width, Math.abs(y) * height, 1, 1);
  }
};

const paper = (color: string) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.62,
    clearcoat: 0.25,
    clearcoatRoughness: 0.45,
    side: THREE.FrontSide,
  });

const materials = new Map<string, THREE.MeshPhysicalMaterial>();

const paperMaterial = (color: string, side: THREE.Side = THREE.FrontSide) => {
  const key = `${color}:${side}`;
  const cached = materials.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const material = paper(color);
  material.side = side;
  materials.set(key, material);
  return material;
};

export interface PaperCupProps {
  look: CupLook;
  mirror: boolean;
  fill: number;
  tilt: number;
}

export const PaperCup = ({ look, mirror, fill, tilt }: PaperCupProps) => {
  useCanvasFont(`800 64px "${roundedFont}"`, roundedFontReady);
  const label = useCanvasTexture(
    LABEL.width,
    LABEL.height,
    (context) => drawLabel(context, look, mirror),
    `${JSON.stringify(look)}:${mirror}`,
  );
  const waterHeight = CUP.base + (CUP.height * 0.62 - CUP.base) * fill;
  const waterRadius = cupRadiusAt(waterHeight) - CUP.wall * 2;
  const inner = paperMaterial(look.band, THREE.BackSide);
  return (
    <group>
      <mesh position={[0, CUP.height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[CUP.topRadius, CUP.bottomRadius, CUP.height, 96, 1, true]} />
        <meshPhysicalMaterial
          map={label}
          roughness={0.5}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
        />
      </mesh>
      <mesh position={[0, CUP.height / 2 + CUP.base / 2, 0]} material={inner} receiveShadow>
        <cylinderGeometry
          args={[
            CUP.topRadius - CUP.wall,
            cupRadiusAt(CUP.base) - CUP.wall,
            CUP.height - CUP.base,
            96,
            1,
            true,
          ]}
        />
      </mesh>
      <mesh
        position={[0, CUP.height, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={paperMaterial(look.band)}
        castShadow
      >
        <torusGeometry args={[CUP.topRadius - CUP.wall / 2 + CUP.rim * 0.4, CUP.rim, 16, 96]} />
      </mesh>
      <mesh
        position={[0, CUP.base, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={paperMaterial(look.band)}
        receiveShadow
      >
        <circleGeometry args={[cupRadiusAt(CUP.base) - CUP.wall, 64]} />
      </mesh>
      <mesh
        position={[0, 0.004, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={paperMaterial(look.band)}
      >
        <circleGeometry args={[CUP.bottomRadius, 64]} />
      </mesh>
      {fill > 0.02 ? (
        <group position={[0, waterHeight, 0]} rotation={[0, 0, -tilt]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1 / Math.max(0.3, Math.cos(tilt)), 1, 1]}>
            <circleGeometry args={[waterRadius, 64]} />
            <meshPhysicalMaterial
              color={look.water}
              roughness={0.04}
              transparent
              opacity={0.55}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};
