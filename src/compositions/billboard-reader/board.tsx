import type * as THREE from 'three';
import { LampLens, LightPool, TOP_LAMPS, WALK_LAMPS } from './lamp-glow';
import { BOARD, BOARD_BOTTOM, BOARD_TOP, type Vec3 } from './layout';

const RIM = 0.16;
const BACK = -BOARD.depth;
const CATWALK_DEPTH = 1.7;
const RAIL_POSTS = Array.from({ length: 11 }, (_, index) => -7.6 + index * 1.52);
const TRUSS_X = [-6.9, -3.45, 0, 3.45, 6.9] as const;

const Steel = ({ color, roughness = 0.6 }: { color: string; roughness?: number }) => (
  <meshStandardMaterial color={color} roughness={roughness} metalness={0.5} />
);

const Beam = ({ position, size, color }: { position: Vec3; size: Vec3; color: string }) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <Steel color={color} />
  </mesh>
);

const Rod = ({
  from,
  to,
  radius,
  color,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  color: string;
}) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.hypot(dx, dy, dz);
  const pitch = Math.atan2(Math.hypot(dx, dz), dy);
  const yaw = Math.atan2(dx, dz);
  return (
    <mesh
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]}
      rotation={[pitch, yaw, 0, 'YXZ']}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <Steel color={color} roughness={0.5} />
    </mesh>
  );
};

export interface LampState {
  color: string;
  glow: number;
  level: (x: number) => number;
}

const TopLamp = ({ x, color, lamp }: { x: number; color: string; lamp: LampState }) => {
  const base: Vec3 = [x, BOARD_TOP, BACK + 0.15];
  const elbow: Vec3 = [x, BOARD_TOP + 1.1, BACK + 0.35];
  const head: Vec3 = [x, BOARD_TOP + 1.2, 1.5];
  return (
    <group>
      <Rod from={base} to={elbow} radius={0.06} color={color} />
      <Rod from={elbow} to={head} radius={0.05} color={color} />
      <group position={head} rotation={[0.5, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.22, 0.42]} />
          <Steel color={color} roughness={0.45} />
        </mesh>
        <LampLens y={-0.115} color={lamp.color} level={lamp.level(x)} glow={lamp.glow} />
      </group>
      <LightPool x={x} fromTop color={lamp.color} level={lamp.level(x)} glow={lamp.glow} />
    </group>
  );
};

const WalkLamp = ({ x, color, lamp }: { x: number; color: string; lamp: LampState }) => (
  <group>
    <group position={[x, BOARD_BOTTOM - 0.7, CATWALK_DEPTH + 0.3]}>
      <Rod from={[0, 0.35, -0.3]} to={[0, 0, 0]} radius={0.05} color={color} />
      <group rotation={[-0.75, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.2, 0.36]} />
          <Steel color={color} roughness={0.45} />
        </mesh>
        <LampLens y={0.105} color={lamp.color} level={lamp.level(x)} glow={lamp.glow} />
      </group>
    </group>
    <LightPool x={x} fromTop={false} color={lamp.color} level={lamp.level(x)} glow={lamp.glow} />
  </group>
);

const Catwalk = ({ color }: { color: string }) => {
  const deckY = BOARD_BOTTOM - 0.45;
  const railY = deckY + 1.05;
  const width = BOARD.width + 1.2;
  return (
    <group>
      <Beam
        position={[0, deckY, CATWALK_DEPTH / 2 - 0.2]}
        size={[width, 0.12, CATWALK_DEPTH + 0.4]}
        color={color}
      />
      <Beam
        position={[0, deckY - 0.28, CATWALK_DEPTH / 2]}
        size={[width, 0.28, 0.16]}
        color={color}
      />
      <Beam position={[0, railY, CATWALK_DEPTH]} size={[width, 0.07, 0.07]} color={color} />
      <Beam position={[0, deckY + 0.55, CATWALK_DEPTH]} size={[width, 0.05, 0.05]} color={color} />
      {RAIL_POSTS.map((x) => (
        <Beam
          key={x}
          position={[x, deckY + 0.52, CATWALK_DEPTH]}
          size={[0.06, 1.05, 0.06]}
          color={color}
        />
      ))}
      {[-7.2, -2.4, 2.4, 7.2].map((x) => (
        <Rod
          key={x}
          from={[x, deckY - 0.1, CATWALK_DEPTH]}
          to={[x, deckY - 1.6, BACK]}
          radius={0.07}
          color={color}
        />
      ))}
    </group>
  );
};

