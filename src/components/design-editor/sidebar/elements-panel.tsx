'use client';

import {
  createEllipse,
  createIcon,
  createLine,
  createPath,
  createPolygon,
  createRect,
  createStar,
  type DesignElement,
  linear,
} from '@/design';
import { IconGrid } from '../panels/icon-grid';
import { ShapePreview } from './shape-preview';

interface ShapePreset {
  label: string;
  create: () => DesignElement;
}

const SHAPES: ShapePreset[] = [
  { label: 'Square', create: () => createRect({ name: 'Square' }) },
  {
    label: 'Rounded',
    create: () =>
      createRect({ name: 'Rounded rectangle', width: 420, height: 260, cornerRadius: 40 }),
  },
  {
    label: 'Pill',
    create: () =>
      createRect({ name: 'Pill', width: 420, height: 120, cornerRadius: 60, fill: '#111827' }),
  },
  { label: 'Circle', create: () => createEllipse() },
  { label: 'Triangle', create: () => createPolygon() },
  {
    label: 'Diamond',
    create: () => createPolygon({ name: 'Diamond', sides: 4, fill: '#06b6d4' }),
  },
  {
    label: 'Pentagon',
    create: () => createPolygon({ name: 'Pentagon', sides: 5, fill: '#f43f5e' }),
  },
  {
    label: 'Hexagon',
    create: () => createPolygon({ name: 'Hexagon', sides: 6, fill: '#8b5cf6' }),
  },
  { label: 'Star', create: () => createStar() },
  {
    label: 'Burst',
    create: () => createStar({ name: 'Burst', points: 16, innerRatio: 0.78, fill: '#f97316' }),
  },
  {
    label: 'Gradient',
    create: () =>
      createRect({
        name: 'Gradient block',
        cornerRadius: 32,
        fill: linear(135, '#7c3aed', '#ec4899'),
      }),
  },
  {
    label: 'Outline',
    create: () =>
      createRect({
        name: 'Outline box',
        fill: 'rgba(0,0,0,0)',
        strokeWidth: 8,
        stroke: '#111827',
        cornerRadius: 24,
      }),
  },
];

const PATHS: ShapePreset[] = [
  {
    label: 'Wave',
    create: () =>
      createPath({
        name: 'Wave',
        width: 1080,
        height: 240,
        viewWidth: 100,
        viewHeight: 24,
        data: 'M0 10 C 20 0 30 20 50 10 S 80 0 100 10 V24 H0 Z',
        fill: '#6366f1',
      }),
  },
  {
    label: 'Blob',
    create: () =>
      createPath({
        name: 'Blob',
        viewWidth: 100,
        viewHeight: 100,
        data: 'M52 4C72 4 94 18 96 42C98 66 82 94 54 96C26 98 4 80 4 54C4 28 28 4 52 4Z',
        fill: '#f472b6',
      }),
  },
  {
    label: 'Arch',
    create: () =>
      createPath({
        name: 'Arch',
        width: 300,
        height: 420,
        viewWidth: 100,
        viewHeight: 140,
        data: 'M0 50A50 50 0 0 1 100 50V140H0Z',
        fill: '#f59e0b',
      }),
  },
  {
    label: 'Speech',
    create: () =>
      createPath({
        name: 'Speech bubble',
        width: 420,
        height: 300,
        viewWidth: 120,
        viewHeight: 90,
        data: 'M12 0H108A12 12 0 0 1 120 12V60A12 12 0 0 1 108 72H40L18 90L22 72H12A12 12 0 0 1 0 60V12A12 12 0 0 1 12 0Z',
        fill: '#ffffff',
        strokeWidth: 4,
        stroke: '#111827',
      }),
  },
  {
    label: 'Band',
    create: () =>
      createPath({
        name: 'Diagonal band',
        width: 1080,
        height: 600,
        viewWidth: 100,
        viewHeight: 56,
        data: 'M0 40L100 0V16L0 56Z',
        fill: '#111827',
      }),
  },
  {
    label: 'Ribbon',
    create: () =>
      createPath({
        name: 'Ribbon',
        width: 520,
        height: 120,
        viewWidth: 130,
        viewHeight: 30,
        data: 'M0 0H130L120 15L130 30H0L10 15Z',
        fill: '#ef4444',
      }),
  },
];

const LINES: ShapePreset[] = [
  { label: 'Line', create: () => createLine() },
  {
    label: 'Dashed',
    create: () => createLine({ name: 'Dashed line', dashed: true }),
  },
  { label: 'Arrow', create: () => createLine({ name: 'Arrow', arrowEnd: true }) },
  {
    label: 'Double arrow',
    create: () => createLine({ name: 'Double arrow', arrowEnd: true, arrowStart: true }),
  },
];

const PresetGrid = ({
  presets,
  onAdd,
}: {
  presets: ShapePreset[];
  onAdd: (element: DesignElement) => void;
}) => (
  <div className="grid grid-cols-4 gap-2">
    {presets.map((preset) => (
      <button
        type="button"
        key={preset.label}
        title={preset.label}
        aria-label={`Add ${preset.label}`}
        onClick={() => onAdd(preset.create())}
        className="flex aspect-square items-center justify-center rounded-lg bg-muted/70 transition-colors hover:bg-accent"
      >
        <ShapePreview element={preset.create()} />
      </button>
    ))}
  </div>
);

export const ElementsPanel = ({ onAdd }: { onAdd: (element: DesignElement) => void }) => (
  <div className="flex flex-col gap-5">
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Shapes</h4>
      <PresetGrid presets={[...SHAPES, ...PATHS]} onAdd={onAdd} />
    </div>
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Lines</h4>
      <PresetGrid presets={LINES} onAdd={onAdd} />
    </div>
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Icons</h4>
      <IconGrid columns={5} onPick={(icon) => onAdd(createIcon({ icon, name: icon }))} />
    </div>
  </div>
);
