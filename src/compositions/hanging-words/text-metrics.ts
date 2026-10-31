let context: CanvasRenderingContext2D | null | undefined;

const canvasContext = (): CanvasRenderingContext2D | null => {
  if (context === undefined) {
    context =
      typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  return context;
};

const textWidth = (text: string, font: string, weight: number, size: number): number => {
  const ctx = canvasContext();
  if (ctx === null) {
    return text.length * size * 0.7;
  }
  ctx.font = `${weight} ${size}px "${font}"`;
  return ctx.measureText(text).width;
};

export const letterCenter = (
  text: string,
  index: number,
  font: string,
  weight: number,
  size: number,
): number => {
  const letters = Array.from(text);
  const safe = Math.min(Math.max(0, index), Math.max(0, letters.length - 1));
  const before = textWidth(letters.slice(0, safe).join(''), font, weight, size);
  const own = textWidth(letters[safe] ?? '', font, weight, size);
  return before + own / 2 - textWidth(text, font, weight, size) / 2;
};
