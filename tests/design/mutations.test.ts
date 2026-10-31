import { describe, expect, it } from 'bun:test';
import {
  createDesign,
  createEllipse,
  createImage,
  createRect,
  createText,
  designSchema,
  duplicateElements,
  expandToGroups,
  findDesignFormat,
  firstFillColor,
  flattenStops,
  groupElements,
  linear,
  moveElementTo,
  pasteElements,
  patchElement,
  radial,
  removeElements,
  reorderElements,
  resizeDesign,
  setBackground,
  translateElements,
  ungroupElements,
} from '@/design';

const designWith = (count: number) =>
  createDesign({
    elements: Array.from({ length: count }, (_, index) =>
      createRect({ id: `r${index}`, x: index * 10 }),
    ),
  });

const ids = (design: { elements: { id: string }[] }) =>
  design.elements.map((element) => element.id);

describe('element mutations', () => {
  it('reorders forward, backward, front and back', () => {
    const design = designWith(4);
    expect(ids(reorderElements(design, ['r1'], 'forward'))).toEqual(['r0', 'r2', 'r1', 'r3']);
    expect(ids(reorderElements(design, ['r1'], 'backward'))).toEqual(['r1', 'r0', 'r2', 'r3']);
    expect(ids(reorderElements(design, ['r0', 'r1'], 'front'))).toEqual(['r2', 'r3', 'r0', 'r1']);
    expect(ids(reorderElements(design, ['r3'], 'back'))).toEqual(['r3', 'r0', 'r1', 'r2']);
    expect(ids(reorderElements(design, ['r3'], 'forward'))).toEqual(['r0', 'r1', 'r2', 'r3']);
    expect(reorderElements(design, ['missing'], 'front')).toBe(design);
  });

  it('moves an element to an index', () => {
    expect(ids(moveElementTo(designWith(3), 'r0', 2))).toEqual(['r1', 'r2', 'r0']);
    const design = designWith(2);
    expect(moveElementTo(design, 'nope', 0)).toBe(design);
  });

  it('duplicates and pastes with fresh ids and an offset', () => {
    const { design, ids: copies } = duplicateElements(designWith(2), ['r1']);
    expect(design.elements).toHaveLength(3);
    expect(copies[0]).not.toBe('r1');
    expect(design.elements[2]?.x).toBe(10 + 24);
    const pasted = pasteElements(createDesign(), [createText()], 0);
    expect(pasted.design.elements).toHaveLength(1);
  });

  it('duplicating a group keeps the copies grouped under a new id', () => {
    const grouped = groupElements(designWith(3), ['r0', 'r1']);
    const groupId = grouped.elements[0]?.groupId;
    const { design } = duplicateElements(grouped, ['r0', 'r1']);
    const copyGroups = new Set(design.elements.slice(3).map((element) => element.groupId));
    expect(copyGroups.size).toBe(1);
    expect(copyGroups.has(groupId)).toBe(false);
  });

  it('groups, expands selection to the group and ungroups', () => {
    const design = groupElements(designWith(3), ['r0', 'r2']);
    expect(expandToGroups(design, ['r0'])).toEqual(['r0', 'r2']);
    expect(groupElements(design, ['r1'])).toBe(design);
    const ungrouped = ungroupElements(design, ['r0', 'r2']);
    expect(ungrouped.elements.every((element) => element.groupId === undefined)).toBe(true);
  });

  it('removes, translates and patches elements', () => {
    expect(ids(removeElements(designWith(3), ['r1']))).toEqual(['r0', 'r2']);
    const moved = translateElements(designWith(2), { r1: { x: 5, y: 7 } });
    expect(moved.elements[1]).toMatchObject({ x: 15, y: 7 });
    expect(patchElement(createEllipse(), { fill: '#000' }).fill).toBe('#000');
    expect(setBackground(createDesign(), linear(90, '#000', '#fff')).background).toMatchObject({
      type: 'linear',
    });
  });
});

describe('design mutations', () => {
  it('resize scales content uniformly and centres it', () => {
    const square = createDesign({
      width: 1000,
      height: 1000,
      elements: [
        createRect({ x: 0, y: 0, width: 1000, height: 1000, cornerRadius: 20 }),
        createText({
          fontSize: 100,
          shadow: { color: '#000', blur: 10, offsetX: 2, offsetY: 4 },
        }),
        createImage({ width: 100, height: 100 }),
      ],
    });
    const story = resizeDesign(square, 500, 1000);
    const [rect, text, image] = story.elements;
    expect(rect).toMatchObject({ x: 0, y: 250, width: 500, height: 500, cornerRadius: 10 });
    expect(text).toMatchObject({ fontSize: 50, shadow: { blur: 5, offsetY: 2 } });
    expect(image).toMatchObject({ width: 50, height: 50 });
    expect(designSchema.safeParse(story).success).toBe(true);
  });
});

describe('fills and formats', () => {
  it('builds evenly spaced gradient stops', () => {
    expect(radial('#000', '#111', '#222').stops.map((stop) => stop.offset)).toEqual([0, 0.5, 1]);
    expect(firstFillColor(linear(0, '#abc', '#def'))).toBe('#abc');
    expect(firstFillColor('#123')).toBe('#123');
    expect(
      flattenStops([
        { offset: 1, color: 'b' },
        { offset: 0, color: 'a' },
      ]),
    ).toEqual([0, 'a', 1, 'b']);
  });

  it('looks up design formats', () => {
    expect(findDesignFormat('story')).toMatchObject({ width: 1080, height: 1920 });
    expect(findDesignFormat('nope')).toBeUndefined();
  });
});
