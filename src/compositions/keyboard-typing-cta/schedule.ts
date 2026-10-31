import type { KeyStep, TypingPlan } from './typing-plan';

const lastStepIndex = (steps: KeyStep[], frame: number): number => {
  let found = -1;
  for (let index = 0; index < steps.length; index++) {
    if ((steps[index]?.frame ?? Number.POSITIVE_INFINITY) <= frame) {
      found = index;
    }
  }
  return found;
};

export const typedCount = (plan: TypingPlan, frame: number): number =>
  plan.steps[lastStepIndex(plan.steps, frame)]?.typed ?? 0;

export const blendedValue = (
  plan: TypingPlan,
  frame: number,
  valueAfter: (index: number) => number,
  frames: number,
): number => {
  let value = valueAfter(-1);
  plan.steps.forEach((step, index) => {
    const change = valueAfter(index) - valueAfter(index - 1);
    if (change !== 0) {
      value += change * Math.min(1, Math.max(0, (frame - step.frame + 1) / frames));
    }
  });
  return value;
};

export type KeyboardMode = 'upper-tools' | 'lower-suggest';

const SENTENCE_END = /[.!?]$/;

export const keyboardMode = (text: string, count: number): KeyboardMode => {
  if (count === 0) {
    return 'upper-tools';
  }
  return SENTENCE_END.test(text.slice(0, count)) ? 'upper-tools' : 'lower-suggest';
};

const FILLERS = ['the', 'us', 'me', 'and', 'you', 'to'];

export const suggestions = (text: string, count: number): [string, string, string] => {
  const typed = text.slice(0, count);
  const words = text.split(' ');
  const typedWords = typed.split(' ');
  const index = typedWords.length - 1;
  const partial = (typedWords[index] ?? '').replace(/[^\p{L}\p{N}]/gu, '');
  const full = (words[index] ?? '').replace(/[^\p{L}\p{N}]/gu, '');
  const filler = FILLERS[index % FILLERS.length] ?? 'the';
  if (partial === '') {
    return [FILLERS[(index + 2) % FILLERS.length] ?? 'I', filler, full];
  }
  return partial === full
    ? [filler, full, FILLERS[(index + 3) % FILLERS.length] ?? 'a']
    : [partial, full, filler];
};

export const blinkOpacity = (since: number, hold: number, period: number): number =>
  since < hold ? 1 : 0.5 + 0.5 * Math.cos((2 * Math.PI * (since - hold)) / period);

export const cursorOpacity = (plan: TypingPlan, frame: number, cursorAt: number): number => {
  if (frame < cursorAt) {
    return 0;
  }
  const last = plan.steps[lastStepIndex(plan.steps, frame)]?.frame ?? cursorAt;
  return blinkOpacity(frame - Math.max(last, cursorAt), 16, 60);
};

export interface WordLayer {
  word: string;
  opacity: number;
  since: number;
}

export const wordLayers = (
  plan: TypingPlan,
  frame: number,
  valueAfter: (index: number) => string,
  frames: number,
): WordLayer[] => {
  const changes = [{ frame: Number.NEGATIVE_INFINITY, word: valueAfter(-1) }];
  plan.steps.forEach((step, index) => {
    const word = valueAfter(index);
    if (word !== changes.at(-1)?.word) {
      changes.push({ frame: step.frame, word });
    }
  });
  const ramp = (start: number) => Math.min(1, Math.max(0, (frame - start + 1) / frames));
  return changes
    .map((change, index) => ({
      word: change.word,
      since: change.frame,
      opacity: ramp(change.frame) - ramp(changes[index + 1]?.frame ?? Number.POSITIVE_INFINITY),
    }))
    .filter((layer) => layer.opacity > 0.001 && layer.word !== '');
};
