import { wrapLine } from '@clipkit/project/text-wrap';
import { EditorCore } from '@/core';
import type { TextCanvasContext } from '@/text/layout';

const MAX_TEXT_WIDTH = 0.8;

export const wrapTextLines = ({
  content,
  canvasHeight,
  ctx,
}: {
  content: string;
  canvasHeight: number;
  ctx: TextCanvasContext;
}) => {
  const { width, height } = EditorCore.getInstance().project.getActive().settings.canvasSize;
  const limit = MAX_TEXT_WIDTH * canvasHeight * (width / height);
  return content
    .split('\n')
    .flatMap((line) => wrapLine(line, limit, (text) => ctx.measureText(text).width));
};
