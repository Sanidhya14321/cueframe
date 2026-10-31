const REFERENCE_SIZE = 100;
const DEGREES = Math.PI / 180;

export type InkBox = { left: number; right: number; top: number; bottom: number };

let context: CanvasRenderingContext2D | null | undefined;

const getContext = (): CanvasRenderingContext2D | null => {
  if (context === undefined) {
    context =
      typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  return context;
};

export const measureInk = (
  text: string,
  family: string,
  weight: number,
  tracking: number,
  lineHeight: number,
): InkBox => {
  const ctx = getContext();
  const spacing = tracking * REFERENCE_SIZE;
  const characters = [...text].length;
  if (ctx === null) {
    const half = ((0.62 + tracking) * characters) / 2;
    return { left: -half, right: half, top: -0.5, bottom: 0.5 };
  }
  ctx.font = `${weight} ${REFERENCE_SIZE}px "${family}"`;
  const metrics = ctx.measureText(text);
  const layoutWidth = metrics.width + spacing * characters;
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  const baseline = (REFERENCE_SIZE * lineHeight - fontHeight) / 2 + metrics.fontBoundingBoxAscent;
  const centerY = (REFERENCE_SIZE * lineHeight) / 2;
  return {
    left: (-metrics.actualBoundingBoxLeft - layoutWidth / 2) / REFERENCE_SIZE,
    right:
      (metrics.actualBoundingBoxRight + spacing * Math.max(0, characters - 1) - layoutWidth / 2) /
      REFERENCE_SIZE,
    top: (baseline - metrics.actualBoundingBoxAscent - centerY) / REFERENCE_SIZE,
    bottom: (baseline + metrics.actualBoundingBoxDescent - centerY) / REFERENCE_SIZE,
  };
};

const corners = (box: InkBox): [number, number][] => [
  [box.left, box.top],
  [box.right, box.top],
  [box.left, box.bottom],
  [box.right, box.bottom],
];

export const sizeInsideCircle = (box: InkBox, radius: number, cap: number): number => {
  const reach = Math.max(...corners(box).map(([x, y]) => Math.hypot(x, y)));
  return reach > 0 ? Math.min(cap, radius / reach) : cap;
};

export const sizeInsideWidth = (
  box: InkBox,
  halfWidth: number,
  angle: number,
  cap: number,
): number => {
  const cos = Math.cos(angle * DEGREES);
  const sin = Math.sin(angle * DEGREES);
  const reach = Math.max(...corners(box).map(([x, y]) => Math.abs(x * cos - y * sin)));
  return reach > 0 ? Math.min(cap, halfWidth / reach) : cap;
};
