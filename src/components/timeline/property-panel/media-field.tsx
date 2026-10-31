'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { PanelRow } from './fields';

interface MediaFieldProps {
  label: string;
  accept: string;
  value: string;
  onChange: (next: string) => void;
}

export const MediaField = ({ label, accept, value, onChange }: MediaFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const receive = (file: File | undefined): void => {
    if (file !== undefined) {
      onChange(URL.createObjectURL(file));
    }
  };

  return (
    <PanelRow label={label}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-md bg-muted p-2 text-muted-foreground text-xs"
        >
          <Upload className="size-4" />
          Choose file
        </button>
        <Input
          type="text"
          aria-label={label}
          value={value}
          placeholder="source url"
          onChange={(event) => onChange(event.target.value)}
          className="font-mono text-xs"
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => receive(event.target.files?.[0])}
        />
      </div>
    </PanelRow>
  );
};
