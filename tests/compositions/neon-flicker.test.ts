import { describe, expect, it } from 'bun:test';
import { flickerLevels } from '@/compositions/neon-sign/flicker';
import { neonSignFlickerDefaults } from '@/schemas';

const { flicker, pendant } = neonSignFlickerDefaults;
const letterAt = (frame: number): number =>
  Number(flickerLevels(frame, flicker, pendant.idle).letter.toFixed(3));

describe('flickerLevels', () => {
  it('holds fully lit before the first burst', () => {
    expect(flickerLevels(0, flicker, pendant.idle)).toEqual({ letter: 1, lamp: 1 });
    expect(letterAt(19)).toBe(1);
  });

  it('opens the first burst from lit with a half, off, half, on cycle', () => {
    expect([20, 21, 22, 23].map(letterAt)).toEqual([0.5, 0, 0.5, 1]);
  });

  it('rests dark with the lamp idling between bursts', () => {
    expect(flickerLevels(50, flicker, pendant.idle)).toEqual({ letter: 0, lamp: pendant.idle });
  });

  it('starts the later bursts on the reference frames', () => {
    expect([58, 94, 126, 152, 173, 188].map(letterAt)).toEqual([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    expect([57, 93, 125, 151, 172, 187].map(letterAt)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('burns out after the last burst', () => {
    expect(letterAt(189)).toBe(1);
    expect(flickerLevels(191, flicker, pendant.idle)).toEqual({ letter: 0, lamp: 0 });
    expect(flickerLevels(299, flicker, pendant.idle)).toEqual({ letter: 0, lamp: 0 });
  });

  it('relights for good when the sign does not stay dead', () => {
    expect(flickerLevels(250, { ...flicker, staysDead: false }, pendant.idle)).toEqual({
      letter: 1,
      lamp: 1,
    });
  });
});
