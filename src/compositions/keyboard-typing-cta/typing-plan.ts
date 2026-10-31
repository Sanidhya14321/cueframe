import type { Finger } from '../promo/desk/hand-rig';
import { type Assigned, assignHands, type HandSetup, type HandSide } from './hand-assign';
import {
  ENTER_KEY,
  type KeyboardLayout,
  type KeySpec,
  LAYER_KEY,
  type LayerId,
  SHIFT_KEY,
} from './layout';

type StepKind = 'char' | 'shift' | 'layer' | 'enter';

export interface KeyState {
  layer: LayerId;
  shift: boolean;
}

export interface KeyStep {
  frame: number;
  key: KeySpec;
  layer: LayerId;
  point: [number, number];
  hand: HandSide;
  finger: Finger;
  anchor: [number, number];
  travel: number;
  kind: StepKind;
  char: string;
  typed: number;
  state: KeyState;
}

export interface TypingPlan {
  text: string;
  skipped: string[];
  initial: KeyState;
  steps: KeyStep[];
}

export interface TypingTiming {
  start: number;
  end: number;
  maxKeyFrames: number;
  rhythm: number;
  wordPause: number;
  switchPause: number;
  submit: boolean;
}

export const MIN_KEY_FRAMES = 2;

export const MIN_HAND_FRAMES = 4;

const HAND_TRAVEL_FRAMES = 3;

const HAND_TRAVEL_SPAN = 50;

const EDGE_INSET = 44;

const SENTENCE_END = /[.!?]\s+$/;

const autoCapital = (typed: string): boolean => typed === '' || SENTENCE_END.test(typed);

const keyById = (layout: KeyboardLayout, layer: LayerId, id: string): KeySpec => {
  const key = layout[layer].find((candidate) => candidate.id === id);
  if (key === undefined) {
    throw new Error(`Keyboard layer ${layer} has no ${id} key`);
  }
  return key;
};

interface Target {
  layer: LayerId;
  key: KeySpec;
  upper: boolean | undefined;
}

const baseOf = (char: string): string => char.normalize('NFD').replace(/\p{M}/gu, '');

const resolveChar = (
  layout: KeyboardLayout,
  char: string,
  current: LayerId,
): Target | undefined => {
  const base = baseOf(char);
  const lower = base.toLowerCase();
  const cased = lower !== base.toUpperCase();
  const output = cased ? lower : base;
  const order: LayerId[] = current === 'letters' ? ['letters', 'symbols'] : ['symbols', 'letters'];
  for (const layer of order) {
    const key = layout[layer].find((candidate) => candidate.output === output);
    if (key !== undefined) {
      return { layer, key, upper: cased ? base !== lower : undefined };
    }
  }
  return undefined;
};

const aimAt = (key: KeySpec, from: [number, number] | undefined): [number, number] => {
  const inset = Math.min(EDGE_INSET, key.width / 2);
  const reach = key.width / 2 - inset;
  const x = from === undefined ? key.x : Math.min(key.x + reach, Math.max(key.x - reach, from[0]));
  return [x, key.y];
};

type Draft = Omit<KeyStep, 'frame' | keyof Assigned>;

type Placed = Omit<KeyStep, 'frame'>;

const FALLBACK: Assigned = { hand: 'right', finger: 'index', anchor: [0, 0], travel: 0 };

interface Drafted {
  text: string;
  skipped: string[];
  initial: KeyState;
  drafts: Draft[];
}

const draftSteps = (text: string, layout: KeyboardLayout, submit: boolean): Drafted => {
  let state: KeyState = { layer: 'letters', shift: autoCapital('') };
  const initial = { ...state };
  let typed = '';
  const drafts: Draft[] = [];
  const skipped: string[] = [];
  const press = (layer: LayerId, key: KeySpec, kind: StepKind, char: string) => {
    drafts.push({
      key,
      layer,
      point: aimAt(key, drafts.at(-1)?.point),
      kind,
      char,
      typed: typed.length,
      state: { ...state },
    });
  };
  for (const char of text) {
    const target = resolveChar(layout, char, state.layer);
    if (target === undefined) {
      skipped.push(char);
      continue;
    }
    if (target.layer !== state.layer) {
      const from = state.layer;
      state = { layer: target.layer, shift: target.layer === 'letters' && autoCapital(typed) };
      press(from, keyById(layout, from, LAYER_KEY[from]), 'layer', '');
    }
    if (target.upper !== undefined && target.upper !== state.shift) {
      state = { ...state, shift: !state.shift };
      press(state.layer, keyById(layout, state.layer, SHIFT_KEY), 'shift', '');
    }
    typed += char;
    state = { ...state, shift: state.layer === 'letters' && autoCapital(typed) };
    press(target.layer, target.key, 'char', char);
  }
  if (submit && drafts.length > 0) {
    press(state.layer, keyById(layout, state.layer, ENTER_KEY), 'enter', '');
  }
  return { text: typed, skipped, initial, drafts };
};

