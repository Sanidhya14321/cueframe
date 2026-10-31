'use client';

import type { IconElement } from '@/design';
import { ColorInput, Section, SliderRow } from './fields';
import { IconGrid } from './icon-grid';

interface IconSectionProps {
  element: IconElement;
  onChange: (next: IconElement, live?: boolean) => void;
  onCommit: () => void;
}

export const IconSection = ({ element, onChange, onCommit }: IconSectionProps) => (
  <Section title="Icon">
    <ColorInput
      label="Icon color"
      value={element.color}
      onChange={(color, live) => onChange({ ...element, color }, live)}
      onCommit={onCommit}
      showSwatches
    />
    <SliderRow
      label="Stroke"
      value={element.strokeWidth}
      min={0.5}
      max={4}
      step={0.25}
      onChange={(strokeWidth) => onChange({ ...element, strokeWidth }, true)}
      onCommit={onCommit}
    />
    <IconGrid selected={element.icon} onPick={(icon) => onChange({ ...element, icon })} />
  </Section>
);
