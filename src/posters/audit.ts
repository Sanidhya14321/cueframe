import { parse } from 'culori';
import { type Design, type DesignControl, type DesignElement, PAGE_TARGET } from '@/design';
import { elementColors } from './kit/theme';

const MAX_COLORS = 6;
const MIN_COLORS = 2;
const MAX_FONTS = 3;
const MAX_COPY = 12;

const isNeutral = (color: string): boolean => {
  const parsed = parse(color);
  if (parsed === undefined) {
    return false;
  }
  const { r, g, b } = { r: 0, g: 0, b: 0, ...parsed };
  return (r === 0 && g === 0 && b === 0) || (r === 1 && g === 1 && b === 1);
};

const fillKeys = (design: Design): string[] =>
  typeof design.background === 'string'
    ? [`${PAGE_TARGET}:fill:`]
    : design.background.stops.map((_, index) => `${PAGE_TARGET}:fill:${index}`);

type ColorControl = Extract<DesignControl, { kind: 'color' }>;

const countProblems = (controls: readonly DesignControl[]): string[] => {
  const colors = controls.filter((control) => control.kind === 'color').length;
  const fonts = controls.filter((control) => control.kind === 'font').length;
  const copy = controls.filter((control) => control.kind === 'text' || control.kind === 'list');
  const ids = controls.map((control) => control.id);
  return [
    ...(colors < MIN_COLORS || colors > MAX_COLORS
      ? [`has ${colors} color controls; use ${MIN_COLORS} to ${MAX_COLORS}`]
      : []),
    ...(fonts > MAX_FONTS ? [`has ${fonts} font controls; use at most ${MAX_FONTS}`] : []),
    ...(copy.length > MAX_COPY
      ? [`has ${copy.length} text controls; group repeated copy into lists`]
      : []),
    ...(new Set(ids).size === ids.length ? [] : ['repeats a control id']),
    ...controls
      .filter((control) =>
        control.kind === 'list'
          ? control.targets.some((item) => item.length === 0)
          : control.targets.length === 0,
      )
      .map((control) => `control "${control.label}" drives nothing`),
  ];
};

const paintedProps = (colors: readonly ColorControl[], problems: string[]): Map<string, string> => {
  const painted = new Map<string, string>();
  for (const control of colors) {
    for (const target of control.targets) {
      const key = `${target.element}:${target.prop}:${target.stop ?? ''}`;
      const owner = painted.get(key);
      if (owner !== undefined && owner !== control.id) {
        problems.push(`${target.element} ${target.prop} is driven by ${owner} and ${control.id}`);
      }
      painted.set(key, control.id);
    }
  }
  return painted;
};

const targetIds = (controls: readonly DesignControl[], kinds: readonly string[]): Set<string> =>
  new Set(
    controls
      .filter((control) => kinds.includes(control.kind))
      .flatMap((control) =>
        control.kind === 'list'
          ? control.targets.flat().map((target) => target.element)
          : control.targets.map((target) => target.element),
      ),
  );

const elementProblems = (
  element: DesignElement,
  painted: ReadonlyMap<string, string>,
  worded: ReadonlySet<string>,
  typed: ReadonlySet<string>,
): string[] => {
  if (element.hidden) {
    return [];
  }
  const colors = elementColors(element)
    .filter((found) => {
      const key = `${element.id}:${found.prop}:${found.stop ?? ''}`;
      return !(painted.has(key) || (found.prop === 'shadow' && isNeutral(found.value)));
    })
    .map((found) => `"${element.name}" ${found.prop} ${found.value} has no color control`);
  if (element.type !== 'text') {
    return colors;
  }
  return [
    ...colors,
    ...(worded.has(element.id) ? [] : [`text "${element.name}" has no text control`]),
    ...(typed.has(element.id) ? [] : [`text "${element.name}" has no font control`]),
  ];
};

export const auditPosterControls = (design: Design): string[] => {
  const { controls, elements } = design;
  if (controls.length === 0) {
    return ['has no theme controls'];
  }
  const problems = countProblems(controls);
  const colors = controls.filter((control): control is ColorControl => control.kind === 'color');
  const painted = paintedProps(colors, problems);
  if (fillKeys(design).some((key) => !painted.has(key))) {
    problems.push('page background has no color control');
  }
  const worded = targetIds(controls, ['text', 'list']);
  const typed = targetIds(controls, ['font']);
  for (const element of elements) {
    problems.push(...elementProblems(element, painted, worded, typed));
  }
  return [...new Set(problems)];
};
