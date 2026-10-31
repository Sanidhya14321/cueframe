export type TextToggle = 'bold' | 'italic' | 'underline';

export type ShortcutAction =
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'delete' }
  | { type: 'duplicate' }
  | { type: 'copy' }
  | { type: 'cut' }
  | { type: 'copy-style' }
  | { type: 'paste-style' }
  | { type: 'select-all' }
  | { type: 'select-next'; direction: 1 | -1 }
  | { type: 'group' }
  | { type: 'ungroup' }
  | { type: 'lock' }
  | { type: 'hide' }
  | { type: 'escape' }
  | { type: 'edit-text' }
  | { type: 'text-toggle'; toggle: TextToggle }
  | { type: 'font-size'; direction: 1 | -1 }
  | { type: 'layer'; move: 'forward' | 'backward' | 'front' | 'back' }
  | { type: 'nudge'; dx: number; dy: number }
  | { type: 'zoom'; direction: 'in' | 'out' | 'fit' | 'actual' }
  | { type: 'add'; element: 'text' | 'rect' | 'ellipse' | 'line' }
  | { type: 'help' }
  | { type: 'save' }
  | { type: 'export' };

export interface KeyInput {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

const NUDGES: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const ADD_KEYS: Record<string, 'text' | 'rect' | 'ellipse' | 'line'> = {
  t: 'text',
  r: 'rect',
  c: 'ellipse',
  l: 'line',
};

const SHIFTED: Record<string, ShortcutAction> = {
  z: { type: 'redo' },
  g: { type: 'ungroup' },
  l: { type: 'lock' },
  h: { type: 'hide' },
  '>': { type: 'font-size', direction: 1 },
  '.': { type: 'font-size', direction: 1 },
  '<': { type: 'font-size', direction: -1 },
  ',': { type: 'font-size', direction: -1 },
  ']': { type: 'layer', move: 'front' },
  '}': { type: 'layer', move: 'front' },
  '[': { type: 'layer', move: 'back' },
  '{': { type: 'layer', move: 'back' },
};

const ALTED: Record<string, ShortcutAction> = {
  c: { type: 'copy-style' },
  v: { type: 'paste-style' },
  ']': { type: 'layer', move: 'front' },
  '[': { type: 'layer', move: 'back' },
};

const MODIFIED: Record<string, ShortcutAction> = {
  z: { type: 'undo' },
  y: { type: 'redo' },
  d: { type: 'duplicate' },
  c: { type: 'copy' },
  x: { type: 'cut' },
  a: { type: 'select-all' },
  g: { type: 'group' },
  b: { type: 'text-toggle', toggle: 'bold' },
  i: { type: 'text-toggle', toggle: 'italic' },
  u: { type: 'text-toggle', toggle: 'underline' },
  ']': { type: 'layer', move: 'forward' },
  '[': { type: 'layer', move: 'backward' },
  '=': { type: 'zoom', direction: 'in' },
  '+': { type: 'zoom', direction: 'in' },
  '-': { type: 'zoom', direction: 'out' },
  '0': { type: 'zoom', direction: 'fit' },
  '1': { type: 'zoom', direction: 'actual' },
  s: { type: 'save' },
  e: { type: 'export' },
};

const ALT_CODES: Record<string, string> = { KeyC: 'c', KeyV: 'v' };

const modifiedShortcut = (
  input: KeyInput & { code?: string },
  key: string,
): ShortcutAction | null => {
  if (input.altKey) {
    return ALTED[ALT_CODES[input.code ?? ''] ?? key] ?? null;
  }
  return (input.shiftKey ? SHIFTED[key] : MODIFIED[key]) ?? null;
};

const PLAIN: Record<string, ShortcutAction> = {
  Delete: { type: 'delete' },
  Backspace: { type: 'delete' },
  Escape: { type: 'escape' },
  Enter: { type: 'edit-text' },
  '?': { type: 'help' },
};

const plainShortcut = (input: KeyInput, key: string): ShortcutAction | null => {
  const nudge = NUDGES[key];
  if (nudge !== undefined) {
    const step = input.shiftKey ? 10 : 1;
    return { type: 'nudge', dx: nudge[0] * step, dy: nudge[1] * step };
  }
  if (key === 'Tab') {
    return { type: 'select-next', direction: input.shiftKey ? -1 : 1 };
  }
  const plain = PLAIN[key];
  if (plain !== undefined) {
    return plain;
  }
  const add = input.altKey || input.shiftKey ? undefined : ADD_KEYS[key];
  return add === undefined ? null : { type: 'add', element: add };
};

const ASCII_KEY = /^[\x20-\x7e]$/;

const keyName = (input: KeyInput & { code?: string }): string => {
  if (input.key.length !== 1) {
    return input.key;
  }
  if (ASCII_KEY.test(input.key) || !input.code?.startsWith('Key')) {
    return input.key.toLowerCase();
  }
  return input.code.slice(3).toLowerCase();
};

export const shortcutFor = (input: KeyInput & { code?: string }): ShortcutAction | null => {
  const key = keyName(input);
  return input.metaKey || input.ctrlKey ? modifiedShortcut(input, key) : plainShortcut(input, key);
};

const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'password', '']);

