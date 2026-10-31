import { describe, expect, it } from 'bun:test';
import type { HandSetup } from '@/compositions/keyboard-typing-cta/hand-assign';
import {
  fingertipAt,
  handSetup,
  handWaypoints,
  panelToScreen,
} from '@/compositions/keyboard-typing-cta/hand-path';
import { KEYBOARD_LAYOUT } from '@/compositions/keyboard-typing-cta/layout';
import { typedCount } from '@/compositions/keyboard-typing-cta/schedule';
import {
  MIN_HAND_FRAMES,
  MIN_KEY_FRAMES,
  planTyping,
  type TypingTiming,
} from '@/compositions/keyboard-typing-cta/typing-plan';
import { keyboardTypingCtaDefaults } from '@/schemas';

const timing: TypingTiming = {
  start: 100,
  end: 300,
  maxKeyFrames: 11,
  rhythm: 0.18,
  wordPause: 1.35,
  switchPause: 1.4,
  submit: false,
};

const plan = (text: string, overrides: Partial<TypingTiming> = {}) =>
  planTyping(text, KEYBOARD_LAYOUT, { ...timing, ...overrides });

const keys = (text: string, overrides: Partial<TypingTiming> = {}) =>
  plan(text, overrides).steps.map((step) => step.key.id);

describe('planTyping', () => {
  it('maps every letter to its own key and spaces to the space bar', () => {
    expect(keys('Go big')).toEqual(['g', 'o', 'space', 'b', 'i', 'g']);
  });

  it('presses keys that sit exactly where the layout draws them', () => {
    for (const step of plan('hello world').steps) {
      const spec = KEYBOARD_LAYOUT[step.layer].find((key) => key.id === step.key.id);
      expect(spec).toBeDefined();
      expect(step.point[1]).toBe(spec?.y ?? -1);
      expect(Math.abs(step.point[0] - (spec?.x ?? 0))).toBeLessThanOrEqual((spec?.width ?? 0) / 2);
    }
  });

  it('switches to the symbols layer for digits and punctuation, and back for letters', () => {
    expect(keys('In 30 days!')).toEqual([
      'i',
      'n',
      'space',
      'to-symbols',
      '3',
      '0',
      'space',
      'to-letters',
      'd',
      'a',
      'y',
      's',
      'to-symbols',
      '!',
    ]);
  });

  it('types commas and periods from the letter layer without switching', () => {
    expect(keys('Hi, you.')).not.toContain('to-symbols');
  });

  it('auto capitalises sentence starts and presses shift for other capitals', () => {
    expect(keys('Hey Sam. Ok')).toEqual([
      'h',
      'e',
      'y',
      'space',
      'shift',
      's',
      'a',
      'm',
      '.',
      'space',
      'o',
      'k',
    ]);
  });

  it('presses shift to type a lowercase first letter', () => {
    expect(keys('hi').slice(0, 2)).toEqual(['shift', 'h']);
  });

  it('tracks the keyboard state after every press', () => {
    const steps = plan('Ab 1').steps;
    expect(steps.map((step) => step.state)).toEqual([
      { layer: 'letters', shift: false },
      { layer: 'letters', shift: false },
      { layer: 'letters', shift: false },
      { layer: 'symbols', shift: false },
      { layer: 'symbols', shift: false },
    ]);
  });

  it('keeps the typed count in step with the characters', () => {
    const typed = plan('Hey 2').steps.map((step) => step.typed);
    expect(typed).toEqual([1, 2, 3, 4, 4, 5]);
  });

  it('skips characters that have no key and types accented letters on their base key', () => {
    const result = plan('Café ☕ ok');
    expect(result.text).toBe('Café  ok');
    expect(result.skipped).toEqual(['☕']);
    expect(result.steps.find((step) => step.char === 'é')?.key.id).toBe('e');
  });

  it('ends on the enter key when submitting', () => {
    expect(keys('ok', { submit: true }).at(-1)).toBe('enter');
  });

  it('keeps press frames strictly increasing and inside the typing window', () => {
    for (const text of ['Bold ideas, launched in 30 days!', 'x'.repeat(60), 'A1!b2?C3.d4,']) {
      const frames = plan(text, { submit: true }).steps.map((step) => step.frame);
      expect(frames[0]).toBe(timing.start);
      expect(frames.at(-1) ?? 0).toBeLessThanOrEqual(timing.end + 1);
      frames.slice(1).forEach((frame, index) => {
        expect(frame - (frames[index] ?? 0)).toBeGreaterThanOrEqual(MIN_KEY_FRAMES);
      });
    }
  });

  it('fills the window for long texts and caps the pace for short ones', () => {
    const long = plan('Launch day is here, and the whole team is ready to go').steps;
    expect(long.at(-1)?.frame).toBeGreaterThan(timing.end - 4);
    const short = plan('Hi').steps;
    expect((short.at(-1)?.frame ?? 0) - timing.start).toBeLessThanOrEqual(timing.maxKeyFrames * 2);
  });

  it('pauses longer after a layer switch and between words', () => {
    const steps = plan('aaaa 1').steps;
    const gaps = steps.slice(1).map((step, index) => step.frame - (steps[index]?.frame ?? 0));
    const sameKey = gaps[1] ?? 0;
    const afterSwitch = gaps.at(-1) ?? 0;
    expect(afterSwitch).toBeGreaterThan(sameKey);
  });
});

