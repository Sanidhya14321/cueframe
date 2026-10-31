'use client';

import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

export const PanelRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-muted-foreground text-xs">{label}</span>
    {children}
  </div>
);

export const NumberField = ({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (next: number) => void;
}) => (
  <PanelRow label={label}>
    <Input
      type="number"
      aria-label={label}
      step={step ?? 1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </PanelRow>
);

export const SliderField = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) => (
  <PanelRow label={`${label} (${value})`}>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(next) => onChange(next[0] ?? value)}
    />
  </PanelRow>
);

export const TextField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) => (
  <PanelRow label={label}>
    <Input
      type="text"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </PanelRow>
);

export const TextareaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) => (
  <PanelRow label={label}>
    <Textarea
      rows={3}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </PanelRow>
);

export const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) => (
  <PanelRow label={label}>
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={`${label} swatch`}
        value={value.slice(0, 7)}
        onChange={(event) => onChange(event.target.value)}
        className="size-9 cursor-pointer rounded-md bg-transparent p-0"
      />
      <Input
        type="text"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="font-mono"
      />
    </div>
  </PanelRow>
);

export const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
}) => (
  <PanelRow label={label}>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </PanelRow>
);
