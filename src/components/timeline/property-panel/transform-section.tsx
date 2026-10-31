'use client';

import type { Element } from '@/project';
import { NumberField, SliderField } from './fields';

interface TransformSectionProps {
  element: Element;
  onChange: (next: Element) => void;
}

export const TransformSection = ({ element, onChange }: TransformSectionProps) => {
  const { transform } = element;
  const patch = (partial: Partial<typeof transform>): void =>
    onChange({ ...element, transform: { ...transform, ...partial } });

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium text-sm">Transform</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="X" value={transform.x} onChange={(x) => patch({ x })} />
        <NumberField label="Y" value={transform.y} onChange={(y) => patch({ y })} />
      </div>
      <SliderField
        label="Scale"
        value={transform.scale}
        min={0}
        max={4}
        step={0.05}
        onChange={(scale) => patch({ scale })}
      />
      <SliderField
        label="Rotation"
        value={transform.rotation}
        min={-180}
        max={180}
        step={1}
        onChange={(rotation) => patch({ rotation })}
      />
      <SliderField
        label="Opacity"
        value={transform.opacity}
        min={0}
        max={1}
        step={0.01}
        onChange={(opacity) => patch({ opacity })}
      />
    </div>
  );
};
