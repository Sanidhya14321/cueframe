import {
  type ColorProp,
  type Design,
  type DesignControl,
  PAGE_TARGET,
  setControlValue,
  setListItem,
} from '@/design';
import type { EditOperation } from './edits';

const CONTROL_VALUE = /^\/controls\/(\d+)\/value$/;
const LIST_ITEM = /^\/controls\/(\d+)\/values\/(\d+)$/;

const ELEMENT_PROP: Record<ColorProp, string> = {
  fill: 'fill',
  stroke: 'stroke',
  color: 'color',
  textBackground: 'background',
  shadow: 'shadow',
};

type ThemeResult = { ok: true; design: Design } | { ok: false; error: string };

export const isControlOperation = (operation: EditOperation): boolean =>
  operation.path.startsWith('/controls');

const controlPath = (design: Design, control: DesignControl): string =>
  `/controls/${design.controls.indexOf(control)}/value`;

const setControl = (design: Design, operation: EditOperation): ThemeResult => {
  const value = operation.value;
  const item = LIST_ITEM.exec(operation.path);
  const single = CONTROL_VALUE.exec(operation.path);
  const control = design.controls[Number(item?.[1] ?? single?.[1] ?? -1)];
  if (operation.op !== 'replace' || control === undefined || (item === null && single === null)) {
    return {
      ok: false,
      error: `${operation.path}: change a control only with "replace" on /controls/N/value, or /controls/N/values/I for a list`,
    };
  }
  if (typeof value !== 'string') {
    return { ok: false, error: `${operation.path}: a control value must be a string` };
  }
  if (control.kind === 'list') {
    const index = Number(item?.[2] ?? -1);
    return index >= 0 && index < control.values.length
      ? { ok: true, design: setListItem(design, control.id, index, value) }
      : {
          ok: false,
          error: `${operation.path}: "${control.label}" is a list, use /controls/N/values/0 to /controls/N/values/${control.values.length - 1}`,
        };
  }
  if (item !== null) {
    return { ok: false, error: `${operation.path}: "${control.label}" is not a list, use /value` };
  }
  const next = setControlValue(design, control.id, value);
  return next === design
    ? { ok: false, error: `${operation.path}: "${value}" is not a valid colour` }
    : { ok: true, design: next };
};

export const applyThemeControls = (
  design: Design,
  operations: readonly EditOperation[],
): ThemeResult =>
  operations.reduce<ThemeResult>(
    (result, operation) => (result.ok ? setControl(result.design, operation) : result),
    { ok: true, design },
  );

const ownedProps = (design: Design): Map<string, DesignControl> => {
  const owned = new Map<string, DesignControl>();
  for (const control of design.controls) {
    if (control.kind === 'color') {
      for (const target of control.targets) {
        const prop = target.element === PAGE_TARGET ? 'background' : ELEMENT_PROP[target.prop];
        owned.set(`${target.element}:${prop}`, control);
      }
      continue;
    }
    const prop = control.kind === 'font' ? 'fontFamily' : 'text';
    const targets = control.kind === 'list' ? control.targets.flat() : control.targets;
    for (const target of targets) {
      owned.set(`${target.element}:${prop}`, control);
    }
  }
  return owned;
};

const ownedValue = (design: Design, element: string, prop: string): string => {
  const source =
    element === PAGE_TARGET ? { background: design.background } : findElement(design, element);
  return JSON.stringify((source as Record<string, unknown> | undefined)?.[prop] ?? null);
};

const findElement = (design: Design, id: string) =>
  design.elements.find((element) => element.id === id);

const nameOf = (design: Design, id: string): string =>
  id === PAGE_TARGET ? 'The page' : (findElement(design, id)?.name ?? id);

export const themeViolations = (before: Design, after: Design): string[] => {
  if (JSON.stringify(before.controls) !== JSON.stringify(after.controls)) {
    return ['/controls: change a control only with "replace" on its value'];
  }
  const issues: string[] = [];
  for (const [key, control] of ownedProps(before)) {
    const [element = '', prop = ''] = key.split(':');
    const gone = element !== PAGE_TARGET && findElement(after, element) === undefined;
    if (!gone && ownedValue(before, element, prop) !== ownedValue(after, element, prop)) {
      issues.push(
        `${nameOf(before, element)} ${prop} is driven by the "${control.label}" control. Replace ${controlPath(before, control)} instead`,
      );
    }
  }
  for (const element of before.elements.filter((item) => item.locked)) {
    const next = findElement(after, element.id);
    if (next !== undefined && JSON.stringify(next) !== JSON.stringify(element)) {
      issues.push(
        `${element.name || element.type} is a locked shape. Restyle it through the theme colour controls`,
      );
    }
  }
  return [...new Set(issues)];
};
