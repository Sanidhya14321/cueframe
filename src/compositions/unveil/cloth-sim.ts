import type { UnveilCloth, UnveilTiming } from '@/schemas';
import { collide } from './cloth-collide';
import { BOARD, CLOTH, hookAt, RIG, type Vec3 } from './flight';
import { windAt } from './wind';

const FPS = 30;
const SUBSTEPS = 8;
const ITERATIONS = 2;
const WARMUP_FRAMES = 45;
const STEP = 1 / (FPS * SUBSTEPS);
const COLUMNS = CLOTH.columns + 1;
const ROWS = CLOTH.rows + 1;
const COUNT = COLUMNS * ROWS;
const SPACING_X = CLOTH.width / CLOTH.columns;
const SPACING_Y = CLOTH.height / CLOTH.rows;
const AREA = SPACING_X * SPACING_Y;
const DRAG = 0.5 * 1.2 * 1.1 * AREA;
const TOP = BOARD.centerY + BOARD.height / 2 + 0.3;
const PIN_EVERY = 4;
const PEEL_FRAMES = 16;

export const ATTACH_COLUMNS = [0, 16, 28, 44] as const;

const index = (column: number, row: number): number => row * COLUMNS + column;

const pinX = (column: number): number => (column / CLOTH.columns - 0.5) * RIG.span;

export const barPoint = (hook: Vec3, column: number): Vec3 => [
  hook[0] + pinX(column),
  hook[1] - RIG.barDrop,
  hook[2],
];

interface Links {
  a: Int32Array;
  b: Int32Array;
  rest: Float64Array;
  stiffness: Float64Array;
}

const buildLinks = (softness: number): Links => {
  const pairs: [number, number, number][] = [];
  const shear = 1 - softness * 0.75;
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      if (column + 1 < COLUMNS) {
        pairs.push([index(column, row), index(column + 1, row), 1]);
      }
      if (row + 1 < ROWS) {
        pairs.push([index(column, row), index(column, row + 1), 1]);
      }
      if (column + 1 < COLUMNS && row + 1 < ROWS) {
        pairs.push([index(column, row), index(column + 1, row + 1), shear]);
        pairs.push([index(column + 1, row), index(column, row + 1), shear]);
      }
    }
  }
  const links: Links = {
    a: new Int32Array(pairs.length),
    b: new Int32Array(pairs.length),
    rest: new Float64Array(pairs.length),
    stiffness: new Float64Array(pairs.length),
  };
  pairs.forEach(([first, second, weight], slot) => {
    links.a[slot] = first;
    links.b[slot] = second;
    const dx = ((second % COLUMNS) - (first % COLUMNS)) * SPACING_X;
    const dy = (Math.floor(second / COLUMNS) - Math.floor(first / COLUMNS)) * SPACING_Y;
    links.rest[slot] = Math.hypot(dx, dy);
    links.stiffness[slot] = weight;
  });
  return links;
};

const isPinColumn = (column: number): boolean =>
  column % PIN_EVERY === 0 || column === CLOTH.columns;

const releaseFrame = (column: number, timing: UnveilTiming): number =>
  timing.liftStart + (column / CLOTH.columns) * PEEL_FRAMES;

interface State {
  positions: Float64Array;
  previous: Float64Array;
  normals: Float64Array;
  air: Float64Array;
  inverseMass: Float64Array;
}

const createState = (): State => {
  const state: State = {
    positions: new Float64Array(COUNT * 3),
    previous: new Float64Array(COUNT * 3),
    normals: new Float64Array(COUNT * 3),
    air: new Float64Array(COUNT * 3),
    inverseMass: new Float64Array(COUNT).fill(1),
  };
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const x = pinX(column);
      const slot = index(column, row) * 3;
      state.positions.set([x, TOP - row * SPACING_Y, 0.5], slot);
      state.previous.set([x, TOP - row * SPACING_Y, 0.5], slot);
    }
  }
  return state;
};

