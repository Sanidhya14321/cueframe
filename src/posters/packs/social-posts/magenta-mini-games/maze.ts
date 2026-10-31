import { type Nodes, rect } from '../../../kit';

interface MazeSpec {
  columns: number;
  rows: number;
  seed: number;
  entrances: readonly number[];
  exit: number;
}

const keyOf = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

const carve = (spec: MazeSpec): Set<string> => {
  let state = spec.seed;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  const total = spec.columns * spec.rows;
  const visited = new Set<number>([0]);
  const passages = new Set<string>();
  const stack: number[] = [0];
  while (stack.length > 0) {
    const current = stack.at(-1);
    if (current === undefined) {
      break;
    }
    const column = current % spec.columns;
    const neighbours = [
      column > 0 ? current - 1 : -1,
      column < spec.columns - 1 ? current + 1 : -1,
      current - spec.columns,
      current + spec.columns,
    ].filter((cell) => cell >= 0 && cell < total && !visited.has(cell));
    if (neighbours.length === 0) {
      stack.pop();
      continue;
    }
    const next = neighbours[Math.floor(random() * neighbours.length)] ?? neighbours[0];
    if (next === undefined) {
      break;
    }
    passages.add(keyOf(current, next));
    visited.add(next);
    stack.push(next);
  }
  return passages;
};

export const maze = (
  x: number,
  y: number,
  size: number,
  color: string,
  thickness: number,
  spec: MazeSpec,
): Nodes[] => {
  const passages = carve(spec);
  const cellWidth = size / spec.columns;
  const cellHeight = size / spec.rows;
  const half = thickness / 2;
  const horizontal = (column: number, row: number) =>
    rect(
      x + column * cellWidth - half,
      y + row * cellHeight - half,
      cellWidth + thickness,
      thickness,
      color,
      { name: 'Maze wall' },
    );
  const vertical = (column: number, row: number) =>
    rect(
      x + column * cellWidth - half,
      y + row * cellHeight - half,
      thickness,
      cellHeight + thickness,
      color,
      { name: 'Maze wall' },
    );
  const walls: Nodes[] = [];
  for (let row = 0; row < spec.rows; row += 1) {
    for (let column = 0; column < spec.columns; column += 1) {
      const cell = row * spec.columns + column;
      if (column < spec.columns - 1 && !passages.has(keyOf(cell, cell + 1))) {
        walls.push(vertical(column + 1, row));
      }
      if (row < spec.rows - 1 && !passages.has(keyOf(cell, cell + spec.columns))) {
        walls.push(horizontal(column, row + 1));
      }
    }
  }
  for (let column = 0; column < spec.columns; column += 1) {
    if (!spec.entrances.includes(column)) {
      walls.push(horizontal(column, 0));
    }
    if (column !== spec.exit) {
      walls.push(horizontal(column, spec.rows));
    }
  }
  for (let row = 0; row < spec.rows; row += 1) {
    walls.push(vertical(0, row), vertical(spec.columns, row));
  }
  return walls;
};
