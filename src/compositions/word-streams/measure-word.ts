const REFERENCE_SIZE = 100;

export type WordInk = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

let context: CanvasRenderingContext2D | null | undefined;

const getContext = (): CanvasRenderingContext2D | null => {
  if (context === undefined) {
    context =
      typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  return context;
};

const estimate = (text: string, tracking: number): WordInk => ({
  width: Math.max(1, [...text].length) * (0.58 + tracking),
  height: 0.76,
  offsetX: 0,
  offsetY: 0.08,
});

export const measureWord = (
  text: string,
  family: string,
  weight: number,
  tracking: number,
): WordInk => {
  const ctx = getContext();
  if (ctx === null || text.trim() === '') {
    return estimate(text, tracking);
  }
  ctx.font = `${weight} ${REFERENCE_SIZE}px "${family}"`;
  ctx.letterSpacing = `${tracking * REFERENCE_SIZE}px`;
  const metrics = ctx.measureText(text);
  ctx.letterSpacing = '0px';
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  const baseline = (REFERENCE_SIZE - fontHeight) / 2 + metrics.fontBoundingBoxAscent;
  const inkLeft = -metrics.actualBoundingBoxLeft;
  const inkRight = metrics.actualBoundingBoxRight;
  const inkTop = baseline - metrics.actualBoundingBoxAscent;
  const inkBottom = baseline + metrics.actualBoundingBoxDescent;
  return {
    width: (inkRight - inkLeft) / REFERENCE_SIZE,
    height: (inkBottom - inkTop) / REFERENCE_SIZE,
    offsetX: ((inkLeft + inkRight) / 2 - metrics.width / 2) / REFERENCE_SIZE,
    offsetY: ((inkTop + inkBottom) / 2 - REFERENCE_SIZE / 2) / REFERENCE_SIZE,
  };
};
