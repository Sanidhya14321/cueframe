import { RoundedBox } from '@react-three/drei';
import {
  capsuleGeometry,
  GLASS_SURFACE,
  LENS_DOME_OFFSET,
  lensDomeGeometry,
  lensHousingGeometry,
  PHONE,
  plateauGeometry,
} from './phone-geometry';
import type { PhoneMaterials } from './phone-materials';

const LENSES: [number, number][] = [
  [-0.142, 0.142],
  [-0.142, -0.142],
  [0.142, 0],
];

const Lens = ({ x, y, materials }: { x: number; y: number; materials: PhoneMaterials }) => (
  <group position={[x, y, PHONE.plateauDepth]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh geometry={lensHousingGeometry()} material={materials.ring} castShadow />
    <mesh position={[0, 0.02, 0]} material={materials.blackGloss}>
      <cylinderGeometry args={[0.076, 0.076, 0.018, 64]} />
    </mesh>
    <mesh
      position={[0, LENS_DOME_OFFSET, 0]}
      geometry={lensDomeGeometry()}
      material={materials.lensGlass}
    />
    <mesh position={[0, 0.0405, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.lensCore}>
      <ringGeometry args={[0.03, 0.046, 64]} />
    </mesh>
    <mesh position={[0, 0.0408, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.blackGloss}>
      <circleGeometry args={[0.018, 48]} />
    </mesh>
  </group>
);

export const CameraPlateau = ({ materials }: { materials: PhoneMaterials }) => (
  <group
    position={[PHONE.width / 2 - 0.4, PHONE.height / 2 - 0.4, -GLASS_SURFACE]}
    rotation={[0, Math.PI, 0]}
  >
    <mesh
      position={[0, 0, PHONE.plateauDepth / 2]}
      geometry={plateauGeometry()}
      material={materials.plateau}
      castShadow
    />
    {LENSES.map(([x, y]) => (
      <Lens key={`${x}:${y}`} x={x} y={y} materials={materials} />
    ))}
    <group position={[0.142, 0.205, PHONE.plateauDepth + 0.0005]}>
      <mesh material={materials.ring}>
        <ringGeometry args={[0.034, 0.042, 48]} />
      </mesh>
      <mesh material={materials.flash}>
        <circleGeometry args={[0.034, 48]} />
      </mesh>
    </group>
    <mesh position={[0.142, -0.205, PHONE.plateauDepth + 0.0005]} material={materials.blackGloss}>
      <circleGeometry args={[0.032, 48]} />
    </mesh>
    <mesh position={[0.02, 0, PHONE.plateauDepth + 0.0005]} material={materials.hole}>
      <circleGeometry args={[0.008, 16]} />
    </mesh>
  </group>
);

const SIDE_BUTTONS: { side: 1 | -1; y: number; length: number }[] = [
  { side: 1, y: 0.52, length: 0.42 },
  { side: -1, y: 0.93, length: 0.14 },
  { side: -1, y: 0.6, length: 0.26 },
  { side: -1, y: 0.27, length: 0.26 },
];

export const SideButtons = ({ materials }: { materials: PhoneMaterials }) => (
  <>
    {SIDE_BUTTONS.map((button) => (
      <RoundedBox
        key={`${button.side}:${button.y}`}
        args={[0.026, button.length, 0.056]}
        radius={0.011}
        smoothness={5}
        position={[button.side * (PHONE.width / 2 + 0.005), button.y, 0]}
        material={materials.frame}
        castShadow
      />
    ))}
  </>
);

const ANTENNA_Y = [PHONE.height / 2 - 0.34, -(PHONE.height / 2 - 0.34)];

export const AntennaBands = ({ materials }: { materials: PhoneMaterials }) => (
  <>
    {ANTENNA_Y.flatMap((y) =>
      [1, -1].map((side) => (
        <mesh
          key={`${y}:${side}`}
          position={[side * (PHONE.width / 2 + 0.0006), y, 0]}
          rotation={[0, (side * Math.PI) / 2, 0]}
          material={materials.antenna}
        >
          <planeGeometry args={[PHONE.depth - PHONE.edge * 2, 0.02]} />
        </mesh>
      )),
    )}
  </>
);

const GRILLE = [0, 1, 2, 3, 4, 5];

export const BottomPorts = ({ materials }: { materials: PhoneMaterials }) => (
  <group position={[0, -PHONE.height / 2 - 0.0006, 0]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh geometry={capsuleGeometry(0.2, 0.062)} material={materials.hole} />
    {GRILLE.flatMap((index) =>
      [1, -1].map((side) => (
        <mesh
          key={`${index}:${side}`}
          position={[side * (0.2 + index * 0.045), 0, 0]}
          material={materials.hole}
        >
          <circleGeometry args={[0.012, 12]} />
        </mesh>
      )),
    )}
  </group>
);