const BackFrame = ({ color }: { color: string }) => (
  <group>
    <Beam
      position={[0, BOARD.centerY, BACK / 2]}
      size={[BOARD.width, BOARD.height, -BACK - 0.02]}
      color={color}
    />
    {TRUSS_X.map((x) => (
      <Beam
        key={x}
        position={[x, BOARD.centerY, BACK - 0.35]}
        size={[0.24, BOARD.height + 0.4, 0.24]}
        color={color}
      />
    ))}
    {[BOARD_BOTTOM + 0.9, BOARD.centerY, BOARD_TOP - 0.9].map((y) => (
      <Beam
        key={y}
        position={[0, y, BACK - 0.6]}
        size={[BOARD.width + 0.3, 0.22, 0.22]}
        color={color}
      />
    ))}
    {TRUSS_X.slice(0, -1).map((x, index) => (
      <Rod
        key={x}
        from={[x, BOARD_BOTTOM + 0.9, BACK - 0.6]}
        to={[TRUSS_X[index + 1] ?? x, BOARD_TOP - 0.9, BACK - 0.6]}
        radius={0.08}
        color={color}
      />
    ))}
  </group>
);

export const Board = ({
  art,
  frameColor,
  poleColor,
  lamps,
  lamp,
}: {
  art: THREE.Texture;
  frameColor: string;
  poleColor: string;
  lamps: boolean;
  lamp: LampState;
}) => (
  <group>
    <mesh position={[0, BOARD.centerY, 0.012]} receiveShadow>
      <planeGeometry args={[BOARD.width, BOARD.height]} />
      <meshStandardMaterial map={art} roughness={0.82} />
    </mesh>
    <Beam
      position={[0, BOARD_TOP + RIM / 2, BACK / 2]}
      size={[BOARD.width + RIM * 2, RIM, -BACK]}
      color={frameColor}
    />
    <Beam
      position={[0, BOARD_BOTTOM - RIM / 2, BACK / 2]}
      size={[BOARD.width + RIM * 2, RIM, -BACK]}
      color={frameColor}
    />
    <Beam
      position={[-BOARD.width / 2 - RIM / 2, BOARD.centerY, BACK / 2]}
      size={[RIM, BOARD.height, -BACK]}
      color={frameColor}
    />
    <Beam
      position={[BOARD.width / 2 + RIM / 2, BOARD.centerY, BACK / 2]}
      size={[RIM, BOARD.height, -BACK]}
      color={frameColor}
    />
    <BackFrame color={frameColor} />
    <Catwalk color={frameColor} />
    {lamps ? (
      <>
        {TOP_LAMPS.map((x) => (
          <TopLamp key={x} x={x} color={frameColor} lamp={lamp} />
        ))}
        {WALK_LAMPS.map((x) => (
          <WalkLamp key={x} x={x} color={frameColor} lamp={lamp} />
        ))}
      </>
    ) : null}
    <Beam
      position={[-0.4, BOARD_BOTTOM - 1.2, BACK - 1.2]}
      size={[4.2, 1.1, 1.8]}
      color={frameColor}
    />
    <mesh position={[-0.4, (BOARD_BOTTOM - 1.2) / 2, BACK - 1.2]} castShadow receiveShadow>
      <cylinderGeometry args={[0.95, 1.1, BOARD_BOTTOM - 1.2, 32]} />
      <meshStandardMaterial color={poleColor} roughness={0.55} metalness={0.35} />
    </mesh>
  </group>
);
