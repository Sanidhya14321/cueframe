import type { ProblemStrikeoutProps } from '@/schemas';
import { hash, signedHash } from '../promo/ink-geometry';

export const PAGE = { width: 1.5, depth: 2.1 } as const;

export const PAGE_CANVAS = { width: 1500, height: 2100 } as const;

const HOLE_ROW = 46;
const RULE_TOP = 170;
const RULE_BOTTOM = 2040;
const STRIKE_POINTS = 32;

type PageLook = ProblemStrikeoutProps['page'];

export interface PlacedProblem {
  text: string;
  centerX: number;
  centerY: number;
  angle: number;
  width: number;
}

export interface StrikePath {
  points: { x: number; y: number }[];
}

const problemList = (problems: string): string[] =>
  problems
    .split('\n')
    .map((line) => line.trim().toUpperCase())
    .filter((line) => line.length > 0);

export const holeCenters = (coils: number): number[] =>
  Array.from({ length: coils }, (_, index) => (index + 0.5) / coils);

export const layoutProblems = (
  context: CanvasRenderingContext2D,
  page: PageLook,
  font: string,
): PlacedProblem[] => {
  const words = problemList(page.problems);
  const rows = Math.max(1, Math.ceil(words.length / 2));
  const usable = RULE_BOTTOM - RULE_TOP - 120;
  context.font = `700 ${page.size}px "${font}"`;
  return words.map((text, index) => {
    const column = index < rows ? 0 : 1;
    const row = index % rows;
    const jitterX = signedHash(11, index) * 70 * page.jitter;
    const jitterY = signedHash(23, index) * 40 * page.jitter;
    return {
      text,
      centerX: PAGE_CANVAS.width * (column === 0 ? 0.31 : 0.69) + jitterX,
      centerY: RULE_TOP + 60 + (row + 0.5 + column * 0.32) * (usable / (rows + 0.32)) + jitterY,
      angle: page.tilt + signedHash(37, index) * 0.16 * page.jitter,
      width: context.measureText(text).width,
    };
  });
};

export const strikePath = (problem: PlacedProblem, page: PageLook, index: number): StrikePath => {
  const reach = problem.width * 0.56 + page.size * 0.18;
  const cos = Math.cos(problem.angle);
  const sin = Math.sin(problem.angle);
  const rise = page.size * (0.08 + hash(41, index) * 0.1);
  const slant = signedHash(43, index) * page.size * 0.18;
  const phase = hash(47, index) * Math.PI * 2;
  const points = Array.from({ length: STRIKE_POINTS }, (_, step) => {
    const t = step / (STRIKE_POINTS - 1);
    const along = -reach + 2 * reach * t;
    const across =
      -rise +
      slant * (t - 0.5) +
      Math.sin(t * Math.PI * 2.3 + phase) * page.size * 0.05 * page.strikeWobble;
    return {
      x: problem.centerX + along * cos - across * sin,
      y: problem.centerY + along * sin + across * cos,
    };
  });
  return { points };
};

export const pointOnStrike = (path: StrikePath, progress: number): { x: number; y: number } => {
  const scaled = Math.min(1, Math.max(0, progress)) * (path.points.length - 1);
  const index = Math.min(path.points.length - 2, Math.floor(scaled));
  const a = path.points[index] ?? { x: 0, y: 0 };
  const b = path.points[index + 1] ?? a;
  const t = scaled - index;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
};

const drawFibres = (context: CanvasRenderingContext2D, paper: string) => {
  const { width, height } = PAGE_CANVAS;
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  for (let index = 0; index < 9000; index++) {
    const x = hash(3, index) * width;
    const y = hash(5, index) * height;
    const dark = hash(7, index) > 0.5;
    context.fillStyle = dark ? 'rgba(90,70,40,0.05)' : 'rgba(255,255,255,0.18)';
    context.fillRect(x, y, 1 + hash(9, index) * 3, 1 + hash(13, index) * 1.5);
  }
  const shade = context.createLinearGradient(0, 0, width, height);
  shade.addColorStop(0, 'rgba(255,255,255,0.05)');
  shade.addColorStop(1, 'rgba(60,40,10,0.07)');
  context.fillStyle = shade;
  context.fillRect(0, 0, width, height);
};