describe('fingertip path', () => {
  const props = keyboardTypingCtaDefaults;
  const reach: HandSetup['reach'] = {
    index: [-120, 30],
    middle: [0, 0],
    ring: [100, 20],
    pinky: [185, 70],
  };

  it('lands the pressing fingertip of the right hand exactly on every planned key', () => {
    for (const twoHands of [true, false]) {
      const setup = { ...props, hand: { ...props.hand, twoHands } };
      for (const text of [props.copy.typed, 'Hey Sam, meet @ 9:45?']) {
        const result = planTyping(
          text,
          KEYBOARD_LAYOUT,
          { ...timing, submit: true },
          handSetup(setup),
        );
        for (const side of ['left', 'right'] as const) {
          const points = handWaypoints(setup, result, side);
          for (const step of result.steps.filter((candidate) => candidate.hand === side)) {
            const tip = fingertipAt(points, step.frame, props.hand.size, side);
            const target = panelToScreen(step.point, props.keyboard);
            expect(Math.hypot(tip[0] - target[0], tip[1] - target[1])).toBeLessThan(0.001);
          }
        }
      }
    }
  });

  it('types left side keys with the left hand and right side keys with the right hand', () => {
    const steps = planTyping('Qp', KEYBOARD_LAYOUT, timing, { reach, split: 493 }).steps;
    expect(steps.map((step) => step.hand)).toEqual(['left', 'right']);
    const single = planTyping('Qp', KEYBOARD_LAYOUT, timing, { reach }).steps;
    expect(single.map((step) => step.hand)).toEqual(['right', 'right']);
  });

  it('presses with the finger on the side of the hand nearest the key', () => {
    const fingers = planTyping('Hqp', KEYBOARD_LAYOUT, timing, { reach }).steps.map(
      (step) => step.finger,
    );
    expect(fingers.slice(0, 2)).toEqual(['middle', 'index']);
    expect(['ring', 'pinky']).toContain(fingers[2] ?? '');
  });

  it('gives each hand time to travel between its own presses', () => {
    const steps = planTyping('Typing with two hands', KEYBOARD_LAYOUT, timing, {
      reach,
      split: 493,
    }).steps;
    for (const side of ['left', 'right'] as const) {
      const frames = steps.filter((step) => step.hand === side).map((step) => step.frame);
      frames.slice(1).forEach((frame, index) => {
        expect(frame - (frames[index] ?? 0)).toBeGreaterThanOrEqual(MIN_HAND_FRAMES);
      });
    }
  });

  it('mirrors the finger choice for the left hand', () => {
    const fingers = planTyping('Gq', KEYBOARD_LAYOUT, timing, { reach, split: 493 }).steps.map(
      (step) => step.finger,
    );
    expect(fingers[0]).toBe('middle');
    expect(['ring', 'pinky']).toContain(fingers[1] ?? '');
  });

  it('shows each character in the field on its press frame', () => {
    const result = plan('Hey 2');
    for (const step of result.steps) {
      expect(typedCount(result, step.frame)).toBe(step.typed);
      expect(typedCount(result, step.frame - 1)).toBeLessThanOrEqual(step.typed);
    }
  });
});
