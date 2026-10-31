import { describe, expect, it } from 'bun:test';
import {
  applyTone,
  createDesign,
  createRect,
  createText,
  type DesignControl,
  linear,
  recolor,
  setControlValue,
  setListItem,
  toneBetween,
} from '@/design';

const controls: DesignControl[] = [
  {
    kind: 'color',
    id: 'primary',
    label: 'Primary color',
    value: '#1f4a36',
    targets: [
      { element: 'page', prop: 'fill', stop: 1 },
      { element: 'card', prop: 'fill' },
      { element: 'card', prop: 'shadow', alpha: 0.3 },
      { element: 'title', prop: 'fill', tone: toneBetween('#1f4a36', '#133024') },
    ],
  },
  {
    kind: 'font',
    id: 'font:heading',
    label: 'Heading font',
    value: 'Anton',
    targets: [{ element: 'title' }],
  },
  {
    kind: 'text',
    id: 'copy:title',
    label: 'Title',
    value: 'QUIZ',
    targets: [{ element: 'title' }],
  },
  {
    kind: 'list',
    id: 'copy:answers',
    label: 'Answer',
    values: ['A', 'B'],
    targets: [[{ element: 'a' }], [{ element: 'b' }]],
  },
];

const design = () =>
  createDesign({
    background: linear(180, '#fbf5e6', '#1f4a36'),
    controls,
    elements: [
      createRect({
        id: 'card',
        fill: '#1f4a36',
        shadow: { color: 'rgba(31,74,54,0.3)', blur: 4, offsetX: 0, offsetY: 2 },
      }),
      createText({ id: 'title', text: 'QUIZ', fill: '#133024', fontFamily: 'Anton' }),
      createText({ id: 'a', text: 'A' }),
      createText({ id: 'b', text: 'B' }),
    ],
  });

describe('design controls', () => {
  it('recolours every target, keeping tones, alpha and gradient stops', () => {
    const next = setControlValue(design(), 'primary', '#2244aa');
    const [card, title] = next.elements;
    expect(card).toMatchObject({ fill: '#2244aa', shadow: { color: 'rgba(34, 68, 170, 0.3)' } });
    expect(title?.type === 'text' ? title.fill : '').toBe(
      applyTone('#2244aa', toneBetween('#1f4a36', '#133024')),
    );
    expect(next.background).toMatchObject({ stops: [{ color: '#fbf5e6' }, { color: '#2244aa' }] });
    expect(next.controls[0]).toMatchObject({ value: '#2244aa' });
  });

  it('round-trips a tone back to the original shade', () => {
    expect(applyTone('#1f4a36', toneBetween('#1f4a36', '#133024'))).toBe('#133024');
    expect(toneBetween('#1f4a36', '#1F4A36')).toBeUndefined();
  });

  it('keeps shades of a coloured role neutral when the role turns grey', () => {
    const deep = toneBetween('#1f4a36', '#133024');
    expect(applyTone('#808080', deep)).toBe('#666666');
    expect(applyTone('#ffffff', deep)).toBe('#e1e1e1');
  });

  it('carries shades of a neutral role over to a coloured one', () => {
    const divider = toneBetween('#ffffff', '#e7e3da');
    expect(divider).toMatchObject({ neutral: true });
    expect(applyTone('#ffffff', divider)).toBe('#e7e3da');
    expect(applyTone('#2244aa', divider)).toBe('#0f2a8f');
  });

  it('recolours a sample relative to its base', () => {
    expect(recolor('#1f4a36', '#1f4a36', '#133024')).toBe('#133024');
    expect(recolor('#2244aa', '#1f4a36', '#1f4a36')).toBe('#2244aa');
    expect(recolor('#2244aa', '#1f4a36', '#133024')).toBe(
      applyTone('#2244aa', toneBetween('#1f4a36', '#133024')),
    );
  });

  it('sets fonts, text and list items', () => {
    let next = setControlValue(design(), 'font:heading', 'Inter');
    next = setControlValue(next, 'copy:title', 'POLL');
    next = setListItem(next, 'copy:answers', 1, 'Beta');
    expect(next.elements[1]).toMatchObject({ fontFamily: 'Inter', text: 'POLL' });
    expect(next.elements.map((element) => element.type === 'text' && element.text)).toEqual([
      false,
      'POLL',
      'A',
      'Beta',
    ]);
  });

  it('ignores unknown controls and bad colours', () => {
    const start = design();
    expect(setControlValue(start, 'missing', '#fff')).toBe(start);
    expect(setControlValue(start, 'primary', 'nope')).toBe(start);
    expect(setListItem(start, 'copy:answers', 5, 'x')).toBe(start);
  });
});