const pinTop = (state: State, frame: number, timing: UnveilTiming): void => {
  for (let column = 0; column < COLUMNS; column++) {
    const held = isPinColumn(column) && frame < releaseFrame(column, timing);
    state.inverseMass[column] = held ? 0 : 1;
    if (held) {
      state.positions.set([pinX(column), TOP, 0.45], column * 3);
      state.previous.set([pinX(column), TOP, 0.45], column * 3);
    }
  }
};

const read = (array: Float64Array, slot: number): number => array[slot] ?? 0;

const computeNormals = ({ positions, normals }: State): void => {
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const left = index(Math.max(0, column - 1), row) * 3;
      const right = index(Math.min(COLUMNS - 1, column + 1), row) * 3;
      const up = index(column, Math.max(0, row - 1)) * 3;
      const down = index(column, Math.min(ROWS - 1, row + 1)) * 3;
      const ax = read(positions, right) - read(positions, left);
      const ay = read(positions, right + 1) - read(positions, left + 1);
      const az = read(positions, right + 2) - read(positions, left + 2);
      const bx = read(positions, up) - read(positions, down);
      const by = read(positions, up + 1) - read(positions, down + 1);
      const bz = read(positions, up + 2) - read(positions, down + 2);
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const size = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const slot = index(column, row) * 3;
      normals[slot] = nx / size;
      normals[slot + 1] = ny / size;
      normals[slot + 2] = nz / size;
    }
  }
};

const sampleWind = (state: State, frame: number, hook: Vec3, cloth: UnveilCloth): void => {
  for (let slot = 0; slot < COUNT * 3; slot += 3) {
    const flow = windAt(
      read(state.positions, slot),
      read(state.positions, slot + 1),
      read(state.positions, slot + 2),
      frame / FPS,
      hook,
      cloth,
    );
    state.air.set(flow, slot);
  }
};

interface Air {
  dragPerMass: number;
  flutter: number;
  time: number;
}

const flutterWave = (particle: number, time: number): number => {
  const row = Math.floor(particle / COLUMNS);
  const column = particle % COLUMNS;
  return (
    Math.sin(row * 0.42 + column * 0.11 - time * 0.55) * 0.7 +
    Math.sin(row * 0.9 - column * 0.23 - time * 0.9) * 0.3
  );
};

const integrateParticle = (state: State, particle: number, air: Air): void => {
  const slot = particle * 3;
  const { positions, previous, normals } = state;
  const x = read(positions, slot);
  const y = read(positions, slot + 1);
  const z = read(positions, slot + 2);
  const vx = (x - read(previous, slot)) / STEP;
  const vy = (y - read(previous, slot + 1)) / STEP;
  const vz = (z - read(previous, slot + 2)) / STEP;
  const rx = vx - read(state.air, slot);
  const ry = vy - read(state.air, slot + 1);
  const rz = vz - read(state.air, slot + 2);
  const nx = read(normals, slot);
  const ny = read(normals, slot + 1);
  const nz = read(normals, slot + 2);
  const across = rx * nx + ry * ny + rz * nz;
  const airspeed = rx * rx + ry * ry + rz * rz;
  const shed = air.flutter * 0.18 * air.dragPerMass * airspeed * flutterWave(particle, air.time);
  const push = Math.max(-500, Math.min(500, -air.dragPerMass * across * Math.abs(across) + shed));
  previous[slot] = x;
  previous[slot + 1] = y;
  previous[slot + 2] = z;
  const keep = STEP * 0.998;
  const square = STEP * STEP;
  positions[slot] = x + vx * keep + (push * nx - rx * 0.35) * square;
  positions[slot + 1] = y + vy * keep + (push * ny - ry * 0.35 - 9.81) * square;
  positions[slot + 2] = z + vz * keep + (push * nz - rz * 0.35) * square;
};

const integrate = (state: State, air: Air): void => {
  for (let particle = 0; particle < COUNT; particle++) {
    if (state.inverseMass[particle] !== 0) {
      integrateParticle(state, particle, air);
    }
  }
};

