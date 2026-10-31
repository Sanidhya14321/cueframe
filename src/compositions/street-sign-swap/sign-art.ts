import type { StreetSignSwapProps } from '@/schemas';
import { sansFont, serifFont } from './sign-fonts';

export type SignSide = 'question' | 'answer';

type SignCopy = Pick<StreetSignSwapProps, 'question' | 'answer' | 'ink'> & {
  print: Pick<StreetSignSwapProps['print'], 'softness' | 'border'>;
};

const WIDTH = 700;
const HEIGHT = 1000;

const linesOf = (text: string) => text.split('\n').filter((line) => line.trim().length > 0);

const drawQuestion = (context: CanvasRenderingContext2D, { question, ink }: SignCopy) => {
  const size = WIDTH * 0.078 * question.size;
  const step = size * 1.02;
  const rows = [
    ...linesOf(question.opening).map((text) => ({ text, brand: false })),
    { text: question.brand, brand: true },
    ...linesOf(question.closing).map((text) => ({ text, brand: false })),
  ];
  context.textAlign = 'left';
  rows.forEach(({ text, brand }, index) => {
    context.font = brand ? `700 ${size * 0.96}px "${sansFont}"` : `400 ${size}px "${serifFont}"`;
    context.fillStyle = brand ? ink.questionBrand : ink.question;
    context.letterSpacing = brand ? `${-size * 0.02}px` : '0px';
    context.fillText(
      text,
      WIDTH * question.left,
      HEIGHT * question.top + index * step,
      WIDTH * 0.8,
    );
  });
  context.letterSpacing = '0px';
};

const drawAnswer = (context: CanvasRenderingContext2D, { answer, ink, print }: SignCopy) => {
  const rim = WIDTH * print.border;
  if (rim > 0) {
    context.fillStyle = ink.border;
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }
  context.fillStyle = ink.board;
  context.fillRect(rim, rim, WIDTH - rim * 2, HEIGHT - rim * 2);
  const size = WIDTH * 0.082 * answer.size;
  context.fillStyle = ink.answer;
  context.textAlign = 'center';
  context.font = `400 ${size}px "${serifFont}"`;
  context.fillText(answer.line, WIDTH / 2, HEIGHT * answer.top, WIDTH * 0.84);
  context.font = `700 ${size * 0.94}px "${sansFont}"`;
  context.letterSpacing = `${-size * 0.02}px`;
  context.fillText(answer.address, WIDTH / 2, HEIGHT * answer.top + size * 1.12, WIDTH * 0.86);
  context.letterSpacing = '0px';
};

export const drawSign = (canvas: HTMLCanvasElement, side: SignSide, copy: SignCopy) => {
  const art = document.createElement('canvas');
  art.width = WIDTH;
  art.height = HEIGHT;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = art.getContext('2d');
  const target = canvas.getContext('2d');
  if (context === null || target === null) {
    return;
  }
  context.textBaseline = 'alphabetic';
  if (side === 'question') {
    drawQuestion(context, copy);
  } else {
    drawAnswer(context, copy);
  }
  target.filter = copy.print.softness > 0 ? `blur(${copy.print.softness * 1.5}px)` : 'none';
  target.drawImage(art, 0, 0);
};
