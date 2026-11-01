import { describe, expect, it } from 'bun:test';
import { wrapLine } from '@/project/text-wrap';

const measure = (text: string) => text.length;

describe('wrapLine', () => {
  it('keeps a line that fits', () => {
    expect(wrapLine('short title', 20, measure)).toEqual(['short title']);
  });
  it('breaks at spaces once a row passes the limit', () => {
    expect(wrapLine('one two three four', 8, measure)).toEqual(['one two', 'three', 'four']);
  });
  it('never splits a single long word', () => {
    expect(wrapLine('extraordinarily long', 5, measure)).toEqual(['extraordinarily', 'long']);
  });
  it('keeps an empty line', () => {
    expect(wrapLine('', 5, measure)).toEqual(['']);
  });
});