const drawRules = (context: CanvasRenderingContext2D, page: PageLook) => {
  context.strokeStyle = page.rule;
  context.lineWidth = 2.4;
  for (let y = RULE_TOP; y <= RULE_BOTTOM; y += page.ruleSpacing) {
    context.globalAlpha = 0.75 + hash(17, y) * 0.2;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(PAGE_CANVAS.width, y);
    context.stroke();
  }
  context.globalAlpha = 1;
};

const drawHoles = (context: CanvasRenderingContext2D, coils: number) => {
  for (const center of holeCenters(coils)) {
    const x = center * PAGE_CANVAS.width;
    const gradient = context.createRadialGradient(x, HOLE_ROW, 2, x, HOLE_ROW, 18);
    gradient.addColorStop(0, 'rgba(20,18,16,0.95)');
    gradient.addColorStop(0.75, 'rgba(40,34,28,0.8)');
    gradient.addColorStop(1, 'rgba(40,34,28,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, HOLE_ROW, 16, 13, 0, 0, Math.PI * 2);
    context.fill();
  }
};

const drawGraphiteWord = (
  context: CanvasRenderingContext2D,
  problem: PlacedProblem,
  page: PageLook,
  font: string,
  index: number,
) => {
  const span = Math.ceil(problem.width + page.size * 2);
  const scratch = document.createElement('canvas');
  scratch.width = span;
  scratch.height = Math.ceil(page.size * 2);
  const ink = scratch.getContext('2d');
  if (ink === null) {
    return;
  }
  ink.font = `700 ${page.size}px "${font}"`;
  ink.textAlign = 'center';
  ink.textBaseline = 'middle';
  ink.fillStyle = page.graphite;
  ink.fillText(problem.text, span / 2, scratch.height / 2);
  ink.globalCompositeOperation = 'destination-out';
  for (let speck = 0; speck < span * 6; speck++) {
    ink.fillStyle = `rgba(0,0,0,${0.2 + hash(61, speck + index * 9973) * 0.5})`;
    ink.fillRect(
      hash(67, speck + index * 9973) * span,
      hash(71, speck + index * 9973) * scratch.height,
      1.5,
      1.5,
    );
  }
  context.save();
  context.translate(problem.centerX, problem.centerY);
  context.rotate(problem.angle);
  context.globalAlpha = 0.86;
  context.drawImage(scratch, -span / 2, -scratch.height / 2);
  context.restore();
};

export const drawPageBase = (
  context: CanvasRenderingContext2D,
  page: PageLook,
  coils: number,
  font: string,
): PlacedProblem[] => {
  drawFibres(context, page.paper);
  drawRules(context, page);
  drawHoles(context, coils);
  const problems = layoutProblems(context, page, font);
  problems.forEach((problem, index) => {
    drawGraphiteWord(context, problem, page, font, index);
  });
  return problems;
};

export const drawStrike = (
  context: CanvasRenderingContext2D,
  path: StrikePath,
  progress: number,
  page: PageLook,
) => {
  if (progress <= 0) {
    return;
  }
  const last = Math.min(1, progress) * (path.points.length - 1);
  context.strokeStyle = page.strikeColor;
  context.lineCap = 'round';
  context.globalAlpha = 0.9;
  let previous = path.points[0];
  for (let step = 1; step <= Math.ceil(last); step++) {
    const point = pointOnStrike(path, Math.min(step, last) / (path.points.length - 1));
    const t = step / (path.points.length - 1);
    if (previous !== undefined) {
      context.lineWidth = page.strikeWidth * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t)));
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }
    previous = point;
  }
  context.globalAlpha = 1;
};