const jitter = (index: number, code: number): number => {
  const seed = Math.sin(index * 12.9898 + code * 78.233) * 43758.5453;
  return (seed - Math.floor(seed)) * 2 - 1;
};

const TRAVEL_SPAN = 250;

const weightOf = (drafts: Placed[], index: number, timing: TypingTiming): number => {
  const step = drafts[index];
  const previous = drafts[index - 1];
  if (step === undefined || previous === undefined) {
    return 0;
  }
  let weight = 0.3 + Math.min(1.4, step.travel / TRAVEL_SPAN);
  if (previous.kind === 'shift' || previous.kind === 'layer') {
    weight *= timing.switchPause;
  }
  if (previous.char === ' ') {
    weight *= timing.wordPause;
  }
  if (step.char === ' ') {
    weight *= 1 + (timing.wordPause - 1) / 2;
  }
  if (/[.!?]/.test(previous.char)) {
    weight *= 1.5;
  } else if (previous.char === ',') {
    weight *= 1.25;
  }
  if (step.kind === 'enter') {
    weight *= 1.8;
  }
  return weight * (1 + timing.rhythm * jitter(index, step.char.codePointAt(0) ?? step.key.x));
};

const handGap = (travel: number): number =>
  MIN_HAND_FRAMES + Math.min(HAND_TRAVEL_FRAMES, travel / HAND_TRAVEL_SPAN);

const spaceFrames = (
  drafts: Placed[],
  weights: number[],
  unit: number,
  start: number,
): number[] => {
  let exact = start;
  let last = Number.NEGATIVE_INFINITY;
  const lastByHand: Partial<Record<HandSide, number>> = {};
  return drafts.map((draft, index) => {
    exact += (weights[index] ?? 0) * unit;
    const sameHand = (lastByHand[draft.hand] ?? Number.NEGATIVE_INFINITY) + handGap(draft.travel);
    const frame = Math.max(Math.round(exact), last + MIN_KEY_FRAMES, Math.ceil(sameHand));
    last = frame;
    lastByHand[draft.hand] = frame;
    return frame;
  });
};

const fitWindow = (frames: number[], start: number, end: number): number[] => {
  const last = frames.at(-1) ?? start;
  if (last <= end || last === start) {
    return frames;
  }
  const scale = (end - start) / (last - start);
  let previous = Number.NEGATIVE_INFINITY;
  return frames.map((frame) => {
    const placed = Math.max(Math.round(start + (frame - start) * scale), previous + MIN_KEY_FRAMES);
    previous = placed;
    return placed;
  });
};

export const planTyping = (
  text: string,
  layout: KeyboardLayout,
  timing: TypingTiming,
  hands: HandSetup = { reach: { index: [0, 0] } },
): TypingPlan => {
  const { drafts: raw, ...rest } = draftSteps(text, layout, timing.submit);
  const assigned = assignHands(
    raw.map((draft) => draft.point),
    hands,
  );
  const drafts = raw.map((draft, index) => ({ ...draft, ...(assigned[index] ?? FALLBACK) }));
  const weights = drafts.map((_, index) => weightOf(drafts, index, timing));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const unit = total > 0 ? Math.min(timing.maxKeyFrames, (timing.end - timing.start) / total) : 0;
  const frames = spaceFrames(drafts, weights, unit, timing.start);
  const fitted = fitWindow(frames, timing.start, timing.end);
  const steps = drafts.map((draft, index) => ({ ...draft, frame: fitted[index] ?? timing.start }));
  return { ...rest, steps };
};
