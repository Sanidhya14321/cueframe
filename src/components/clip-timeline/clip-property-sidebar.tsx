'use client';

import { Trash2 } from 'lucide-react';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { AnimationSection } from '@/components/timeline/property-panel/animation-section';
import { PropertyPanel } from '@/components/timeline/property-panel/property-panel';
import { TimingSection } from '@/components/timeline/property-panel/timing-section';
import { TransformSection } from '@/components/timeline/property-panel/transform-section';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { clipControlsFor } from '@/core';
import type { Element } from '@/project';
import { getClipMeta, isClipId } from '@/schemas';
import { useItemPresence } from './live-presence';

interface ClipPropertySidebarProps {
  element: Element | null;
  onChange: (next: Element) => void;
  onDelete: (id: string) => void;
}

export const ClipPropertySidebar = ({ element, onChange, onDelete }: ClipPropertySidebarProps) => {
  const { locked } = useItemPresence(element?.id ?? '');
  if (element === null) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Select an element on the timeline to edit its properties.
      </div>
    );
  }

  if (element.type !== 'composition') {
    return (
      <fieldset disabled={locked}>
        <PropertyPanel element={element} onChange={onChange} onDelete={onDelete} />
      </fieldset>
    );
  }

  const sections = clipControlsFor(element.clipId);
  const attribution = isClipId(element.clipId)
    ? getClipMeta(element.clipId).attribution
    : undefined;
  const clipTitle = isClipId(element.clipId) ? getClipMeta(element.clipId).title : element.clipId;

  return (
    <fieldset disabled={locked} className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="truncate font-semibold text-sm">{clipTitle}</span>
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
      {attribution?.url ? (
        <a
          href={attribution.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground text-xs underline"
        >
          {attribution.name} · {attribution.license} source
        </a>
      ) : null}
      <PropertiesPanel
        sections={sections}
        values={element.props}
        onChange={(values) => onChange({ ...element, props: values })}
      />
      <Separator />
      <TransformSection element={element} onChange={onChange} />
      <Separator />
      <TimingSection element={element} onChange={onChange} />
      <Separator />
      <AnimationSection element={element} onChange={onChange} />
    </fieldset>
  );
};
