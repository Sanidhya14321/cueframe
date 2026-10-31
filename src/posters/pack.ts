import {
  createDesign,
  type Design,
  type DesignControl,
  type DesignElement,
  mergePatterns,
  PAGE_TARGET,
  type RectElement,
} from '@/design';
import type { ClipTheme, PosterCategory, PosterTag } from '@/schemas';
import { flatten } from './kit/elements';
import type { Template } from './kit/template';

export interface PosterMeta {
  id: string;
  packId: string;
  title: string;
  description: string;
  category: PosterCategory;
  tags: readonly PosterTag[];
  theme: ClipTheme;
  width: number;
  height: number;
}

export interface Poster {
  meta: PosterMeta;
  build: () => Design;
}

export interface PosterPackSpec extends Omit<PosterMeta, 'id' | 'packId' | 'width' | 'height'> {
  id: string;
  designs: readonly Template[];
}

const isBackdrop = (
  element: DesignElement | undefined,
  width: number,
  height: number,
): element is RectElement =>
  element !== undefined &&
  element.type === 'rect' &&
  element.x === 0 &&
  element.y === 0 &&
  element.width === width &&
  element.height === height &&
  element.rotation === 0 &&
  element.opacity === 1 &&
  element.strokeWidth === 0 &&
  element.cornerRadius === 0 &&
  element.shadow === undefined;

const retarget = (
  controls: readonly DesignControl[],
  rename: (id: string) => string,
): DesignControl[] =>
  controls.map((control): DesignControl => {
    if (control.kind === 'color') {
      const seen = new Set<string>();
      return {
        ...control,
        targets: control.targets.flatMap((target) => {
          const next = { ...target, element: rename(target.element) };
          const key = `${next.element}:${next.prop}:${next.stop ?? ''}`;
          if (seen.has(key)) {
            return [];
          }
          seen.add(key);
          return [next];
        }),
      };
    }
    const unique = (targets: readonly { element: string }[]) =>
      [...new Set(targets.map((target) => rename(target.element)))].map((element) => ({ element }));
    return control.kind === 'list'
      ? { ...control, targets: control.targets.map(unique) }
      : { ...control, targets: unique(control.targets) };
  });

const colorBindings = (controls: readonly DesignControl[]): Map<string, string> => {
  const bindings = new Map<string, string[]>();
  for (const control of controls) {
    if (control.kind !== 'color') {
      continue;
    }
    for (const target of control.targets) {
      const key = JSON.stringify([control.id, target.prop, target.stop, target.tone, target.alpha]);
      bindings.set(target.element, [...(bindings.get(target.element) ?? []), key]);
    }
  }
  return new Map([...bindings].map(([element, keys]) => [element, keys.sort().join('|')]));
};

const lockShapes = (element: DesignElement): DesignElement =>
  element.type === 'text' || element.type === 'image' ? element : { ...element, locked: true };

export const templateDesign = (item: Template, id: string, title: string): Design => {
  const composed = item.compose?.() ?? { elements: flatten(item.build()), controls: [] };
  const bindings = colorBindings(composed.controls);
  const { elements: merged, aliases } = mergePatterns(
    composed.elements,
    (element) => bindings.get(element) ?? '',
  );
  const themed = composed.controls.length > 0;
  const elements = themed ? merged.map(lockShapes) : merged;
  const [first, ...rest] = elements;
  const backdrop = isBackdrop(first, item.width, item.height) ? first : undefined;
  const controls = retarget(composed.controls, (element) => {
    const resolved = aliases.get(element) ?? element;
    return resolved === backdrop?.id ? PAGE_TARGET : resolved;
  });
  return createDesign({
    id,
    title,
    width: item.width,
    height: item.height,
    controls,
    ...(backdrop === undefined ? { elements } : { background: backdrop.fill, elements: rest }),
  });
};

export const posterNumber = (index: number): string => String(index + 1).padStart(2, '0');

export const definePack = ({ id, designs, title, ...meta }: PosterPackSpec): Poster[] =>
  [...new Set(designs)].map((item, index) => {
    const posterId = `${id}-${posterNumber(index)}`;
    const posterTitle = `${title} ${index + 1}`;
    return {
      meta: {
        ...meta,
        id: posterId,
        packId: id,
        title: posterTitle,
        width: item.width,
        height: item.height,
      },
      build: () => templateDesign(item, posterId, posterTitle),
    };
  });
