'use client';

import { Switch } from '@/components/ui/switch';
import type { DesignElement } from '@/design';
import { ColorInput, Section, SliderRow } from './fields';

const DEFAULT_SHADOW = { color: 'rgba(0,0,0,0.35)', blur: 24, offsetX: 0, offsetY: 12 };

interface ShadowSectionProps {
  element: DesignElement;
  onChange: (next: DesignElement, live?: boolean) => void;
  onCommit: () => void;
}

export const ShadowSection = ({ element, onChange, onCommit }: ShadowSectionProps) => {
  const shadow = element.shadow;
  return (
    <Section
      title="Shadow"
      action={
        <Switch
          aria-label="Toggle shadow"
          checked={shadow !== undefined}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange({ ...element, shadow: DEFAULT_SHADOW });
            } else {
              const { shadow: _removed, ...rest } = element;
              onChange(rest);
            }
          }}
        />
      }
    >
      {shadow === undefined ? null : (
        <>
          <ColorInput
            label="Shadow color"
            value={shadow.color}
            onChange={(color, live) => onChange({ ...element, shadow: { ...shadow, color } }, live)}
            onCommit={onCommit}
          />
          <SliderRow
            label="Blur"
            value={shadow.blur}
            min={0}
            max={120}
            step={1}
            onChange={(blur) => onChange({ ...element, shadow: { ...shadow, blur } }, true)}
            onCommit={onCommit}
          />
          <SliderRow
            label="Offset X"
            value={shadow.offsetX}
            min={-100}
            max={100}
            step={1}
            onChange={(offsetX) => onChange({ ...element, shadow: { ...shadow, offsetX } }, true)}
            onCommit={onCommit}
          />
          <SliderRow
            label="Offset Y"
            value={shadow.offsetY}
            min={-100}
            max={100}
            step={1}
            onChange={(offsetY) => onChange({ ...element, shadow: { ...shadow, offsetY } }, true)}
            onCommit={onCommit}
          />
        </>
      )}
    </Section>
  );
};
