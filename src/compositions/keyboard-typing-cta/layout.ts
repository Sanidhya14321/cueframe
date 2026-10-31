export const PANEL = { left: 54, width: 987, height: 736 } as const;

export const ROW_Y = {
  tools: 52,
  top: 168,
  home: 291,
  bottom: 414,
  space: 537,
  nav: 676,
} as const;

export const KEY = { width: 88, height: 104, pitch: 98.85, radius: 22 } as const;

export type LayerId = 'letters' | 'symbols';

type KeyIcon = 'shift' | 'backspace' | 'globe' | 'enter';

export interface KeySpec {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  output?: string;
  icon?: KeyIcon;
}

export interface KeyboardLayout {
  letters: KeySpec[];
  symbols: KeySpec[];
}

export const LAYER_KEY: Record<LayerId, string> = { letters: 'to-symbols', symbols: 'to-letters' };

export const SHIFT_KEY = 'shift';

export const ENTER_KEY = 'enter';

const charRow = (chars: string, firstX: number, y: number): KeySpec[] =>
  [...chars].map((char, index) => ({
    id: char,
    label: char,
    x: firstX + KEY.pitch * index,
    y,
    width: KEY.width,
    output: char,
  }));

const sharedBottom: KeySpec[] = [
  { id: ',', label: ',', x: 191, y: ROW_Y.space, width: KEY.width, output: ',' },
  { id: 'globe', label: '', x: 290, y: ROW_Y.space, width: KEY.width, icon: 'globe' },
  { id: 'space', label: '', x: 539, y: ROW_Y.space, width: 400, output: ' ' },
  { id: '.', label: '.', x: 782, y: ROW_Y.space, width: KEY.width, output: '.' },
  { id: ENTER_KEY, label: '', x: 908, y: ROW_Y.space, width: 120, icon: 'enter' },
  { id: 'backspace', label: '', x: 910, y: ROW_Y.bottom, width: 118, icon: 'backspace' },
];

export const KEYBOARD_LAYOUT: KeyboardLayout = {
  letters: [
    ...charRow('qwertyuiop', 45, ROW_Y.top),
    ...charRow('asdfghjkl', 94.4, ROW_Y.home),
    ...charRow('zxcvbnm', 191, ROW_Y.bottom),
    { id: SHIFT_KEY, label: '', x: 67, y: ROW_Y.bottom, width: 118, icon: 'shift' },
    { id: LAYER_KEY.letters, label: '?123', x: 64, y: ROW_Y.space, width: 112 },
    ...sharedBottom,
  ],
  symbols: [
    ...charRow('1234567890', 45, ROW_Y.top),
    ...charRow('@#$_&-+()/', 45, ROW_Y.home),
    ...charRow('*"\':;!?', 191, ROW_Y.bottom),
    { id: 'more', label: '=\\<', x: 67, y: ROW_Y.bottom, width: 118 },
    { id: LAYER_KEY.symbols, label: 'ABC', x: 64, y: ROW_Y.space, width: 112 },
    ...sharedBottom,
  ],
};

export const TOOL_X = [45, 222, 399, 577, 754, 931] as const;

export const SUGGESTION_X = [225, 492, 759] as const;
