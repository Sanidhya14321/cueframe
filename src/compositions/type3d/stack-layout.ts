import type { GridStackProps } from '@/schemas';
import { highlightSet, normalize, wordsOf } from '../promo/words';
import { wordAspect } from './word-art';

interface StackWord {
  text: string;
  color: string;
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface StackPhrase {
  words: StackWord[];
  start: number;
  exitAt: number;
  end: number;
  offsets: number[];
}

const centerOf = (words: StackWord[], count: number): number => {
  const visible = words.slice(0, Math.max(1, count));
  const first = visible[0];
  const last = visible.at(-1);
  if (first === undefined || last === undefined) {
    return 0;
  }
  return (first.y + first.height / 2 + (last.y - last.height / 2)) / 2;
};

const layoutPhrase = (line: string, phraseIndex: number, props: GridStackProps): StackWord[] => {
  const accented = highlightSet(props.highlight);
  const side = phraseIndex % 2 === 0 ? 1 : -1;
  const sized = wordsOf(line).map((text, index) => {
    const isAccent = accented.has(normalize(text));
    const art = { text, color: '', weight: props.weight, face: props.face };
    const aspect = wordAspect(art);
    const wanted = isAccent ? props.bigSize : props.smallSize;
    const height = Math.min(wanted, props.maxWidth / aspect);
    const shift = isAccent ? 0 : (index % 2 === 0 ? -1 : 1) * side * props.offset * props.maxWidth;
    const width = height * aspect;
    const room = (props.maxWidth - width) / 2;
    return {
      text,
      color: isAccent ? props.look.accent : props.look.ink,
      height,
      width,
      x: Math.max(-room, Math.min(room, shift)),
      y: 0,
    };
  });
  let cursor = 0;
  const placed = sized.map((word, index) => {
    const above = sized[index - 1];
    if (above !== undefined) {
      cursor -= props.gap * Math.min(above.height, word.height);
    }
    const y = cursor - word.height / 2;
    cursor -= word.height;
    return { ...word, y };
  });
  const middle = centerOf(placed, placed.length);
  return placed.map((word) => ({ ...word, y: word.y - middle }));
};

export const layoutStack = (props: GridStackProps): StackPhrase[] => {
  const lines = props.text.split('\n').filter((line) => line.trim().length > 0);
  let start = props.delay;
  return lines.map((line, index) => {
    const words = layoutPhrase(line, index, props);
    const exitAt = start + words.length * props.wordGap + props.holdFrames;
    const phrase = {
      words,
      start,
      exitAt,
      end: exitAt + props.exitFrames,
      offsets: words.map((_, count) => -centerOf(words, count + 1)),
    };
    start = exitAt + Math.round(props.exitFrames * 0.55);
    return phrase;
  });
};
