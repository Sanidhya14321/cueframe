import type { Design } from './design';
import type { DesignElement } from './element';
import { createDesignId } from './factories';
import type { Fill } from './fill';
import type { Offsets } from './geometry';

export const addElements = (design: Design, elements: readonly DesignElement[]): Design => ({
  ...design,
  elements: [...design.elements, ...elements],
});

export const updateElements = (
  design: Design,
  ids: readonly string[],
  update: (element: DesignElement) => DesignElement,
): Design => ({
  ...design,
  elements: design.elements.map((element) =>
    ids.includes(element.id) ? update(element) : element,
  ),
});

export const patchElement = <T extends DesignElement>(element: T, patch: Partial<T>): T => ({
  ...element,
  ...patch,
});

export const removeElements = (design: Design, ids: readonly string[]): Design => ({
  ...design,
  elements: design.elements.filter((element) => !ids.includes(element.id)),
});

const remapGroup = (groupIds: Map<string, string>, groupId: string): string => {
  const existing = groupIds.get(groupId);
  if (existing !== undefined) {
    return existing;
  }
  const next = createDesignId('group');
  groupIds.set(groupId, next);
  return next;
};

const cloneWithNewIds = (elements: readonly DesignElement[], offset: number): DesignElement[] => {
  const groupIds = new Map<string, string>();
  return elements.map((element) => ({
    ...element,
    ...(element.groupId === undefined ? {} : { groupId: remapGroup(groupIds, element.groupId) }),
    id: createDesignId(element.type),
    x: element.x + offset,
    y: element.y + offset,
  }));
};

const withoutGroup = (element: DesignElement): DesignElement => {
  const { groupId: _ignored, ...rest } = element;
  return rest;
};

export const duplicateElements = (
  design: Design,
  ids: readonly string[],
  offset = 24,
): { design: Design; ids: string[] } => {
  const copies = cloneWithNewIds(
    design.elements.filter((element) => ids.includes(element.id)),
    offset,
  );
  return { design: addElements(design, copies), ids: copies.map((element) => element.id) };
};

export const pasteElements = (
  design: Design,
  elements: readonly DesignElement[],
  offset = 24,
): { design: Design; ids: string[] } => {
  const copies = cloneWithNewIds(elements, offset);
  return { design: addElements(design, copies), ids: copies.map((element) => element.id) };
};

export const LAYER_MOVES = ['forward', 'backward', 'front', 'back'] as const;

export type LayerMove = (typeof LAYER_MOVES)[number];

export const reorderElements = (
  design: Design,
  ids: readonly string[],
  move: LayerMove,
): Design => {
  const selected = design.elements.filter((element) => ids.includes(element.id));
  const rest = design.elements.filter((element) => !ids.includes(element.id));
  if (selected.length === 0) {
    return design;
  }
  if (move === 'front') {
    return { ...design, elements: [...rest, ...selected] };
  }
  if (move === 'back') {
    return { ...design, elements: [...selected, ...rest] };
  }
  const elements = [...design.elements];
  const indexes = elements
    .map((element, index) => (ids.includes(element.id) ? index : -1))
    .filter((index) => index >= 0);
  const ordered = move === 'forward' ? [...indexes].reverse() : indexes;
  const step = move === 'forward' ? 1 : -1;
  for (const index of ordered) {
    const target = index + step;
    const neighbour = elements[target];
    const current = elements[index];
    if (neighbour === undefined || current === undefined || ids.includes(neighbour.id)) {
      continue;
    }
    elements[target] = current;
    elements[index] = neighbour;
  }
  return { ...design, elements };
};

export const moveElementTo = (design: Design, id: string, index: number): Design => {
  const element = design.elements.find((item) => item.id === id);
  if (element === undefined) {
    return design;
  }
  const rest = design.elements.filter((item) => item.id !== id);
  const clamped = Math.max(0, Math.min(rest.length, index));
  return { ...design, elements: [...rest.slice(0, clamped), element, ...rest.slice(clamped)] };
};

export const translateElements = (design: Design, offsets: Offsets): Design => ({
  ...design,
  elements: design.elements.map((element) => {
    const offset = offsets[element.id];
    return offset === undefined
      ? element
      : { ...element, x: element.x + offset.x, y: element.y + offset.y };
  }),
});

export const groupElements = (design: Design, ids: readonly string[]): Design => {
  if (ids.length < 2) {
    return design;
  }
  const groupId = createDesignId('group');
  return updateElements(design, ids, (element) => ({ ...element, groupId }));
};

export const ungroupElements = (design: Design, ids: readonly string[]): Design =>
  updateElements(design, ids, withoutGroup);

export const expandToGroups = (design: Design, ids: readonly string[]): string[] => {
  const groups = new Set(
    design.elements
      .filter((element) => ids.includes(element.id) && element.groupId !== undefined)
      .map((element) => element.groupId),
  );
  return design.elements
    .filter(
      (element) =>
        ids.includes(element.id) || (element.groupId !== undefined && groups.has(element.groupId)),
    )
    .map((element) => element.id);
};

export const setBackground = (design: Design, background: Fill): Design => ({
  ...design,
  background,
});

export const scaleElement = (
  element: DesignElement,
  factor: number,
  shiftX: number,
  shiftY: number,
): DesignElement => {
  const shadow =
    element.shadow === undefined
      ? {}
      : {
          shadow: {
            ...element.shadow,
            blur: element.shadow.blur * factor,
            offsetX: element.shadow.offsetX * factor,
            offsetY: element.shadow.offsetY * factor,
          },
        };
  const moved = {
    ...element,
    ...shadow,
    x: element.x * factor + shiftX,
    y: element.y * factor + shiftY,
    width: element.width * factor,
  };
  switch (moved.type) {
    case 'text':
      return {
        ...moved,
        fontSize: moved.fontSize * factor,
        letterSpacing: moved.letterSpacing * factor,
        strokeWidth: moved.strokeWidth * factor,
      };
    case 'line':
      return { ...moved, strokeWidth: moved.strokeWidth * factor };
    case 'rect':
      return {
        ...moved,
        height: moved.height * factor,
        cornerRadius: moved.cornerRadius * factor,
        strokeWidth: moved.strokeWidth * factor,
      };
    case 'image':
      return {
        ...moved,
        height: moved.height * factor,
        cornerRadius: moved.cornerRadius * factor,
        strokeWidth: moved.strokeWidth * factor,
      };
    case 'icon':
      return { ...moved, height: moved.height * factor };
    default:
      return { ...moved, height: moved.height * factor, strokeWidth: moved.strokeWidth * factor };
  }
};

export const resizeDesign = (design: Design, width: number, height: number): Design => {
  const factor = Math.min(width / design.width, height / design.height);
  const shiftX = (width - design.width * factor) / 2;
  const shiftY = (height - design.height * factor) / 2;
  return {
    ...design,
    width,
    height,
    elements: design.elements.map((element) => scaleElement(element, factor, shiftX, shiftY)),
  };
};
