'use client';

import { Upload, X } from 'lucide-react';
import { type DragEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { type ControlDescriptor, humanizeKey } from '@/core';
import { cn } from '@/lib/utils';

type LeafDescriptor = Extract<
  ControlDescriptor,
  { kind: 'text' | 'color' | 'number' | 'boolean' | 'enum' | 'image' | 'video' }
>;

type MediaKind = 'image' | 'video';

const MediaPreview = ({ kind, value }: { kind: MediaKind; value: string }) =>
  kind === 'video' ? (
    <video
      src={value}
      className="h-28 w-full rounded-md object-cover"
      muted
      playsInline
      preload="metadata"
    />
  ) : (
    <span
      role="img"
      aria-label="Selected image"
      className="block h-28 w-full rounded-md bg-center bg-cover"
      style={{ backgroundImage: `url("${value}")` }}
    />
  );

const MediaField = ({
  kind,
  value,
  onChange,
}: {
  kind: MediaKind;
  value: string;
  onChange: (next: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const receive = (file: File | undefined) => {
    if (file !== undefined) {
      onChange(URL.createObjectURL(file));
    }
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    receive(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex min-h-28 w-full flex-col items-center justify-center overflow-hidden rounded-md bg-muted p-2 text-muted-foreground text-xs transition-[box-shadow] outline-none',
          dragging && 'ring-[3px] ring-ring/40',
        )}
      >
        {value ? (
          <MediaPreview kind={kind} value={value} />
        ) : (
          <span className="flex flex-col items-center gap-1">
            <Upload className="size-5" />
            {`Drop ${kind} or click to choose`}
          </span>
        )}
      </button>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          placeholder={`${kind} URL`}
          onChange={(event) => onChange(event.target.value)}
          className="font-mono text-xs"
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Clear ${kind}`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onChange('')}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/*' : 'video/*'}
        className="hidden"
        onChange={(event) => receive(event.target.files?.[0])}
      />
    </div>
  );
};

const TextField = ({
  descriptor,
  value,
  onChange,
}: {
  descriptor: Extract<LeafDescriptor, { kind: 'text' }>;
  value: string;
  onChange: (next: string) => void;
}) =>
  descriptor.format === 'multiline' ? (
    <Textarea value={value} rows={3} onChange={(event) => onChange(event.target.value)} />
  ) : (
    <Input
      type={descriptor.format === 'datetime' ? 'datetime-local' : 'text'}
      value={value}
      maxLength={descriptor.maxLength ?? undefined}
      onChange={(event) => onChange(event.target.value)}
    />
  );

const ColorField = ({ value, onChange }: { value: string; onChange: (next: string) => void }) => (
  <div className="flex items-center gap-2">
    <input
      type="color"
      value={value.slice(0, 7)}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Color"
      className="size-9 cursor-pointer overflow-hidden rounded-md bg-transparent p-0"
    />
    <Input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="font-mono"
    />
  </div>
);

const NumberField = ({
  descriptor,
  value,
  onChange,
}: {
  descriptor: Extract<LeafDescriptor, { kind: 'number' }>;
  value: number;
  onChange: (next: number) => void;
}) => (
  <div className="flex items-center gap-3">
    <Slider
      min={descriptor.min ?? 0}
      max={descriptor.max ?? 100}
      step={descriptor.step}
      value={[value]}
      onValueChange={(next) => onChange(next[0] ?? value)}
      className="flex-1"
    />
    <Input
      type="number"
      min={descriptor.min ?? undefined}
      max={descriptor.max ?? undefined}
      step={descriptor.step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-20 text-right"
    />
  </div>
);

const EnumField = ({
  descriptor,
  value,
  onChange,
}: {
  descriptor: Extract<LeafDescriptor, { kind: 'enum' }>;
  value: string;
  onChange: (next: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {descriptor.options.map((option) => (
        <SelectItem key={option} value={option}>
          {humanizeKey(option)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const FieldControl = ({
  descriptor,
  value,
  onChange,
}: {
  descriptor: LeafDescriptor;
  value: unknown;
  onChange: (next: unknown) => void;
}) => {
  switch (descriptor.kind) {
    case 'text':
      return <TextField descriptor={descriptor} value={String(value ?? '')} onChange={onChange} />;
    case 'color':
      return <ColorField value={String(value ?? '#000000')} onChange={onChange} />;
    case 'number':
      return <NumberField descriptor={descriptor} value={Number(value ?? 0)} onChange={onChange} />;
    case 'boolean':
      return <Switch checked={Boolean(value)} onCheckedChange={onChange} />;
    case 'enum':
      return <EnumField descriptor={descriptor} value={String(value ?? '')} onChange={onChange} />;
    case 'image':
      return <MediaField kind="image" value={String(value ?? '')} onChange={onChange} />;
    case 'video':
      return <MediaField kind="video" value={String(value ?? '')} onChange={onChange} />;
    default:
      return null;
  }
};
