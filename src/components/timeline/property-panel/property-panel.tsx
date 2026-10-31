'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Element } from '@/project';
import { AnimationSection } from './animation-section';
import { ContentSection } from './content-section';
import { TimingSection } from './timing-section';
import { TransformSection } from './transform-section';

interface PropertyPanelProps {
  element: Element | null;
  onChange: (next: Element) => void;
  onDelete: (id: string) => void;
}

export const PropertyPanel = ({ element, onChange, onDelete }: PropertyPanelProps) => {
  if (element === null) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Select an element on the timeline to edit its properties.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm capitalize">{element.type}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete element"
          onClick={() => onDelete(element.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <ContentSection element={element} onChange={onChange} />
      <Separator />
      <TransformSection element={element} onChange={onChange} />
      <Separator />
      <TimingSection element={element} onChange={onChange} />
      <Separator />
      <AnimationSection element={element} onChange={onChange} />
    </div>
  );
};
