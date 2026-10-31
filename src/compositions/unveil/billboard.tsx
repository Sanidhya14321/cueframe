import type * as THREE from 'three';
import { useTexture } from '../promo/use-texture';
import { BOARD, type Vec3 } from './flight';

const TOP = BOARD.centerY + BOARD.height / 2;
const BOTTOM = BOARD.centerY - BOARD.height / 2;
const RIM = 0.32;
const LAMPS = [-4.6, -1.55, 1.55, 4.6] as const;
const TRUSS_X = [-4.3, 0, 4.3] as const;
const TRUSS_Y = [BOTTOM + 3, BOARD.centerY, TOP - 3] as const;

const Steel = ({ color }: { color: string }) => (
  <meshStandardMaterial color={color} roughness={0.55} metalness={0.45} />
);

const Beam = ({ position, size, color }: { position: Vec3; size: Vec3; color: string }) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <Steel color={color} />
  </mesh>
);

const PosterFace = ({ map }: { map: THREE.Texture }) => (
  <mesh position={[0, BOARD.centerY, 0.02]} receiveShadow>
    <planeGeometry args={[BOARD.width, BOARD.height]} />
    <meshStandardMaterial map={map} roughness={0.85} />
  </mesh>
);

const ImagePoster = ({ url }: { url: string }) => <PosterFace map={useTexture(url)} />;

export const Billboard = ({
  posterMap,
  posterUrl,
  frameColor,
  poleColor,
}: {
  posterMap: THREE.Texture;
  posterUrl: string | undefined;
  frameColor: string;
  poleColor: string;
}) => {
  const outer = BOARD.width + RIM * 2;
  const back = -BOARD.depth;
  return (
    <group>
      {posterUrl === undefined ? <PosterFace map={posterMap} /> : <ImagePoster url={posterUrl} />}
      <Beam position={[0, TOP + RIM / 2, -0.2]} size={[outer, RIM, 0.75]} color={frameColor} />
      <Beam position={[0, BOTTOM - RIM / 2, -0.2]} size={[outer, RIM, 0.75]} color={frameColor} />
      <Beam
        position={[-BOARD.width / 2 - RIM / 2, BOARD.centerY, -0.2]}
        size={[RIM, BOARD.height, 0.75]}
        color={frameColor}
      />
      <Beam
        position={[BOARD.width / 2 + RIM / 2, BOARD.centerY, -0.2]}
        size={[RIM, BOARD.height, 0.75]}
        color={frameColor}
      />
      <Beam
        position={[0, BOARD.centerY, back / 2 - 0.2]}
        size={[BOARD.width, BOARD.height, 0.2]}
        color={frameColor}
      />
      {TRUSS_X.map((x) => (
        <Beam
          key={`v${x}`}
          position={[x, BOARD.centerY, back - 0.2]}
          size={[0.3, BOARD.height + 0.6, 0.3]}
          color={frameColor}
        />
      ))}
      {TRUSS_Y.map((y) => (
        <Beam
          key={`h${y}`}
          position={[0, y, back - 0.45]}
          size={[BOARD.width + 0.4, 0.26, 0.26]}
          color={frameColor}
        />
      ))}
      <Beam position={[0, BOTTOM - 0.75, 0.6]} size={[outer + 0.4, 0.14, 1.8]} color={frameColor} />
      <Beam
        position={[0, BOTTOM - 0.25, 1.45]}
        size={[outer + 0.4, 0.06, 0.06]}
        color={frameColor}
      />
      {LAMPS.map((x) => (
        <group key={x} position={[x, BOTTOM - 0.55, 1.2]}>
          <mesh rotation={[-0.6, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.3, 0.45]} />
            <Steel color={frameColor} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, BOTTOM / 2 - 0.4, back - 0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 1.05, BOTTOM - 0.8, 28]} />
        <meshStandardMaterial color={poleColor} roughness={0.7} metalness={0.2} />
      </mesh>
      <Beam position={[0, BOTTOM - 0.55, back - 0.3]} size={[5.5, 0.9, 1.6]} color={frameColor} />
    </group>
  );
};
