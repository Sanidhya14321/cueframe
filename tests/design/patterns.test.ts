import { describe, expect, it } from 'bun:test';
import {
  createEllipse,
  createRect,
  createStar,
  createText,
  type DesignElement,
  mergePatterns,
} from '@/design';

const patternsOf = (elements: readonly DesignElement[]) => mergePatterns(elements).elements;

const square = (x: number, y: number, fill = '#1f4a36', extra: Partial<DesignElement> = {}) =>
  createRect({ name: 'Check', x, y, width: 10, height: 10, fill, ...extra });

describe('mergePatterns', () => {
  it('turns a run of repeated shapes into one path per colour', () => {
    const merged = patternsOf([
      createText({ id: 'title' }),
      square(0, 0),
      square(10, 0, '#ffffff'),
      square(20, 0),
      square(30, 0, '#ffffff'),
      createText({ id: 'footer' }),
    ]);
    expect(merged.map((element) => element.type)).toEqual(['text', 'path', 'path', 'text']);
    expect(merged[1]).toMatchObject({
      name: 'Check pattern',
      x: 0,
      y: 0,
      width: 30,
      height: 10,
      fill: '#1f4a36',
      data: 'M0 0 H10 V10 H0 Z M20 0 H30 V10 H20 Z',
    });
  });

  it('keeps paint order when differently coloured shapes overlap', () => {
    const merged = patternsOf([square(0, 0), square(0, 0), square(5, 5, '#fff'), square(9, 9)]);
    expect(merged.map((element) => element.type)).toEqual(['path', 'rect', 'rect']);
  });

  it('leaves short runs, rotated shapes and shadows alone', () => {
    const short = [square(0, 0), square(10, 0)];
    expect(patternsOf(short)).toEqual(short);
    const rotated = [0, 10, 20].map((x) => square(x, 0, '#000', { rotation: 5 }));
    expect(patternsOf(rotated)).toEqual(rotated);
  });

  it('draws circles, rounded squares and stars as path data', () => {
    const dots = [0, 20, 40].map((x) =>
      createEllipse({ name: 'Dot', x, y: 0, width: 10, height: 10, fill: '#000' }),
    );
    expect(patternsOf(dots)[0]).toMatchObject({
      type: 'path',
      data: expect.stringContaining('A5 5 0 1 1'),
    });
    const tiles = [0, 20, 40].map((x) =>
      createRect({ name: 'Tile', x, y: 0, width: 10, height: 10, cornerRadius: 2, fill: '#000' }),
    );
    expect(patternsOf(tiles)[0]).toMatchObject({ data: expect.stringContaining('A2 2 0 0 1') });
    const stars = [0, 20, 40].map((x) =>
      createStar({ name: 'Star', x, y: 0, width: 10, height: 10, fill: '#000' }),
    );
    expect(patternsOf(stars)).toHaveLength(1);
  });

  it('keeps shapes driven by different colour roles in separate patterns', () => {
    const squares = [0, 10, 20, 30].map((x) => square(x, 0));
    const role = (id: string) => (squares.findIndex((shape) => shape.id === id) < 2 ? 'a' : 'b');
    const merged = mergePatterns(squares, role).elements;
    expect(merged).toMatchObject([
      { type: 'path', width: 20 },
      { type: 'path', x: 20, width: 20 },
    ]);
    const paired = mergePatterns([...squares, square(40, 0)], (id) =>
      squares.findIndex((shape) => shape.id === id) === 0 ? 'a' : 'b',
    ).elements;
    expect(paired.map((element) => element.type)).toEqual(['rect', 'path']);
  });
});
