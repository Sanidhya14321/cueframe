'use client';

import { Pipette } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { eyeDropperSupported, pickScreenColor, useDocumentColors } from '../document-colors';

export const SWATCHES = [
  '#000000',
  '#ffffff',
  '#0f172a',
  '#475569',
  '#e2e8f0',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#facc15',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#4f46e5',
  '#7c3aed',
  '#c026d3',
  '#ec4899',
  '#f5efe6',
  '#1e3a2f',
];

export const Section = ({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <section className="flex flex-col gap-3 border-b px-4 py-4 last:border-b-0">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-[13px]">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

export const NumberInput = ({
  label,
  value,
  onChange,
  step = 1,
  min,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) => (
  <label className="flex h-8 items-center gap-1.5 rounded-md bg-muted px-2 text-xs">
    <span className="w-4 shrink-0 text-muted-foreground">{label}</span>
    <input
      type="number"
      aria-label={label}
      className="w-full min-w-0 bg-transparent tabular-nums outline-none"
      step={step}
      {...(min === undefined ? {} : { min })}
      value={Number.isFinite(value) ? Math.round(value * 100) / 100 : 0}
      onChange={(event) => {
        const next = Number(event.target.value);
        if (Number.isFinite(next)) {
          onChange(min === undefined ? next : Math.max(min, next));
        }
      }}
    />
    {suffix === undefined ? null : <span className="text-muted-foreground">{suffix}</span>}
  </label>
);

export const SliderRow = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onCommit,
  format = (current) => String(Math.round(current * 100) / 100),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  onCommit: () => void;
  format?: (value: number) => string;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{format(value)}</span>
    </div>
    <Slider
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(next) => onChange(next[0] ?? value)}
      onValueCommit={onCommit}
    />
  </div>
);

export const ToggleButton = ({
  label,
  active,
  onClick,
  children,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    title={label}
    onClick={onClick}
    className={cn(
      'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs transition-colors hover:bg-accent [&_svg]:size-4',
      active ? 'bg-violet-500/15 text-violet-600 dark:text-violet-300' : 'bg-muted',
      className,
    )}
  >
    {children}
  </button>
);

const SwatchRow = ({
  colors,
  onPick,
}: {
  colors: readonly string[];
  onPick: (color: string) => void;
}) => (
  <div className="grid grid-cols-10 gap-1">
    {colors.map((swatch) => (
      <button
        type="button"
        key={swatch}
        title={swatch}
        aria-label={`Use ${swatch}`}
        onClick={() => onPick(swatch)}
        className="aspect-square rounded-[5px] ring-1 ring-black/10 ring-inset transition-transform hover:scale-110"
        style={{ background: swatch }}
      />
    ))}
  </div>
);

export const ColorInput = ({
  label,
  value,
  onChange,
  onCommit,
  showSwatches = false,
}: {
  label: string;
  value: string;
  onChange: (next: string, live?: boolean) => void;
  onCommit?: () => void;
  showSwatches?: boolean;
}) => {
  const documentColors = useDocumentColors();
  const [canPick, setCanPick] = useState(false);
  useEffect(() => setCanPick(eyeDropperSupported()), []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-f]{6}/i.test(value) ? value.slice(0, 7) : '#000000'}
          onChange={(event) => onChange(event.target.value, true)}
          onBlur={onCommit}
          className="size-8 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
        <Input
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 font-mono text-xs"
        />
        {canPick ? (
          <button
            type="button"
            aria-label={`Pick ${label} from screen`}
            title="Pick a colour from the screen"
            onClick={() => {
              pickScreenColor()
                .then((color) => {
                  if (color !== null) {
                    onChange(color);
                  }
                })
                .catch(() => undefined);
            }}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-muted hover:bg-accent"
          >
            <Pipette className="size-4" />
          </button>
        ) : null}
      </div>
      {showSwatches && documentColors.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-muted-foreground">Document colours</span>
          <SwatchRow colors={documentColors} onPick={(color) => onChange(color)} />
        </div>
      ) : null}
      {showSwatches ? <SwatchRow colors={SWATCHES} onPick={(color) => onChange(color)} /> : null}
    </div>
  );
};