const solveLinks = (state: State, links: Links): void => {
  const { positions, inverseMass } = state;
  for (let link = 0; link < links.a.length; link++) {
    const first = links.a[link] ?? 0;
    const second = links.b[link] ?? 0;
    const wa = inverseMass[first] ?? 1;
    const wb = inverseMass[second] ?? 1;
    if (wa + wb === 0) {
      continue;
    }
    const p = first * 3;
    const q = second * 3;
    const dx = read(positions, q) - read(positions, p);
    const dy = read(positions, q + 1) - read(positions, p + 1);
    const dz = read(positions, q + 2) - read(positions, p + 2);
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
    const correction =
      ((links.stiffness[link] ?? 1) * (distance - (links.rest[link] ?? 0))) / distance / (wa + wb);
    positions[p] = read(positions, p) + dx * correction * wa;
    positions[p + 1] = read(positions, p + 1) + dy * correction * wa;
    positions[p + 2] = read(positions, p + 2) + dz * correction * wa;
    positions[q] = read(positions, q) - dx * correction * wb;
    positions[q + 1] = read(positions, q + 1) - dy * correction * wb;
    positions[q + 2] = read(positions, q + 2) - dz * correction * wb;
  }
};

const solveRopes = (state: State, hook: Vec3): void => {
  for (const column of ATTACH_COLUMNS) {
    if (state.inverseMass[column] === 0) {
      continue;
    }
    const anchor = barPoint(hook, column);
    const slot = column * 3;
    const dx = read(state.positions, slot) - anchor[0];
    const dy = read(state.positions, slot + 1) - anchor[1];
    const dz = read(state.positions, slot + 2) - anchor[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (distance > RIG.drop) {
      const scale = RIG.drop / distance;
      state.positions.set(
        [anchor[0] + dx * scale, anchor[1] + dy * scale, anchor[2] + dz * scale],
        slot,
      );
    }
  }
};

const substep = (
  state: State,
  links: Links,
  time: number,
  timing: UnveilTiming,
  air: Air,
): void => {
  pinTop(state, time, timing);
  computeNormals(state);
  integrate(state, { ...air, time });
  const hook = hookAt(time, timing);
  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    solveLinks(state, links);
    solveRopes(state, hook);
  }
  collide(state.positions, state.previous, COUNT);
};

export interface ClothRun {
  frames: Float32Array[];
  hooks: Vec3[];
}

const simulate = (cloth: UnveilCloth, timing: UnveilTiming, lastFrame: number): ClothRun => {
  const links = buildLinks(cloth.softness);
  const state = createState();
  const air: Air = { dragPerMass: DRAG / (cloth.weight * AREA), flutter: cloth.flutter, time: 0 };
  const run: ClothRun = { frames: [], hooks: [] };
  for (let frame = -WARMUP_FRAMES; frame <= lastFrame; frame++) {
    sampleWind(state, frame, hookAt(frame, timing), cloth);
    for (let step = 0; step < SUBSTEPS; step++) {
      substep(state, links, frame + step / SUBSTEPS, timing, air);
    }
    if (frame >= 0) {
      run.frames.push(Float32Array.from(state.positions));
      run.hooks.push(hookAt(frame, timing));
    }
  }
  return run;
};

const cache = new Map<string, ClothRun>();

export const clothRun = (cloth: UnveilCloth, timing: UnveilTiming, lastFrame: number): ClothRun => {
  const key = JSON.stringify({ cloth, timing, lastFrame });
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const run = simulate(cloth, timing, lastFrame);
  cache.clear();
  cache.set(key, run);
  return run;
};

export const clothFrame = (run: ClothRun, frame: number, target: Float32Array): void => {
  const last = run.frames.length - 1;
  const clamped = Math.max(0, Math.min(last, frame));
  const low = Math.floor(clamped);
  const from = run.frames[low];
  const to = run.frames[Math.min(last, low + 1)];
  if (from === undefined || to === undefined) {
    return;
  }
  const amount = clamped - low;
  for (let slot = 0; slot < target.length; slot++) {
    target[slot] = (from[slot] ?? 0) + ((to[slot] ?? 0) - (from[slot] ?? 0)) * amount;
  }
};

export const attachPoint = (positions: Float32Array, column: number): Vec3 => {
  const slot = column * 3;
  return [positions[slot] ?? 0, positions[slot + 1] ?? 0, positions[slot + 2] ?? 0];
};
