'use client';

import { ChevronDown, Link2, Plus, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ControlDescriptor, ControlEntry, ControlSectionView } from '@/core';
import { recolor } from '@/design';
import { cn } from '@/lib/utils';
import { getAtPath, setAtPath } from '@/lib/value-path';
import { FieldControl } from './field-control';

type LeafDescriptor = Extract<
  ControlDescriptor,
  { kind: 'text' | 'color' | 'number' | 'boolean' | 'enum' | 'image' | 'video' }
>;

type ArrayDescriptor = Extract<ControlDescriptor, { kind: 'array' }>;

type Values = Record<string, unknown>;

interface PanelProps {
  values: Values;
  onChange: (next: Values) => void;
}

const isLeaf = (descriptor: ControlDescriptor): descriptor is LeafDescriptor =>
  descriptor.kind !== 'object' && descriptor.kind !== 'array';

const leafDefault = (descriptor: ControlDescriptor): unknown => {
  switch (descriptor.kind) {
    case 'color':
      return '#000000';
    case 'number':
      return descriptor.min ?? 0;
    case 'boolean':
      return false;
    case 'enum':
      return descriptor.options[0] ?? '';
    default:
      return '';
  }
};

const buildDefaultItem = (fields: ControlDescriptor[]): Values => {
  const item: Values = {};
  for (const field of fields) {
    const key = field.path[0];
    if (key !== undefined) {
      item[key] = leafDefault(field);
    }
  }
  return item;
};

const itemSummary = (fields: ControlDescriptor[], item: unknown): string => {
  const first = fields.find((field) => field.kind === 'text' || field.kind === 'enum');
  if (first === undefined) {
    return '';
  }
  const raw = getAtPath(item, first.path);
  return typeof raw === 'string' ? raw : '';
};

const FieldShell = ({
  label,
  hint,
  linked,
  mixed = false,
  children,
}: {
  label: string;
  hint: string | null;
  linked: number;
  mixed?: boolean;
  children: ReactNode;
}) => (
  <div className="mb-3.5 flex flex-col gap-1.5">
    <Label className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wide">
      {label}
      {linked > 1 ? (
        <Link2 className="size-3" aria-label={`Applies to ${linked} properties`} />
      ) : null}
    </Label>
    {children}
    {hint === null ? null : <p className="text-[11px] text-muted-foreground/80">{hint}</p>}
    {mixed ? (
      <p className="text-[11px] text-muted-foreground/80">
        Currently mixed. Changing this sets all {linked} to the same value.
      </p>
    ) : null}
  </div>
);

const LeafRow = ({
  entry,
  descriptor,
  values,
  onChange,
}: { entry: ControlEntry; descriptor: LeafDescriptor } & PanelProps) => {
  const current = getAtPath(values, descriptor.path);
  const { shades } = entry;
  const mixed =
    shades === null && entry.targets.some((target) => getAtPath(values, target) !== current);
  const valueFor = (next: unknown, index: number): unknown => {
    const [base] = shades ?? [];
    const sample = shades?.[index];
    return typeof next === 'string' && base !== undefined && sample !== undefined
      ? recolor(next, base, sample)
      : next;
  };
  return (
    <FieldShell
      label={descriptor.label}
      hint={entry.hint}
      linked={entry.targets.length}
      mixed={mixed}
    >
      <FieldControl
        descriptor={descriptor}
        value={current}
        onChange={(next) =>
          onChange(
            entry.targets.reduce<Values>(
              (accumulated, target, index) =>
                setAtPath(accumulated, target, valueFor(next, index)) as Values,
              values,
            ),
          )
        }
      />
    </FieldShell>
  );
};

const ArrayRow = ({
  entry,
  descriptor,
  values,
  onChange,
}: { entry: ControlEntry; descriptor: ArrayDescriptor } & PanelProps) => {
  const items = (getAtPath(values, descriptor.path) as unknown[] | undefined) ?? [];
  const canAdd = descriptor.max === null || items.length < descriptor.max;
  const canRemove = descriptor.min === null || items.length > descriptor.min;
  const replace = (next: unknown[]) => onChange(setAtPath(values, descriptor.path, next) as Values);
  const leafFields = descriptor.item.filter(isLeaf);

  return (
    <div className="mb-4">
      <div className="mb-2 text-[11px] text-muted-foreground uppercase tracking-wide">
        {descriptor.label}
      </div>
      {entry.hint === null ? null : (
        <p className="mb-2 text-[11px] text-muted-foreground/80">{entry.hint}</p>
      )}
      <Accordion type="multiple" className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`${index}`}
            className="overflow-hidden rounded-lg bg-muted/60"
          >
            <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline">
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-muted-foreground">{index + 1}</span>
                <span className="truncate">{itemSummary(leafFields, item) || 'Item'}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              {canRemove ? (
                <div className="mb-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-muted-foreground hover:text-destructive"
                    onClick={() => replace(items.filter((_item, position) => position !== index))}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              ) : null}
              {leafFields.map((field) => {
                const path = [...descriptor.path, String(index), ...field.path];
                return (
                  <FieldShell key={field.path.join('.')} label={field.label} hint={null} linked={1}>
                    <FieldControl
                      descriptor={field}
                      value={getAtPath(values, path)}
                      onChange={(next) => onChange(setAtPath(values, path, next) as Values)}
                    />
                  </FieldShell>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {canAdd ? (
        <Button
          type="button"
          variant="ghost"
          className="mt-2 w-full bg-muted/60 text-muted-foreground hover:text-foreground"
          onClick={() => replace([...items, buildDefaultItem(descriptor.item)])}
        >
          <Plus className="size-4" />
          Add {descriptor.label.toLowerCase().replace(/s$/, '')}
        </Button>
      ) : null}
    </div>
  );
};

const EntryRow = ({ entry, values, onChange }: { entry: ControlEntry } & PanelProps) => {
  const { descriptor } = entry;
  if (descriptor.kind === 'array') {
    return <ArrayRow entry={entry} descriptor={descriptor} values={values} onChange={onChange} />;
  }
  return <LeafRow entry={entry} descriptor={descriptor} values={values} onChange={onChange} />;
};

const MoreOptions = ({ entries, values, onChange }: { entries: ControlEntry[] } & PanelProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={open}
        className="h-7 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
        {open ? 'Fewer options' : `More options (${entries.length})`}
      </Button>
      {open ? (
        <div className="mt-3">
          {entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} values={values} onChange={onChange} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const PropertiesPanel = ({
  sections,
  values,
  onChange,
}: { sections: ControlSectionView[] } & PanelProps) => (
  <Accordion
    type="multiple"
    defaultValue={sections
      .filter((section, index) => index === 0 || section.title === 'Colors')
      .map((section) => section.title)}
    className="flex flex-col"
  >
    {sections.map((section) => (
      <AccordionItem key={section.title} value={section.title} className="border-border border-b">
        <AccordionTrigger className="py-3 font-semibold hover:no-underline">
          {section.title}
        </AccordionTrigger>
        <AccordionContent className="pb-3">
          {section.fields.map((entry) => (
            <EntryRow key={entry.id} entry={entry} values={values} onChange={onChange} />
          ))}
          {section.more.length > 0 ? (
            <MoreOptions entries={section.more} values={values} onChange={onChange} />
          ) : null}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