const isTextEntry = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable || target.tagName === 'TEXTAREA') {
    return true;
  }
  return target instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(target.type);
};

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

const CLIPBOARD_ACTIONS = new Set<ShortcutAction['type']>(['copy', 'cut', 'select-all']);

const isHistoryAction = (action: ShortcutAction): boolean =>
  action.type === 'undo' || action.type === 'redo';

export const shouldHandleShortcut = (
  action: ShortcutAction,
  input: KeyInput,
  target: EventTarget | null,
): boolean => {
  if (isHistoryAction(action)) {
    return true;
  }
  if (isTextEntry(target)) {
    return false;
  }
  if (!isEditableTarget(target)) {
    return true;
  }
  return (input.metaKey || input.ctrlKey) && !CLIPBOARD_ACTIONS.has(action.type);
};

export const SHORTCUT_GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: 'General',
    items: [
      ['Undo', '⌘ Z'],
      ['Redo', '⌘ ⇧ Z  or  ⌘ Y'],
      ['Copy / cut / paste', '⌘ C  ⌘ X  ⌘ V'],
      ['Copy style / paste style', '⌘ ⌥ C  ⌘ ⌥ V'],
      ['Duplicate', '⌘ D  or  ⌥ drag'],
      ['Delete', '⌫'],
      ['Select all', '⌘ A'],
      ['Select next / previous', 'Tab  ⇧ Tab'],
      ['Deselect / stop editing', 'Esc'],
      ['Show shortcuts', '?'],
    ],
  },
  {
    title: 'Arrange',
    items: [
      ['Group / ungroup', '⌘ G  ⌘ ⇧ G'],
      ['Lock / hide', '⌘ ⇧ L  ⌘ ⇧ H'],
      ['Forward / backward', '⌘ ]  ⌘ ['],
      ['To front / to back', '⌘ ⌥ ]  ⌘ ⌥ ['],
      ['Nudge', 'Arrows (⇧ for 10px)'],
      ['Lock axis while dragging', '⇧ drag'],
    ],
  },
  {
    title: 'Text',
    items: [
      ['Edit text', 'Enter or double-click'],
      ['Bold / italic / underline', '⌘ B  ⌘ I  ⌘ U'],
      ['Bigger / smaller text', '⌘ ⇧ .  ⌘ ⇧ ,'],
    ],
  },
  {
    title: 'Add & view',
    items: [
      ['Add text / rectangle / circle / line', 'T  R  C  L'],
      ['Zoom in / out', '⌘ +  ⌘ -'],
      ['Fit / 100%', '⌘ 0  ⌘ 1'],
      ['Pan', 'Space drag or scroll'],
      ['Zoom with the wheel', '⌘ scroll or pinch'],
      ['Download PNG', '⌘ E'],
    ],
  },
];
