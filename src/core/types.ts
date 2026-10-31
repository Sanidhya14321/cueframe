export type TextFormat = 'line' | 'multiline' | 'datetime';

export type ControlDescriptor =
  | {
      kind: 'text';
      path: string[];
      label: string;
      format: TextFormat;
      maxLength: number | null;
    }
  | { kind: 'color'; path: string[]; label: string }
  | {
      kind: 'number';
      path: string[];
      label: string;
      min: number | null;
      max: number | null;
      step: number;
    }
  | { kind: 'boolean'; path: string[]; label: string }
  | { kind: 'enum'; path: string[]; label: string; options: string[] }
  | { kind: 'image'; path: string[]; label: string }
  | { kind: 'video'; path: string[]; label: string }
  | {
      kind: 'array';
      path: string[];
      label: string;
      min: number | null;
      max: number | null;
      item: ControlDescriptor[];
    }
  | { kind: 'object'; path: string[]; label: string; fields: ControlDescriptor[] };

export type AddressableDescriptor = Exclude<ControlDescriptor, { kind: 'object' }>;

export type ControlEntry = {
  id: string;
  descriptor: AddressableDescriptor;
  hint: string | null;
  targets: string[][];
  shades: string[] | null;
};

export type ControlSectionView = {
  title: string;
  fields: ControlEntry[];
  more: ControlEntry[];
};
