import { describe, expect, it } from 'bun:test';
import { auditPosterControls, templateDesign } from '@/posters';
import { paint, rect, text, themed } from '@/posters/kit';

const poster = themed(
  400,
  400,
  {
    colors: {
      background: { value: '#ffffff', hint: 'Page' },
      primary: { value: '#1f4a36', hint: 'Squares and title' },
    },
    fonts: { heading: { label: 'Heading font', value: 'Anton' } },
    copy: {
      title: { label: 'Title', value: 'Hello' },
      items: { label: 'Item', value: ['One', 'Two'] },
    },
  },
  (t) => [
    rect(0, 0, 400, 400, t.color('background'), { name: 'Background' }),
    [0, 40, 80].map((x) => rect(x, 0, 30, 30, t.color('primary'), { name: 'Square' })),
    text(t.copy('title'), 0, 100, 300, {
      fill: t.shade('primary', '#133024'),
      fontFamily: t.font('heading'),
    }),
    t.list('items').map((item, index) =>
      text(item, 0, 200 + index * 50, 300, {
        fill: t.color('primary'),
        fontFamily: t.font('heading'),
      }),
    ),
  ],
);

describe('themed templates', () => {
  const design = templateDesign(poster, 'demo', 'Demo');

  it('renders the default theme exactly', () => {
    expect(design.background).toBe('#ffffff');
    expect(design.elements.map((element) => element.type)).toEqual([
      'path',
      'text',
      'text',
      'text',
    ]);
    expect(design.elements[1]).toMatchObject({ text: 'Hello', fill: '#133024' });
  });

  it('binds each control to the elements that use it', () => {
    const [, title, one, two] = design.elements.map((element) => element.id);
    const byId = new Map(design.controls.map((control) => [control.id, control]));
    expect(byId.get('background')?.targets).toEqual([{ element: 'page', prop: 'fill' }]);
    expect(byId.get('primary')).toMatchObject({ kind: 'color' });
    const primary = byId.get('primary');
    expect(
      primary?.kind === 'color' ? primary.targets.map((target) => target.element) : [],
    ).toEqual(design.elements.map((element) => element.id));
    expect(byId.get('copy:title')).toMatchObject({ targets: [{ element: title }] });
    expect(byId.get('copy:items')).toMatchObject({
      targets: [[{ element: one }], [{ element: two }]],
    });
    expect(auditPosterControls(design)).toEqual([]);
  });

  it('locks shapes but leaves text editable', () => {
    expect(design.elements.map((element) => element.locked)).toEqual([true, false, false, false]);
  });

  it('flags unbound colours and copy', () => {
    const loose = templateDesign(
      themed(
        100,
        100,
        {
          colors: {
            background: { value: '#fff', hint: 'Page' },
            primary: { value: '#000', hint: 'x' },
          },
        },
        (t) => [
          rect(0, 0, 100, 100, t.color('background')),
          rect(0, 0, 10, 10, '#ff0000'),
          text('Hi', 0, 0, 50),
        ],
      ),
      'loose',
      'Loose',
    );
    expect(auditPosterControls(loose)).toEqual(
      expect.arrayContaining([
        'control "Primary color" drives nothing',
        '"Shape" fill #ff0000 has no color control',
        'text "Hi" has no text control',
        'text "Hi" has no font control',
      ]),
    );
  });
});

describe('paint', () => {
  it('swaps exact colours inside kit blocks', () => {
    const [shape, label] = paint(
      [rect(0, 0, 10, 10, '#111111'), text('Hi', 0, 0, 10, { fill: '#FFFFFF' })],
      { '#111111': '#222222', '#ffffff': '#eeeeee' },
    );
    expect(shape).toMatchObject({ fill: '#222222', stroke: '#222222' });
    expect(label).toMatchObject({ fill: '#eeeeee' });
  });
});
